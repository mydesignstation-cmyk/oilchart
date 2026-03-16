// Offset analysis for WHITE APPLE SOYA products using user-provided snapshots
const snapshots = [
  {
    SF: 100,
    prices: {
      "15KG TIN NEW": 1650,
      "15LTR TIN NEW": 1515,
      "15LTR JAR": 1505,
      "13KG TIN NEW": 1450,
      "13KG JAR": 1440,
      "5LTR JAR": 518,
      "4.200KG JAR": 483,
      "2LTR JAR": 216,
      "1KG POUCH": 107.5,
      "0.5KG POUCH": 54.25,
      "1LTR POUCH": 98.5,
      "0.5LTR POUCH": 49.75,
      "840GM POUCH": 91.5
    }
  },
  {
    SF: 123,
    prices: {
      "15KG TIN NEW": 1995,
      "15LTR TIN NEW": 1829,
      "15LTR JAR": 1819,
      "13KG TIN NEW": 1749,
      "13KG JAR": 1739,
      "5LTR JAR": 622,
      "4.200KG JAR": 579,
      "2LTR JAR": 258,
      "1KG POUCH": 130.5,
      "0.5KG POUCH": 65.75,
      "1LTR POUCH": 119.43,
      "0.5LTR POUCH": 60.22,
      "840GM POUCH": 110.82
    }
  },
  {
    SF: 178,
    prices: {
      "15KG TIN NEW": 2820,
      "15LTR TIN NEW": 2580,
      "15LTR JAR": 2570,
      "13KG TIN NEW": 2464,
      "13KG JAR": 2454,
      "5LTR JAR": 872,
      "4.200KG JAR": 810,
      "2LTR JAR": 358,
      "1KG POUCH": 185.5,
      "0.5KG POUCH": 93.25,
      "1LTR POUCH": 169.48,
      "0.5LTR POUCH": 85.24,
      "840GM POUCH": 157.02
    }
  },
  {
    SF: 186,
    prices: {
      "15KG TIN NEW": 2940,
      "15LTR TIN NEW": 2689,
      "15LTR JAR": 2679,
      "13KG TIN NEW": 2568,
      "13KG JAR": 2558,
      "5LTR JAR": 909,
      "4.200KG JAR": 844,
      "2LTR JAR": 373,
      "1KG POUCH": 193.5,
      "0.5KG POUCH": 97.25,
      "1LTR POUCH": 176.76,
      "0.5LTR POUCH": 88.88,
      "840GM POUCH": 163.74
    }
  }
];

const packSizes = {
  "15KG TIN NEW": 15,
  "15LTR TIN NEW": 15,
  "15LTR JAR": 15,
  "13KG TIN NEW": 13,
  "13KG JAR": 13,
  "5LTR JAR": 5,
  "4.200KG JAR": 4.2,
  "2LTR JAR": 2,
  "1KG POUCH": 1,
  "0.5KG POUCH": 0.5,
  "1LTR POUCH": 1,
  "0.5LTR POUCH": 0.5,
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
