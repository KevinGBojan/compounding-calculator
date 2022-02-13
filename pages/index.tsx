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
import Head from "next/head";
import useCalculateInterest from "../lib/Hooks/useCalculateInterest";

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
// non intrusive visual elements i.e., blobs, waves, particles

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

// net worth calculator as well?

// maybe make just a dark mode and focus on that design being super sleek

export default function Page({}) {
  const [years, setYears] = useState<number>(10);
  const [savingRate, setSavingRate] = useState<number>(100);
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);

  // wait for user to stop typing to check the validity of the fields and change
  // inputs of the function

  const { totals, labels } = useCalculateInterest(
    years,
    savingRate,
    initialInvestment
  );

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
        text: "Determine how much your money can grow using the power of compound interest.",
        color: "rgb(255, 255, 255)",
        font: {
          family: "Poppins",
          weight: "normal",
          size: 16,
          lineHeight: 2,
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.15)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.801)",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.15)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.801)",
        },
      },
    },
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="mt-20 px-4 sm:px-8 md:px-8 lg:px-20 xl:px-28">
        <form>
          <div>
            <label htmlFor="savingRate">
              How much you will save and invest per month:
            </label>
            <input
              type="number"
              name="savingRate"
              value={savingRate}
              onChange={(e) => setSavingRate(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="years">Number of years you are compounding:</label>
            <input
              type="number"
              name="years"
              value={years}
              onChange={(e) => setYears(parseFloat(e.target.value))}
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
              onChange={(e) => setInitialInvestment(parseFloat(e.target.value))}
            />
          </div>
        </form>
        <Line data={data} options={options} />
      </main>
    </>
  );
}
