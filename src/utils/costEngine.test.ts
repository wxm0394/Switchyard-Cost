import test from 'node:test';
import assert from 'node:assert/strict';
import {
  costFor,
  buildCostSummary,
  toCSTDateString,
  LITELLM_MODEL_PRICES,
  type AuditHistoryRecord,
} from './costEngine';

test('1. CostFor calculates accurate USD cost within ±0.001 tolerance', () => {
  // Spec 5.1 scenario 1:
  // input 1,000,000 tokens * $0.15/1M + output 500,000 * $0.50/1M = $0.40
  // Model z-ai/glm-5.3-flash-free has input_cost_per_token=1.5e-7 ($0.15/1M) and output_cost_per_token=5e-7 ($0.50/1M)
  const { costUsd, ok } = costFor('z-ai/glm-5.3-flash-free', 1_000_000, 500_000);
  assert.equal(ok, true);
  assert.ok(
    Math.abs(costUsd - 0.4) <= 0.001,
    `Expected $0.40 ±0.001, got ${costUsd}`
  );

  // Also test ZhipuAI/GLM-5.2 ($1.40/1M in, $4.40/1M out)
  const glm52 = costFor('ZhipuAI/GLM-5.2', 2_000_000, 1_000_000);
  assert.equal(glm52.ok, true);
  assert.ok(Math.abs(glm52.costUsd - 7.2) <= 0.001);
});

test('2. CostFor returns ok=false without throwing for unknown models', () => {
  // Spec 5.1 scenario 2:
  const res1 = costFor('non-existent-provider/mystery-70b', 500_000, 200_000);
  assert.equal(res1.ok, false);
  assert.equal(res1.costUsd, 0);

  const res2 = costFor('', 100, 100);
  assert.equal(res2.ok, false);
  assert.equal(res2.costUsd, 0);
});

test('3. Summary aggregation groups by CST day (UTC+8) and by model across 3 days and multiple models', () => {
  // Spec 5.1 scenario 3:
  // CST day = UTC previous day 16:00 to current day 16:00
  assert.equal(toCSTDateString('2026-11-11T15:59:59Z'), '2026-11-11');
  assert.equal(toCSTDateString('2026-11-11T16:00:00Z'), '2026-11-12');

  const records: AuditHistoryRecord[] = [
    // CST Day 1: 2026-11-11 (2026-11-11T10:00:00Z)
    {
      id: 1,
      timestamp: '2026-11-11T10:00:00Z',
      selected_model_id: 'ZhipuAI/GLM-5.2',
      requested_model: 'ZhipuAI/GLM-5.2',
      prompt_tokens: 1_000_000,
      completion_tokens: 500_000,
      billed_tokens: 1_500_000,
      estimated_tokens: 1_500_000,
      usage_source: 'upstream',
      client_token_id: 'tok-1',
      client_token_name: '全客户端通用访问令牌',
      session_key: 's1',
      cost_usd: 3.6,
    },
    // CST Day 2: 2026-11-12 (2026-11-11T16:30:00Z -> crosses 16:00 UTC into 2026-11-12 CST!)
    {
      id: 2,
      timestamp: '2026-11-11T16:30:00Z',
      selected_model_id: 'nvidia/nemotron-3.5-lightning-30b-a3b',
      requested_model: 'nvidia/nemotron-3.5-lightning-30b-a3b',
      prompt_tokens: 2_000_000,
      completion_tokens: 1_000_000,
      billed_tokens: 3_000_000,
      estimated_tokens: 3_000_000,
      usage_source: 'upstream',
      client_token_id: 'tok-1',
      client_token_name: '全客户端通用访问令牌',
      session_key: 's2',
      cost_usd: 0.34,
    },
    // CST Day 3: 2026-11-13 (2026-11-13T08:00:00Z)
    {
      id: 3,
      timestamp: '2026-11-13T08:00:00Z',
      selected_model_id: 'ZhipuAI/GLM-5.2',
      requested_model: 'ZhipuAI/GLM-5.2',
      prompt_tokens: 500_000,
      completion_tokens: 500_000,
      billed_tokens: 1_000_000,
      estimated_tokens: 1_000_000,
      usage_source: 'upstream',
      client_token_id: 'tok-2',
      client_token_name: 'RooCode 研发集群令牌',
      session_key: 's3',
      cost_usd: 2.9,
    },
  ];

  const summary = buildCostSummary(records, '7d', '2026-11-13T12:00:00Z');
  assert.equal(summary.total_requests, 3);
  assert.equal(summary.total_tokens, 5_500_000);
  assert.equal(summary.total_cost_usd, 6.84);
  assert.equal(summary.by_day.length, 3);
  assert.deepEqual(
    summary.by_day.map((d) => d.date),
    ['2026-11-11', '2026-11-12', '2026-11-13']
  );
  assert.equal(summary.by_model.length, 2);
  assert.equal(summary.by_model[0].model_id, 'ZhipuAI/GLM-5.2');
  assert.equal(summary.by_model[0].cost_usd, 6.5);
  assert.equal(
    summary.by_model[1].model_id,
    'nvidia/nemotron-3.5-lightning-30b-a3b'
  );
  assert.equal(summary.by_model[1].cost_usd, 0.34);
});

test('4. NULL cost_usd records are excluded from total_cost_usd and counted in unknown_price_tokens', () => {
  // Spec 5.1 scenario 4:
  const records: AuditHistoryRecord[] = [
    {
      id: 10,
      timestamp: '2026-11-13T04:00:00Z',
      selected_model_id: 'command-a-03-2025',
      requested_model: 'command-a-03-2025',
      prompt_tokens: 1_000_000,
      completion_tokens: 200_000,
      billed_tokens: 1_200_000,
      estimated_tokens: 1_200_000,
      usage_source: 'upstream',
      client_token_id: 'tok-1',
      client_token_name: '全客户端通用访问令牌',
      session_key: 's10',
      cost_usd: 4.5,
    },
    {
      id: 11,
      timestamp: '2026-11-13T05:00:00Z',
      selected_model_id: 'custom/unpriced-local-llm',
      requested_model: 'custom/unpriced-local-llm',
      prompt_tokens: 3_000_000,
      completion_tokens: 2_000_000,
      billed_tokens: 5_000_000,
      estimated_tokens: 5_000_000,
      usage_source: 'estimated',
      client_token_id: 'tok-1',
      client_token_name: '全客户端通用访问令牌',
      session_key: 's11',
      cost_usd: null,
    },
  ];

  const summary = buildCostSummary(records, '7d', '2026-11-13T12:00:00Z');
  assert.equal(summary.total_cost_usd, 4.5);
  assert.equal(summary.unknown_price_tokens, 5_000_000);
  assert.equal(summary.total_tokens, 6_200_000);
  const unknownModel = summary.by_model.find(
    (m) => m.model_id === 'custom/unpriced-local-llm'
  );
  assert.ok(unknownModel);
  assert.equal(unknownModel.price_unknown, true);
  assert.equal(unknownModel.cost_usd, null);
});

test('5. All 19 Switchyard model_routes entries are present in LITELLM_MODEL_PRICES', () => {
  const expected19 = [
    'ZhipuAI/GLM-5.2',
    'nvidia/nemotron-3-ultra-550b-a55b',
    'nvidia/nemotron-3.5-lightning-30b-a3b',
    'nvidia/nemotron-3.5-lightning:free',
    'qwen3.6-27b',
    'openai/gpt-oss-20b',
    'command-a-03-2025',
    'codestral-latest',
    'gpt-oss:20b',
    'zai-glm-4.7-flash',
    'gpt-oss-120b',
    'DeepSeek-V4-Flash',
    'mistralai/devstral-medium',
    'z-ai/glm-5.3-flash-free',
    'deepseek/deepseek-v4-flash-free',
    'google/gemini-2.5-flash',
    'moonshotai/kimi-k2.7-code',
    'google/gemini-3-flash-preview',
    'glm-4.6v',
  ];
  assert.equal(Object.keys(LITELLM_MODEL_PRICES).length, 19);
  for (const m of expected19) {
    const res = costFor(m, 100_000, 50_000);
    assert.equal(res.ok, true, `Expected ${m} to have valid pricing`);
    assert.ok(res.costUsd > 0, `Expected ${m} costUsd > 0`);
  }
});
