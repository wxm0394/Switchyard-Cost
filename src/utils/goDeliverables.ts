export interface DeliverableFile {
  id: string;
  shortTitle: string;
  repoPath: string;
  localPath: string;
  action: 'NEW' | 'MODIFY';
  linesEstimate: string;
  summary: string;
  content: string;
}

export const GO_PRICES_JSON = `{
  "ZhipuAI/GLM-5.2": {
    "litellm_key": "zai/glm-5.2",
    "litellm_provider": "zai",
    "input_cost_per_token": 0.0000014,
    "output_cost_per_token": 0.0000044,
    "estimated": false,
    "free_route": false
  },
  "nvidia/nemotron-3-ultra-550b-a55b": {
    "litellm_key": "baseten/nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B",
    "litellm_provider": "baseten",
    "input_cost_per_token": 0.0000006,
    "output_cost_per_token": 0.0000024,
    "estimated": false,
    "free_route": false
  },
  "nvidia/nemotron-3.5-lightning-30b-a3b": {
    "litellm_key": "wandb/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B",
    "litellm_provider": "wandb",
    "input_cost_per_token": 0.00000007,
    "output_cost_per_token": 0.0000002,
    "estimated": false,
    "free_route": false
  },
  "nvidia/nemotron-3.5-lightning:free": {
    "litellm_key": "wandb/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B",
    "litellm_provider": "wandb",
    "input_cost_per_token": 0.00000007,
    "output_cost_per_token": 0.0000002,
    "estimated": false,
    "free_route": true
  },
  "qwen3.6-27b": {
    "litellm_key": "deepinfra/Qwen/Qwen3.6-27B",
    "litellm_provider": "deepinfra",
    "input_cost_per_token": 0.00000032,
    "output_cost_per_token": 0.0000032,
    "estimated": true,
    "free_route": true
  },
  "openai/gpt-oss-20b": {
    "litellm_key": "cloudflare/@cf/openai/gpt-oss-20b",
    "litellm_provider": "cloudflare",
    "input_cost_per_token": 0.0000002,
    "output_cost_per_token": 0.0000003,
    "estimated": false,
    "free_route": false
  },
  "command-a-03-2025": {
    "litellm_key": "command-a-03-2025",
    "litellm_provider": "cohere_chat",
    "input_cost_per_token": 0.0000025,
    "output_cost_per_token": 0.00001,
    "estimated": false,
    "free_route": false
  },
  "codestral-latest": {
    "litellm_key": "mistral/codestral-latest",
    "litellm_provider": "mistral",
    "input_cost_per_token": 0.0000003,
    "output_cost_per_token": 0.0000009,
    "estimated": false,
    "free_route": false
  },
  "gpt-oss:20b": {
    "litellm_key": "cloudflare/@cf/openai/gpt-oss-20b",
    "litellm_provider": "cloudflare",
    "input_cost_per_token": 0.0000002,
    "output_cost_per_token": 0.0000003,
    "estimated": true,
    "free_route": true
  },
  "zai-glm-4.7-flash": {
    "litellm_key": "cloudflare/@cf/zai-org/glm-4.7-flash",
    "litellm_provider": "cloudflare",
    "input_cost_per_token": 0.0000000605,
    "output_cost_per_token": 0.0000004,
    "estimated": false,
    "free_route": false
  },
  "gpt-oss-120b": {
    "litellm_key": "azure_ai/gpt-oss-120b",
    "litellm_provider": "azure_ai",
    "input_cost_per_token": 0.00000015,
    "output_cost_per_token": 0.0000006,
    "estimated": false,
    "free_route": false
  },
  "DeepSeek-V4-Flash": {
    "litellm_key": "deepseek/deepseek-v4-flash",
    "litellm_provider": "deepseek",
    "input_cost_per_token": 0.0000003,
    "output_cost_per_token": 0.0000012,
    "estimated": false,
    "free_route": false
  },
  "mistralai/devstral-medium": {
    "litellm_key": "mistral/devstral-medium-latest",
    "litellm_provider": "mistral",
    "input_cost_per_token": 0.0000004,
    "output_cost_per_token": 0.000002,
    "estimated": false,
    "free_route": false
  },
  "z-ai/glm-5.3-flash-free": {
    "litellm_key": "friendliai/zai-org/GLM-5.3-Flash",
    "litellm_provider": "friendliai",
    "input_cost_per_token": 0.00000015,
    "output_cost_per_token": 0.0000005,
    "estimated": false,
    "free_route": true
  },
  "deepseek/deepseek-v4-flash-free": {
    "litellm_key": "deepseek/deepseek-v4-flash",
    "litellm_provider": "deepseek",
    "input_cost_per_token": 0.0000003,
    "output_cost_per_token": 0.0000012,
    "estimated": false,
    "free_route": true
  },
  "google/gemini-2.5-flash": {
    "litellm_key": "gemini-2.5-flash",
    "litellm_provider": "vertex_ai-language-models",
    "input_cost_per_token": 0.0000003,
    "output_cost_per_token": 0.0000025,
    "estimated": false,
    "free_route": false
  },
  "moonshotai/kimi-k2.7-code": {
    "litellm_key": "moonshot/kimi-k2.7-code",
    "litellm_provider": "moonshot",
    "input_cost_per_token": 0.00000095,
    "output_cost_per_token": 0.000004,
    "estimated": false,
    "free_route": false
  },
  "google/gemini-3-flash-preview": {
    "litellm_key": "gemini/gemini-3-flash-preview",
    "litellm_provider": "gemini",
    "input_cost_per_token": 0.0000005,
    "output_cost_per_token": 0.000003,
    "estimated": false,
    "free_route": false
  },
  "glm-4.6v": {
    "litellm_key": "novita/zai-org/glm-4.6v",
    "litellm_provider": "novita",
    "input_cost_per_token": 0.0000003,
    "output_cost_per_token": 0.0000009,
    "estimated": false,
    "free_route": false
  }
}`;

export const GO_PRICES_GO = `package gateway

import (
	_ "embed"
	"encoding/json"
	"math"
	"sync"
)

//go:embed prices.json
var embeddedPricesJSON []byte

// ModelPrice holds per-token USD market reference pricing from LiteLLM
// (https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json).
type ModelPrice struct {
	LiteLLMKey         string  \`json:"litellm_key"\`
	LiteLLMProvider    string  \`json:"litellm_provider"\`
	InputCostPerToken  float64 \`json:"input_cost_per_token"\`
	OutputCostPerToken float64 \`json:"output_cost_per_token"\`
	Estimated          bool    \`json:"estimated"\`
	FreeRoute          bool    \`json:"free_route"\`
}

var (
	priceTableOnce sync.Once
	priceTable     map[string]ModelPrice
)

func loadPriceTable() map[string]ModelPrice {
	priceTableOnce.Do(func() {
		priceTable = make(map[string]ModelPrice)
		if len(embeddedPricesJSON) > 0 {
			_ = json.Unmarshal(embeddedPricesJSON, &priceTable)
		}
	})
	return priceTable
}

// LookupModelPrice returns the ModelPrice metadata for a given modelID if present.
func LookupModelPrice(modelID string) (ModelPrice, bool) {
	if modelID == "" {
		return ModelPrice{}, false
	}
	tbl := loadPriceTable()
	p, ok := tbl[modelID]
	return p, ok
}

// CostFor computes the market-reference USD price for a single request:
//   cost_usd = promptTokens * input_price + completionTokens * output_price
// Returns (0, false) if the model is not found in the LiteLLM price map or if inputs are invalid.
// Never panics.
func CostFor(modelID string, promptTokens, completionTokens int64) (float64, bool) {
	defer func() {
		_ = recover()
	}()
	p, ok := LookupModelPrice(modelID)
	if !ok {
		return 0, false
	}
	if promptTokens < 0 {
		promptTokens = 0
	}
	if completionTokens < 0 {
		completionTokens = 0
	}
	cost := float64(promptTokens)*p.InputCostPerToken + float64(completionTokens)*p.OutputCostPerToken
	if math.IsNaN(cost) || math.IsInf(cost, 0) {
		return 0, false
	}
	return cost, true
}
`;

export const GO_COST_GO = `package gateway

import (
	"database/sql"
	"encoding/json"
	"math"
	"net/http"
	"os"
	"sort"
	"time"
)

const DefaultHistoryDBPath = "/opt/switchyard-history/audit_history.db"

type CostModelBreakdown struct {
	ModelID      string   \`json:"model_id"\`
	CostUSD      *float64 \`json:"cost_usd"\`
	Tokens       int64    \`json:"tokens"\`
	Requests     int64    \`json:"requests"\`
	Estimated    bool     \`json:"estimated,omitempty"\`
	PriceUnknown bool     \`json:"price_unknown,omitempty"\`
}

type CostDayBreakdown struct {
	Date     string  \`json:"date"\`
	CostUSD  float64 \`json:"cost_usd"\`
	Tokens   int64   \`json:"tokens"\`
	Requests int64   \`json:"requests"\`
}

type CostClientBreakdown struct {
	ClientTokenName string  \`json:"client_token_name"\`
	CostUSD         float64 \`json:"cost_usd"\`
	Tokens          int64   \`json:"tokens"\`
	Requests        int64   \`json:"requests"\`
}

type CostSummaryResponse struct {
	Range              string                \`json:"range"\`
	TotalCostUSD       float64               \`json:"total_cost_usd"\`
	TotalTokens        int64                 \`json:"total_tokens"\`
	TotalRequests      int64                 \`json:"total_requests"\`
	ByModel            []CostModelBreakdown  \`json:"by_model"\`
	ByDay              []CostDayBreakdown    \`json:"by_day"\`
	ByClient           []CostClientBreakdown \`json:"by_client"\`
	UnknownPriceTokens int64                 \`json:"unknown_price_tokens"\`
	Note               string                \`json:"note"\`
}

func roundUSD2(v float64) float64 {
	return math.Round(v*100) / 100
}

// cstCutoffUTC computes the UTC start timestamp for a CST-day (UTC+8) window:
// CST day = previous UTC day 16:00:00 to current UTC day 16:00:00.
func cstCutoffUTC(nowUTC time.Time, rangeParam string) (string, time.Time) {
	normalized := "7d"
	days := 7
	switch rangeParam {
	case "today":
		normalized = "today"
		days = 1
	case "30d":
		normalized = "30d"
		days = 30
	case "7d":
		normalized = "7d"
		days = 7
	}
	cstZone := time.FixedZone("CST", 8*3600)
	nowCST := nowUTC.In(cstZone)
	todayStartCST := time.Date(nowCST.Year(), nowCST.Month(), nowCST.Day(), 0, 0, 0, 0, cstZone)
	cutoffCST := todayStartCST.AddDate(0, 0, -(days - 1))
	return normalized, cutoffCST.UTC()
}

// QueryCostSummary queries audit_history (or fallback audit_logs) and aggregates market-reference costs.
func QueryCostSummary(db *sql.DB, tableName string, rangeParam string, nowUTC time.Time) (CostSummaryResponse, error) {
	normalizedRange, cutoffUTC := cstCutoffUTC(nowUTC, rangeParam)
	cutoffISO := cutoffUTC.Format(time.RFC3339)

	resp := CostSummaryResponse{
		Range:    normalizedRange,
		ByModel:  []CostModelBreakdown{},
		ByDay:    []CostDayBreakdown{},
		ByClient: []CostClientBreakdown{},
		Note:     "参考价，按市价估算，非实际扣费",
	}

	// 1. Totals & unknown_price_tokens
	totalsQuery := \`
		SELECT
			COALESCE(SUM(CASE WHEN cost_usd IS NOT NULL THEN cost_usd ELSE 0 END), 0),
			COALESCE(SUM(COALESCE(billed_tokens, 0)), 0),
			COUNT(*),
			COALESCE(SUM(CASE WHEN cost_usd IS NULL THEN COALESCE(billed_tokens, 0) ELSE 0 END), 0)
		FROM \` + tableName + \`
		WHERE timestamp >= ?
	\`
	var rawTotalCost float64
	if err := db.QueryRow(totalsQuery, cutoffISO).Scan(
		&rawTotalCost,
		&resp.TotalTokens,
		&resp.TotalRequests,
		&resp.UnknownPriceTokens,
	); err != nil {
		return resp, err
	}
	resp.TotalCostUSD = roundUSD2(rawTotalCost)

	// 2. Group by model_id (sorted by cost_usd DESC)
	modelQuery := \`
		SELECT
			COALESCE(NULLIF(selected_model_id, ''), COALESCE(requested_model, 'unknown')) AS model_id,
			SUM(CASE WHEN cost_usd IS NOT NULL THEN cost_usd ELSE 0 END) AS sum_cost,
			COUNT(cost_usd) AS known_cost_count,
			COALESCE(SUM(COALESCE(billed_tokens, 0)), 0) AS sum_tokens,
			COUNT(*) AS req_count
		FROM \` + tableName + \`
		WHERE timestamp >= ?
		GROUP BY model_id
	\`
	mRows, err := db.Query(modelQuery, cutoffISO)
	if err != nil {
		return resp, err
	}
	defer mRows.Close()

	for mRows.Next() {
		var modelID string
		var sumCost float64
		var knownCount int64
		var tokens, reqs int64
		if err := mRows.Scan(&modelID, &sumCost, &knownCount, &tokens, &reqs); err != nil {
			return resp, err
		}
		pInfo, hasPrice := LookupModelPrice(modelID)
		item := CostModelBreakdown{
			ModelID:   modelID,
			Tokens:    tokens,
			Requests:  reqs,
			Estimated: pInfo.Estimated,
		}
		if knownCount == 0 && !hasPrice {
			item.PriceUnknown = true
			item.CostUSD = nil
		} else {
			rounded := roundUSD2(sumCost)
			item.CostUSD = &rounded
		}
		resp.ByModel = append(resp.ByModel, item)
	}

	sort.Slice(resp.ByModel, func(i, j int) bool {
		if resp.ByModel[i].PriceUnknown != resp.ByModel[j].PriceUnknown {
			return !resp.ByModel[i].PriceUnknown
		}
		ci := 0.0
		if resp.ByModel[i].CostUSD != nil {
			ci = *resp.ByModel[i].CostUSD
		}
		cj := 0.0
		if resp.ByModel[j].CostUSD != nil {
			cj = *resp.ByModel[j].CostUSD
		}
		if ci != cj {
			return ci > cj
		}
		return resp.ByModel[i].Tokens > resp.ByModel[j].Tokens
	})

	// 3. Group by CST day (datetime(timestamp, '+8 hours'))
	dayQuery := \`
		SELECT
			strftime('%Y-%m-%d', datetime(timestamp, '+8 hours')) AS cst_date,
			COALESCE(SUM(CASE WHEN cost_usd IS NOT NULL THEN cost_usd ELSE 0 END), 0) AS sum_cost,
			COALESCE(SUM(COALESCE(billed_tokens, 0)), 0) AS sum_tokens,
			COUNT(*) AS req_count
		FROM \` + tableName + \`
		WHERE timestamp >= ?
		GROUP BY cst_date
		ORDER BY cst_date ASC
	\`
	dRows, err := db.Query(dayQuery, cutoffISO)
	if err != nil {
		return resp, err
	}
	defer dRows.Close()

	for dRows.Next() {
		var d CostDayBreakdown
		var rawCost float64
		if err := dRows.Scan(&d.Date, &rawCost, &d.Tokens, &d.Requests); err != nil {
			return resp, err
		}
		d.CostUSD = roundUSD2(rawCost)
		resp.ByDay = append(resp.ByDay, d)
	}

	// 4. Group by client_token_name
	clientQuery := \`
		SELECT
			COALESCE(NULLIF(client_token_name, ''), '默认客户端令牌') AS client_name,
			COALESCE(SUM(CASE WHEN cost_usd IS NOT NULL THEN cost_usd ELSE 0 END), 0) AS sum_cost,
			COALESCE(SUM(COALESCE(billed_tokens, 0)), 0) AS sum_tokens,
			COUNT(*) AS req_count
		FROM \` + tableName + \`
		WHERE timestamp >= ?
		GROUP BY client_name
		ORDER BY sum_cost DESC, sum_tokens DESC
	\`
	cRows, err := db.Query(clientQuery, cutoffISO)
	if err != nil {
		return resp, err
	}
	defer cRows.Close()

	for cRows.Next() {
		var c CostClientBreakdown
		var rawCost float64
		if err := cRows.Scan(&c.ClientTokenName, &rawCost, &c.Tokens, &c.Requests); err != nil {
			return resp, err
		}
		c.CostUSD = roundUSD2(rawCost)
		resp.ByClient = append(resp.ByClient, c)
	}

	return resp, nil
}

// handleCostSummary serves GET /api/gateway/cost/summary?range=today|7d|30d
func (s *Server) handleCostSummary(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	rangeParam := r.URL.Query().Get("range")
	historyPath := os.Getenv("SWITCHYARD_HISTORY_DB")
	if historyPath == "" {
		historyPath = DefaultHistoryDBPath
	}

	var summary CostSummaryResponse
	var err error

	if _, statErr := os.Stat(historyPath); statErr == nil {
		hdb, openErr := sql.Open("sqlite", historyPath+"?mode=ro")
		if openErr == nil {
			defer hdb.Close()
			summary, err = QueryCostSummary(hdb, "audit_history", rangeParam, time.Now().UTC())
		} else {
			err = openErr
		}
	} else if s.store != nil && s.store.DB() != nil {
		summary, err = QueryCostSummary(s.store.DB(), "audit_logs", rangeParam, time.Now().UTC())
	}

	if err != nil {
		// Return safe empty summary rather than crashing panel
		summary = CostSummaryResponse{
			Range:    "7d",
			ByModel:  []CostModelBreakdown{},
			ByDay:    []CostDayBreakdown{},
			ByClient: []CostClientBreakdown{},
			Note:     "参考价，按市价估算，非实际扣费",
		}
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	_ = json.NewEncoder(w).Encode(summary)
}
`;

export const GO_COST_TEST_GO = `package gateway

import (
	"database/sql"
	"math"
	"testing"
	"time"

	_ "modernc.org/sqlite"
)

func TestCostForCalculation(t *testing.T) {
	// Scenario 1 (Spec 5.1):
	// z-ai/glm-5.3-flash-free uses GLM-5.3-Flash paid rate:
	// input 1,000,000 * $0.15/1M + output 500,000 * $0.50/1M = $0.40 (±0.001)
	cost, ok := CostFor("z-ai/glm-5.3-flash-free", 1_000_000, 500_000)
	if !ok {
		t.Fatalf("expected ok=true for z-ai/glm-5.3-flash-free")
	}
	if math.Abs(cost-0.40) > 0.001 {
		t.Fatalf("expected cost ~0.40, got %.6f", cost)
	}
}

func TestCostForUnknownModel(t *testing.T) {
	// Scenario 2 (Spec 5.1):
	// Unknown model returns ok=false without panic
	cost, ok := CostFor("non-existent/unknown-model-99b", 1_000_000, 500_000)
	if ok {
		t.Fatalf("expected ok=false for unknown model, got ok=true with cost=%v", cost)
	}
	if cost != 0 {
		t.Fatalf("expected cost=0 for unknown model, got %v", cost)
	}
}

func TestCostSummaryAggregationAndNullHandling(t *testing.T) {
	// Scenarios 3 & 4 (Spec 5.1):
	// In-memory SQLite with >= 2 models, >= 3 CST days, and NULL cost_usd rows
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("open memory sqlite: %v", err)
	}
	defer db.Close()

	_, err = db.Exec(\`
		CREATE TABLE audit_history (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			timestamp TEXT NOT NULL,
			selected_model_id TEXT,
			requested_model TEXT,
			billed_tokens INTEGER,
			estimated_tokens INTEGER,
			usage_source TEXT,
			preview_prompt TEXT,
			session_key TEXT,
			client_token_id TEXT,
			client_token_name TEXT,
			cost_usd REAL
		);
	\`)
	if err != nil {
		t.Fatalf("create table: %v", err)
	}

	// Insert 3 CST days across 2 priced models + 1 NULL cost_usd row
	// Note: 2026-11-11T16:30:00Z is 2026-11-12 00:30:00 CST
	rows := []struct {
		ts     string
		model  string
		tokens int64
		client string
		cost   *float64
	}{
		{"2026-11-11T10:00:00Z", "ZhipuAI/GLM-5.2", 1500000, "全客户端通用访问令牌", ptrFloat(3.60)},
		{"2026-11-11T16:30:00Z", "nvidia/nemotron-3.5-lightning-30b-a3b", 3000000, "全客户端通用访问令牌", ptrFloat(0.34)},
		{"2026-11-13T08:00:00Z", "ZhipuAI/GLM-5.2", 1000000, "RooCode 研发令牌", ptrFloat(2.90)},
		{"2026-11-13T09:00:00Z", "custom/unpriced-model", 5000000, "全客户端通用访问令牌", nil},
	}

	for _, r := range rows {
		_, err := db.Exec(
			\`INSERT INTO audit_history (timestamp, selected_model_id, requested_model, billed_tokens, client_token_name, cost_usd) VALUES (?, ?, ?, ?, ?, ?)\`,
			r.ts, r.model, r.model, r.tokens, r.client, r.cost,
		)
		if err != nil {
			t.Fatalf("insert row: %v", err)
		}
	}

	nowUTC := time.Date(2026, 11, 13, 12, 0, 0, 0, time.UTC)
	summary, err := QueryCostSummary(db, "audit_history", "7d", nowUTC)
	if err != nil {
		t.Fatalf("QueryCostSummary failed: %v", err)
	}

	// Verify NULL cost_usd excluded from total_cost_usd but included in unknown_price_tokens
	if math.Abs(summary.TotalCostUSD-6.84) > 0.001 {
		t.Fatalf("expected TotalCostUSD=6.84, got %.2f", summary.TotalCostUSD)
	}
	if summary.UnknownPriceTokens != 5000000 {
		t.Fatalf("expected UnknownPriceTokens=5000000, got %d", summary.UnknownPriceTokens)
	}
	if summary.TotalTokens != 10500000 {
		t.Fatalf("expected TotalTokens=10500000, got %d", summary.TotalTokens)
	}
	if summary.TotalRequests != 4 {
		t.Fatalf("expected TotalRequests=4, got %d", summary.TotalRequests)
	}
	if len(summary.ByDay) != 3 {
		t.Fatalf("expected 3 CST days, got %d: %+v", len(summary.ByDay), summary.ByDay)
	}
	if summary.ByDay[0].Date != "2026-11-11" || summary.ByDay[1].Date != "2026-11-12" || summary.ByDay[2].Date != "2026-11-13" {
		t.Fatalf("unexpected CST day dates: %+v", summary.ByDay)
	}
}

func ptrFloat(v float64) *float64 {
	return &v
}
`;

export const GO_PATCHES_DIFF = `--- a/go/internal/gateway/gateway.go
+++ b/go/internal/gateway/gateway.go
@@ -832,10 +832,17 @@
 	// 成功分支记录审计与市价参考计价（只读参考价，计价异常不影响主流程返回）
+	var costUSDPtr *float64
+	func() {
+		defer func() { _ = recover() }()
+		if c, ok := CostFor(selectedRoute.ModelID, int64(usage.PromptTokens), int64(usage.CompletionTokens)); ok {
+			costUSDPtr = &c
+		}
+	}()
+
 	_ = s.store.AddAudit(store.AuditEntry{
 		Timestamp:       time.Now().UTC().Format(time.RFC3339),
 		SelectedModelID: selectedRoute.ModelID,
 		RequestedModel:  reqModel,
 		BilledTokens:    billedTokens,
 		EstimatedTokens: estimatedTokens,
 		UsageSource:     usageSource,
 		PreviewPrompt:   previewPrompt,
 		SessionKey:      sessionKey,
 		ClientTokenID:   clientTokenID,
 		ClientTokenName: clientTokenName,
+		CostUSD:         costUSDPtr,
 	})

--- a/go/internal/store/sqlite.go
+++ b/go/internal/store/sqlite.go
@@ -94,6 +94,9 @@
 	// Ensure audit_logs has cost_usd REAL column (nullable for unknown model prices)
+	_, _ = db.Exec("ALTER TABLE audit_logs ADD COLUMN cost_usd REAL;")
+	// Note for Tier-1 history DB (/opt/switchyard-history/audit_history.db):
+	// Run once before or during sync: sqlite3 /opt/switchyard-history/audit_history.db "ALTER TABLE audit_history ADD COLUMN cost_usd REAL;"

--- a/go/internal/gateway/admin.go
+++ b/go/internal/gateway/admin.go
@@ -42,4 +42,5 @@
 	mux.HandleFunc("/api/gateway/routes", s.handleRoutes)
+	mux.HandleFunc("/api/gateway/cost/summary", s.handleCostSummary)
`;

export const DELIVERABLE_FILES: DeliverableFile[] = [
  {
    id: 'prices-go',
    shortTitle: 'prices.go',
    repoPath: 'go/internal/gateway/prices.go',
    localPath: '~/workspace/switchyard-merged-auto/go/internal/gateway/prices.go',
    action: 'NEW',
    linesEstimate: '66 行',
    summary: '内嵌 LiteLLM 价格表并提供 CostFor(modelID, promptTokens, completionTokens) (float64, bool)，带 recover 保护永不 panic',
    content: GO_PRICES_GO,
  },
  {
    id: 'prices-json',
    shortTitle: 'prices.json',
    repoPath: 'go/internal/gateway/prices.json',
    localPath: '~/workspace/switchyard-merged-auto/go/internal/gateway/prices.json',
    action: 'NEW',
    linesEstimate: '154 行',
    summary: '从 LiteLLM model_prices_and_context_window.json 筛出的 19 个在用模型价格，明确标注 litellm_key、estimated 与 free_route',
    content: GO_PRICES_JSON,
  },
  {
    id: 'cost-go',
    shortTitle: 'cost.go',
    repoPath: 'go/internal/gateway/cost.go',
    localPath: '~/workspace/switchyard-merged-auto/go/internal/gateway/cost.go',
    action: 'NEW',
    linesEstimate: '215 行',
    summary: 'GET /api/gateway/cost/summary 聚合接口（按 CST 日 UTC+8 切分，读取 audit_history 表，NULL 计入 unknown_price_tokens）',
    content: GO_COST_GO,
  },
  {
    id: 'cost-test-go',
    shortTitle: 'cost_test.go',
    repoPath: 'go/internal/gateway/cost_test.go',
    localPath: '~/workspace/switchyard-merged-auto/go/internal/gateway/cost_test.go',
    action: 'NEW',
    linesEstimate: '115 行',
    summary: '覆盖 5.1 节全部 4 个必测场景：CostFor 精度(±0.001)、未知模型 ok=false、跨 3 天 CST 日与多模型分组、NULL cost_usd 计入 unknown_price_tokens',
    content: GO_COST_TEST_GO,
  },
  {
    id: 'patches-diff',
    shortTitle: 'gateway.go / admin.go / sqlite.go 补丁',
    repoPath: 'go/internal/gateway/{gateway.go,admin.go} & go/internal/store/sqlite.go',
    localPath: '~/workspace/switchyard-merged-auto/go/internal/...',
    action: 'MODIFY',
    linesEstimate: '约 30 行',
    summary: '成功分支调用 CostFor 写入 AddAudit、audit_logs 增加 cost_usd REAL 可空列、admin.go 注册只读 GET 路由',
    content: GO_PATCHES_DIFF,
  },
];
