# Switchyard-Cost

A cost-tracking integration for the Switchyard Go gateway, supporting LiteLLM market-reference pricing and audit logging.

## Overview

This project integrates cost calculation into the Switchyard gateway using LiteLLM pricing data. Costs are computed from prompt and completion tokens and stored in audit logs via the `AuditRow.CostUSD` field.

## Features

- **Cost calculation**: Uses `CostFor()` from embedded `prices.json` to compute USD costs from token usage
- **NULL cost handling**: Unknown models produce NULL `cost_usd` (not 0), counted in summary as unknown
- **Audit integration**: Cost stored alongside other audit fields in SQLite via `AddAudit`
- **Cost summary endpoint**: Admin-protected `/api/gateway/cost-summary` endpoint with range queries (7d, 30d, 90d, all)
- **Model breakdowns**: Summary can be filtered by model, day, or client

## Tasks Completed

| Task | Description |
|------|-------------|
| 3.1-3.3 | Cost tracking Go integration (cost.go, cost_test.go, prices.go, prices.json) |
| 3.4 | Integrate cost calculation into gateway success branch (AddAudit with CostUSD) |
| 3.5 | Database schema migration (cost_usd column), AuditRow.CostUSD field, migrations |
| 3.6 | Port CostView to panel-v2 — N/A (panel-v2 not found locally) |
| 3.7 | Fix Switchyard-Cost package.json esbuild conflict (esbuild ^0.25.0 → ^0.28.0) |
| 3.8 | Add README to Switchyard-Cost repository |
| 3.9 | Create branch muse/cost-tracking and open PR |

## Development

### Prerequisites

- Go 1.21+
- Node.js 20+ with npm

### Building

**Go gateway:**
```bash
cd go
go build ./...
go test ./internal/gateway/ ./internal/store/
```

**Frontend:**
```bash
npm install
npm run build
```

### Running

**Go gateway:**
```bash
cd go/cmd/switchyard
go run main.go
```

**Frontend dev server:**
```bash
npm run dev
```

## License

MIT