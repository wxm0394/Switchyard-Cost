/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { CostView } from './components/CostView';
import { DeliverablesView } from './components/DeliverablesView';
import { PricesAndRoutesView } from './components/PricesAndRoutesView';
import type { CostRange, CostSummaryResponse } from './utils/costEngine';

type ActiveTab = 'cost' | 'routes' | 'prices' | 'deliverables';

type ApiSummaries = {
  today?: CostSummaryResponse;
  '7d'?: CostSummaryResponse;
  '30d'?: CostSummaryResponse;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('cost');
  const [activeRange, setActiveRange] = useState<CostRange>('7d');
  const [apiSummaries, setApiSummaries] = useState<ApiSummaries>({});
  // Admin password lives in browser memory only (same model as panel-v2):
  // never written to disk, never persisted, re-entered after a refresh.
  const [adminPw, setAdminPw] = useState('');
  const [pwInput, setPwInput] = useState('');
  const [needAuth, setNeedAuth] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllSummaries = async (pw: string) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const headers = { 'X-Admin-Password': pw };
      const [rToday, r7d, r30d] = await Promise.all([
        fetch('/api/gateway/cost/summary?range=today', { headers }),
        fetch('/api/gateway/cost/summary?range=7d', { headers }),
        fetch('/api/gateway/cost/summary?range=30d', { headers }),
      ]);
      if ([rToday, r7d, r30d].some((r) => r.status === 401 || r.status === 403)) {
        setNeedAuth(true);
        setAuthError('管理密码不对，请重新输入。');
        return;
      }
      if (rToday.ok && r7d.ok && r30d.ok) {
        const [today, sevenD, thirtyD] = await Promise.all([
          rToday.json(),
          r7d.json(),
          r30d.json(),
        ]);
        setApiSummaries({ today, '7d': sevenD, '30d': thirtyD });
        setNeedAuth(false);
        setAuthError(null);
      } else {
        const first = [rToday, r7d, r30d].find((r) => !r.ok);
        let detail = '';
        try {
          detail = first ? `: ${(await first.json()).error ?? ''}` : '';
        } catch {
          // keep the status text only
        }
        setLoadError(
          `接口返回 ${first?.status ?? '错误'}${detail}，请确认网关已部署带 cost/summary 的版本、历史库已有 cost_usd 列。`
        );
      }
    } catch {
      setLoadError('连不上网关接口，请检查网络与面板代理。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwInput.trim()) {
      setAuthError('请输入管理密码。');
      return;
    }
    setAdminPw(pwInput);
    setAuthError(null);
    await fetchAllSummaries(pwInput);
  };

  const handleExportCurrentJson = () => {
    const activeData =
      activeRange === 'today'
        ? apiSummaries.today
        : activeRange === '7d'
        ? apiSummaries['7d']
        : apiSummaries['30d'];
    if (!activeData) {
      return;
    }
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

  // Login gate: same model as panel-v2. No seed/demo data is ever shown:
  // without the real API summaries the page shows this form, not numbers.
  if (needAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-white rounded-xl border border-slate-200 p-6 space-y-4"
        >
          <div>
            <h1 className="text-lg font-bold tracking-tight">Switchyard 花费统计</h1>
            <p className="text-xs text-slate-500 mt-1">
              请输入网关管理密码（与面板同一个）。密码只留在浏览器内存里，不会保存。
            </p>
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              管理密码
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={pwInput}
              onChange={(e) => setPwInput(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>
          {authError && (
            <p role="alert" className="text-xs text-red-600 font-medium">
              {authError}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? '正在验证…' : '进入花费统计'}
          </button>
          {loadError && (
            <p role="alert" className="text-xs text-red-600">
              {loadError}
            </p>
          )}
        </form>
      </div>
    );
  }

  const summariesReady =
    apiSummaries.today && apiSummaries['7d'] && apiSummaries['30d'];

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
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void fetchAllSummaries(adminPw)}
              disabled={isLoading}
              className="px-3 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              {isLoading ? '刷新中…' : '刷新'}
            </button>
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
        {loadError && (
          <p role="alert" className="mb-4 text-xs text-red-600">
            {loadError}{' '}
            <button
              type="button"
              onClick={() => void fetchAllSummaries(adminPw)}
              className="underline font-medium"
            >
              重试
            </button>
          </p>
        )}
        {activeTab === 'cost' &&
          (summariesReady ? (
            <CostView
              todaySummary={apiSummaries.today!}
              sevenDaySummary={apiSummaries['7d']!}
              thirtyDaySummary={apiSummaries['30d']!}
              activeRange={activeRange}
              onRangeChange={setActiveRange}
            />
          ) : (
            <p className="text-sm text-slate-500">
              {isLoading ? '正在加载真实汇总…' : '暂无汇总数据，请点右上角“刷新”。'}
            </p>
          ))}

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
            分支: muse/cost-tracking · 基准: main@91c022d5 · 价格源: LiteLLM MIT
          </span>
        </div>
      </footer>
    </div>
  );
}
