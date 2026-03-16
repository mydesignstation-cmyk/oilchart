export type OilType = "SF" | "SOYA" | "PALM";
export type Tier = "self" | "other" | "dealer";

export interface Product {
  name: string;
  oilType: OilType;
  /** optional brand name - e.g. WHITE APPLE or BESTTASTE */
  brand?: string;
  packSize: number;
  offsets?: Record<OilType, number>;
  adjustments?: Record<Tier, number>;
}

export const products: Product[] = [
  // WHITE APPLE - SUNFLOWER OIL
  { name: "15KG TIN NEW", brand: "WHITE APPLE", oilType: "SF", packSize: 15, offsets: { SF: 150, SOYA: 150, PALM: 82 }, adjustments: { self: 150, other: 190, dealer: 205 } },
  { name: "15LTR TIN NEW", brand: "WHITE APPLE", oilType: "SF", packSize: 15, offsets: { SF: -75, SOYA: -47, PALM: -5 }, adjustments: { self: 15, other: 55, dealer: 70 } },
  { name: "15LTR JAR", brand: "WHITE APPLE", oilType: "SF", packSize: 15, offsets: { SF: -85, SOYA: -57, PALM: -15 }, adjustments: { self: 5, other: 45, dealer: 60 } },
  { name: "13KG TIN NEW", brand: "WHITE APPLE", oilType: "SF", packSize: 13, offsets: { SF: 150, SOYA: 140, PALM: 110 }, adjustments: { self: 136, other: 156, dealer: 166 } },
  { name: "13KG JAR", brand: "WHITE APPLE", oilType: "SF", packSize: 13, offsets: { SF: 140, SOYA: 130, PALM: 110 }, adjustments: { self: 126, other: 146, dealer: 156 } },
  { name: "5LTR JAR(4)", brand: "WHITE APPLE", oilType: "SF", packSize: 5, offsets: { SF: -13, SOYA: -10, PALM: 13 }, adjustments: { self: 18, other: 33, dealer: 38 } },
  { name: "5LTR JAR(3) PET", brand: "WHITE APPLE", oilType: "SF", packSize: 5, offsets: { SF: -13, SOYA: -10, PALM: 13 }, adjustments: { self: 18, other: 33, dealer: 38 } },
  { name: "1LTR POUCH", brand: "WHITE APPLE", oilType: "SF", packSize: 1, offsets: { SF: -7.53, SOYA: -8.53, PALM: -2 }, adjustments: { self: -1.5, other: 1, dealer: 2 } },
  { name: "840GM POUCH", brand: "WHITE APPLE", oilType: "SF", packSize: 0.84, offsets: { SF: 7.5, SOYA: 7.0, PALM: 6.5 }, adjustments: { self: 120, other: 140, dealer: 150 } },

  // WHITE APPLE - SOYA OIL
  { name: "15KG TIN NEW", brand: "WHITE APPLE", oilType: "SOYA", packSize: 15, offsets: { SF: 150, SOYA: 150, PALM: 82 }, adjustments: { self: 150, other: 190, dealer: 205 } },
  { name: "15LTR TIN NEW", brand: "WHITE APPLE", oilType: "SOYA", packSize: 15, offsets: { SF: -75, SOYA: -47, PALM: -5 }, adjustments: { self: -120, other: -80, dealer: -65 } },
  { name: "15LTR JAR", brand: "WHITE APPLE", oilType: "SOYA", packSize: 15, offsets: { SF: -85, SOYA: -57, PALM: -15 }, adjustments: { self: -130, other: -90, dealer: -75 } },
  { name: "13KG TIN NEW", brand: "WHITE APPLE", oilType: "SOYA", packSize: 13, offsets: { SF: 150, SOYA: 140, PALM: 110 }, adjustments: { self: 136, other: 156, dealer: 166 } },
  { name: "13KG JAR", brand: "WHITE APPLE", oilType: "SOYA", packSize: 13, offsets: { SF: 140, SOYA: 140, PALM: 110 }, adjustments: { self: 126, other: 146, dealer: 156 } },
  { name: "5LTR JAR", brand: "WHITE APPLE", oilType: "SOYA", packSize: 5, offsets: { SF: -13, SOYA: -3, PALM: 13 }, adjustments: { self: 18, other: 33, dealer: 38 } },
  { name: "4.200KG JAR", brand: "WHITE APPLE", oilType: "SOYA", packSize: 4.2, offsets: { SF: 62.8, SOYA: 62.8, PALM: 62.8 }, adjustments: { self: 62.8, other: 82.8, dealer: 92.8 } },
  { name: "2LTR JAR", brand: "WHITE APPLE", oilType: "SOYA", packSize: 2, offsets: { SF: 8, SOYA: 8, PALM: 8 }, adjustments: { self: 8, other: 28, dealer: 38 } },
  { name: "1KG POUCH", brand: "WHITE APPLE", oilType: "SOYA", packSize: 1, offsets: { SF: 7.5, SOYA: 7.5, PALM: 6.5 }, adjustments: { self: 7.5, other: 27.5, dealer: 37.5 } },
  { name: "0.5KG POUCH", brand: "WHITE APPLE", oilType: "SOYA", packSize: 0.5, offsets: { SF: 4.25, SOYA: 4.25, PALM: 4.25 }, adjustments: { self: 4.25, other: 24.25, dealer: 34.25 } },
  { name: "1LTR POUCH", brand: "WHITE APPLE", oilType: "SOYA", packSize: 1, offsets: { SF: -5.64, SOYA: -5.64, PALM: -5.64 }, adjustments: { self: -5.64, other: 14.36, dealer: 24.36 } },
  { name: "0.5LTR POUCH", brand: "WHITE APPLE", oilType: "SOYA", packSize: 0.5, offsets: { SF: -2.32, SOYA: -2.32, PALM: -2.32 }, adjustments: { self: -2.32, other: 17.68, dealer: 27.68 } },
  { name: "840GM POUCH", brand: "WHITE APPLE", oilType: "SOYA", packSize: 0.84, offsets: { SF: 7.5, SOYA: 7.5, PALM: 6.5 }, adjustments: { self: 120, other: 140, dealer: 150 } },

  // BESTTASTE - SOYA OIL
  { name: "14.800KG TIN (ST)", brand: "BESTTASTE", oilType: "SOYA", packSize: 14.8, offsets: { SF: 110.2, SOYA: 110.2, PALM: 110.2 }, adjustments: { self: 110.2, other: 130.2, dealer: 140.2 } },
  { name: "13KG TIN (ST)", brand: "BESTTASTE", oilType: "SOYA", packSize: 13, offsets: { SF: 110, SOYA: 110, PALM: 110 }, adjustments: { self: 110, other: 130, dealer: 140 } },
  { name: "12.800KG TIN (ST)", brand: "BESTTASTE", oilType: "SOYA", packSize: 12.8, offsets: { SF: 110.2, SOYA: 110.2, PALM: 110.2 }, adjustments: { self: 110.2, other: 130.2, dealer: 140.2 } },
  { name: "12.800KG JAR", brand: "BESTTASTE", oilType: "SOYA", packSize: 12.8, offsets: { SF: 140.2, SOYA: 140.2, PALM: 140.2 }, adjustments: { self: 140.2, other: 160.2, dealer: 170.2 } },
  { name: "900GM POUCH", brand: "BESTTASTE", oilType: "SOYA", packSize: 0.9, offsets: { SF: 7.5, SOYA: 7.5, PALM: 7.5 }, adjustments: { self: 7.5, other: 27.5, dealer: 37.5 } },
  { name: "800GM POUCH", brand: "BESTTASTE", oilType: "SOYA", packSize: 0.8, offsets: { SF: 7.5, SOYA: 7.5, PALM: 7.5 }, adjustments: { self: 7.5, other: 27.5, dealer: 37.5 } },

  // BESTTASTE - PALM OIL
  { name: "14.800KG TIN (ST)", brand: "BESTTASTE", oilType: "PALM", packSize: 14.8, offsets: { SF: 110, SOYA: 110, PALM: 110 }, adjustments: { self: 110, other: 130, dealer: 140 } },
  { name: "12.800KG TIN (ST)", brand: "BESTTASTE", oilType: "PALM", packSize: 12.8, offsets: { SF: 110, SOYA: 110, PALM: 110 }, adjustments: { self: 110, other: 130, dealer: 140 } },
  { name: "840GM POUCH", brand: "BESTTASTE", oilType: "PALM", packSize: 0.84, offsets: { SF: 7.5, SOYA: 7.5, PALM: 7.5 }, adjustments: { self: 7.5, other: 27.5, dealer: 37.5 } },
];

export default products;
