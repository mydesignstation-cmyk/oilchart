import type { OilType, Product, Tier } from "@/data/products";

export type OilRates = Record<OilType, number>;

// Re-export for convenience so consumers only need one import.
export type { OilType, Tier };

/**
 * Calculates the price of a product for a given set of oil rates and tier.
 * Formula:  price = (oil_rate × pack_size) + adjustment
 */
export function calculatePrice(
  product: Product,
  rates: OilRates,
  tier: Tier = "dealer",
): number {
  const oilRate = rates[product.oilType];
  const base = oilRate * product.packSize;

    // Support legacy numeric offsets as well as optional dynamic linear offsets:
    // product.dynamicOffsets?.[oilType] = { slope: number, intercept: number }
    let offsetForOil: number;
    const dyn = (product as any).dynamicOffsets?.[product.oilType];
    if (dyn && typeof dyn.slope === "number" && typeof dyn.intercept === "number") {
      offsetForOil = dyn.intercept + dyn.slope * oilRate;
    } else {
      offsetForOil = product.offsets?.[product.oilType] ?? product.adjustments?.["self"] ?? 0;
    }

  // Tier-specific extra markup = adjustments[tier] - adjustments[self]
  const tierExtra = product.adjustments ? (product.adjustments[tier] - (product.adjustments["self"] ?? 0)) : 0;

    const result = base + offsetForOil + tierExtra;
    return Math.round(result * 100) / 100;
}
