import { products } from "../src/data/products";
import { calculatePrice } from "../src/utils/priceCalculator";

// Usage: bun ./scripts/verifyPrices.ts [tier] [SF_rate]
const tierArg = (process.argv[2] as any) || "self";
const sfArg = process.argv[3] ? Number(process.argv[3]) : 167;
const rates = { SF: sfArg, SOYA: 146, PALM: 140 } as const;

function fmt(n: number) {
  return n.toFixed(2);
}

// Print products grouped by brand -> oil order
const OIL_ORDER: Array<"SF" | "SOYA" | "PALM"> = ["SF", "SOYA", "PALM"];

for (const brand of ["WHITE APPLE", "BESTTASTE"]) {
  console.log(`\n=== ${brand} (${tierArg}) ===`);
  for (const oil of OIL_ORDER) {
    const group = products.filter((p) => p.brand === brand && p.oilType === oil);
    if (!group.length) continue;
    console.log(`\n-- ${oil} --`);
    for (const p of group) {
      const price = calculatePrice(p, rates as any, tierArg as any);
      console.log(`${p.name.padEnd(30)} -> ${fmt(price)}`);
    }
  }
}

// Also list any products without a brand (should be none)
const unbranded = products.filter((p) => !p.brand);
if (unbranded.length) {
  console.log("\nUnbranded products:");
  for (const p of unbranded) console.log(`${p.name} (${p.oilType})`);
}
