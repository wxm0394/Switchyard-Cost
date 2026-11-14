import {
  LITELLM_MODEL_PRICES,
  costFor,
  type AuditHistoryRecord,
} from './costEngine';

export interface GatewayRouteItem {
  id: string;
  model_id: string;
  provider: string;
  upstream_endpoint: string;
  is_free_tier: boolean;
  status: 'healthy' | 'standby';
  weight: number;
  daily_requests: number;
}

export const SWITCHYARD_ROUTES: GatewayRouteItem[] = [
  {
    id: 'rt-01',
    model_id: 'nvidia/nemotron-3.5-lightning-30b-a3b',
    provider: 'NVIDIA NIM',
    upstream_endpoint: 'https://integrate.api.nvidia.com/v1',
    is_free_tier: true,
    status: 'healthy',
    weight: 30,
    daily_requests: 420,
  },
  {
    id: 'rt-02',
    model_id: 'nvidia/nemotron-3.5-lightning:free',
    provider: 'OpenRouter (Free)',
    upstream_endpoint: 'https://openrouter.ai/api/v1',
    is_free_tier: true,
    status: 'healthy',
    weight: 25,
    daily_requests: 380,
  },
  {
    id: 'rt-03',
    model_id: 'ZhipuAI/GLM-5.2',
    provider: 'BigModel / ModelScope',
    upstream_endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    is_free_tier: true,
    status: 'healthy',
    weight: 20,
    daily_requests: 295,
  },
  {
    id: 'rt-04',
    model_id: 'nvidia/nemotron-3-ultra-550b-a55b',
    provider: 'NVIDIA NIM',
    upstream_endpoint: 'https://integrate.api.nvidia.com/v1',
    is_free_tier: true,
    status: 'healthy',
    weight: 15,
    daily_requests: 180,
  },
  {
    id: 'rt-05',
    model_id: 'moonshotai/kimi-k2.7-code',
    provider: 'Moonshot / NVIDIA',
    upstream_endpoint: 'https://api.moonshot.cn/v1',
    is_free_tier: true,
    status: 'healthy',
    weight: 20,
    daily_requests: 240,
  },
  {
    id: 'rt-06',
    model_id: 'google/gemini-3-flash-preview',
    provider: 'Google AI Studio',
    upstream_endpoint: 'https://generativelanguage.googleapis.com/v1beta',
    is_free_tier: true,
    status: 'healthy',
    weight: 20,
    daily_requests: 210,
  },
  {
    id: 'rt-07',
    model_id: 'google/gemini-2.5-flash',
    provider: 'Google AI Studio',
    upstream_endpoint: 'https://generativelanguage.googleapis.com/v1beta',
    is_free_tier: true,
    status: 'healthy',
    weight: 20,
    daily_requests: 265,
  },
  {
    id: 'rt-08',
    model_id: 'qwen3.6-27b',
    provider: 'Kaggle GPU Self-Hosted',
    upstream_endpoint: 'http://127.0.0.1:11434/v1',
    is_free_tier: true,
    status: 'healthy',
    weight: 15,
    daily_requests: 190,
  },
  {
    id: 'rt-09',
    model_id: 'command-a-03-2025',
    provider: 'Cohere Trial Tier',
    upstream_endpoint: 'https://api.cohere.com/v2',
    is_free_tier: true,
    status: 'healthy',
    weight: 10,
    daily_requests: 95,
  },
  {
    id: 'rt-10',
    model_id: 'DeepSeek-V4-Flash',
    provider: 'AMD Developer Cloud',
    upstream_endpoint: 'https://api.amd-cloud.ai/v1',
    is_free_tier: true,
    status: 'healthy',
    weight: 18,
    daily_requests: 220,
  },
  {
    id: 'rt-11',
    model_id: 'deepseek/deepseek-v4-flash-free',
    provider: 'OpenRouter (Free)',
    upstream_endpoint: 'https://openrouter.ai/api/v1',
    is_free_tier: true,
    status: 'healthy',
    weight: 18,
    daily_requests: 205,
  },
  {
    id: 'rt-12',
    model_id: 'z-ai/glm-5.3-flash-free',
    provider: 'OpenRouter (Free)',
    upstream_endpoint: 'https://openrouter.ai/api/v1',
    is_free_tier: true,
    status: 'healthy',
    weight: 18,
    daily_requests: 195,
  },
  {
    id: 'rt-13',
    model_id: 'mistralai/devstral-medium',
    provider: 'Mistral La Plateforme',
    upstream_endpoint: 'https://api.mistral.ai/v1',
    is_free_tier: true,
    status: 'healthy',
    weight: 12,
    daily_requests: 130,
  },
  {
    id: 'rt-14',
    model_id: 'codestral-latest',
    provider: 'Mistral Codestral Free',
    upstream_endpoint: 'https://codestral.mistral.ai/v1',
    is_free_tier: true,
    status: 'healthy',
    weight: 15,
    daily_requests: 175,
  },
  {
    id: 'rt-15',
    model_id: 'gpt-oss-120b',
    provider: 'Cerebras / Github Models',
    upstream_endpoint: 'https://api.cerebras.ai/v1',
    is_free_tier: true,
    status: 'healthy',
    weight: 12,
    daily_requests: 140,
  },
  {
    id: 'rt-16',
    model_id: 'openai/gpt-oss-20b',
    provider: 'Cloudflare Workers AI',
    upstream_endpoint: 'https://api.cloudflare.com/client/v4',
    is_free_tier: true,
    status: 'healthy',
    weight: 10,
    daily_requests: 110,
  },
  {
    id: 'rt-17',
    model_id: 'gpt-oss:20b',
    provider: 'Ollama Cloud Free',
    upstream_endpoint: 'https://ollama.com/api',
    is_free_tier: true,
    status: 'healthy',
    weight: 10,
    daily_requests: 85,
  },
  {
    id: 'rt-18',
    model_id: 'zai-glm-4.7-flash',
    provider: 'BigModel Free Quota',
    upstream_endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    is_free_tier: true,
    status: 'healthy',
    weight: 15,
    daily_requests: 160,
  },
  {
    id: 'rt-19',
    model_id: 'glm-4.6v',
    provider: 'Zhipu Vision Quota',
    upstream_endpoint: 'https://open.bigmodel.cn/api/paas/v4',
    is_free_tier: true,
    status: 'healthy',
    weight: 10,
    daily_requests: 75,
  },
];

/**
 * Generates deterministic Tier-1 `audit_history` records spanning 2026-10-16 to 2026-11-14 (CST)
 * so that `today`, `7d`, and `30d` views all have realistic, rich, verifiable data.
 */
export function generateSeedAuditHistory(): AuditHistoryRecord[] {
  const records: AuditHistoryRecord[] = [];
  const models = Object.keys(LITELLM_MODEL_PRICES);
  const clients = [
    { id: 'ct-01', name: '全客户端通用访问令牌', share: 0.56 },
    { id: 'ct-02', name: 'RooCode 自动化研发工作流', share: 0.24 },
    { id: 'ct-03', name: 'Muse 验收与回归测试端', share: 0.12 },
    { id: 'ct-04', name: 'CLI 终端日常助手', share: 0.08 },
  ];

  let nextId = 1000;

  // Generate 30 CST days ending at 2026-11-14 (CST)
  // Note: 2026-11-14 CST starts at 2026-11-13T16:00:00Z
  const baseStartUtcMs = Date.parse('2026-10-15T18:00:00Z'); // 2026-10-16 02:00 CST

  for (let dayIdx = 0; dayIdx < 30; dayIdx++) {
    const dayStartMs = baseStartUtcMs + dayIdx * 86400 * 1000;
    // Higher activity from 2026-11-02 onwards (dayIdx >= 17)
    const intensityMultiplier = dayIdx >= 17 ? 1.35 : 0.65;

    for (let mIdx = 0; mIdx < models.length; mIdx++) {
      const modelId = models[mIdx];
      // Deterministic pseudo-random activity per day & model
      const seed = (dayIdx * 31 + mIdx * 17) % 100;
      if (dayIdx < 17 && seed > 55) continue;

      const clientIdx = (dayIdx + mIdx) % clients.length;
      const client = clients[clientIdx];

      // Prompt and completion token scale based on model usage profile
      let basePrompt = 320_000 + ((seed * 19_000) % 950_000);
      let baseCompletion = 95_000 + ((seed * 7_500) % 340_000);

      if (
        modelId === 'ZhipuAI/GLM-5.2' ||
        modelId === 'nvidia/nemotron-3.5-lightning-30b-a3b' ||
        modelId === 'moonshotai/kimi-k2.7-code' ||
        modelId === 'nvidia/nemotron-3-ultra-550b-a55b'
      ) {
        basePrompt = Math.round(basePrompt * 1.9 * intensityMultiplier);
        baseCompletion = Math.round(baseCompletion * 1.75 * intensityMultiplier);
      } else {
        basePrompt = Math.round(basePrompt * intensityMultiplier);
        baseCompletion = Math.round(baseCompletion * intensityMultiplier);
      }

      const { costUsd, ok } = costFor(modelId, basePrompt, baseCompletion);
      const tsMs = dayStartMs + ((mIdx * 1800 + seed * 120) % 64800) * 1000;

      records.push({
        id: nextId++,
        timestamp: new Date(tsMs).toISOString(),
        selected_model_id: modelId,
        requested_model: modelId,
        prompt_tokens: basePrompt,
        completion_tokens: baseCompletion,
        billed_tokens: basePrompt + baseCompletion,
        estimated_tokens: basePrompt + baseCompletion,
        usage_source: 'upstream',
        client_token_id: client.id,
        client_token_name: client.name,
        session_key: `sess-${dayIdx}-${mIdx}`,
        cost_usd: ok ? costUsd : null,
      });
    }

    // Also add 1 unpriced experimental self-hosted record every 2 days to exercise unknown_price_tokens (cost_usd = NULL)
    if (dayIdx % 2 === 1) {
      const unpricedPrompt = 420_000 + dayIdx * 15_000;
      const unpricedCompletion = 130_000 + dayIdx * 5_000;
      const tsMs = dayStartMs + 3600 * 5 * 1000;
      records.push({
        id: nextId++,
        timestamp: new Date(tsMs).toISOString(),
        selected_model_id: 'kaggle/custom-llama-lora-exp',
        requested_model: 'kaggle/custom-llama-lora-exp',
        prompt_tokens: unpricedPrompt,
        completion_tokens: unpricedCompletion,
        billed_tokens: unpricedPrompt + unpricedCompletion,
        estimated_tokens: unpricedPrompt + unpricedCompletion,
        usage_source: 'estimated',
        client_token_id: 'ct-02',
        client_token_name: 'RooCode 自动化研发工作流',
        session_key: `sess-unpriced-${dayIdx}`,
        cost_usd: null, // NULL per spec 4.2: 查不到价格时 cost_usd 记 NULL
      });
    }
  }

  return records;
}
