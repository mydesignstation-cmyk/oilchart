import type { CostSetupRow } from "@/data/costSetup";
import { calculateCostSetupPrice } from "@/utils/costSetupCalculator";

interface CostSetupPreviewProps {
  liveRate: number;
  rows: CostSetupRow[];
  autoRound: boolean;
  onAutoRoundChange: (value: boolean) => void;
}

export function CostSetupPreview({
  liveRate,
  rows,
  autoRound,
  onAutoRoundChange,
}: CostSetupPreviewProps) {
  const activeRows = rows.filter((row) => row.is_active);

  return (
    <div className="card cost-setup-preview-panel">
      <div className="card-header">
        <div className="card-header-left">
          <p className="card-title">Cost Setup Prices (A x B + C)</p>
          <p className="card-desc">Live rate source on homepage: SF rate.</p>
        </div>
        <label className="toggle-wrap">
          <input
            type="checkbox"
            checked={autoRound}
            onChange={(e) => onAutoRoundChange(e.target.checked)}
          />
          <span>Auto Round {autoRound ? "ON" : "OFF"}</span>
        </label>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="price-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>B</th>
              <th>C</th>
              <th>Final Price</th>
            </tr>
          </thead>
          <tbody>
            {activeRows.map((row) => {
              const price = calculateCostSetupPrice(liveRate, row.multiplier_b, row.extra_cost_c, autoRound);
              const priceText = autoRound
                ? price.toLocaleString("en-IN", { maximumFractionDigits: 0 })
                : price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

              return (
                <tr key={row.id}>
                  <td className="product-name">{row.product_name}</td>
                  <td className="pack-cell">{row.multiplier_b}</td>
                  <td className="pack-cell">{row.extra_cost_c}</td>
                  <td className="price-cell">₹{priceText}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
