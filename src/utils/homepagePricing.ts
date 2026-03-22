import { products } from "@/data/products";
import type { OilType, Product, Tier } from "@/data/products";
import type { OilRates } from "@/utils/priceCalculator";
import { calculatePrice } from "@/utils/priceCalculator";
import type { CostSetupRow } from "@/data/costSetup";
import { calculateCostSetupPrice } from "@/utils/costSetupCalculator";

const OIL_ORDER: OilType[] = ["SF", "SOYA", "PALM"];

const OIL_LABEL: Record<OilType, string> = {
  SF: "Sunflower Oil",
  SOYA: "Soya Oil",
  PALM: "Palm Oil",
};

const PREFERRED_SEQUENCE: Record<string, Partial<Record<OilType, string[]>>> = {
  "WHITE APPLE": {
    SF: [
      "15LTR TIN NEW",
      "15LTR JAR",
      "13KG TIN NEW",
      "13KG JAR",
      "5LTR JAR(4)",
      "5LTR JAR(3) PET",
      "4 KG JAR",
      "1LTR POUCH",
      "840GM POUCH",
    ],
    SOYA: [
      "15KG TIN NEW",
      "15LTR TIN NEW",
      "15LTR JAR",
      "13KG TIN NEW",
      "13KG JAR",
      "5LTR JAR",
      "4.200KG JAR",
      "2LTR JAR",
      "1KG POUCH",
      "0.5KG POUCH",
      "1LTR POUCH",
      "0.5LTR POUCH",
      "840GM POUCH",
    ],
  },
  BESTTASTE: {
    SOYA: [
      "14.800KG TIN (ST)",
      "13KG TIN (ST)",
      "12.800KG TIN (ST)",
      "12.800KG JAR",
      "900GM POUCH",
      "800GM POUCH",
    ],
    PALM: ["14.800KG TIN (ST)", "12.800KG TIN (ST)", "840GM POUCH"],
  },
};

export interface HomepagePriceItem {
  name: string;
  oilType: OilType;
  packSize: number;
  price: number;
}

export interface HomepagePriceSection {
  brand: string;
  oilType: OilType;
  title: string;
  items: HomepagePriceItem[];
}

export function getHomepagePriceSections(
  rates: OilRates,
  tier: Tier,
  costSetupRows: CostSetupRow[],
  autoRound: boolean,
): HomepagePriceSection[] {
  // Build homepage sections from the provided costSetupRows so the homepage
  // matches the admin Cost Setup ordering and active flags.
  const sectionsMap = new Map<string, HomepagePriceItem[]>();

  // Helper to parse stored product names into brand/oilType/displayName
  function parseRowName(productName: string) {
    const value = productName.trim();
    if (!value.includes(" SF ") && !value.includes(" SOYA ") && !value.includes(" PALM ")) {
      return { brand: "WHITE APPLE", oilType: "SF" as OilType, displayName: value };
    }
    const parsed = value.match(/^(.*)\s(SF|SOYA|PALM)\s(.*)$/);
    if (parsed) {
      return { brand: parsed[1].trim(), oilType: parsed[2] as OilType, displayName: parsed[3].trim() };
    }
    return { brand: "WHITE APPLE", oilType: "SF" as OilType, displayName: value };
  }

  const productLookup = new Map<string, Product>();
  for (const p of products) {
    productLookup.set(`${p.brand}||${p.oilType}||${p.name}`, p);
  }

  for (const row of costSetupRows) {
    if (!row.is_active) continue;
    const { brand, oilType, displayName } = parseRowName(row.product_name);
    const key = `${brand}||${oilType}||${displayName}`;

    const prod = productLookup.get(key);
    const packSize = prod ? prod.packSize : Math.round(row.multiplier_b * 100) / 100;

    const isPouch = displayName.toUpperCase().includes("POUCH");
    const price = calculateCostSetupPrice(rates[oilType], row.multiplier_b, row.extra_cost_c, autoRound && !isPouch);

    const item: HomepagePriceItem = { name: displayName, oilType, packSize, price };

    const sectionKey = `${brand}||${oilType}`;
    if (!sectionsMap.has(sectionKey)) sectionsMap.set(sectionKey, []);
    sectionsMap.get(sectionKey)!.push(item);
  }

  // Convert map to ordered sections following BRAND_ORDER and OIL_ORDER.
  const orderedSections: HomepagePriceSection[] = [];
  const brandsSeen = new Set(Array.from(sectionsMap.keys()).map((k) => k.split("||")[0]));
  const orderedBrands = ["WHITE APPLE", "BESTTASTE", ...Array.from(brandsSeen).filter((b) => b !== "WHITE APPLE" && b !== "BESTTASTE")];

  for (const b of orderedBrands) {
    for (const o of OIL_ORDER) {
      const sk = `${b}||${o}`;
      const items = sectionsMap.get(sk);
      if (!items || items.length === 0) continue;
      orderedSections.push({ brand: b, oilType: o, title: `${b} ${OIL_LABEL[o]}`, items });
    }
  }

  return orderedSections;
}
