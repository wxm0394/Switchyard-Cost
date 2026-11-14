import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  LITELLM_MODEL_PRICES,
  buildCostSummary,
  costFor,
  type AuditHistoryRecord,
  type CostRange,
} from './src/utils/costEngine.ts';
import {
  SWITCHYARD_ROUTES,
  generateSeedAuditHistory,
} from './src/utils/seedData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REFERENCE_NOW_UTC = '2026-11-14T03:38:00Z';
let auditHistoryRecords: AuditHistoryRecord[] = generateSeedAuditHistory();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Spec 4.3: GET /api/gateway/cost/summary?range=today|7d|30d
  app.get('/api/gateway/cost/summary', (req, res) => {
    const rawRange = String(req.query.range || '7d');
    const range: CostRange =
      rawRange === 'today' || rawRange === '7d' || rawRange === '30d'
        ? rawRange
        : '7d';
    const summary = buildCostSummary(
      auditHistoryRecords,
      range,
      REFERENCE_NOW_UTC,
      LITELLM_MODEL_PRICES
    );
    res.json(summary);
  });

  // Read-only routes endpoint
  app.get('/api/gateway/routes', (_req, res) => {
    res.json({ routes: SWITCHYARD_ROUTES });
  });

  // Read-only LiteLLM price table endpoint
  app.get('/api/gateway/prices', (_req, res) => {
    res.json({
      source:
        'https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json',
      models: Object.values(LITELLM_MODEL_PRICES),
    });
  });

  // Interactive simulator endpoint to test CostFor + AddAudit in real time
  app.post('/api/gateway/simulate-audit', (req, res) => {
    const {
      model_id = 'ZhipuAI/GLM-5.2',
      prompt_tokens = 1000000,
      completion_tokens = 500000,
      client_token_name = '全客户端通用访问令牌',
    } = req.body || {};

    const pTokens = Math.max(0, Math.round(Number(prompt_tokens) || 0));
    const cTokens = Math.max(0, Math.round(Number(completion_tokens) || 0));
    const { costUsd, ok } = costFor(String(model_id), pTokens, cTokens);

    const newRecord: AuditHistoryRecord = {
      id: auditHistoryRecords.length + 2000,
      timestamp: REFERENCE_NOW_UTC,
      selected_model_id: String(model_id),
      requested_model: String(model_id),
      prompt_tokens: pTokens,
      completion_tokens: cTokens,
      billed_tokens: pTokens + cTokens,
      estimated_tokens: pTokens + cTokens,
      usage_source: 'upstream',
      client_token_id: 'ct-sim',
      client_token_name: String(client_token_name || '全客户端通用访问令牌'),
      session_key: `sim-${Date.now()}`,
      cost_usd: ok ? costUsd : null,
    };

    auditHistoryRecords = [newRecord, ...auditHistoryRecords];
    res.json({
      record: newRecord,
      cost_for_ok: ok,
      cost_usd: ok ? costUsd : null,
    });
  });

  // Reset simulated audit records back to deterministic seed state
  app.post('/api/gateway/reset-audit', (_req, res) => {
    auditHistoryRecords = generateSeedAuditHistory();
    res.json({ ok: true, count: auditHistoryRecords.length });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`Switchyard Cost Tracking server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
