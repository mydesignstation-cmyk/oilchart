export function calculateCostSetupPrice(
  liveRate: number,
  multiplierB: number,
  extraCostC: number,
  autoRound: boolean,
): number {
  const result = (liveRate * multiplierB) + extraCostC;
  return autoRound ? Math.round(result) : result;
}
