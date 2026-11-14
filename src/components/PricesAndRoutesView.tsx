import React, { useState } from 'react';
import { LITELLM_MODEL_PRICES, type ModelPriceEntry } from '../utils/costEngine';
import { SWITCHYARD_ROUTES, type GatewayRouteItem } from '../utils/seedData';

interface PricesAndRoutesViewProps {
  mode: 'prices' | 'routes';
}

export const PricesAndRoutesView: React.FC<PricesAndRoutesViewProps> = ({
  mode,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'estimated' | 'free'>(
    'all'
  );

  const pricesList: ModelPriceEntry[] = Object.values(LITELLM_MODEL_PRICES).filter(
    (item) => {
      const matchesSearch =
        item.model_id.toLowerCase().includes(search.toLowerCase()) ||
        item.litellm_key.toLowerCase().includes(search.toLowerCase()) ||
        item.litellm_provider.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (filterType === 'estimated') return item.estimated;
      if (filterType === 'free') return item.free_route;
      return true;
    }
  );

  const routesList: GatewayRouteItem[] = SWITCHYARD_ROUTES.filter(
    (r) =>
      r.model_id.toLowerCase().includes(search.toLowerCase()) ||
      r.provider.toLowerCase().includes(search.toLowerCase())
  );

  if (mode === 'routes') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-medium text-slate-500">
              只读网关路由快照 · 不修改任何路由权重、轮询或冷却状态机
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Switchyard 在用模型路由清单 (19 个模型)
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              对应网关 <span className="font-mono">model_routes</span> 表全部 19 个在用模型及各自关联的 LiteLLM 市价参考价。
            </p>
          </div>
          <div>
            <label htmlFor="route-search" className="sr-only">
              搜索路由模型
            </label>
            <input
              id="route-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="筛选模型或上游供应商..."
              className="px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 w-64"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="py-3 px-6">路由 ID</th>
                  <th className="py-3 px-4">网关 model_id</th>
                  <th className="py-3 px-4">上游通道 / 供应商</th>
                  <th className="py-3 px-4 text-right">权重 (只读)</th>
                  <th className="py-3 px-4 text-right">Input 参考价 / 1M</th>
                  <th className="py-3 px-4 text-right">Output 参考价 / 1M</th>
                  <th className="py-3 px-6 text-right">实际扣费</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {routesList.map((r) => {
                  const p = LITELLM_MODEL_PRICES[r.model_id];
                  const inPerM = p ? p.input_cost_per_token * 1_000_000 : 0;
                  const outPerM = p ? p.output_cost_per_token * 1_000_000 : 0;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-6 font-mono text-slate-500">
                        {r.id}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        {r.model_id}
                        {p?.estimated && (
                          <span className="ml-2 font-sans text-amber-700 font-semibold">
                            · 估算
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {r.provider} ·{' '}
                        <span className="font-mono text-slate-400">
                          {r.upstream_endpoint}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                        {r.weight}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900">
                        ${inPerM.toFixed(4)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900">
                        ${outPerM.toFixed(4)}
                      </td>
                      <td className="py-3 px-6 text-right font-mono tabular-nums text-slate-500">
                        $0.00 (免费额度)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-slate-500">
            数据源: BerriAI/litellm/main/model_prices_and_context_window.json (MIT 协议)
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            LiteLLM 价格映射表 (internal/gateway/prices.json)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            覆盖网关在用的全部 19 个模型，手工核对 LiteLLM 源 key；自托管无官方账单的模型标注{' '}
            <span className="font-mono text-amber-700 font-semibold">
              estimated: true
            </span>
            。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="按价格属性筛选"
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200"
          >
            {(
              [
                { key: 'all', label: '全部 (19)' },
                { key: 'estimated', label: '同类估算 (2)' },
                { key: 'free', label: '免费路由折算 (5)' },
              ] as const
            ).map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => setFilterType(btn.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  filterType === btn.key
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <label htmlFor="price-search" className="sr-only">
            搜索模型或 LiteLLM Key
          </label>
          <input
            id="price-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索 model_id 或 litellm_key..."
            className="px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 w-60"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                <th className="py-3 px-6">网关 model_id</th>
                <th className="py-3 px-4">LiteLLM 来源 Key</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4 text-right">Input ($/token)</th>
                <th className="py-3 px-4 text-right">Output ($/token)</th>
                <th className="py-3 px-4 text-right">折合 ($/1M in · out)</th>
                <th className="py-3 px-6">标记与映射说明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {pricesList.map((item) => {
                const in1M = item.input_cost_per_token * 1_000_000;
                const out1M = item.output_cost_per_token * 1_000_000;
                return (
                  <tr key={item.model_id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-6 font-mono font-semibold text-slate-900">
                      {item.model_id}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {item.litellm_key}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {item.litellm_provider}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                      {item.input_cost_per_token.toExponential(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                      {item.output_cost_per_token.toExponential(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                      ${in1M.toFixed(2)} / ${out1M.toFixed(2)}
                    </td>
                    <td className="py-3 px-6 text-slate-600">
                      {item.estimated && (
                        <span className="font-semibold text-amber-700 mr-1.5">
                          [估算 estimated: true]
                        </span>
                      )}
                      {item.free_route && !item.estimated && (
                        <span className="font-semibold text-slate-800 mr-1.5">
                          [免费路由按付费版折算]
                        </span>
                      )}
                      <span>{item.note}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
