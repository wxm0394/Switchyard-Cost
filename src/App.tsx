/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { CostView } from './components/CostView';
import { DeliverablesView } from './components/DeliverablesView';
import { PricesAndRoutesView } from './components/PricesAndRoutesView';
import {
  LITELLM_MODEL_PRICES,
  buildCostSummary,
  costFor,
  type AuditHistoryRecord,
  type CostRange,
  type CostSummaryResponse,
} from './utils/costEngine';
import { generateSeedAuditHistory } from './utils/seedData';

type ActiveTab = 'cost' | 'routes' | 'prices' | 'deliverables';

const REFERENCE_NOW_UTC = '2026-11-14T03:38:00Z';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cost');
  const [activeRange, setActiveRange] = useState<CostRange>('7d');
  const [localRecords, setLocalRecords] = useState<AuditHistoryRecord[]>(() =>
    generateSeedAuditHistory()
  );

  const [apiSummaries, setApiSummaries] = useState<{
    today?: CostSummaryResponse;
    '7d'?: CostSummaryResponse;
    '30d'?: CostSummaryResponse;
  }>({});
  const [isSubmittingSim, setIsSubmittingSim] = useState(false);

  // Local deterministic fallback summaries
  const computedSummaries = useMemo(
    () => ({
      today: buildCostSummary(
        localRecords,
        'today',
        REFERENCE_NOW_UTC,
        LITELLM_MODEL_PRICES
      ),
      '7d': buildCostSummary(
        localRecords,
        '7d',
        REFERENCE_NOW_UTC,
        LITELLM_MODEL_PRICES
      ),
      '30d': buildCostSummary(
        localRecords,
        '30d',
        REFERENCE_NOW_UTC,
        LITELLM_MODEL_PRICES
      ),
    }),
    [localRecords]
  );

  const fetchAllSummaries = async () => {
    try {
      const [rToday, r7d, r30d] = await Promise.all([
        fetch('/api/gateway/cost/summary?range=today'),
        fetch('/api/gateway/cost/summary?range=7d'),
        fetch('/api/gateway/cost/summary?range=30d'),
      ]);
      if (rToday.ok && r7d.ok && r30d.ok) {
        const [today, sevenD, thirtyD] = await Promise.all([
          rToday.json(),
          r7d.json(),
          r30d.json(),
        ]);
        setApiSummaries({ today, '7d': sevenD, '30d': thirtyD });
      }
    } catch {
      // Uses deterministic local calculation if offline or static preview
    }
  };

  useEffect(() => {
    void fetchAllSummaries();
  }, []);

  const todaySummary = apiSummaries.today || computedSummaries.today;
  const sevenDaySummary = apiSummaries['7d'] || computedSummaries['7d'];
  const thirtyDaySummary = apiSummaries['30d'] || computedSummaries['30d'];

  const handleSimulateAudit = async (payload: {
    model_id: string;
    prompt_tokens: number;
    completion_tokens: number;
    client_token_name: string;
  }) => {
    setIsSubmittingSim(true);
    try {
      const res = await fetch('/api/gateway/simulate-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await fetchAllSummaries();
      }
    } catch {
      // Also update local state fallback
    } finally {
      const { costUsd, ok } = costFor(
        payload.model_id,
        payload.prompt_tokens,
        payload.completion_tokens
      );
      const nextRec: AuditHistoryRecord = {
        id: localRecords.length + 3000,
        timestamp: REFERENCE_NOW_UTC,
        selected_model_id: payload.model_id,
        requested_model: payload.model_id,
        prompt_tokens: payload.prompt_tokens,
        completion_tokens: payload.completion_tokens,
        billed_tokens: payload.prompt_tokens + payload.completion_tokens,
        estimated_tokens: payload.prompt_tokens + payload.completion_tokens,
        usage_source: 'upstream',
        client_token_id: 'ct-sim',
        client_token_name: payload.client_token_name,
        session_key: `sim-${Date.now()}`,
        cost_usd: ok ? costUsd : null,
      };
      setLocalRecords((prev) => [nextRec, ...prev]);
      setIsSubmittingSim(false);
    }
  };

  const handleResetAudit = async () => {
    setIsSubmittingSim(true);
    try {
      await fetch('/api/gateway/reset-audit', { method: 'POST' });
      await fetchAllSummaries();
    } catch {
      // fallback
    } finally {
      setLocalRecords(generateSeedAuditHistory());
      setIsSubmittingSim(false);
    }
  };

  const handleExportCurrentJson = () => {
    const activeData =
      activeRange === 'today'
        ? todaySummary
        : activeRange === '7d'
        ? sevenDaySummary
        : thirtyDaySummary;
    const blob = new Blob([JSON.stringify(activeData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `switchyard-cost-summary-${activeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#cost"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('cost');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Switchyard Panel
          </a>

          {/* Zone 2: 4 concise single-line text navigation links */}
          <nav
            aria-label="主导航"
            className="flex items-center gap-6 text-sm font-medium text-slate-600 overflow-x-auto"
          >
            {(
              [
                { id: 'cost', label: '花费 (Cost)' },
                { id: 'routes', label: '路由清单 (Routes)' },
                { id: 'prices', label: 'LiteLLM 价格映射' },
                { id: 'deliverables', label: 'Go 源码与验收' },
              ] as const
            ).map((nav) => (
              <button
                key={nav.id}
                type="button"
                onClick={() => {
                  setActiveTab(nav.id);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === nav.id
                    ? 'border-slate-900 text-slate-900 font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleExportCurrentJson}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              导出 Summary JSON
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-6 py-8">
        {activeTab === 'cost' && (
          <CostView
            todaySummary={todaySummary}
            sevenDaySummary={sevenDaySummary}
            thirtyDaySummary={thirtyDaySummary}
            activeRange={activeRange}
            onRangeChange={setActiveRange}
            onSimulateAudit={handleSimulateAudit}
            onResetAudit={handleResetAudit}
            isSubmittingSim={isSubmittingSim}
          />
        )}

        {activeTab === 'routes' && <PricesAndRoutesView mode="routes" />}

        {activeTab === 'prices' && <PricesAndRoutesView mode="prices" />}

        {activeTab === 'deliverables' && <DeliverablesView />}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-[1360px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            Switchyard Gateway Cost Reference System · 参考价，按市价估算，非实际扣费
          </span>
          <span className="font-mono">
            分支: muse/cost-tracking · 基准: main@ae648ec · 价格源: LiteLLM MIT
          </span>
        </div>
      </footer>
    </div>
  );
}
