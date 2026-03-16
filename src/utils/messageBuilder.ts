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

// Preferred product sequence per brand + oil type. Products not listed will appear after these.
const PREFERRED_SEQUENCE: Record<string, Partial<Record<OilType, string[]>>> = {
  "WHITE APPLE": {
    SF: [
      "15KG TIN NEW",
      "15LTR TIN NEW",
      "15LTR JAR",
      "13KG TIN NEW",
      "13KG JAR",
      "5LTR JAR(4)",
      "5LTR JAR(3) PET",
      "1LTR POUCH",
      "840GM POUCH",
    ],
    SOYA: [
      "15 KG TIN NEW",
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
    PALM: ["14.800KG TIN (ST)", "12.800 KG TIN (ST)", "840GM POUCH"],
  },
};

export interface MessageOptions {
  brand?: string;
  rateDate?: string;
  chartNumber?: string;
  tier?: Tier;
  companyName?: string;
  custCare?: string;
  notes?: string[];
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

  // Group products by brand first, then by oil type (preserve requested oil order)
  const OIL_ICON: Record<OilType, string> = { SF: "🟨", SOYA: "🟩", PALM: "🟧" };

  // Preferred brand ordering; any other brands appear after these in original discovery order
  const BRAND_ORDER = ["WHITE APPLE", "BESTTASTE"];
  const allBrands = Array.from(new Set(products.map((p) => p.brand ?? "WHITE APPLE")));
  const orderedBrands = [
    ...BRAND_ORDER.filter((b) => allBrands.includes(b)),
    ...allBrands.filter((b) => !BRAND_ORDER.includes(b)),
  ];

  let firstSection = true;
  for (const brandName of orderedBrands) {
    // check whether this brand has any products at all
    const brandProducts = products.filter((p) => (p.brand ?? "WHITE APPLE") === brandName);
    if (!brandProducts.length) continue;

    // for each oil type in preferred order, list products for that brand
    for (const oilType of OIL_ORDER) {
      let group = brandProducts.filter((p) => p.oilType === oilType);
      if (!group.length) continue;

      // sort group according to preferred sequence if provided for this brand+oil
      const orderList = PREFERRED_SEQUENCE[brandName as string]?.[oilType] ?? [];
      if (orderList && orderList.length) {
        group = group.slice().sort((a, b) => {
          const ia = orderList.indexOf(a.name);
          const ib = orderList.indexOf(b.name);
          if (ia === -1 && ib === -1) return 0;
          if (ia === -1) return 1;
          if (ib === -1) return -1;
          return ia - ib;
        });
      }

      if (!firstSection) lines.push("");
      firstSection = false;

      lines.push(`${OIL_ICON[oilType]} *${brandName} ${OIL_LABELS[oilType]}*`);
      lines.push("");

      for (const p of group) {
        const price = calculatePrice(p, rates, tier);
        const priceStr = price.toFixed(2);
        lines.push(`${p.name} - ${priceStr}`);
      }
    }
  }

  return lines.join("\n");
}

// Append a small quoted footer for attribution when rendering in WhatsApp
export function buildMessageWithFooter(rates: OilRates, opts: MessageOptions = {}) {
  const base = buildMessage(rates, opts);
  const {
    companyName = "BHAGYODAY PROTEINS & OIL REFINERY PVT LTD VAIJAPUR",
    custCare = "+91-7249717971",
    notes = [
      "NOTE: (ST) = SECOND TIN.",
      "CD: SAME DAY CHEQUE RS.5/NOG & SAME DAY RTGS RS. 10/NOG.",
      "BOOKING VALIDITY 10 DAYS (CARRYING CHARGES OF RS. 2 NOG/DAY).",
      "DAILY RATES ARE VALID TILL WORKING HRS TILL 6PM.",
      "UNLOADING CHARGES WILL BE GIVEN 1 RS/NOG ONLY.",
      "PAYMENT VALIDITY 7 DAYS CHEQUE COMPULSORY.",
    ],
  } = opts;

  const footerLines: string[] = [];
  // quoted lines for WhatsApp
  if (companyName) footerLines.push(`> *${companyName}*`);
  if (custCare) footerLines.push(`> Cust.Care: ${custCare}`);

  // append legal/notes block (not quoted) after a blank line
  const notesBlock = notes && notes.length ? `\n${notes.join("\n")}` : "";

  return `${base}\n\n${footerLines.join("\n")}${notesBlock}`;
}
