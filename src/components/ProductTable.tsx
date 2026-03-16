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
  // Build brand-first grouping while preserving original product array order
  const groupedByBrand = useMemo(() => {
    const BRAND_ORDER = ["WHITE APPLE", "BESTTASTE"];
    const allBrands = Array.from(new Set(products.map((p) => p.brand ?? "WHITE APPLE")));
    const orderedBrands = [
      ...BRAND_ORDER.filter((b) => allBrands.includes(b)),
      ...allBrands.filter((b) => !BRAND_ORDER.includes(b)),
    ];

    return orderedBrands.map((brandName) => ({
      brand: brandName,
      products: products.filter((p) => (p.brand ?? "WHITE APPLE") === brandName),
    }));
  }, []);

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
            {groupedByBrand.map(({ brand, products: brandProducts }) => {
              if (!brandProducts.length) return null;
              return (
                <Fragment key={brand}>
                  <tr className="brand-row">
                    <td colSpan={4}>{brand}</td>
                  </tr>

                  {OIL_ORDER.map((oilType) => {
                    const group = brandProducts.filter((p) => p.oilType === oilType);
                    if (!group.length) return null;

                    return (
                      <Fragment key={`${brand}-${oilType}`}>
                        <tr className="group-row">
                          <td colSpan={4}>{OIL_LABEL[oilType]}</td>
                        </tr>

                        {group.map((product) => {
                          const price = calculatePrice(product, rates, tier);
                          const priceStr = price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                          return (
                            <tr key={`${brand}-${oilType}-${product.name}`}>
                              <td className="product-name">{product.name}</td>
                              <td><span className={OIL_BADGE[oilType]}>{oilType}</span></td>
                              <td className="pack-cell">{product.packSize}</td>
                              <td className="price-cell">₹{priceStr}</td>
                            </tr>
                          );
                        })}
                      </Fragment>
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
