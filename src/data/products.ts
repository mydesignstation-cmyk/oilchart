export type OilType = "SF" | "SOYA" | "PALM";
export type Tier = "self" | "other" | "dealer";

export interface Product {
  name: string;
  oilType: OilType;
  packSize: number;
  /**
   * Per-oil offsets (base additive offsets that depend on oil type).
   * Example: { SF: 150, SOYA: 150, PALM: 82 }
   */
  offsets?: Record<OilType, number>;
  /**
   * Legacy per-tier adjustments (kept for compatibility but not used by
   * the new price calculator which prefers `offsets`).
   */
  adjustments?: Record<Tier, number>;
}

export const products: Product[] = [
  // ── Sunflower Oil ──────────────────────────────────────────────────────────
  {
    name: "15KG TIN NEW",
    oilType: "SF",
    packSize: 15,
    offsets: { SF: 150, SOYA: 150, PALM: 82 },
    adjustments: { self: 150, other: 190, dealer: 205 },
  },
  {
    name: "15LTR TIN NEW",
    oilType: "SF",
    packSize: 15,
    offsets: { SF: -75, SOYA: -47, PALM: -5 },
    adjustments: { self: 15, other: 55, dealer: 70 },
  },
  {
    name: "15LTR JAR",
    oilType: "SF",
    packSize: 15,
    offsets: { SF: -85, SOYA: -57, PALM: -15 },
    adjustments: { self: 5, other: 45, dealer: 60 },
  },
  {
    name: "13KG TIN",
    oilType: "SF",
    packSize: 13,
    offsets: { SF: 150, SOYA: 140, PALM: 110 },
    adjustments: { self: 136, other: 156, dealer: 166 },
  },
  {
    name: "13KG JAR",
    oilType: "SF",
    packSize: 13,
    offsets: { SF: 140, SOYA: 130, PALM: 110 },
    adjustments: { self: 126, other: 146, dealer: 156 },
  },
  {
    name: "5LTR JAR",
    oilType: "SF",
    packSize: 5,
    offsets: { SF: -13, SOYA: -10, PALM: 13 },
    adjustments: { self: 18, other: 33, dealer: 38 },
  },
  {
    name: "1LTR POUCH",
    oilType: "SF",
    packSize: 1,
    offsets: { SF: -7.53, SOYA: -8.53, PALM: -2 },
    adjustments: { self: -1.5, other: 1, dealer: 2 },
  },
  {
    name: "840GM POUCH",
    oilType: "SF",
    packSize: 0.84,
    offsets: { SF: 7.5, SOYA: 7.0, PALM: 6.5 },
    adjustments: { self: 120, other: 140, dealer: 150 },
  },

  // ── Soya Oil ───────────────────────────────────────────────────────────────
  {
    name: "15KG TIN NEW",
    oilType: "SOYA",
    packSize: 15,
    offsets: { SF: 150, SOYA: 150, PALM: 82 },
    adjustments: { self: 150, other: 190, dealer: 205 },
  },
  {
    name: "15LTR TIN NEW",
    oilType: "SOYA",
    packSize: 15,
    offsets: { SF: -75, SOYA: -47, PALM: -5 },
    adjustments: { self: -120, other: -80, dealer: -65 },
  },
  {
    name: "15LTR JAR",
    oilType: "SOYA",
    packSize: 15,
    offsets: { SF: -85, SOYA: -57, PALM: -15 },
    adjustments: { self: -130, other: -90, dealer: -75 },
  },
  {
    name: "5LTR JAR",
    oilType: "SOYA",
    packSize: 5,
    offsets: { SF: -13, SOYA: -10, PALM: 13 },
    adjustments: { self: 18, other: 33, dealer: 38 },
  },
  {
    name: "840GM POUCH",
    oilType: "SOYA",
    packSize: 0.84,
    offsets: { SF: 7.5, SOYA: 7.0, PALM: 6.5 },
    adjustments: { self: 120, other: 140, dealer: 150 },
  },

  // ── Palm Oil ───────────────────────────────────────────────────────────────
  {
    name: "15KG TIN",
    oilType: "PALM",
    packSize: 15,
    offsets: { SF: 150, SOYA: 150, PALM: 82 },
    adjustments: { self: 125, other: 165, dealer: 180 },
  },
  {
    name: "15LTR TIN",
    oilType: "PALM",
    packSize: 15,
    offsets: { SF: -75, SOYA: -47, PALM: -5 },
    adjustments: { self: -5, other: 35, dealer: 50 },
  },
  {
    name: "5LTR JAR",
    oilType: "PALM",
    packSize: 5,
    offsets: { SF: -13, SOYA: -10, PALM: 13 },
    adjustments: { self: 13, other: 28, dealer: 35 },
  },
  {
    name: "1LTR POUCH",
    oilType: "PALM",
    packSize: 1,
    offsets: { SF: -7.53, SOYA: -8.53, PALM: -2 },
    adjustments: { self: -2, other: 0.5, dealer: 1.5 },
  },
  {
    name: "12.800KG TIN",
    oilType: "PALM",
    packSize: 12.8,
    offsets: { SF: 140, SOYA: 120, PALM: 110 },
    adjustments: { self: 100, other: 120, dealer: 130 },
  },
  {
    name: "840GM POUCH",
    oilType: "PALM",
    packSize: 0.84,
    offsets: { SF: 7.5, SOYA: 7.0, PALM: 6.5 },
    adjustments: { self: 120, other: 140, dealer: 150 },
  },
];
