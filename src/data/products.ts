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
  /** optional dynamic linear offsets: offset = intercept + slope * SF_rate */
  dynamicOffsets?: Partial<Record<OilType, { slope: number; intercept: number }>>;
}

export const products: Product[] = [
  // WHITE APPLE - SUNFLOWER OIL
  { name: "15KG TIN NEW", brand: "WHITE APPLE", oilType: "SF", packSize: 15, offsets: { SF: 150, SOYA: 150, PALM: 82 }, adjustments: { self: 150, other: 190, dealer: 205 } },
  { name: "13KG TIN NEW", brand: "WHITE APPLE", oilType: "SF", packSize: 13, offsets: { SF: 150, SOYA: 140, PALM: 110 }, adjustments: { self: 136, other: 139, dealer: 152 } },
  { name: "13KG JAR", brand: "WHITE APPLE", oilType: "SF", packSize: 13, offsets: { SF: 140, SOYA: 130, PALM: 110 }, adjustments: { self: 126, other: 129, dealer: 142 } },
  { name: "15LTR TIN NEW", brand: "WHITE APPLE", oilType: "SF", packSize: 15, offsets: { SF: -16, SOYA: -47, PALM: -5 }, dynamicOffsets: { SF: { slope: -1.3469147432878004, intercept: 149.76848798869526 } }, adjustments: { self: 15, other: 55, dealer: 70 } },
  { name: "15LTR JAR", brand: "WHITE APPLE", oilType: "SF", packSize: 15, offsets: { SF: -26, SOYA: -57, PALM: -15 }, dynamicOffsets: { SF: { slope: -1.3469147432878004, intercept: 139.76848798869526 } }, adjustments: { self: 5, other: 45, dealer: 60 } },
    { name: "5LTR JAR(4)", brand: "WHITE APPLE", oilType: "SF", packSize: 5, offsets: { SF: 7, SOYA: -10, PALM: 13 }, dynamicOffsets: { SF: { slope: -0.4567239755063589, intercept: 63.47974564295808 } }, adjustments: { self: 18, other: 33, dealer: 38 } },
    { name: "5LTR JAR(3) PET", brand: "WHITE APPLE", oilType: "SF", packSize: 5, offsets: { SF: 7, SOYA: -10, PALM: 13 }, dynamicOffsets: { SF: { slope: -0.4567239755063589, intercept: 63.47974564295808 } }, adjustments: { self: 18, other: 33, dealer: 38 } },
    { name: "1LTR POUCH", brand: "WHITE APPLE", oilType: "SF", packSize: 1, offsets: { SF: -3.57, SOYA: -8.53, PALM: -2 }, dynamicOffsets: { SF: { slope: -0.09, intercept: 7.5 } }, adjustments: { self: -1.5, other: 1, dealer: 2 } },
  { name: "840GM POUCH", brand: "WHITE APPLE", oilType: "SF", packSize: 0.84, offsets: { SF: 7.5, SOYA: 7.0, PALM: 6.5 }, adjustments: { self: 0, other: 2.5, dealer: 3.5 } },

  // WHITE APPLE - SOYA OIL
  { name: "15KG TIN NEW", brand: "WHITE APPLE", oilType: "SOYA", packSize: 15, offsets: { SF: 150, SOYA: 150, PALM: 82 }, dynamicOffsets: { SOYA: { slope: 0, intercept: 150 } }, adjustments: { self: 150, other: 190, dealer: 205 } },
  { name: "15LTR TIN NEW", brand: "WHITE APPLE", oilType: "SOYA", packSize: 15, offsets: { SF: -75, SOYA: -47, PALM: -5 }, dynamicOffsets: { SOYA: { slope: -1.3477001946171738, intercept: 149.77500356007025 } }, adjustments: { self: -120, other: -80, dealer: -65 } },
  { name: "15LTR JAR", brand: "WHITE APPLE", oilType: "SOYA", packSize: 15, offsets: { SF: -85, SOYA: -57, PALM: -15 }, dynamicOffsets: { SOYA: { slope: -1.3477001946171738, intercept: 139.77500356007025 } }, adjustments: { self: -130, other: -90, dealer: -75 } },
  { name: "13KG TIN NEW", brand: "WHITE APPLE", oilType: "SOYA", packSize: 13, offsets: { SF: 150, SOYA: 150, PALM: 110 }, dynamicOffsets: { SOYA: { slope: 0, intercept: 150 } }, adjustments: { self: 136, other: 156, dealer: 166 } },
  { name: "13KG JAR", brand: "WHITE APPLE", oilType: "SOYA", packSize: 13, offsets: { SF: 140, SOYA: 140, PALM: 110 }, dynamicOffsets: { SOYA: { slope: 0, intercept: 140 } }, adjustments: { self: 126, other: 146, dealer: 156 } },
  { name: "5LTR JAR", brand: "WHITE APPLE", oilType: "SOYA", packSize: 5, offsets: { SF: -13, SOYA: -3, PALM: 13 }, dynamicOffsets: { SOYA: { slope: -0.4546447049888451, intercept: 63.21911045711302 } }, adjustments: { self: 18, other: 33, dealer: 38 } },
  { name: "4.200KG JAR", brand: "WHITE APPLE", oilType: "SOYA", packSize: 4.2, offsets: { SF: 62.8, SOYA: 62.8, PALM: 62.8 }, dynamicOffsets: { SOYA: { slope: -0.0023448996060199973, intercept: 62.99411401718341 } }, adjustments: { self: 62.8, other: 82.8, dealer: 92.8 } },
  { name: "2LTR JAR", brand: "WHITE APPLE", oilType: "SOYA", packSize: 2, offsets: { SF: 8, SOYA: 8, PALM: 8 }, dynamicOffsets: { SOYA: { slope: -0.17681682251863104, intercept: 33.69786870460911 } }, adjustments: { self: 8, other: 28, dealer: 38 } },
  { name: "1KG POUCH", brand: "WHITE APPLE", oilType: "SOYA", packSize: 1, offsets: { SF: 7.5, SOYA: 7.5, PALM: 6.5 }, dynamicOffsets: { SOYA: { slope: 0, intercept: 7.5 } }, adjustments: { self: 7.5, other: 27.5, dealer: 37.5 } },
  { name: "0.5KG POUCH", brand: "WHITE APPLE", oilType: "SOYA", packSize: 0.5, offsets: { SF: 4.25, SOYA: 4.25, PALM: 4.25 }, dynamicOffsets: { SOYA: { slope: 0, intercept: 4.25 } }, adjustments: { self: 4.25, other: 24.25, dealer: 34.25 } },
  { name: "1LTR POUCH", brand: "WHITE APPLE", oilType: "SOYA", packSize: 1, offsets: { SF: -5.64, SOYA: -5.64, PALM: -5.64 }, dynamicOffsets: { SOYA: { slope: -0.09, intercept: 7.5 } }, adjustments: { self: -5.64, other: 14.36, dealer: 24.36 } },
  { name: "0.5LTR POUCH", brand: "WHITE APPLE", oilType: "SOYA", packSize: 0.5, offsets: { SF: -2.32, SOYA: -2.32, PALM: -2.32 }, dynamicOffsets: { SOYA: { slope: -0.04502254711159637, intercept: 4.254558788626764 } }, adjustments: { self: -2.32, other: 17.68, dealer: 27.68 } },
  { name: "840GM POUCH", brand: "WHITE APPLE", oilType: "SOYA", packSize: 0.84, offsets: { SF: 7.5, SOYA: 7.5, PALM: 6.5 }, dynamicOffsets: { SOYA: { slope: 3.453722700993699e-16, intercept: 7.5 } }, adjustments: { self: 0, other: 0, dealer: 3.5 } },

  // BESTTASTE - SOYA OIL
  { name: "14.800KG TIN (ST)", brand: "BESTTASTE", oilType: "SOYA", packSize: 14.8, offsets: { SF: 110.2, SOYA: 110.2, PALM: 110.2 }, adjustments: { self: 110.2, other: 130.2, dealer: 140.2 } },
  { name: "13KG TIN (ST)", brand: "BESTTASTE", oilType: "SOYA", packSize: 13, offsets: { SF: 110, SOYA: 110, PALM: 110 }, dynamicOffsets: { SOYA: { slope: 0, intercept: 110 } }, adjustments: { self: 110, other: 130, dealer: 140 } },
  { name: "12.800KG TIN (ST)", brand: "BESTTASTE", oilType: "SOYA", packSize: 12.8, offsets: { SF: 110.2, SOYA: 110.2, PALM: 110.2 }, dynamicOffsets: { SOYA: { slope: 0, intercept: 110.19999999999982 } }, adjustments: { self: 110.2, other: 130.2, dealer: 140.2 } },
  { name: "12.800KG JAR", brand: "BESTTASTE", oilType: "SOYA", packSize: 12.8, offsets: { SF: 140.2, SOYA: 140.2, PALM: 140.2 }, dynamicOffsets: { SOYA: { slope: 0, intercept: 140.19999999999982 } }, adjustments: { self: 140.2, other: 160.2, dealer: 170.2 } },
  { name: "900GM POUCH", brand: "BESTTASTE", oilType: "SOYA", packSize: 0.9, offsets: { SF: 7.5, SOYA: 7.5, PALM: 7.5 }, dynamicOffsets: { SOYA: { slope: 0, intercept: 7.5 } }, adjustments: { self: 7.5, other: 27.5, dealer: 37.5 } },
  { name: "800GM POUCH", brand: "BESTTASTE", oilType: "SOYA", packSize: 0.8, offsets: { SF: 7.5, SOYA: 7.5, PALM: 7.5 }, dynamicOffsets: { SOYA: { slope: 2.127472986603341e-16, intercept: 7.499999999999964 } }, adjustments: { self: 7.5, other: 27.5, dealer: 37.5 } },

  // BESTTASTE - PALM OIL
  { name: "14.800KG TIN (ST)", brand: "BESTTASTE", oilType: "PALM", packSize: 14.8, offsets: { SF: 110, SOYA: 110, PALM: 110 }, adjustments: { self: 110, other: 130, dealer: 140 } },
  { name: "12.800KG TIN (ST)", brand: "BESTTASTE", oilType: "PALM", packSize: 12.8, offsets: { SF: 110, SOYA: 110, PALM: 110 }, dynamicOffsets: { PALM: { slope: 0, intercept: 110 } }, adjustments: { self: 110, other: 130, dealer: 140 } },
  { name: "840GM POUCH", brand: "BESTTASTE", oilType: "PALM", packSize: 0.84, offsets: { SF: 7.5, SOYA: 7.5, PALM: 7.5 }, dynamicOffsets: { PALM: { slope: -0.13584825425246166, intercept: 31.86181736794983 } }, adjustments: { self: 7.5, other: 27.5, dealer: 37.5 } },
];

export default products;
