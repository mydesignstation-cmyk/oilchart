import products from "../src/data/products";
import { calculatePrice } from "../src/utils/priceCalculator";

const palmArg = process.argv[2] ? Number(process.argv[2]) : 189;
const rates = { SF: 150, SOYA: 146, PALM: palmArg } as const;

function fmt(n: number) { return n.toFixed(2); }

console.log(`\n=== VERIFY PALM=${palmArg} ===`);
for (const brand of ["BESTTASTE","WHITE APPLE"]) {
  console.log(`\n--- ${brand} ---`);
  const group = (products as any).filter((p: any) => p.brand === brand && p.oilType === 'PALM');
  for (const p of group) {
    const price = calculatePrice(p, rates as any, 'self');
    console.log(`${p.name.padEnd(30)} -> ${fmt(price)}`);
  }
}
