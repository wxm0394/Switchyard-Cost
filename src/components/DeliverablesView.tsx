import React, { useState } from 'react';
import { DELIVERABLE_FILES } from '../utils/goDeliverables';

export const DeliverablesView: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>(
    DELIVERABLE_FILES[0].id
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeFile =
    DELIVERABLE_FILES.find((f) => f.id === selectedFileId) ||
    DELIVERABLE_FILES[0];

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(id);
    }
  };

  const roocodeCommands = `# 1. 编译与静态检查（在 module 根目录执行）
cd ~/workspace/switchyard-merged-auto/go
export PATH=~/workspace/go-toolchains/go/bin:$PATH
go vet ./...
go build -o /tmp/switchyard-cost ./cmd/switchyard

# 2. 运行金额检测单元测试（覆盖 5.1 节全部 4 个场景）
go test ./internal/gateway/ -run TestCost -v

# 3. 面板构建验证（Node v24.22.1 / npm 10.9.4）
cd ~/workspace/switchyard-panel-v2 && npm run build

# 4. 使用 Git Data API 脚本推送到 muse/cost-tracking 分支（基于 main ae648ec，署名 Muse <muse@local>）
python3 ~/workspace/push_switchyard.py \\
  "Cost tracking: market-reference pricing per request + panel view" \\
  muse/cost-tracking \\
  go/internal/gateway/prices.go:~/workspace/switchyard-merged-auto/go/internal/gateway/prices.go \\
  go/internal/gateway/prices.json:~/workspace/switchyard-merged-auto/go/internal/gateway/prices.json \\
  go/internal/gateway/cost.go:~/workspace/switchyard-merged-auto/go/internal/gateway/cost.go \\
  go/internal/gateway/cost_test.go:~/workspace/switchyard-merged-auto/go/internal/gateway/cost_test.go \\
  go/internal/gateway/gateway.go:~/workspace/switchyard-merged-auto/go/internal/gateway/gateway.go \\
  go/internal/gateway/admin.go:~/workspace/switchyard-merged-auto/go/internal/gateway/admin.go \\
  go/internal/store/sqlite.go:~/workspace/switchyard-merged-auto/go/internal/store/sqlite.go`;

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-medium text-slate-500">
          分支: muse/cost-tracking (基于 main ae648ec) · 署名: Muse &lt;muse@local&gt;
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
          Go 源码交付包、红线逐条确认与验收清单
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          全部 Go 源码已同步生成至本仓库 <span className="font-mono">/go/internal/gateway/</span> 目录，供 RooCode 直接落地与 Muse 验收。
        </p>
      </div>

      {/* 第 7 节红线逐条确认 & 第 9 节验收清单 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-900">
            01. 第 7 节红线逐条核对（零触碰确认）
          </h2>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start justify-between gap-4 pb-2 border-b border-slate-100">
              <span>1. 路由选择、轮询权重、冷却/耗尽状态机、会话亲和、自动注册、别名逻辑</span>
              <span className="font-mono font-semibold text-emerald-700 shrink-0">
                未触碰 (只读计价)
              </span>
            </li>
            <li className="flex items-start justify-between gap-4 pb-2 border-b border-slate-100">
              <span>2. internal/kaggle/ 下的任何文件</span>
              <span className="font-mono font-semibold text-emerald-700 shrink-0">
                未触碰 (0 改动)
              </span>
            </li>
            <li className="flex items-start justify-between gap-4 pb-2 border-b border-slate-100">
              <span>3. 隐私开关保持 off；不碰隐私/密钥/令牌代码；不打印任何密钥或密码</span>
              <span className="font-mono font-semibold text-emerald-700 shrink-0">
                已严格遵守
              </span>
            </li>
            <li className="flex items-start justify-between gap-4 pb-2 border-b border-slate-100">
              <span>4. 计价失败时绝不让请求失败（recover 捕获，cost_usd 记 NULL，请求正常返回）</span>
              <span className="font-mono font-semibold text-emerald-700 shrink-0">
                已实现并单测覆盖
              </span>
            </li>
            <li className="flex items-start justify-between gap-4 pb-2 border-b border-slate-100">
              <span>5. 不改面板 server.py 写规则；新接口使用只读 GET /api/gateway/cost/summary</span>
              <span className="font-mono font-semibold text-emerald-700 shrink-0">
                已严格遵守
              </span>
            </li>
            <li className="flex items-start justify-between gap-4">
              <span>6. 不部署到生产、不改生产数据库（历史库 /opt/switchyard-history/audit_history.db 需手动加 cost_usd REAL 列）</span>
              <span className="font-mono font-semibold text-emerald-700 shrink-0">
                已注明 PR 说明
              </span>
            </li>
          </ul>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              02. RooCode 本地编译、测试与推送命令
            </h2>
            <button
              type="button"
              onClick={() => handleCopy('roocode-cmd', roocodeCommands)}
              className="px-3 py-1 text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
            >
              {copiedId === 'roocode-cmd' ? '已复制命令' : '复制执行脚本'}
            </button>
          </div>
          <pre className="mt-3 p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
            {roocodeCommands}
          </pre>
        </section>
      </div>

      {/* Go 代码文件查看器 */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="选择交付源码文件"
            className="flex flex-wrap items-center gap-1.5"
          >
            {DELIVERABLE_FILES.map((file) => (
              <button
                key={file.id}
                role="tab"
                aria-selected={selectedFileId === file.id}
                type="button"
                onClick={() => setSelectedFileId(file.id)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedFileId === file.id
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {file.action === 'NEW' ? '+ ' : '~ '}
                {file.shortTitle}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleCopy(activeFile.id, activeFile.content)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {copiedId === activeFile.id ? '已复制文件内容' : '复制当前源码'}
          </button>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div>
            <span className="font-semibold text-slate-900">仓库路径:</span>{' '}
            <span className="font-mono">{activeFile.repoPath}</span>
            <span className="mx-2 text-slate-300">·</span>
            <span className="font-semibold text-slate-900">本地路径:</span>{' '}
            <span className="font-mono">{activeFile.localPath}</span>
          </div>
          <span className="font-mono text-slate-500">
            规模: {activeFile.linesEstimate} · {activeFile.summary}
          </span>
        </div>

        <pre className="p-6 bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed max-h-[540px]">
          {activeFile.content}
        </pre>
      </section>
    </div>
  );
};
