// Offset analysis for BESTTASTE SOYA products using user-provided snapshots
const snapshots = [
  {
    SF: 186,
    prices: {
      "14.800KG TIN (ST)": 2863,
      "13KG TIN (ST)": 2528,
      "12.800KG TIN (ST)": 2491,
      "12.800KG JAR": 2521,
      "900GM POUCH": 174.9,
      "800GM POUCH": 156.3
    }
  },
  {
    SF: 156,
    prices: {
      "14.800KG TIN (ST)": 2419,
      "13KG TIN (ST)": 2138,
      "12.800KG TIN (ST)": 2107,
      "12.800KG JAR": 2137,
      "900GM POUCH": 147.9,
      "800GM POUCH": 132.3
    }
  },
  {
    SF: 111,
    prices: {
      "14.800KG TIN (ST)": 1753,
      "13KG TIN (ST)": 1553,
      "12.800KG TIN (ST)": 1531,
      "12.800KG JAR": 1561,
      "900GM POUCH": 107.4,
      "800GM POUCH": 96.3
    }
  }
];

const packSizes = {
  "14.800KG TIN (ST)": 14.8,
  "13KG TIN (ST)": 13,
  "12.800KG TIN (ST)": 12.8,
  "12.800KG JAR": 12.8,
  "900GM POUCH": 0.9,
  "800GM POUCH": 0.8
};

function analyze() {
  const productNames = Object.keys(packSizes);
  const results = {};
  for (const name of productNames) {
    const pack = packSizes[name];
    const data = snapshots.map((s) => {
      const price = s.prices[name];
      const offset = price - s.SF * pack;
      return { SF: s.SF, price, offset };
    });

    const n = data.length;
    const sumX = data.reduce((s, d) => s + d.SF, 0);
    const sumY = data.reduce((s, d) => s + d.offset, 0);
    const sumXY = data.reduce((s, d) => s + d.SF * d.offset, 0);
    const sumXX = data.reduce((s, d) => s + d.SF * d.SF, 0);
    const denom = n * sumXX - sumX * sumX;
    const a = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
    const b = (sumY - a * sumX) / n;

    const residuals = data.map((d) => ({ SF: d.SF, offset: d.offset, pred: a * d.SF + b, err: d.offset - (a * d.SF + b) }));
    const maxErr = Math.max(...residuals.map((r) => Math.abs(r.err)));

    results[name] = { pack, a, b, maxErr, residuals };
  }

  console.log(JSON.stringify(results, null, 2));
}

analyze();
