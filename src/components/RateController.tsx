import { useState } from "react";
import type { OilRates } from "@/utils/priceCalculator";

interface RateControllerProps {
  rates: OilRates;
  chartNumber: string;
  rateDate: string;
  onUpdate: (rates: OilRates, chartNumber: string, rateDate: string) => void;
}

export function RateController({
  rates,
  chartNumber,
  rateDate,
  onUpdate,
}: RateControllerProps) {
  const [localRates, setLocalRates] = useState<OilRates>({ ...rates });
  const [localChart, setLocalChart] = useState(chartNumber);
  const [localDate, setLocalDate] = useState(rateDate);

  function setRate(key: keyof OilRates, value: string) {
    const parsed = parseFloat(value);
    const next = { ...localRates, [key]: isNaN(parsed) ? 0 : parsed };
    setLocalRates(next);
    onUpdate(next, localChart, localDate);
  }

  function setChart(value: string) {
    setLocalChart(value);
    onUpdate(localRates, value, localDate);
  }

  function setDate(value: string) {
    setLocalDate(value);
    onUpdate(localRates, localChart, value);
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <p className="card-title">Rate Controller</p>
          <p className="card-desc">Enter today's oil rates — prices update instantly.</p>
        </div>
      </div>

      <div className="card-body">
        <div className="rate-grid rate-grid-meta">
          <div className="field">
            <label className="field-label" htmlFor="rate-date">Date</label>
            <input
              className="input"
              id="rate-date"
              type="date"
              value={localDate}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="chart-number">Chart No.</label>
            <input
              className="input"
              id="chart-number"
              placeholder="e.g. 001"
              value={localChart}
              onChange={(e) => setChart(e.target.value)}
            />
          </div>
        </div>

        <div className="rate-grid rate-grid-oils">
          <div className="field">
            <label className="field-label" htmlFor="sf-rate">SF Rate (₹/kg)</label>
            <input
              className="input"
              id="sf-rate"
              type="number"
              min={0}
              step={0.5}
              value={localRates.SF}
              onChange={(e) => setRate("SF", e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="soya-rate">SOYA Rate (₹/kg)</label>
            <input
              className="input"
              id="soya-rate"
              type="number"
              min={0}
              step={0.5}
              value={localRates.SOYA}
              onChange={(e) => setRate("SOYA", e.target.value)}
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="palm-rate">PALM Rate (₹/kg)</label>
            <input
              className="input"
              id="palm-rate"
              type="number"
              min={0}
              step={0.5}
              value={localRates.PALM}
              onChange={(e) => setRate("PALM", e.target.value)}
            />
          </div>
        </div>

        <div className="rate-footer">
          {/* refresh button removed — inputs update live */}
          <div className="rates-summary">
            <span className="rate-chip">
              <span className="rate-chip-dot" style={{ background: "#D29922" }} />
              SF <strong>{rates.SF}</strong>
            </span>
            <span className="rate-chip">
              <span className="rate-chip-dot" style={{ background: "#3FB950" }} />
              SOYA <strong>{rates.SOYA}</strong>
            </span>
            <span className="rate-chip">
              <span className="rate-chip-dot" style={{ background: "#F78166" }} />
              PALM <strong>{rates.PALM}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
