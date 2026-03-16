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

  // Prefer per-oil offsets; fall back to legacy per-tier adjustments if offsets are missing.
  const offset = product.offsets?.[product.oilType] ?? product.adjustments?.[tier] ?? 0;

  // Return number rounded to two decimals for fractional pack sizes
  const price = base + offset;
  return Math.round(price * 100) / 100;
}
