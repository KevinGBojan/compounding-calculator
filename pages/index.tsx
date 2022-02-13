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
import { useState } from "react";

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

// dynamic form. user has simple settings and advanced settings.
// even with simple settings, a slider pops up below to adjust things like how much you save.
// advanced settings take your income and expenses (dynamically listed out) as well as how you
// plan to invest, if trading stocks then fees are taken into account and if someone else is managing
// your money then their fee structure is taken into account. sliders for each of these show up.
// advanced setting can assume you retire and live off a certain amount of the money.
// another thing would be to allow people to specify their income/expenses at different parts of their
// life.

// maybe use different charts like bar charts for much fees eat returns over time.

// allow people to save their settings. next time it loads, it checks if data already exists to populate
// the form and the graph.

// maybe make just a dark mode and focus on that design being super sleek

export default function Page({}) {
  const [years, setYears] = useState<number | string>(0);
  const [savingRate, setSavingRate] = useState<number | string>(0);
  const [initialInvestment, setInitialInvestment] = useState<number | string>(
    0
  );

  // wait for user to stop typing to check the validity of the fields and change
  // inputs of the function

  const { totals, labels } = calculateInterest(10, 200, 0);

  const data = {
    labels,
    datasets: [
      {
        label: "6%",
        data: totals,
        backgroundColor: "#f6c9de",
        borderColor: "#f6c9de",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.6%",
        },
      },
      {
        label: "8%",
        data: totals,
        backgroundColor: "#eeabca",
        borderColor: "#eeabca",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.8%",
        },
      },
      {
        label: "10%",
        data: totals,
        backgroundColor: "#c888a6",
        borderColor: "#c888a6",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.10%",
        },
      },
      {
        label: "12%",
        data: totals,
        backgroundColor: "#ca6e99",
        borderColor: "#ca6e99",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.12%",
        },
      },
      {
        label: "15%",
        data: totals,
        backgroundColor: "#c3447f",
        borderColor: "#c3447f",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.15%",
        },
      },
      {
        label: "20%",
        data: totals,
        backgroundColor: "#c2266f",
        borderColor: "#c2266f",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.20%",
        },
      },
      {
        label: "26%",
        data: totals,
        backgroundColor: "#aa0753",
        borderColor: "#aa0753",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.26%",
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Compounding",
      },
    },
  };

  return (
    <main className="mt-20 px-4">
      <form>
        <div>
          <label htmlFor="savingRate">
            How much you will save and invest per month:
          </label>
          <input
            type="number"
            name="savingRate"
            value={savingRate}
            onChange={(e) => setSavingRate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="years">Number of years you are compounding:</label>
          <input
            type="number"
            name="years"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="initialInvestment">
            How much do you have available to invest today?
          </label>
          <input
            type="number"
            name="initialInvestment"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
          />
        </div>
      </form>
      <Line data={data} options={options} />
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
