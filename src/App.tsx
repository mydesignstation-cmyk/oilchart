import { useState } from "react";
import { RateController } from "@/components/RateController";
import { ProductTable } from "@/components/ProductTable";
import { WhatsappPreview } from "@/components/WhatsappPreview";
import { CostSetupTable } from "@/components/CostSetupTable";
import { CostSetupPreview } from "@/components/CostSetupPreview";
import { initialCostSetup, type CostSetupRow } from "@/data/costSetup";
import type { OilRates } from "@/utils/priceCalculator";
import type { Tier } from "@/data/products";

const today = new Date().toISOString().split("T")[0];
const ROWS_STORAGE_KEY = "cost_setup_rows";
const ROUNDING_STORAGE_KEY = "cost_setup_auto_round";
const DEFAULT_RATES: OilRates = { SF: 167, SOYA: 146, PALM: 140 };

function readStoredRounding(): boolean {
  const raw = localStorage.getItem(ROUNDING_STORAGE_KEY);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return true;
}

function readStoredRows(): CostSetupRow[] {
  const raw = localStorage.getItem(ROWS_STORAGE_KEY);
  if (!raw) {
    return initialCostSetup;
  }

  try {
    const parsed = JSON.parse(raw) as CostSetupRow[];
    if (!Array.isArray(parsed)) {
      return initialCostSetup;
    }

    const normalized = parsed.map((item) => ({
      id: Number(item.id),
      product_name: String(item.product_name),
      multiplier_b: Number(item.multiplier_b) || 0,
      extra_cost_c: Number(item.extra_cost_c) || 0,
      is_active: Boolean(item.is_active),
      created_at: String(item.created_at || new Date().toISOString()),
    }));

    // Canonicalize to homepage product list order and names.
    // This removes legacy unmatched rows and keeps saved B/C values where names match.
    const savedByName = new Map(normalized.map((row) => [row.product_name, row]));

    return initialCostSetup.map((row) => {
      const saved =
        savedByName.get(row.product_name) ??
        savedByName.get(`WHITE APPLE SF ${row.product_name}`);
      if (!saved) {
        return row;
      }

      return {
        ...row,
        multiplier_b: saved.multiplier_b,
        extra_cost_c: saved.extra_cost_c,
        is_active: saved.is_active,
      };
    });
  } catch {
    return initialCostSetup;
  }
}

export default function App() {
  const [screen, setScreen] = useState<"home" | "cost-setup">("home");
  const [rates, setRates] = useState<OilRates>(DEFAULT_RATES);
  const [tier, setTier] = useState<Tier>("self");
  const [chartNumber, setChartNumber] = useState("");
  const [rateDate, setRateDate] = useState(today);
  const [autoRound, setAutoRound] = useState<boolean>(() => readStoredRounding());
  const [costSetupRows, setCostSetupRows] = useState<CostSetupRow[]>(() => readStoredRows());

  function persistRows(rows: CostSetupRow[]) {
    setCostSetupRows(rows);
    localStorage.setItem(ROWS_STORAGE_KEY, JSON.stringify(rows));
  }

  function saveSingleRow(rowId: number) {
    const next = costSetupRows.map((row) =>
      row.id === rowId
        ? {
            ...row,
            multiplier_b: Number(row.multiplier_b) || 0,
            extra_cost_c: Number(row.extra_cost_c) || 0,
          }
        : row,
    );

    persistRows(next);
  }

  function handleRatesUpdate(r: OilRates, c: string, d: string) {
    setRates(r);
    setChartNumber(c);
    setRateDate(d);
  }

  function handleAutoRoundChange(value: boolean) {
    setAutoRound(value);
    localStorage.setItem(ROUNDING_STORAGE_KEY, String(value));
  }

  return (
    <div className="page">
      <div className="page-inner">

        {/* ── Header ── */}
        <header className="app-header">
          <div className="app-logo">🫙</div>
          <div>
            <h1 className="app-title">Oil Rate Broadcast Tool</h1>
            <p className="app-subtitle">
              Calculate product prices · Generate WhatsApp rate list
            </p>
          </div>
        </header>

        <div className="tier-switcher">
          <button
            className={`tier-btn${screen === "home" ? " active" : ""}`}
            onClick={() => setScreen("home")}
          >
            Home
          </button>
          <button
            className={`tier-btn${screen === "cost-setup" ? " active" : ""}`}
            onClick={() => setScreen("cost-setup")}
          >
            Cost Setup
          </button>
        </div>

        {screen === "home" ? (
          <>
            <RateController
              rates={rates}
              chartNumber={chartNumber}
              rateDate={rateDate}
              onUpdate={handleRatesUpdate}
            />

            <ProductTable
              rates={rates}
              tier={tier}
              onTierChange={setTier}
              costSetupRows={costSetupRows}
              autoRound={autoRound}
            />

            <CostSetupPreview
              liveRate={rates.SF}
              rows={costSetupRows}
              autoRound={autoRound}
              onAutoRoundChange={handleAutoRoundChange}
            />

            <WhatsappPreview
              rates={rates}
              tier={tier}
              costSetupRows={costSetupRows}
              autoRound={autoRound}
              chartNumber={chartNumber}
              rateDate={rateDate}
            />
          </>
        ) : (
          <CostSetupTable
            rows={costSetupRows}
            onRowsChange={persistRows}
            onSaveAll={persistRows}
            onSaveRow={saveSingleRow}
          />
        )}

      </div>
    </div>
  );
}

