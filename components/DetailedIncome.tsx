import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

import { v4 as uuidv4 } from "uuid";
import Item from "./Item";
import { AiFillPlusCircle } from "react-icons/ai";
import { Slider } from "@mantine/core";
import AddItem from "./AddItem";

export interface sourceType {
  uid: string;
  source: string;
  amount: string;
}

const backgroundColors = [
  "#9ADBD4",
  "#69AFBF",
  "#63A9BB",
  "#579CB5",
  "#5196B2",
  "#3E7DA4",
  "#3977A0",
  "#36719C",
  "#326A98",
  "#306493",
  "#2D5F8F",
  "#2A588A",
  "#295285",
  "#253970",
  "#24336A",
];

const DetailedIncome = ({
  sliderValue,
  setSliderValue,
  incomeSources,
  setIncomeSources,
  expenses,
  setExpenses,
  setSavingRate,
}: {
  sliderValue: number | undefined;
  setSliderValue: Dispatch<SetStateAction<number | undefined>>;
  incomeSources: sourceType[];
  setIncomeSources: Dispatch<SetStateAction<sourceType[]>>;
  expenses: sourceType[];
  setExpenses: Dispatch<SetStateAction<sourceType[]>>;
  setSavingRate: Dispatch<SetStateAction<string>>;
}) => {
  const addIncomeSource = () => {
    setIncomeSources([
      ...incomeSources,
      {
        uid: uuidv4(),
        source: "",
        amount: "0",
      },
    ]);
  };

  const addExpense = () => {
    setExpenses([
      ...expenses,
      {
        uid: uuidv4(),
        source: "",
        amount: "0",
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

  const [incomeTotal, setIncomeTotal] = useState<number>(0);
  const [expenseTotal, setExpenseTotal] = useState<number>(0);

  useEffect(() => {
    setIncomeTotal(
      incomeSources.reduce(
        (accumulator, current) => accumulator + parseFloat(current.amount),
        0
      )
    );

    setExpenseTotal(
      expenses.reduce(
        (accumulator, current) => accumulator + parseFloat(current.amount),
        0
      )
    );

    if (typeof sliderValue == "undefined") return;

    const total = (
      ((incomeTotal - expenseTotal) * sliderValue) /
      100
    ).toString();

    setSavingRate(total);

    if (sliderValue === 0) {
      if (expenseTotal < incomeTotal) {
        setSavingRate((incomeTotal - expenseTotal).toString());
      } else {
        setSavingRate("0");
      }
    } else {
      setSavingRate(total);
    }
  }, [sliderValue, incomeSources, incomeTotal, expenseTotal, expenses]);

  const useGetIncomeAndExpensesData = (array: sourceType[]) => {
    const labels: string[] = [];
    const amounts: number[] = [];

    array.map((stream) => labels.push(stream.source));
    array.map((stream) => amounts.push(parseFloat(stream.amount)));

    return { labels, amounts };
  };

  const expensesData = useGetIncomeAndExpensesData(expenses);
  const incomeData = useGetIncomeAndExpensesData(incomeSources);

  const doughnutDataExpenses = {
    labels: expensesData.labels,
    datasets: [
      {
        data: expensesData.amounts,
        backgroundColor: backgroundColors,
      },
    ],
  };

  const doughnutDataIncome = {
    labels: incomeData.labels,
    datasets: [
      {
        data: incomeData.amounts,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
      },
    ],
  };

  return (
    <form className="col-span-2 grid grid-cols-2 lg:gap-x-10">
      <div className="col-span-2">
        {incomeTotal > expenseTotal && (
          <>
            <h2 className="mb-2 text-lg">Saving Rate %</h2>
            <Slider
              className="col-span-2 mb-8"
              label={(value) => `${value}%`}
              value={sliderValue}
              labelTransition="skew-down"
              labelTransitionDuration={150}
              labelTransitionTimingFunction="ease"
              onChange={(e) => setSliderValue(e)}
              marks={[
                { value: 20, label: "20%" },
                { value: 50, label: "50%" },
                { value: 80, label: "80%" },
              ]}
              color="grape"
              size={2}
              styles={(theme) => ({
                track: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[3]
                      : theme.colors.blue[1],
                },
                mark: {
                  width: 6,
                  height: 6,
                  borderRadius: 6,
                  transform: "translateX(-3px) translateY(-2px)",
                  borderColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[3]
                      : theme.colors.blue[1],
                },
                markFilled: {
                  borderColor: theme.colors.blue[6],
                },
                markLabel: {
                  fontSize: theme.fontSizes.xs,
                  marginBottom: 5,
                  marginTop: 0,
                },
                thumb: {
                  height: 16,
                  width: 16,
                  backgroundColor: theme.white,
                  borderWidth: 1,
                  boxShadow: theme.shadows.sm,
                },
              })}
            />
          </>
        )}
      </div>

      <div className="col-span-2 lg:col-span-1">
        <span className="mb-2 text-lg">Income Streams</span>
        {incomeSources.map((item) => (
          <Item
            key={item.uid}
            item={item}
            sources={incomeSources}
            itemChangeHandler={incomeSourceHandler}
            deleteItem={deleteIncome}
          />
        ))}
        <div className="grid-cols-20 mb-4 grid gap-x-4">
          <div className="relative col-span-9 flex items-center rounded-lg bg-[#48448061] p-4">
            <label htmlFor="source">Total:</label>
            <input
              className="absolute inset-0 h-full w-full rounded-lg bg-transparent pl-20 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl md:pl-40"
              type="text"
              disabled
              value={incomeTotal || 0}
            />
          </div>
          <div className="col-span-9 flex items-center justify-center">
            <AddItem text="Add income source" addItem={addIncomeSource} />
          </div>
        </div>
      </div>
      <div className="col-span-2 lg:col-span-1">
        <span className="mb-2 text-lg">Expenses</span>
        {expenses.map((item) => (
          <Item
            key={item.uid}
            item={item}
            sources={expenses}
            itemChangeHandler={expensesHandler}
            deleteItem={deleteExpense}
          />
        ))}
        <div className="grid-cols-20 mb-4 grid gap-x-4">
          <div className="relative col-span-9 flex items-center rounded-lg bg-[#48448061] p-4">
            <label htmlFor="source">Total:</label>
            <input
              className="absolute inset-0 h-full w-full rounded-lg bg-transparent pl-20 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl md:pl-40"
              type="text"
              disabled
              value={expenseTotal || 0}
            />
          </div>
          <div className="col-span-9 flex items-center justify-center">
            <AddItem text="Add Expense" addItem={addExpense} />
          </div>
        </div>
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Doughnut data={doughnutDataIncome} />
      </div>
      <div className="col-span-2 lg:col-span-1">
        <Doughnut data={doughnutDataExpenses} />
      </div>
    </form>
  );
};

export default DetailedIncome;
