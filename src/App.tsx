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
const RATES_STORAGE_KEY = "live_rates_v1";
const DEFAULT_RATES: OilRates = { SF: 177, SOYA: 157, PALM: 150 };

type StoredRates = {
  rates: OilRates;
  rateDate?: string;
  chartNumber?: string;
};

function readStoredRates(): StoredRates | null {
  try {
    const raw = localStorage.getItem(RATES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredRates;
    if (!parsed || typeof parsed !== "object") return null;
    // Basic validation of structure
    if (!parsed.rates || typeof parsed.rates !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

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

    const canonicalRows = initialCostSetup.map((row) => {
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

    // Keep any saved rows that are not in the canonical seed so nothing disappears.
    const canonicalNames = new Set(canonicalRows.map((row) => row.product_name));
    const extraSavedRows = normalized.filter((row) => !canonicalNames.has(row.product_name));

    return [...canonicalRows, ...extraSavedRows];
  } catch {
    return initialCostSetup;
  }
}

export default function App() {
  const [screen, setScreen] = useState<"home" | "cost-setup">("home");
  const [rates, setRates] = useState<OilRates>(() => {
    const stored = readStoredRates();
    return stored?.rates ?? DEFAULT_RATES;
  });
  const [tier, setTier] = useState<Tier>("self");
  const [chartNumber, setChartNumber] = useState<string>(() => {
    const stored = readStoredRates();
    return stored?.chartNumber ?? "";
  });
  const [rateDate, setRateDate] = useState<string>(() => {
    const stored = readStoredRates();
    return stored?.rateDate ?? today;
  });
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

    // Persist latest live rates so a refresh shows the last saved values
    try {
      const payload: StoredRates = { rates: r, rateDate: d, chartNumber: c };
      localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("failed to persist live rates:", err);
    }
  }

  function handleAutoRoundChange(value: boolean) {
    setAutoRound(value);
    localStorage.setItem(ROUNDING_STORAGE_KEY, String(value));
  }

  function reloadDefaults() {
    // Strong reset: overwrite storage with the canonical initial seed exactly,
    // then reload so the UI reflects these defaults.
    try {
      localStorage.removeItem(ROWS_STORAGE_KEY);
      const seed = initialCostSetup.map((r) => ({
        id: r.id,
        product_name: r.product_name,
        multiplier_b: Number(r.multiplier_b) || 0,
        extra_cost_c: Number(r.extra_cost_c) || 0,
        is_active: Boolean(r.is_active),
        created_at: r.created_at,
      }));
      localStorage.setItem(ROWS_STORAGE_KEY, JSON.stringify(seed));
      // update in-memory state as well, then reload to clear any stale caches
      persistRows(seed);
    } catch (err) {
      // swallow — still attempt a reload
      // eslint-disable-next-line no-console
      console.error("reloadDefaults error:", err);
    }
    window.location.reload();
  }

  function hardResetStorage() {
    try {
      localStorage.clear();
      sessionStorage.clear();
      // If the app ever used IndexedDB or other storage, instructive to delete, but
      // here we just reload to pick up a clean state.
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("hardResetStorage error:", err);
    }
    window.location.reload();
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
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={autoRound}
                onChange={(e) => handleAutoRoundChange(e.target.checked)}
              />
              <span style={{ color: "var(--c-text-muted)" }}>Round prices</span>
            </label>
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
            onReloadDefaults={reloadDefaults}
            onHardReset={hardResetStorage}
            onSaveRow={saveSingleRow}
          />
        )}

      </div>
    </div>
  );
}

