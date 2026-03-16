// Offset analysis for BESTTASTE PALM products using provided snapshots
const snapshots = [
  {
    SF: 111,
    prices: {
      "14.800KG TIN (ST)": 2182,
      "12.800 KG TIN (ST)": 1902,
      "840GM POUCH": 125.10
    }
  },
  {
    SF: 100,
    prices: {
      "14.800KG TIN (ST)": 1590,
      "12.800 KG TIN (ST)": 1390,
      "840GM POUCH": 91.50
    }
  },
  {
    SF: 145,
    prices: {
      "14.800KG TIN (ST)": 2256,
      "12.800 KG TIN (ST)": 1966,
      "840GM POUCH": 129.30
    }
  },
  {
    SF: 189,
    prices: {
      "14.800KG TIN (ST)": 2907,
      "12.800 KG TIN (ST)": 2529,
      "840GM POUCH": 166.26
    }
  },
  {
    SF: 176,
    prices: {
      "14.800KG TIN (ST)": 2715,
      "12.800 KG TIN (ST)": 2363,
      "840GM POUCH": 155.34
    }
  },
  {
    SF: 177,
    prices: {
      "14.800KG TIN (ST)": 2730,
      "12.800 KG TIN (ST)": 2376,
      "840GM POUCH": 156.18
    }
  },
  {
    SF: 178,
    prices: {
      "14.800KG TIN (ST)": 2744,
      "12.800 KG TIN (ST)": 2388,
      "840GM POUCH": 157.02
    }
  }
];

const packSizes = {
  "14.800KG TIN (ST)": 14.8,
  "12.800 KG TIN (ST)": 12.8,
  "840GM POUCH": 0.84
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
