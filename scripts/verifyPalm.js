import productsDefault, { products as productsNamed } from '../src/data/products.js';
import { calculatePrice } from '../src/utils/priceCalculator.js';

const palmArg = process.argv[2] ? Number(process.argv[2]) : 189;
const rates = { SF: 150, SOYA: 146, PALM: palmArg };

function fmt(n) { return n.toFixed(2); }

const products = productsNamed ?? productsDefault;

console.log(`\n=== VERIFY PALM=${palmArg} ===`);
for (const brand of ['BESTTASTE','WHITE APPLE']) {
  console.log(`\n--- ${brand} ---`);
  const group = products.filter(p => p.brand === brand && p.oilType === 'PALM');
  for (const p of group) {
    const price = calculatePrice(p, rates, 'self');
    console.log(`${p.name.padEnd(30)} -> ${fmt(price)}`);
  }
}
