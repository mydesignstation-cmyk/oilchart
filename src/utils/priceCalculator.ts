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
  const base = rates[product.oilType] * product.packSize;
  return base + product.adjustments[tier];
}
