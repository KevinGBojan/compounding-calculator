const useCalculateFees = (
  years: string,
  returns: number,
  inflation: number,
  indexFees: number,
  managementFees: { fixed: number; hurdle: number; performance: number }
) => {
  const parsedYears = parseFloat(years);
  const parsedReturns = returns / 100;

  const labels: number[] = [];
  const totalWithoutInflation: number[] = [];
  const inflationPercentages: number[] = [];
  const totalWithoutIndexFees: number[] = [];
  const indexFeesPercentages: number[] = [];
  const totalWithoutFees: number[] = [];
  const fixedFeesPercentages: number[] = [];
  const performanceFeesPercentages: number[] = [];

  for (let i = 1; i < parsedYears + 1; i++) {
    const total = (1 + parsedReturns) ** i;

    //* Inflation

    // Inflation-adjusted return = (1 + Stock Return) / (1 + Inflation) - 1

    const totalWithInflation = ((1 + parsedReturns) / (1 + inflation)) ** i;

    const totalWithIndexFees = (1 + parsedReturns - indexFees) ** i;
    let totalWithFixedManagementFees =
      (1 + parsedReturns - managementFees.fixed) ** i;

    const totalWithPerformanceFees =
      (1 +
        (parsedReturns - managementFees.fixed) * managementFees.performance) **
      i;

    const fixedFeesImpact = Math.abs(totalWithFixedManagementFees / total - 1);
    const performanceFeesImpact = Math.abs(
      totalWithPerformanceFees / total - 1
    );

    const inflationImpact = Math.abs(totalWithInflation / total - 1);

    const indexFeesImpact = Math.abs(totalWithIndexFees / total - 1);

    performanceFeesPercentages.push(performanceFeesImpact);
    fixedFeesPercentages.push(fixedFeesImpact);
    inflationPercentages.push(inflationImpact);
    indexFeesPercentages.push(indexFeesImpact);
    labels.push(i);

    totalWithoutInflation.push(1 - inflationImpact);
    totalWithoutIndexFees.push(1 - indexFeesImpact);
    totalWithoutFees.push(1 - fixedFeesImpact - performanceFeesImpact);
  }

  return {
    labels,
    inflationPercentages,
    indexFeesPercentages,
    fixedFeesPercentages,
    performanceFeesPercentages,
    totalWithoutInflation,
    totalWithoutIndexFees,
    totalWithoutFees,
  };
};

export default useCalculateFees;
