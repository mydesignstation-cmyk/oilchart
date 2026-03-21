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
}

export const COST_SETUP_SEQUENCE: CostSetupSequenceItem[] = [
  { product_name: "15LTR TIN NEW", pack_kg: 15, default_multiplier_b: 13.65 },
  { product_name: "15LTR JAR", pack_kg: 15, default_multiplier_b: 13.65 },
  { product_name: "13KG TIN NEW", pack_kg: 13, default_multiplier_b: 13 },
  { product_name: "13KG JAR", pack_kg: 13, default_multiplier_b: 13 },
  { product_name: "5LTR JAR(4)", pack_kg: 5, default_multiplier_b: 4.55 },
  { product_name: "5LTR JAR(3) PET", pack_kg: 5, default_multiplier_b: 4.55 },
  { product_name: "4 KG JAR", pack_kg: 4, default_multiplier_b: 4 },
  { product_name: "1LTR POUCH", pack_kg: 1, default_multiplier_b: 1 },
  { product_name: "840GM POUCH", pack_kg: 0.84, default_multiplier_b: 0.84 },
];

const PRIMARY_SEQUENCE_ROWS: CostSetupRow[] = COST_SETUP_SEQUENCE.map((item, index) => ({
  id: index + 1,
  product_name: item.product_name,
  multiplier_b: item.default_multiplier_b,
  extra_cost_c: 0,
  is_active: true,
  created_at: CREATED_AT,
}));

const primaryNames = new Set(PRIMARY_SEQUENCE_ROWS.map((row) => row.product_name));

const EXTRA_PRODUCT_ROWS: CostSetupRow[] = products
  .filter((product) => {
    // Keep the user-approved WHITE APPLE SF sequence authoritative.
    if (product.brand === "WHITE APPLE" && product.oilType === "SF") {
      return !primaryNames.has(product.name);
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

export const initialCostSetup: CostSetupRow[] = [
  ...PRIMARY_SEQUENCE_ROWS,
  ...EXTRA_PRODUCT_ROWS,
];
