import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import Item from "./Item";
import { AiFillPlusCircle } from "react-icons/ai";
import { Slider, Tooltip } from "@mantine/core";

export interface sourceType {
  uid: string;
  source: string;
  amount: string;
}

const DetailedIncome = ({
  sliderValue,
  setSliderValue,
  detailedIncome,
  incomeSources,
  setIncomeSources,
  expenses,
  setExpenses,
  setSavingRate,
}: {
  sliderValue: number | undefined;
  setSliderValue: Dispatch<SetStateAction<number | undefined>>;
  detailedIncome: boolean;
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

    // if (sliderValue === 0) {
    //   if (expenseTotal < incomeTotal) {
    //     setSavingRate((incomeTotal - expenseTotal).toString());
    //   } else {
    //     setSavingRate("0");
    //   }
    // } else {
    //   setSavingRate(
    //     (((incomeTotal - expenseTotal) * sliderValue) / 100).toString()
    //   );
    // }
  }, [sliderValue, incomeSources, incomeTotal, expenseTotal, expenses]);

  return (
    <form className="col-span-2 grid grid-cols-2">
      <h2 className="mb-2 text-lg">Saving Rate %</h2>
      {incomeTotal > expenseTotal && (
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
      )}

      <h2 className="mb-2 text-lg">Income Streams</h2>
      <div className="col-span-2 lg:col-span-1">
        {incomeSources.map((item) => (
          <Item
            key={item.uid}
            item={item}
            sources={incomeSources}
            itemChangeHandler={incomeSourceHandler}
            deleteItem={deleteIncome}
          />
        ))}
      </div>
      <div className="col-span-2 lg:col-span-1">
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
            <Tooltip
              color="violet"
              label="Add Income Source"
              transition="rotate-right"
              transitionDuration={300}
              transitionTimingFunction="ease"
            >
              <AiFillPlusCircle
                size="32"
                className="cursor-pointer text-[#5C43F5] hover:text-[#705DF2]"
                type="button"
                onClick={() => addIncomeSource()}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <h2 className="mb-2 text-lg">Expenses</h2>
      <div className="col-span-2 lg:col-span-1">
        {expenses.map((item) => (
          <Item
            key={item.uid}
            item={item}
            sources={expenses}
            itemChangeHandler={expensesHandler}
            deleteItem={deleteExpense}
          />
        ))}
      </div>
      <div className="col-span-2 lg:col-span-1">
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
            <Tooltip
              color="violet"
              label="Add Expense"
              transition="rotate-right"
              transitionDuration={300}
              transitionTimingFunction="ease"
            >
              <AiFillPlusCircle
                size="32"
                className="cursor-pointer text-[#5C43F5] hover:text-[#705DF2]"
                type="button"
                onClick={() => addExpense()}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DetailedIncome;
