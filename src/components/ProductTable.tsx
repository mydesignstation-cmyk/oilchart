import { Fragment, useMemo } from "react";
import type { OilType, Tier } from "@/data/products";
import type { OilRates } from "@/utils/priceCalculator";
import type { CostSetupRow } from "@/data/costSetup";
import { getHomepagePriceSections } from "@/utils/homepagePricing";

const TIER_LABELS: Record<Tier, string> = { self: "Self", other: "Other", dealer: "Dealer" };

const OIL_LABEL: Record<OilType, string> = {
  SF: "Sunflower Oil",
  SOYA: "Soya Oil",
  PALM: "Palm Oil",
};

const OIL_BADGE: Record<OilType, string> = {
  SF: "oil-badge oil-badge-sf",
  SOYA: "oil-badge oil-badge-soya",
  PALM: "oil-badge oil-badge-palm",
};

interface ProductTableProps {
  rates: OilRates;
  tier: Tier;
  onTierChange: (t: Tier) => void;
  costSetupRows: CostSetupRow[];
  autoRound: boolean;
}

export function ProductTable({ rates, tier, onTierChange, costSetupRows, autoRound }: ProductTableProps) {
  const SHOW_TIER_TABS = false;
  const sections = useMemo(
    () => getHomepagePriceSections(rates, tier, costSetupRows, autoRound),
    [rates, tier, costSetupRows, autoRound],
  );

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <p className="card-title">Product Prices</p>
          <p className="card-desc">Updates live as rates change.</p>
        </div>
        {SHOW_TIER_TABS && (
          <div className="tier-switcher">
            {["self", "other", "dealer"].map((t) => (
              <button
                key={t}
                className={`tier-btn${tier === t ? " active" : ""}`}
                onClick={() => onTierChange(t as Tier)}
              >
                {TIER_LABELS[t as Tier]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="price-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Oil</th>
              <th>{TIER_LABELS[tier]} Price</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <Fragment key={`${section.brand}-${section.oilType}`}>
                <tr className="group-row">
                  <td colSpan={3}>
                    <span className={`brand-name ${section.brand === "WHITE APPLE" ? "brand-white" : section.brand === "BESTTASTE" ? "brand-besttaste" : ""}`}>
                      {section.brand}
                    </span>
                    {OIL_LABEL[section.oilType]}
                  </td>
                </tr>

                {section.items.map((item) => {
                  const rounded = Math.round(item.price * 100) / 100;
                  const isPouch = item.name.toUpperCase().includes("POUCH");
                  const isWhole = Math.abs(rounded - Math.trunc(rounded)) < 0.005;
                  const priceStr = isPouch
                    ? // always show two decimals for pouches
                      rounded.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : isWhole
                    ? rounded.toLocaleString("en-IN", { maximumFractionDigits: 0 })
                    : rounded.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                  const getColor = (b: string, o: OilType) => {
                    if (b === "BESTTASTE" && o === "SOYA") return "#86efac";
                    if (b === "BESTTASTE" && o === "PALM") return "#fb923c";
                    if (b === "WHITE APPLE" && o === "SF") return "#fcd34d";
                    if (b === "WHITE APPLE" && o === "SOYA") return "#16a34a";
                    return "#10b981";
                  };

                  const priceColor = getColor(section.brand, section.oilType);

                  return (
                    <tr key={`${section.brand}-${section.oilType}-${item.name}`}>
                      <td className="product-name">{item.name}</td>
                      <td><span className={OIL_BADGE[item.oilType]}>{item.oilType}</span></td>
                      <td className="price-cell" style={{ color: priceColor }}>₹{priceStr}</td>
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
