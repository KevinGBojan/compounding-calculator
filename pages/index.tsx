import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// simple version: takes in amount invested per month, shows a graph
// of money compounding with each line representing a different return
// objective. you can adjust graph length by moving the x-axis and also
// which lines get displayed by clicking on them below the chart.

// make it so they can specify different saving rates for different time frames

// make a three js landing page for the calculator or have three js elements

export default function Page({}) {
  const { totals, labels } = calculateInterest(20, 100, 1000);

  const data = {
    labels,
    datasets: [
      {
        label: "6%",
        data: totals,
        backgroundColor: "rgba(255, 26, 104, 0.2)",
        borderColor: "rgb(255, 0, 85)",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.6%",
        },
      },
      {
        label: "8%",
        data: totals,
        backgroundColor: "rgba(255, 26, 104, 0.2)",
        borderColor: "rgb(255, 0, 85)",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.8%",
        },
      },
      {
        label: "10%",
        data: totals,
        backgroundColor: "rgba(255, 26, 104, 0.2)",
        borderColor: "rgb(255, 0, 85)",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.10%",
        },
      },
      {
        label: "12%",
        data: totals,
        backgroundColor: "rgba(255, 26, 104, 0.2)",
        borderColor: "rgb(255, 0, 85)",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.12%",
        },
      },
      {
        label: "15%",
        data: totals,
        backgroundColor: "rgba(255, 26, 104, 0.2)",
        borderColor: "rgb(255, 0, 85)",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.15%",
        },
      },
      {
        label: "20%",
        data: totals,
        backgroundColor: "rgba(255, 26, 104, 0.2)",
        borderColor: "rgb(255, 0, 85)",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.20%",
        },
      },
      {
        label: "26%",
        data: totals,
        backgroundColor: "rgba(250, 219, 229, 0.2)",
        borderColor: "rgb(126, 32, 63)",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.26%",
        },
      },
    ],
  };

  return (
    <main>
      <Line data={data} />
    </main>
  );
}

const calculateInterest = (
  years: number,
  savingRate: number,
  initialInvestment: number
) => {
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

  // push for each element in the array to have an object

  for (let i = 1; i < years + 1; i++) {
    const annual6 = calculateTotal(i, savingRate, initialInvestment, 0.06);
    const annual8 = calculateTotal(i, savingRate, initialInvestment, 0.08);
    const annual10 = calculateTotal(i, savingRate, initialInvestment, 0.1);
    const annual12 = calculateTotal(i, savingRate, initialInvestment, 0.12);
    const annual15 = calculateTotal(i, savingRate, initialInvestment, 0.15);
    const annual20 = calculateTotal(i, savingRate, initialInvestment, 0.2);
    const annual26 = calculateTotal(i, savingRate, initialInvestment, 0.26);

    labels.push(i);

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
  }

  return { totals, labels };
};
