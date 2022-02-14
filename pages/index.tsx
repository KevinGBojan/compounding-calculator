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
import React, { ChangeEvent, useRef, useState } from "react";
import Head from "next/head";
import useCalculateInterest from "../lib/Hooks/useCalculateInterest";
import { BiReset } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import Item from "../components/Item";
import { Select } from "@mantine/core";
import { BsChevronDown } from "react-icons/bs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

// in the detailed settings make each part optional i.e., (income, expenses, saving %), (assets, liabilities, net worth), (management fees, indexing fees, trading fees, taxes, inflation),
// provide pie chart for income, expenses, assets, and bar chart for fees as a percentage of returns

// support login and saved settings

export default function Page({}) {
  //TODO: Field validation.
  //TODO: Wait a few seconds before running the function.
  //TODO: Sliders
  //TODO: Make the simple calculator work with negative monthly contribution values.

  const [hoverReset, setHoverReset] = useState(false);
  const [savedSettings, setSavedSettings] = useState<string | null>(null);

  // Basic inputs
  const [years, setYears] = useState<number>(10);
  const [savingRate, setSavingRate] = useState<number>(100);
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);

  // Detailed inputs
  const [detailed, setDetailed] = useState(false);
  const [incomeSources, setIncomeSources] = useState([
    { uid: uuidv4(), source: "", amount: 0 },
  ]);
  const [expenses, setExpenses] = useState([
    { uid: uuidv4(), source: "", amount: 0 },
  ]);

  const addIncomeSource = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIncomeSources([
      ...incomeSources,
      {
        uid: uuidv4(),
        source: "",
        amount: 0,
      },
    ]);
  };

  const addExpense = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setExpenses([
      ...expenses,
      {
        uid: uuidv4(),
        source: "",
        amount: 0,
      },
    ]);
  };

  const incomeSourceHandler = (
    e: ChangeEvent<HTMLInputElement>,
    uid: string
  ) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setIncomeSources(
      incomeSources.map((item) =>
        item.uid == uid
          ? {
              ...item,
              [name]: value,
            }
          : item
      )
    );
  };

  const expensesHandler = (e: ChangeEvent<HTMLInputElement>, uid: string) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setExpenses(
      expenses.map((item) =>
        item.uid == uid
          ? {
              ...item,
              [name]: value,
            }
          : item
      )
    );
  };

  const deleteExpense = (uid: string) => {
    setExpenses(expenses.filter((item) => item.uid !== uid));
  };

  const deleteIncome = (uid: string) => {
    setIncomeSources(incomeSources.filter((item) => item.uid !== uid));
  };

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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.15)",
        },
        ticks: {
          color: "#CCCCCC",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.15)",
        },
        ticks: {
          color: "#CCCCCC",
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
      <main className="px-4 sm:px-8 md:px-8 lg:px-20 xl:px-28">
        <div className="h-20v ">
          <h1 className="pt-12 text-center text-lg md:text-xl lg:text-2xl">
            Calculate your future wealth using the power of compound interest
          </h1>
          <h2 className="mx-auto w-3/4 py-4 text-center tracking-wider opacity-50">
            "Compound interest is the eight wonder of the world. He who
            understands it, earns it. He who doesn't, pays it." Albert Einstein
          </h2>
        </div>
        <div className="h-60v">
          <div className="flex items-center justify-end">
            <div className="relative mr-4">
              <BiReset
                onClick={() => {
                  setYears(10);
                  setSavingRate(100);
                  setInitialInvestment(10000);
                }}
                onMouseOver={() => setHoverReset(true)}
                onMouseOut={() => setHoverReset(false)}
                size="24"
                className="z-3 col-span-2 cursor-pointer text-white"
              />
              {hoverReset && (
                <div className="text-md top- absolute -left-5 flex items-center justify-center rounded-md bg-[#121826] px-3 py-2 font-semibold text-white">
                  Reset
                </div>
              )}
            </div>
            <Select
              // styles={{ item: { outlineColor: "##847ed6" } }}
              sx={{ outlineColor: "##847ed6", marginRight: 10 }}
              dropdownPosition="bottom"
              placeholder="Save your inputs"
              value={savedSettings}
              onChange={(e) => setSavedSettings(e)}
              clearable
              nothingFound="No saved settings"
              searchable
              creatable
              maxDropdownHeight={200}
              getCreateLabel={(query) => `+ Create ${query}`}
              // onCreate={(query) => setData((current) => [...current, query])}
              data={["Settings #1", "Settings #2", "Settings #4"]}
            />
          </div>
          <Line data={data} options={options} />
        </div>
        <div className="flex h-20v w-full items-center justify-center md:w-2/3 lg:w-1/2">
          <form className="relative mt-8 grid grid-cols-2 gap-x-8 gap-y-2">
            <div className="relative flex items-center rounded-lg bg-[#48448061] p-4">
              <label htmlFor="initialInvestment" className="font-semibold">
                Initial Investment <span className="text-gray-500">*</span>{" "}
              </label>
              <input
                className="absolute inset-0 col-span-1 rounded-lg bg-transparent pl-60 pr-4 outline-1 outline-[#847ed6]"
                type="number"
                name="initialInvestment"
                value={initialInvestment}
                onChange={(e) =>
                  setInitialInvestment(parseFloat(e.target.value))
                }
              />
            </div>
            <div className="relative flex items-center rounded-lg bg-[#48448061] p-4">
              <label htmlFor="savingRate" className="font-semibold">
                Monthly Contribution <span className="text-gray-500">*</span>
              </label>
              <input
                className="absolute inset-0 col-span-1 rounded-lg bg-transparent pl-60 pr-4 outline-1 outline-[#847ed6]"
                type="number"
                name="savingRate"
                value={savingRate}
                onChange={(e) => setSavingRate(parseFloat(e.target.value))}
              />
            </div>
            <div className="relative flex items-center rounded-lg bg-[#48448061] p-4">
              <label htmlFor="years" className="font-semibold">
                Length of Time in Years <span className="text-gray-500">*</span>
              </label>
              <input
                className="absolute inset-0 col-span-1 rounded-lg bg-transparent pl-60 pr-4 outline-1 outline-[#847ed6]"
                type="number"
                name="years"
                value={years}
                onChange={(e) => setYears(parseFloat(e.target.value))}
              />
            </div>
            <button
              className="col-span-2 mt-2 rounded-lg bg-[#6C62EA] px-4 py-2 hover:bg-[#7469EB]"
              type="button"
              onClick={() => setDetailed(!detailed)}
            >
              Detailed Settings
            </button>
          </form>
        </div>
        {detailed && (
          <form className="col-span-2 grid grid-cols-2">
            <h2 className="text-center">Specify your income and expenses</h2>
            <div className="col-span-2">
              {incomeSources.map((item) => (
                <Item
                  key={item.uid}
                  item={item}
                  itemChangeHandler={incomeSourceHandler}
                  deleteItem={deleteIncome}
                />
              ))}
            </div>
            <button
              className="cols-span-2 bg-red-500"
              type="button"
              onClick={(e) => addIncomeSource(e)}
            >
              Add Income
            </button>
            <div className="col-span-2">
              {expenses.map((item) => (
                <Item
                  key={item.uid}
                  item={item}
                  itemChangeHandler={expensesHandler}
                  deleteItem={deleteExpense}
                />
              ))}
            </div>
            <button type="button" onClick={(e) => addExpense(e)}>
              Add Expense
            </button>
          </form>
        )}
      </main>
    </>
  );
}
