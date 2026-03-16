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

  // Per-oil offset (common base offset for that product & oil type)
  const offsetForOil = product.offsets?.[product.oilType] ?? product.adjustments?.["self"] ?? 0;

  // Tier-specific extra markup = adjustments[tier] - adjustments[self]
  const tierExtra = product.adjustments ? (product.adjustments[tier] - (product.adjustments["self"] ?? 0)) : 0;

  const price = base + offsetForOil + tierExtra;
  return Math.round(price * 100) / 100;
}
