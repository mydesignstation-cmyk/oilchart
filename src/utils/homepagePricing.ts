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
  const costSetupByName = new Map(costSetupRows.map((row) => [row.product_name, row]));
  const BRAND_ORDER = ["WHITE APPLE", "BESTTASTE"];
  const allBrands = Array.from(
    new Set(products.map((p: Product) => p.brand).filter((b: unknown): b is string => Boolean(b))),
  ) as string[];
  const orderedBrands = [
    ...BRAND_ORDER.filter((b) => allBrands.includes(b)),
    ...allBrands.filter((b) => !BRAND_ORDER.includes(b)),
  ];

  const sections: HomepagePriceSection[] = [];

  for (const brand of orderedBrands) {
    const brandProducts = products.filter((p: Product) => p.brand === brand);
    for (const oilType of OIL_ORDER) {
      let group = brandProducts.filter((p) => p.oilType === oilType);
      if (!group.length) continue;

      if (brand === "WHITE APPLE" && oilType === "SF") {
        group = group.filter((p) => p.name !== "15KG TIN NEW");
      }

      const orderList = PREFERRED_SEQUENCE[brand]?.[oilType] ?? [];
      if (orderList.length) {
        group = group.slice().sort((a, b) => {
          const ia = orderList.indexOf(a.name);
          const ib = orderList.indexOf(b.name);
          if (ia === -1 && ib === -1) return 0;
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        });
      }

      const items: HomepagePriceItem[] = group.map((product) => {
        const setupRow = brand === "WHITE APPLE" && oilType === "SF"
          ? costSetupByName.get(product.name)
          : undefined;

        const price = setupRow
          ? calculateCostSetupPrice(rates.SF, setupRow.multiplier_b, setupRow.extra_cost_c, autoRound)
          : calculatePrice(product, rates, tier);

        return {
          name: product.name,
          oilType,
          packSize: product.packSize,
          price,
        };
      });

      sections.push({
        brand,
        oilType,
        title: `${brand} ${OIL_LABEL[oilType]}`,
        items,
      });
    }
  }

  return sections;
}
