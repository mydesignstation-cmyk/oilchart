// Standalone offset analysis for WHITE APPLE SF products
const snapshots = [
  {
    SF: 100,
    prices: {
      "15KG TIN NEW": 1650,
      "15LTR TIN NEW": 1515,
      "15LTR JAR": 1505,
      "13KG TIN NEW": 1450,
      "13KG JAR": 1440,
      "5LTR JAR(4)": 518,
      "5LTR JAR(3) PET": 518,
      "1LTR POUCH": 98.5,
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
      "5LTR JAR(4)": 622,
      "5LTR JAR(3) PET": 622,
      "1LTR POUCH": 119.43,
      "840GM POUCH": 110.82
    }
  },
  {
    SF: 150,
    prices: {
      "15KG TIN NEW": 2400,
      "15LTR TIN NEW": 2198,
      "15LTR JAR": 2188,
      "13KG TIN NEW": 2100,
      "13KG JAR": 2090,
      "5LTR JAR(4)": 745,
      "5LTR JAR(3) PET": 745,
      "1LTR POUCH": 144,
      "840GM POUCH": 133.5
    }
  },
  {
    SF: 167,
    prices: {
      "15KG TIN NEW": 2655,
      "15LTR TIN NEW": 2430,
      "15LTR JAR": 2420,
      "13KG TIN NEW": 2321,
      "13KG JAR": 2311,
      "5LTR JAR(4)": 822,
      "5LTR JAR(3) PET": 822,
      "1LTR POUCH": 159.47,
      "840GM POUCH": 147.78
    }
  },
  {
    SF: 175,
    prices: {
      "15KG TIN NEW": 2775,
      "15LTR TIN NEW": 2539,
      "15LTR JAR": 2529,
      "13KG TIN NEW": 2425,
      "13KG JAR": 2415,
      "5LTR JAR(4)": 859,
      "5LTR JAR(3) PET": 859,
      "1LTR POUCH": 166.75,
      "840GM POUCH": 154.5
    }
  },
  {
    SF: 189,
    prices: {
      "15KG TIN NEW": 2985,
      "15LTR TIN NEW": 2730,
      "15LTR JAR": 2720,
      "13KG TIN NEW": 2607,
      "13KG JAR": 2597,
      "5LTR JAR(4)": 922,
      "5LTR JAR(3) PET": 922,
      "1LTR POUCH": 179.49,
      "840GM POUCH": 166.26
    }
  }
];

const packSizes = {
  "15KG TIN NEW": 15,
  "15LTR TIN NEW": 15,
  "15LTR JAR": 15,
  "13KG TIN NEW": 13,
  "13KG JAR": 13,
  "5LTR JAR(4)": 5,
  "5LTR JAR(3) PET": 5,
  "1LTR POUCH": 1,
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
