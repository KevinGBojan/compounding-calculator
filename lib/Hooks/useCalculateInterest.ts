const useCalculateInterest = (
  years: number,
  savingRate: number,
  initialInvestment: number
) => {
  // if (!years || !savingRate || !initialInvestment) return;
  const totals = [];
  const labels = [];

  const calculateTotal = (
    years: number,
    savingRate: number,
    initialInvestment: number,
    annualRate: number
  ) => {
    // Annual rate to monthly rate R = (1+r)^(1/12)
    const monthlyRate = (1 + annualRate) ** (1 / 12) - 1;

    // Value of the initial investment compounded to the present
    const initialInvestmentValue =
      initialInvestment * (1 + annualRate) ** years;

    // Value of the monthly investments, annuity formula: coupon * ((1 + r)^n -1)/r
    const savingsValue =
      (savingRate * ((1 + monthlyRate) ** (years * 12) - 1)) / monthlyRate;

    const total = Math.round(initialInvestmentValue + savingsValue);

    return total;
  };

  for (let i = 1; i < years + 1; i++) {
    const annual6 = calculateTotal(i, savingRate, initialInvestment, 0.06);
    const annual8 = calculateTotal(i, savingRate, initialInvestment, 0.08);
    const annual10 = calculateTotal(i, savingRate, initialInvestment, 0.1);
    const annual12 = calculateTotal(i, savingRate, initialInvestment, 0.12);
    const annual15 = calculateTotal(i, savingRate, initialInvestment, 0.15);
    const annual20 = calculateTotal(i, savingRate, initialInvestment, 0.2);
    const annual26 = calculateTotal(i, savingRate, initialInvestment, 0.26);

    totals.push({
      year: i,
      totals: {
        "6%": annual6,
        "8%": annual8,
        "10%": annual10,
        "12%": annual12,
        "15%": annual15,
        "20%": annual20,
        "26%": annual26,
      },
    });
    labels.push(i);
  }

  return { totals, labels };
};

export default useCalculateInterest;
