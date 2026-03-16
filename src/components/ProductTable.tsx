import { Fragment, useMemo } from "react";
import { products } from "@/data/products";
import type { OilType, Tier } from "@/data/products";
import { calculatePrice } from "@/utils/priceCalculator";
import type { OilRates } from "@/utils/priceCalculator";

const OIL_ORDER: OilType[] = ["SF", "SOYA", "PALM"];

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

const TIERS: Tier[] = ["self", "other", "dealer"];
const TIER_LABELS: Record<Tier, string> = { self: "Self", other: "Other", dealer: "Dealer" };

interface ProductTableProps {
  rates: OilRates;
  tier: Tier;
  onTierChange: (t: Tier) => void;
}

export function ProductTable({ rates, tier, onTierChange }: ProductTableProps) {
  const grouped = useMemo(
    () =>
      OIL_ORDER.reduce<Partial<Record<OilType, typeof products>>>((acc, type) => {
        acc[type] = products.filter((p) => p.oilType === type);
        return acc;
      }, {}),
    [],
  );

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-left">
          <p className="card-title">Product Prices</p>
          <p className="card-desc">Updates live as rates change.</p>
        </div>
        <div className="tier-switcher">
          {TIERS.map((t) => (
            <button
              key={t}
              className={`tier-btn${tier === t ? " active" : ""}`}
              onClick={() => onTierChange(t)}
            >
              {TIER_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="price-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Oil</th>
              <th>Pack (kg)</th>
              <th>{TIER_LABELS[tier]} Price</th>
            </tr>
          </thead>
          <tbody>
            {OIL_ORDER.map((oilType) => {
              const group = grouped[oilType];
              if (!group?.length) return null;
              return (
                <Fragment key={oilType}>
                  <tr className="group-row">
                    <td colSpan={4}>{OIL_LABEL[oilType]}</td>
                  </tr>
                  {group.map((product) => {
                    const price = Math.round(calculatePrice(product, rates, tier));
                    return (
                      <tr key={`${oilType}-${product.name}`}>
                        <td className="product-name">{product.name}</td>
                        <td><span className={OIL_BADGE[oilType]}>{oilType}</span></td>
                        <td className="pack-cell">{product.packSize}</td>
                        <td className="price-cell">₹{price.toLocaleString("en-IN")}</td>
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
