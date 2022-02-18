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
import { backgroundColors, sourceType } from "./DetailedIncome";

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
import AddItem from "./AddItem";
import useGetDoughnutData from "../lib/Hooks/useGetDoughnutData";

const DetailedIncome = ({
  assets,
  setAssets,
  liabilities,
  setLiabilities,
}: {
  assets: sourceType[];
  setAssets: Dispatch<SetStateAction<sourceType[]>>;
  liabilities: sourceType[];
  setLiabilities: Dispatch<SetStateAction<sourceType[]>>;
}) => {
  const addAsset = () => {
    setAssets([
      ...assets,
      {
        uid: uuidv4(),
        source: "",
        amount: "0",
      },
    ]);
  };

  const addDebt = () => {
    setLiabilities([
      ...liabilities,
      {
        uid: uuidv4(),
        source: "",
        amount: "0",
      },
    ]);
  };

  const assetSourceHandler = (
    e: ChangeEvent<HTMLInputElement>,
    uid: string
  ) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setAssets(
      assets.map((item) =>
        item.uid == uid
          ? {
              ...item,
              [name]: value,
            }
          : item
      )
    );
  };

  const debtSourceHandler = (e: ChangeEvent<HTMLInputElement>, uid: string) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    setLiabilities(
      liabilities.map((item) =>
        item.uid == uid
          ? {
              ...item,
              [name]: value,
            }
          : item
      )
    );
  };

  const deleteDebt = (uid: string) => {
    setLiabilities(liabilities.filter((item) => item.uid !== uid));
  };

  const deleteAsset = (uid: string) => {
    setAssets(assets.filter((item) => item.uid !== uid));
  };

  const [assetTotal, setAssetTotal] = useState<number>(0);
  const [debtTotal, setDebtTotal] = useState<number>(0);
  const [netWorth, setNetWorth] = useState<number>(0);

  useEffect(() => {
    const assetsTotal = assets.reduce(
      (accumulator, current) => accumulator + parseFloat(current.amount),
      0
    );

    const liabilitiesTotal = liabilities.reduce(
      (accumulator, current) => accumulator + parseFloat(current.amount),
      0
    );

    setAssetTotal(assetsTotal);
    setDebtTotal(liabilitiesTotal);
    setNetWorth(assetsTotal - liabilitiesTotal);
  }, [assets, liabilities]);

  const useGetIncomeAndExpensesData = (array: sourceType[]) => {
    const labels: string[] = [];
    const amounts: number[] = [];

    array.map((stream) => labels.push(stream.source));
    array.map((stream) => amounts.push(parseFloat(stream.amount)));

    return { labels, amounts };
  };

  const assetData = useGetDoughnutData(assets);
  const debtData = useGetDoughnutData(liabilities);

  const doughnutAssetData = {
    labels: assetData.labels,
    datasets: [
      {
        data: assetData.amounts,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#fff",
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const doughnutDebtData = {
    labels: debtData.labels,
    datasets: [
      {
        data: debtData.amounts,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  //TODO: Adding total inside doughnut
  // https://www.youtube.com/watch?v=E8pSF9JrEvE&ab_channel=ChartJS

  return (
    <form className="col-span-2 mb-20 grid grid-cols-2 lg:gap-x-10">
      <div className="col-span-2 lg:col-span-1 lg:mb-10">
        <h2 className="mb-2 text-lg leading-10">Assets</h2>
        {assets.map((item) => (
          <Item
            key={item.uid}
            item={item}
            sources={assets}
            itemChangeHandler={assetSourceHandler}
            deleteItem={deleteAsset}
          />
        ))}
        <div className="grid-cols-20 mb-4 grid gap-x-4 ">
          <div className="relative col-span-9 flex items-center rounded-lg bg-[#48448061] p-4">
            <label htmlFor="source">Total:</label>
            <input
              className="absolute inset-0 h-full w-full rounded-lg bg-transparent pl-20 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl"
              type="text"
              disabled
              value={assetTotal || 0}
            />
          </div>
          <div className="col-span-9 flex items-center justify-center">
            <AddItem text="Add Asset" addItem={addAsset} />
          </div>
        </div>
      </div>
      <div className="col-span-2 lg:col-span-1">
        <h2 className="mb-2 text-lg leading-10">Liabilities</h2>
        {liabilities.map((item) => (
          <Item
            key={item.uid}
            item={item}
            sources={liabilities}
            itemChangeHandler={debtSourceHandler}
            deleteItem={deleteDebt}
          />
        ))}
        <div className="grid-cols-20 mb-4 grid gap-x-4">
          <div className="relative col-span-9 flex items-center rounded-lg bg-[#48448061] p-4">
            <label htmlFor="source">Total:</label>
            <input
              className="absolute inset-0 h-full w-full rounded-lg bg-transparent pl-20 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl"
              type="text"
              disabled
              value={debtTotal || 0}
            />
          </div>
          <div className="col-span-9 flex items-center justify-center">
            <AddItem text="Add Expense" addItem={addDebt} />
          </div>
        </div>
      </div>
      {assetTotal > 0 && (
        <div className="col-span-2 my-8 text-center lg:col-span-1 lg:my-0">
          <h3 className="leading-12 mb-4 text-lg lg:hidden lg:text-xl">
            Income Streams
          </h3>
          <Doughnut data={doughnutAssetData} options={options} />
        </div>
      )}
      {debtTotal > 0 && (
        <div className="col-span-2 mb-10 text-center lg:col-span-1">
          <h3 className="leading-12 mb-4 text-lg lg:hidden lg:text-xl">
            Expenses
          </h3>
          <Doughnut data={doughnutDebtData} options={options} />
        </div>
      )}
    </form>
  );
};

export default DetailedIncome;
