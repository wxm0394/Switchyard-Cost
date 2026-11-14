export interface ModelPriceEntry {
  model_id: string;
  litellm_key: string;
  litellm_provider: string;
  input_cost_per_token: number;
  output_cost_per_token: number;
  estimated: boolean;
  free_route: boolean;
  note: string;
}

export interface AuditHistoryRecord {
  id: number;
  timestamp: string; // ISO UTC string, e.g. "2026-11-12T10:25:00Z"
  selected_model_id: string;
  requested_model: string;
  prompt_tokens: number;
  completion_tokens: number;
  billed_tokens: number;
  estimated_tokens: number;
  usage_source: string;
  client_token_id: string;
  client_token_name: string;
  session_key: string;
  cost_usd: number | null; // NULL when price is unknown
}

export interface CostByModelItem {
  model_id: string;
  cost_usd: number | null;
  tokens: number;
  requests: number;
  estimated: boolean;
  free_route: boolean;
  price_unknown: boolean;
  litellm_key?: string;
}

export interface CostByDayItem {
  date: string; // YYYY-MM-DD in CST (UTC+8)
  cost_usd: number;
  tokens: number;
  requests: number;
}

export interface CostByClientItem {
  client_token_name: string;
  cost_usd: number;
  tokens: number;
  requests: number;
}

export type CostRange = 'today' | '7d' | '30d';

export interface CostSummaryResponse {
  range: CostRange;
  total_cost_usd: number;
  total_tokens: number;
  total_requests: number;
  by_model: CostByModelItem[];
  by_day: CostByDayItem[];
  by_client: CostByClientItem[];
  unknown_price_tokens: number;
  note: string;
}

/**
 * Exact 19 in-use models in Switchyard model_routes mapped from LiteLLM's
 * model_prices_and_context_window.json (MIT License).
 */
export const LITELLM_MODEL_PRICES: Record<string, ModelPriceEntry> = {
  'ZhipuAI/GLM-5.2': {
    model_id: 'ZhipuAI/GLM-5.2',
    litellm_key: 'zai/glm-5.2',
    litellm_provider: 'zai',
    input_cost_per_token: 0.0000014,
    output_cost_per_token: 0.0000044,
    estimated: false,
    free_route: false,
    note: 'LiteLLM 官方 Z.ai GLM-5.2 价格 ($1.40 / $4.40 per 1M)',
  },
  'nvidia/nemotron-3-ultra-550b-a55b': {
    model_id: 'nvidia/nemotron-3-ultra-550b-a55b',
    litellm_key: 'baseten/nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B',
    litellm_provider: 'baseten',
    input_cost_per_token: 0.0000006,
    output_cost_per_token: 0.0000024,
    estimated: false,
    free_route: false,
    note: 'NVIDIA Nemotron-3 Ultra 550B A55B 标准托管市价 ($0.60 / $2.40 per 1M)',
  },
  'nvidia/nemotron-3.5-lightning-30b-a3b': {
    model_id: 'nvidia/nemotron-3.5-lightning-30b-a3b',
    litellm_key: 'wandb/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B',
    litellm_provider: 'wandb',
    input_cost_per_token: 0.00000007,
    output_cost_per_token: 0.0000002,
    estimated: false,
    free_route: false,
    note: 'NVIDIA Nemotron-3.5 Lightning 30B A3B 付费版市价 ($0.07 / $0.20 per 1M)',
  },
  'nvidia/nemotron-3.5-lightning:free': {
    model_id: 'nvidia/nemotron-3.5-lightning:free',
    litellm_key: 'wandb/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B',
    litellm_provider: 'wandb',
    input_cost_per_token: 0.00000007,
    output_cost_per_token: 0.0000002,
    estimated: false,
    free_route: true,
    note: '免费路由（实际支出 $0），参考价按 NVIDIA Lightning 付费版市价计算',
  },
  'qwen3.6-27b': {
    model_id: 'qwen3.6-27b',
    litellm_key: 'deepinfra/Qwen/Qwen3.6-27B',
    litellm_provider: 'deepinfra',
    input_cost_per_token: 0.00000032,
    output_cost_per_token: 0.0000032,
    estimated: true,
    free_route: true,
    note: 'Kaggle GPU 自托管，无官方账单，按同类 Qwen3.6-27B 市价估算 ($0.32 / $3.20 per 1M)',
  },
  'openai/gpt-oss-20b': {
    model_id: 'openai/gpt-oss-20b',
    litellm_key: 'cloudflare/@cf/openai/gpt-oss-20b',
    litellm_provider: 'cloudflare',
    input_cost_per_token: 0.0000002,
    output_cost_per_token: 0.0000003,
    estimated: false,
    free_route: false,
    note: 'OpenAI GPT-OSS-20B 市价 ($0.20 / $0.30 per 1M)',
  },
  'command-a-03-2025': {
    model_id: 'command-a-03-2025',
    litellm_key: 'command-a-03-2025',
    litellm_provider: 'cohere_chat',
    input_cost_per_token: 0.0000025,
    output_cost_per_token: 0.00001,
    estimated: false,
    free_route: false,
    note: 'Cohere Command A (03-2025) 官方价格 ($2.50 / $10.00 per 1M)',
  },
  'codestral-latest': {
    model_id: 'codestral-latest',
    litellm_key: 'mistral/codestral-latest',
    litellm_provider: 'mistral',
    input_cost_per_token: 0.0000003,
    output_cost_per_token: 0.0000009,
    estimated: false,
    free_route: false,
    note: 'Mistral Codestral Latest 官方价格 ($0.30 / $0.90 per 1M)',
  },
  'gpt-oss:20b': {
    model_id: 'gpt-oss:20b',
    litellm_key: 'cloudflare/@cf/openai/gpt-oss-20b',
    litellm_provider: 'cloudflare',
    input_cost_per_token: 0.0000002,
    output_cost_per_token: 0.0000003,
    estimated: true,
    free_route: true,
    note: 'Ollama 风格标签，LiteLLM 中 ollama/gpt-oss:20b-cloud 为 0，按同类 gpt-oss-20b 市价估算',
  },
  'zai-glm-4.7-flash': {
    model_id: 'zai-glm-4.7-flash',
    litellm_key: 'cloudflare/@cf/zai-org/glm-4.7-flash',
    litellm_provider: 'cloudflare',
    input_cost_per_token: 0.0000000605,
    output_cost_per_token: 0.0000004,
    estimated: false,
    free_route: false,
    note: 'Z.ai GLM-4.7-Flash 市价 ($0.0605 / $0.40 per 1M)',
  },
  'gpt-oss-120b': {
    model_id: 'gpt-oss-120b',
    litellm_key: 'azure_ai/gpt-oss-120b',
    litellm_provider: 'azure_ai',
    input_cost_per_token: 0.00000015,
    output_cost_per_token: 0.0000006,
    estimated: false,
    free_route: false,
    note: 'GPT-OSS-120B 托管市价 ($0.15 / $0.60 per 1M)',
  },
  'DeepSeek-V4-Flash': {
    model_id: 'DeepSeek-V4-Flash',
    litellm_key: 'deepseek/deepseek-v4-flash',
    litellm_provider: 'deepseek',
    input_cost_per_token: 0.0000003,
    output_cost_per_token: 0.0000012,
    estimated: false,
    free_route: false,
    note: 'DeepSeek-V4-Flash 官方参考市价 ($0.30 / $1.20 per 1M)',
  },
  'mistralai/devstral-medium': {
    model_id: 'mistralai/devstral-medium',
    litellm_key: 'mistral/devstral-medium-latest',
    litellm_provider: 'mistral',
    input_cost_per_token: 0.0000004,
    output_cost_per_token: 0.000002,
    estimated: false,
    free_route: false,
    note: 'Mistral Devstral Medium 官方市价 ($0.40 / $2.00 per 1M)',
  },
  'z-ai/glm-5.3-flash-free': {
    model_id: 'z-ai/glm-5.3-flash-free',
    litellm_key: 'friendliai/zai-org/GLM-5.3-Flash',
    litellm_provider: 'friendliai',
    input_cost_per_token: 0.00000015,
    output_cost_per_token: 0.0000005,
    estimated: false,
    free_route: true,
    note: '免费路由（实际支出 $0），参考价按 GLM-5.3-Flash 付费版市价计算 ($0.15 / $0.50 per 1M)',
  },
  'deepseek/deepseek-v4-flash-free': {
    model_id: 'deepseek/deepseek-v4-flash-free',
    litellm_key: 'deepseek/deepseek-v4-flash',
    litellm_provider: 'deepseek',
    input_cost_per_token: 0.0000003,
    output_cost_per_token: 0.0000012,
    estimated: false,
    free_route: true,
    note: '免费路由（实际支出 $0），参考价按 DeepSeek-V4-Flash 付费版市价计算 ($0.30 / $1.20 per 1M)',
  },
  'google/gemini-2.5-flash': {
    model_id: 'google/gemini-2.5-flash',
    litellm_key: 'gemini-2.5-flash',
    litellm_provider: 'vertex_ai-language-models',
    input_cost_per_token: 0.0000003,
    output_cost_per_token: 0.0000025,
    estimated: false,
    free_route: false,
    note: 'Google Gemini 2.5 Flash 官方价格 ($0.30 / $2.50 per 1M)',
  },
  'moonshotai/kimi-k2.7-code': {
    model_id: 'moonshotai/kimi-k2.7-code',
    litellm_key: 'moonshot/kimi-k2.7-code',
    litellm_provider: 'moonshot',
    input_cost_per_token: 0.00000095,
    output_cost_per_token: 0.000004,
    estimated: false,
    free_route: false,
    note: 'Moonshot Kimi K2.7 Code 官方价格 ($0.95 / $4.00 per 1M)',
  },
  'google/gemini-3-flash-preview': {
    model_id: 'google/gemini-3-flash-preview',
    litellm_key: 'gemini/gemini-3-flash-preview',
    litellm_provider: 'gemini',
    input_cost_per_token: 0.0000005,
    output_cost_per_token: 0.000003,
    estimated: false,
    free_route: false,
    note: 'Google Gemini 3 Flash Preview 官方价格 ($0.50 / $3.00 per 1M)',
  },
  'glm-4.6v': {
    model_id: 'glm-4.6v',
    litellm_key: 'novita/zai-org/glm-4.6v',
    litellm_provider: 'novita',
    input_cost_per_token: 0.0000003,
    output_cost_per_token: 0.0000009,
    estimated: false,
    free_route: false,
    note: 'GLM-4.6V 视觉模型托管市价 ($0.30 / $0.90 per 1M)',
  },
};

/**
 * Equivalent to Go's `CostFor(modelID string, promptTokens, completionTokens int64) (float64, bool)`
 * Returns { costUsd, ok }. Never throws; returns ok=false when model is unknown or tokens < 0.
 */
export function costFor(
  modelID: string,
  promptTokens: number,
  completionTokens: number,
  priceMap: Record<string, ModelPriceEntry> = LITELLM_MODEL_PRICES
): { costUsd: number; ok: boolean } {
  try {
    if (!modelID || typeof modelID !== 'string') {
      return { costUsd: 0, ok: false };
    }
    const entry = priceMap[modelID];
    if (!entry) {
      return { costUsd: 0, ok: false };
    }
    const pTokens = Math.max(0, Number(promptTokens) || 0);
    const cTokens = Math.max(0, Number(completionTokens) || 0);
    const cost =
      pTokens * entry.input_cost_per_token +
      cTokens * entry.output_cost_per_token;
    if (!Number.isFinite(cost)) {
      return { costUsd: 0, ok: false };
    }
    return { costUsd: cost, ok: true };
  } catch {
    return { costUsd: 0, ok: false };
  }
}

/**
 * Converts an ISO UTC timestamp string into a CST (UTC+8) date string YYYY-MM-DD.
 * Per spec 4.3: CST day = UTC previous day 16:00 to current day 16:00 (i.e. UTC + 8 hours).
 */
export function toCSTDateString(isoUtcTimestamp: string): string {
  const ms = Date.parse(isoUtcTimestamp);
  if (Number.isNaN(ms)) {
    return isoUtcTimestamp.slice(0, 10);
  }
  const cstMs = ms + 8 * 3600 * 1000;
  return new Date(cstMs).toISOString().slice(0, 10);
}

/**
 * Rounds USD amount to 2 decimal places per spec 4.3 ("金额保留 2 位小数；token 和请求数是整数").
 */
export function roundUsd2(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Aggregates audit_history records for a given range ('today' | '7d' | '30d') relative to referenceNowUtc.
 * Mirrors the SQL aggregation in `internal/gateway/cost.go`.
 */
export function buildCostSummary(
  records: AuditHistoryRecord[],
  range: CostRange = '7d',
  referenceNowUtc: string = '2026-11-14T03:38:00Z',
  priceMap: Record<string, ModelPriceEntry> = LITELLM_MODEL_PRICES
): CostSummaryResponse {
  const normalizedRange: CostRange =
    range === 'today' || range === '7d' || range === '30d' ? range : '7d';

  const todayCst = toCSTDateString(referenceNowUtc);
  const todayCstStartUtcMs =
    Date.parse(`${todayCst}T00:00:00Z`) - 8 * 3600 * 1000;

  let daysCount = 7;
  if (normalizedRange === 'today') daysCount = 1;
  else if (normalizedRange === '30d') daysCount = 30;

  const cutoffUtcMs = todayCstStartUtcMs - (daysCount - 1) * 86400 * 1000;
  const endUtcMs = todayCstStartUtcMs + 86400 * 1000;

  const filtered = records.filter((r) => {
    const t = Date.parse(r.timestamp);
    return !Number.isNaN(t) && t >= cutoffUtcMs && t < endUtcMs;
  });

  let totalCostRaw = 0;
  let totalTokens = 0;
  let totalRequests = 0;
  let unknownPriceTokens = 0;

  const modelAgg = new Map<
    string,
    {
      model_id: string;
      costRaw: number;
      hasKnownCost: boolean;
      allNullCost: boolean;
      tokens: number;
      requests: number;
    }
  >();

  const dayAgg = new Map<
    string,
    { date: string; costRaw: number; tokens: number; requests: number }
  >();

  const clientAgg = new Map<
    string,
    {
      client_token_name: string;
      costRaw: number;
      tokens: number;
      requests: number;
    }
  >();

  for (const r of filtered) {
    const tokens = Math.round(Number(r.billed_tokens) || 0);
    totalTokens += tokens;
    totalRequests += 1;

    const isCostNull = r.cost_usd === null || r.cost_usd === undefined;
    const rowCost = isCostNull ? 0 : Number(r.cost_usd) || 0;

    if (isCostNull) {
      unknownPriceTokens += tokens;
    } else {
      totalCostRaw += rowCost;
    }

    // By model
    const modelId = r.selected_model_id || r.requested_model || 'unknown';
    const existingModel = modelAgg.get(modelId) || {
      model_id: modelId,
      costRaw: 0,
      hasKnownCost: false,
      allNullCost: true,
      tokens: 0,
      requests: 0,
    };
    existingModel.tokens += tokens;
    existingModel.requests += 1;
    if (!isCostNull) {
      existingModel.costRaw += rowCost;
      existingModel.hasKnownCost = true;
      existingModel.allNullCost = false;
    }
    modelAgg.set(modelId, existingModel);

    // By CST day
    const cstDate = toCSTDateString(r.timestamp);
    const existingDay = dayAgg.get(cstDate) || {
      date: cstDate,
      costRaw: 0,
      tokens: 0,
      requests: 0,
    };
    existingDay.costRaw += rowCost;
    existingDay.tokens += tokens;
    existingDay.requests += 1;
    dayAgg.set(cstDate, existingDay);

    // By client token name
    const clientName =
      r.client_token_name && r.client_token_name.trim() !== ''
        ? r.client_token_name
        : '默认客户端令牌';
    const existingClient = clientAgg.get(clientName) || {
      client_token_name: clientName,
      costRaw: 0,
      tokens: 0,
      requests: 0,
    };
    existingClient.costRaw += rowCost;
    existingClient.tokens += tokens;
    existingClient.requests += 1;
    clientAgg.set(clientName, existingClient);
  }

  const by_model: CostByModelItem[] = Array.from(modelAgg.values())
    .map((m) => {
      const priceInfo = priceMap[m.model_id];
      const priceUnknown = m.allNullCost && !priceInfo;
      return {
        model_id: m.model_id,
        cost_usd: priceUnknown ? null : roundUsd2(m.costRaw),
        tokens: m.tokens,
        requests: m.requests,
        estimated: Boolean(priceInfo?.estimated),
        free_route: Boolean(priceInfo?.free_route),
        price_unknown: priceUnknown,
        litellm_key: priceInfo?.litellm_key,
      };
    })
    .sort((a, b) => {
      // Unknown price items at the bottom, otherwise sort descending by cost_usd then tokens
      if (a.price_unknown && !b.price_unknown) return 1;
      if (!a.price_unknown && b.price_unknown) return -1;
      const diff = (b.cost_usd ?? -1) - (a.cost_usd ?? -1);
      if (diff !== 0) return diff;
      return b.tokens - a.tokens;
    });

  const by_day: CostByDayItem[] = Array.from(dayAgg.values())
    .map((d) => ({
      date: d.date,
      cost_usd: roundUsd2(d.costRaw),
      tokens: d.tokens,
      requests: d.requests,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const by_client: CostByClientItem[] = Array.from(clientAgg.values())
    .map((c) => ({
      client_token_name: c.client_token_name,
      cost_usd: roundUsd2(c.costRaw),
      tokens: c.tokens,
      requests: c.requests,
    }))
    .sort((a, b) => b.cost_usd - a.cost_usd || b.tokens - a.tokens);

  return {
    range: normalizedRange,
    total_cost_usd: roundUsd2(totalCostRaw),
    total_tokens: totalTokens,
    total_requests: totalRequests,
    by_model,
    by_day,
    by_client,
    unknown_price_tokens: unknownPriceTokens,
    note: '参考价，按市价估算，非实际扣费',
  };
}
