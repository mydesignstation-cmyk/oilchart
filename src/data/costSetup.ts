import { products } from "@/data/products";

export interface CostSetupRow {
  id: number;
  product_name: string;
  multiplier_b: number;
  extra_cost_c: number;
  is_active: boolean;
  created_at: string;
}

const CREATED_AT = "2026-03-21T00:00:00Z";

export interface CostSetupSequenceItem {
  product_name: string;
  pack_kg: number;
  default_multiplier_b: number;
  default_extra_cost_c?: number;
}

export const COST_SETUP_SEQUENCE: CostSetupSequenceItem[] = [
  { product_name: "15KG TIN NEW", pack_kg: 15, default_multiplier_b: 15, default_extra_cost_c: 160 },
  { product_name: "15LTR TIN NEW", pack_kg: 15, default_multiplier_b: 13.65, default_extra_cost_c: 160 },
  { product_name: "15LTR JAR", pack_kg: 15, default_multiplier_b: 13.65, default_extra_cost_c: 160 },
  { product_name: "13KG TIN NEW", pack_kg: 13, default_multiplier_b: 13, default_extra_cost_c: 160 },
  { product_name: "13KG JAR", pack_kg: 13, default_multiplier_b: 13, default_extra_cost_c: 160 },
  { product_name: "5LTR JAR(4)", pack_kg: 5, default_multiplier_b: 4.55, default_extra_cost_c: 66 },
  { product_name: "5LTR JAR(3) PET", pack_kg: 5, default_multiplier_b: 4.55, default_extra_cost_c: 66 },
  { product_name: "4 KG JAR", pack_kg: 4, default_multiplier_b: 4, default_extra_cost_c: 66 },
  { product_name: "1LTR POUCH", pack_kg: 1, default_multiplier_b: 0.91, default_extra_cost_c: 8 },
  { product_name: "840GM POUCH", pack_kg: 0.84, default_multiplier_b: 0.84, default_extra_cost_c: 8 },
];

const PRIMARY_SEQUENCE_ROWS: CostSetupRow[] = COST_SETUP_SEQUENCE.map((item, index) => ({
  id: index + 1,
  product_name: item.product_name,
  multiplier_b: item.default_multiplier_b,
  extra_cost_c: item.default_extra_cost_c ?? 0,
  is_active: true,
  created_at: CREATED_AT,
}));

const primaryNames = new Set(PRIMARY_SEQUENCE_ROWS.map((row) => row.product_name));

// Products to ignore for the WHITE APPLE SF extra rows (not part of SF sequence)
const IGNORE_WHITE_APPLE_SF = new Set(["15KG TIN NEW"]);

const EXTRA_PRODUCT_ROWS: CostSetupRow[] = products
  .filter((product) => {
    // Keep the user-approved WHITE APPLE SF sequence authoritative.
    if (product.brand === "WHITE APPLE" && product.oilType === "SF") {
      return !primaryNames.has(product.name) && !IGNORE_WHITE_APPLE_SF.has(product.name);
    }
    return true;
  })
  .map((product, index) => ({
    id: PRIMARY_SEQUENCE_ROWS.length + index + 1,
    product_name: `${product.brand ?? "GENERIC"} ${product.oilType} ${product.name}`,
    multiplier_b: product.packSize,
    extra_cost_c: 0,
    is_active: true,
    created_at: CREATED_AT,
  }));

// Per-product prefills for multiplier B and extra cost C (brand + oilType + name key)
const DEFAULT_B_MAP: Record<string, number> = {
  // WHITE APPLE SF
  "WHITE APPLE SF 15KG TIN NEW": 15,

  // WHITE APPLE SOYA
  "WHITE APPLE SOYA 15KG TIN NEW": 15,
  "WHITE APPLE SOYA 15LTR TIN NEW": 13.65,
  "WHITE APPLE SOYA 15LTR JAR": 13.65,
  "WHITE APPLE SOYA 13KG TIN NEW": 13,
  "WHITE APPLE SOYA 13KG JAR": 13,
  "WHITE APPLE SOYA 5LTR JAR": 4.55,
  "WHITE APPLE SOYA 4.200KG JAR": 4.2,
  "WHITE APPLE SOYA 2LTR JAR": 1.82,
  "WHITE APPLE SOYA 1KG POUCH": 1,
  "WHITE APPLE SOYA 0.5KG POUCH": 0.5,
  "WHITE APPLE SOYA 1LTR POUCH": 0.91,
  "WHITE APPLE SOYA 0.5LTR POUCH": 0.455,
  "WHITE APPLE SOYA 840GM POUCH": 0.84,

  // BESTTASTE SOYA
  "BESTTASTE SOYA 14.800KG TIN (ST)": 14.8,
  "BESTTASTE SOYA 13KG TIN (ST)": 13,
  "BESTTASTE SOYA 12.800KG TIN (ST)": 12.8,
  "BESTTASTE SOYA 12.800KG JAR": 12.8,
  "BESTTASTE SOYA 900GM POUCH": 0.9,
  "BESTTASTE SOYA 800GM POUCH": 0.8,

  // BESTTASTE PALM
  "BESTTASTE PALM 14.800KG TIN (ST)": 14.8,
  "BESTTASTE PALM 13KG TIN (ST)": 13,
  "BESTTASTE PALM 12.800KG TIN (ST)": 12.8,
  "BESTTASTE PALM 840GM POUCH": 0.84,
};

const DEFAULT_C_MAP: Record<string, number> = {
  // WHITE APPLE SF
  "WHITE APPLE SF 15KG TIN NEW": 160,

  // WHITE APPLE SOYA
  "WHITE APPLE SOYA 15KG TIN NEW": 160,
  "WHITE APPLE SOYA 15LTR TIN NEW": 160,
  "WHITE APPLE SOYA 15LTR JAR": 160,
  "WHITE APPLE SOYA 13KG TIN NEW": 160,
  "WHITE APPLE SOYA 13KG JAR": 160,
  "WHITE APPLE SOYA 5LTR JAR": 66,
  "WHITE APPLE SOYA 4.200KG JAR": 66,
  "WHITE APPLE SOYA 2LTR JAR": 36,
  "WHITE APPLE SOYA 1KG POUCH": 8,
  "WHITE APPLE SOYA 0.5KG POUCH": 4,
  "WHITE APPLE SOYA 1LTR POUCH": 8,
  "WHITE APPLE SOYA 0.5LTR POUCH": 4.5,
  "WHITE APPLE SOYA 840GM POUCH": 8,

  // BESTTASTE SOYA
  "BESTTASTE SOYA 14.800KG TIN (ST)": 120,
  "BESTTASTE SOYA 13KG TIN (ST)": 120,
  "BESTTASTE SOYA 12.800KG TIN (ST)": 120,
  "BESTTASTE SOYA 12.800KG JAR": 160,
  "BESTTASTE SOYA 900GM POUCH": 8,
  "BESTTASTE SOYA 800GM POUCH": 8,

  // BESTTASTE PALM
  "BESTTASTE PALM 14.800KG TIN (ST)": 120,
  "BESTTASTE PALM 13KG TIN (ST)": 120,
  "BESTTASTE PALM 12.800KG TIN (ST)": 120,
  "BESTTASTE PALM 840GM POUCH": 8,
};

// Derive 0.5KG / 0.5LTR pouch defaults from their 1KG / 1LTR counterparts so they
// follow the same A*B + C formula: price(0.5) = price(1) / 2 + 0.5
// => B_half = B_full / 2, C_half = C_full / 2 + 0.5
for (const key of Object.keys(DEFAULT_B_MAP)) {
  if (key.endsWith(" 1KG POUCH")) {
    const halfKey = key.replace(" 1KG POUCH", " 0.5KG POUCH");
    DEFAULT_B_MAP[halfKey] = DEFAULT_B_MAP[key] / 2;
    DEFAULT_C_MAP[halfKey] = (DEFAULT_C_MAP[key] ?? 0) / 2 + 0.5;
  }
  if (key.endsWith(" 1LTR POUCH")) {
    const halfKey = key.replace(" 1LTR POUCH", " 0.5LTR POUCH");
    DEFAULT_B_MAP[halfKey] = DEFAULT_B_MAP[key] / 2;
    DEFAULT_C_MAP[halfKey] = (DEFAULT_C_MAP[key] ?? 0) / 2 + 0.5;
  }
}

// Apply maps to EXTRA_PRODUCT_ROWS by mutating entries so prefills appear
for (const row of EXTRA_PRODUCT_ROWS) {
  const key = row.product_name;
  const plainName = key.replace(/^.+?\s(?:SF|SOYA|PALM)\s/, "");
  row.multiplier_b = DEFAULT_B_MAP[key] ?? DEFAULT_B_MAP[plainName] ?? row.multiplier_b;
  row.extra_cost_c = DEFAULT_C_MAP[key] ?? DEFAULT_C_MAP[plainName] ?? row.extra_cost_c;
}

export const initialCostSetup: CostSetupRow[] = [
  ...PRIMARY_SEQUENCE_ROWS,
  ...EXTRA_PRODUCT_ROWS,
];
