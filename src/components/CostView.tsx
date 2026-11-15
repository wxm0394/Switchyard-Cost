import React, { useState } from 'react';
import {
  LITELLM_MODEL_PRICES,
  type CostRange,
  type CostSummaryResponse,
} from '../utils/costEngine';

interface CostViewProps {
  todaySummary: CostSummaryResponse;
  sevenDaySummary: CostSummaryResponse;
  thirtyDaySummary: CostSummaryResponse;
  activeRange: CostRange;
  onRangeChange: (range: CostRange) => void;
}

function formatUSD(val: number | null | undefined): string {
  if (val === null || val === undefined || Number.isNaN(val)) {
    return '价格未知';
  }
  return `$${val.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatInt(val: number): string {
  return Math.round(val).toLocaleString('en-US');
}

function formatCompactTokens(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(2)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K`;
  }
  return String(tokens);
}

export const CostView: React.FC<CostViewProps> = ({
  todaySummary,
  sevenDaySummary,
  thirtyDaySummary,
  activeRange,
  onRangeChange,
}) => {
  const [modelSearch, setModelSearch] = useState('');
  const [selectedBarDate, setSelectedBarDate] = useState<string | null>(null);

  const activeSummary =
    activeRange === 'today'
      ? todaySummary
      : activeRange === '7d'
      ? sevenDaySummary
      : thirtyDaySummary;

  const filteredModels = activeSummary.by_model.filter((m) =>
    m.model_id.toLowerCase().includes(modelSearch.trim().toLowerCase())
  );

  // 30-day trend always renders the 30d daily series per Spec 4.4 ("近 30 天每天的参考价柱状图")
  const thirtyDaysSeries = thirtyDaySummary.by_day;
  const maxDayCost = Math.max(
    ...thirtyDaysSeries.map((d) => d.cost_usd),
    0.01
  );

  const inspectedDay =
    thirtyDaysSeries.find((d) => d.date === selectedBarDate) ||
    thirtyDaysSeries[thirtyDaysSeries.length - 1] ||
    null;

  return (
    <div className="space-y-8">
      {/* Page Title & Range Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-medium text-slate-500">
            只读金额检测系统 · LiteLLM 市价参考体系 · CST (UTC+8) 日切分
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Token 市价花费参考看板
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            当前网关路由主要使用免费额度（实际支出 <span className="font-mono font-semibold text-slate-900">$0.00</span>）。以下金额为按 LiteLLM 开源价格表折算的市价参考价。
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 mr-1">明细表时间范围:</span>
          <div
            role="group"
            aria-label="选择汇总时间范围"
            className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200"
          >
            {(
              [
                { key: 'today', label: '今日 (Today)' },
                { key: '7d', label: '近 7 天 (7d)' },
                { key: '30d', label: '近 30 天 (30d)' },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onRangeChange(item.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeRange === item.key
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. 顶部三张卡片：今日参考价、近 7 天参考价、近 30 天参考价 */}
      <section aria-label="市价参考价核心汇总卡片">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 'card-today',
              rangeKey: 'today' as CostRange,
              title: '今日参考价 (CST)',
              data: todaySummary,
            },
            {
              id: 'card-7d',
              rangeKey: '7d' as CostRange,
              title: '近 7 天参考价',
              data: sevenDaySummary,
            },
            {
              id: 'card-30d',
              rangeKey: '30d' as CostRange,
              title: '近 30 天参考价',
              data: thirtyDaySummary,
            },
          ].map((card) => {
            const isSelected = activeRange === card.rangeKey;
            return (
              <div
                key={card.id}
                data-testid={card.id}
                onClick={() => onRangeChange(card.rangeKey)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRangeChange(card.rangeKey);
                  }
                }}
                className={`text-left p-6 rounded-xl border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-white border-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {card.title}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    实际支出 $0.00
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl font-bold font-mono tabular-nums text-slate-900">
                    {formatUSD(card.data.total_cost_usd)}
                  </span>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {formatInt(card.data.total_requests)} 次请求 ·{' '}
                    {formatCompactTokens(card.data.total_tokens)} tokens
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  参考价，按市价估算，非实际扣费
                </p>

                {card.data.unknown_price_tokens > 0 && (
                  <p className="mt-1.5 text-xs text-amber-700 font-mono tabular-nums">
                    另有 {formatInt(card.data.unknown_price_tokens)} tokens 价格未知（未计入总价）
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. 按模型拆分表：模型、请求数、token 数、参考价，按参考价从高到低排 */}
      <section
        aria-label="按模型拆分表"
        className="bg-white rounded-xl border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              01. 按模型拆分参考花费（{activeRange === 'today' ? '今日' : activeRange === '7d' ? '近 7 天' : '近 30 天'}）
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              按参考价从高到低排序 · 免费路由按对应模型付费版市价折算 · 自托管同类估算标「估算」· 本表只统计已计价的请求，未计价的不列入
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="model-filter-input" className="sr-only">
              筛选模型名称
            </label>
            <input
              id="model-filter-input"
              type="search"
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              placeholder="搜索模型 ID (如 glm, nemotron, qwen)..."
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="py-3 px-6">模型 (model_id)</th>
                <th className="py-3 px-4">定价属性与 LiteLLM 映射源</th>
                <th className="py-3 px-4 text-right">请求数</th>
                <th className="py-3 px-4 text-right">Token 总数</th>
                <th className="py-3 px-4 text-right">实际支出</th>
                <th className="py-3 px-6 text-right">市价参考价 (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredModels.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 px-6 text-center text-sm text-slate-500"
                  >
                    未找到匹配的模型记录。
                  </td>
                </tr>
              ) : (
                filteredModels.map((row) => {
                  const priceMeta = LITELLM_MODEL_PRICES[row.model_id];
                  return (
                    <tr
                      key={row.model_id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-6 font-mono text-xs font-medium text-slate-900">
                        <span>{row.model_id}</span>
                        {row.estimated && (
                          <span className="ml-2 text-xs font-sans font-semibold text-amber-700">
                            · 估算
                          </span>
                        )}
                        {row.price_unknown && (
                          <span className="ml-2 text-xs font-sans font-semibold text-rose-700">
                            · 价格未知
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {row.price_unknown ? (
                          <span className="text-rose-700">
                            未收录于 prices.json · cost_usd 记 NULL · 计入 unknown_price_tokens
                          </span>
                        ) : (
                          <span>
                            <span className="font-mono text-slate-600">
                              {priceMeta?.litellm_key || row.litellm_key}
                            </span>
                            {row.free_route && (
                              <span className="text-slate-500">
                                {' '}
                                · 免费路由按付费市价折算
                              </span>
                            )}
                            {row.estimated && (
                              <span className="text-amber-700 font-medium">
                                {' '}
                                · 同类模型参考价 (estimated: true)
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs text-slate-700">
                        {formatInt(row.requests)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs text-slate-700">
                        {formatInt(row.tokens)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-xs text-slate-500">
                        $0.00
                      </td>
                      <td className="py-3 px-6 text-right font-mono tabular-nums text-sm font-semibold text-slate-900">
                        {row.price_unknown || row.cost_usd === null ? (
                          <span className="text-rose-700 font-sans text-xs font-semibold">
                            价格未知
                          </span>
                        ) : (
                          <span>
                            {formatUSD(row.cost_usd)}
                            {row.estimated && (
                              <span className="ml-1.5 text-xs font-sans font-medium text-amber-700">
                                (估算)
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800">
                <td className="py-3 px-6">
                  合计（{filteredModels.length} 个模型）
                </td>
                <td className="py-3 px-4 text-slate-500 font-normal">
                  {activeSummary.unknown_price_tokens > 0
                    ? `未知价格 Token 单独统计：${formatInt(activeSummary.unknown_price_tokens)} tokens（不混入总价）`
                    : '全部已计价'}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums">
                  {formatInt(activeSummary.total_requests)}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums">
                  {formatInt(activeSummary.total_tokens)}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-500">
                  $0.00
                </td>
                <td className="py-3 px-6 text-right font-mono tabular-nums text-slate-900 text-sm">
                  {formatUSD(activeSummary.total_cost_usd)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* 3. 按天趋势：近 30 天每天的参考价柱状图（简单 div 高度条即可，不用引入图表库） */}
      <section
        aria-label="近 30 天按天趋势柱状图"
        className="bg-white rounded-xl border border-slate-200 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              02. 近 30 天每日参考价趋势（按 CST 日切分）
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              CST 日 = UTC 前一天 16:00 至当天 16:00 · 点击或悬停柱条可查看单日详情
            </p>
          </div>
          {inspectedDay && (
            <div className="flex items-center gap-4 text-xs font-mono tabular-nums bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-900">
                {inspectedDay.date} (CST)
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="text-slate-700">
                参考价:{' '}
                <strong className="text-slate-900">
                  {formatUSD(inspectedDay.cost_usd)}
                </strong>
              </span>
              <span aria-hidden="true" className="text-slate-300">
                ·
              </span>
              <span className="text-slate-600">
                {formatInt(inspectedDay.requests)} 请求 /{' '}
                {formatCompactTokens(inspectedDay.tokens)} tokens
              </span>
            </div>
          )}
        </div>

        <div className="mt-6">
          <div
            data-testid="daily-bar-chart"
            className="h-48 flex items-end gap-1.5 pt-4 pb-2 px-1 border-b border-slate-200"
          >
            {thirtyDaysSeries.map((day) => {
              const heightPct = Math.max(
                6,
                Math.min(100, Math.round((day.cost_usd / maxDayCost) * 100))
              );
              const isSelected = inspectedDay?.date === day.date;
              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => setSelectedBarDate(day.date)}
                  onMouseEnter={() => setSelectedBarDate(day.date)}
                  aria-label={`${day.date} 参考价 ${formatUSD(day.cost_usd)}, ${day.requests} 次请求`}
                  className="group flex-1 h-full flex flex-col justify-end items-center focus:outline-none"
                >
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t transition-opacity ${
                      isSelected
                        ? 'bg-slate-900'
                        : 'bg-slate-400/75 group-hover:bg-slate-700'
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs font-mono tabular-nums text-slate-500 mt-2 px-1">
            <span>{thirtyDaysSeries[0]?.date || '2026-10-16'}</span>
            <span>Tier-1 历史库完整审计起点: 2026-11-02</span>
            <span>
              {thirtyDaysSeries[thirtyDaysSeries.length - 1]?.date ||
                '2026-11-14'}{' '}
              (今日)
            </span>
          </div>
        </div>
      </section>

      {/* 4. 按客户端拆分 & 实时 CostFor 计价模拟器 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 按客户端拆分 */}
        <section
          aria-label="按客户端令牌拆分"
          className="lg:col-span-12 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between"
        >
          <div>
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-semibold text-slate-900">
                03. 按客户端令牌拆分（{activeRange === 'today' ? '今日' : activeRange === '7d' ? '近 7 天' : '近 30 天'}）
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                按每个 client_token_name 汇总市价参考价与消费占比（参考价，按市价估算，非实际扣费）
              </p>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {activeSummary.by_client.map((client) => {
                const pct =
                  activeSummary.total_cost_usd > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (client.cost_usd / activeSummary.total_cost_usd) *
                            1000
                        ) / 10
                      )
                    : 0;
                return (
                  <div
                    key={client.client_token_name}
                    className="py-3.5 first:pt-1 last:pb-1"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="text-sm font-semibold text-slate-900">
                          {client.client_token_name}
                        </span>
                        <span className="ml-2 text-xs font-mono tabular-nums text-slate-500">
                          · {formatInt(client.requests)} 请求 ·{' '}
                          {formatCompactTokens(client.tokens)} tokens
                        </span>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <span className="text-sm font-bold text-slate-900">
                          {formatUSD(client.cost_usd)}
                        </span>
                        <span className="ml-2 text-xs text-slate-500">
                          ({pct.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${Math.max(2, pct)}%` }}
                        className="h-full bg-slate-900 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>数据来源：/opt/switchyard-history/audit_history.db (audit_history 表)</span>
            <span className="font-mono tabular-nums">
              接口：GET /api/gateway/cost/summary?range={activeRange}
            </span>
          </div>
        </section>

      </div>
    </div>
  );
};
