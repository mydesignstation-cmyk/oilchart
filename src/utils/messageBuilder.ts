import { products } from "@/data/products";
import type { OilType, Tier } from "@/data/products";
import { calculatePrice } from "./priceCalculator";
import type { OilRates } from "./priceCalculator";

const OIL_LABELS: Record<OilType, string> = {
  SF: "SUNFLOWER OIL",
  SOYA: "SOYA OIL",
  PALM: "PALM OIL",
};

const OIL_ORDER: OilType[] = ["SF", "SOYA", "PALM"];

export interface MessageOptions {
  brand?: string;
  rateDate?: string;
  chartNumber?: string;
  tier?: Tier;
}

/**
 * Builds a WhatsApp-formatted rate broadcast message.
 * Groups products by oil type and renders them with their calculated price.
 */
export function buildMessage(rates: OilRates, opts: MessageOptions = {}): string {
  const { brand = "WHITE APPLE", rateDate = "", chartNumber = "", tier = "dealer" } = opts;

  const lines: string[] = [];

  // Optional header block
  if (rateDate || chartNumber) {
    if (rateDate) lines.push(`Date: ${rateDate}`);
    if (chartNumber) lines.push(`Rate Chart: ${chartNumber}`);
    lines.push("");
  }

  // Group products by oil type
  const grouped = products.reduce<Partial<Record<OilType, typeof products>>>(
    (acc, p) => {
      if (!acc[p.oilType]) acc[p.oilType] = [];
      acc[p.oilType]!.push(p);
      return acc;
    },
    {},
  );

  let firstSection = true;
  for (const oilType of OIL_ORDER) {
    const group = grouped[oilType];
    if (!group?.length) continue;

    if (!firstSection) lines.push("");
    firstSection = false;

    lines.push(`*${brand} ${OIL_LABELS[oilType]}*`);
    lines.push("");

    for (const p of group) {
      const price = Math.round(calculatePrice(p, rates, tier));
      lines.push(`${p.name} - ${price}`);
    }
  }

  return lines.join("\n");
}
