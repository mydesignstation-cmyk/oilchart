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

    // prepend a colored icon for visual grouping (emoji fallback)
    const OIL_ICON: Record<OilType, string> = { SF: "🟨", SOYA: "🟩", PALM: "🟧" };
    lines.push(`${OIL_ICON[oilType]} *${brand} ${OIL_LABELS[oilType]}*`);
    lines.push("");

    for (const p of group) {
      const price = Math.round(calculatePrice(p, rates, tier));
      lines.push(`${p.name} - ${price}`);
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
