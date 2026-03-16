export type OilType = "SF" | "SOYA" | "PALM";
export type Tier = "self" | "other" | "dealer";

export interface Product {
  name: string;
  oilType: OilType;
  packSize: number;
  adjustments: Record<Tier, number>;
}

export const products: Product[] = [
  // ── Sunflower Oil ──────────────────────────────────────────────────────────
  {
    name: "15KG TIN NEW",
    oilType: "SF",
    packSize: 15,
    adjustments: { self: 150, other: 190, dealer: 205 },
  },
  {
    name: "15LTR TIN NEW",
    oilType: "SF",
    packSize: 15,
    adjustments: { self: 15, other: 55, dealer: 70 },
  },
  {
    name: "15LTR JAR",
    oilType: "SF",
    packSize: 15,
    adjustments: { self: 5, other: 45, dealer: 60 },
  },
  {
    name: "13KG TIN",
    oilType: "SF",
    packSize: 13,
    adjustments: { self: 136, other: 156, dealer: 166 },
  },
  {
    name: "13KG JAR",
    oilType: "SF",
    packSize: 13,
    adjustments: { self: 126, other: 146, dealer: 156 },
  },
  {
    name: "5LTR JAR",
    oilType: "SF",
    packSize: 5,
    adjustments: { self: 18, other: 33, dealer: 38 },
  },
  {
    name: "1LTR POUCH",
    oilType: "SF",
    packSize: 1,
    adjustments: { self: -1.5, other: 1, dealer: 2 },
  },

  // ── Soya Oil ───────────────────────────────────────────────────────────────
  {
    name: "15KG TIN NEW",
    oilType: "SOYA",
    packSize: 15,
    adjustments: { self: 150, other: 190, dealer: 205 },
  },
  {
    name: "15LTR TIN NEW",
    oilType: "SOYA",
    packSize: 15,
    adjustments: { self: -120, other: -80, dealer: -65 },
  },
  {
    name: "15LTR JAR",
    oilType: "SOYA",
    packSize: 15,
    adjustments: { self: -130, other: -90, dealer: -75 },
  },
  {
    name: "5LTR JAR",
    oilType: "SOYA",
    packSize: 5,
    adjustments: { self: 18, other: 33, dealer: 38 },
  },

  // ── Palm Oil ───────────────────────────────────────────────────────────────
  {
    name: "15KG TIN",
    oilType: "PALM",
    packSize: 15,
    adjustments: { self: 125, other: 165, dealer: 180 },
  },
  {
    name: "15LTR TIN",
    oilType: "PALM",
    packSize: 15,
    adjustments: { self: -5, other: 35, dealer: 50 },
  },
  {
    name: "5LTR JAR",
    oilType: "PALM",
    packSize: 5,
    adjustments: { self: 13, other: 28, dealer: 35 },
  },
  {
    name: "1LTR POUCH",
    oilType: "PALM",
    packSize: 1,
    adjustments: { self: -2, other: 0.5, dealer: 1.5 },
  },
];
