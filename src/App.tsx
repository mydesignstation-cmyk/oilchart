import { useState } from "react";
import { RateController } from "@/components/RateController";
import { ProductTable } from "@/components/ProductTable";
import { WhatsappPreview } from "@/components/WhatsappPreview";
import type { OilRates } from "@/utils/priceCalculator";
import type { Tier } from "@/data/products";

const today = new Date().toISOString().split("T")[0];
const DEFAULT_RATES: OilRates = { SF: 167, SOYA: 146, PALM: 140 };

export default function App() {
  const [rates, setRates] = useState<OilRates>(DEFAULT_RATES);
  const [tier, setTier] = useState<Tier>("dealer");
  const [chartNumber, setChartNumber] = useState("");
  const [rateDate, setRateDate] = useState(today);

  function handleRatesUpdate(r: OilRates, c: string, d: string) {
    setRates(r);
    setChartNumber(c);
    setRateDate(d);
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

        {/* ── Rate Controller ── */}
        <RateController
          rates={rates}
          chartNumber={chartNumber}
          rateDate={rateDate}
          onUpdate={handleRatesUpdate}
        />

        {/* ── Product Table ── */}
        <ProductTable
          rates={rates}
          tier={tier}
          onTierChange={setTier}
        />

        {/* ── WhatsApp Preview ── */}
        <WhatsappPreview
          rates={rates}
          tier={tier}
          chartNumber={chartNumber}
          rateDate={rateDate}
        />

      </div>
    </div>
  );
}

