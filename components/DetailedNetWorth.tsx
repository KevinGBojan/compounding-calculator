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
import lodash from "lodash";

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
import useWindowSize from "../lib/Hooks/useWindowSize";

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
  //TODO: Adding percentages and customizing labels
  // https://www.youtube.com/watch?v=hyyIX_8Xe8w&ab_channel=ChartJS

  const size = useWindowSize();
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
        cutout: "70%",
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
        cutout: "70%",
      },
    ],
  };

  const doughnutPluginAssets = [
    {
      id: "doughnutPlugin",
      beforeDraw: function (chart: any) {
        const total = chart._metasets[0].total;
        const totalPercentages = (
          (total / lodash.sum(chart._metasets[0]._dataset.data)) *
          100
        ).toFixed(2);

        const {
          ctx,
          chartArea: { top, width, height },
        } = chart;
        ctx.save();
        const text = `${total} (${totalPercentages}%)`;
        ctx.font = `${
          size.width ? (size.width < 425 ? "15px" : "24px") : "24px"
        } sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.fillText(text, width / 2, top + height / 2);
        ctx.restore();
      },
    },
  ];

  const doughnutPluginLiabilities = [
    {
      id: "doughnutPlugin",
      beforeDraw: function (chart: any) {
        const total = chart._metasets[0].total;
        const totalPercentages = (
          (total / lodash.sum(chart._metasets[0]._dataset.data)) *
          100
        ).toFixed(2);

        const {
          ctx,
          chartArea: { top, width, height },
        } = chart;
        ctx.save();
        const text = `${total} (${totalPercentages}%)`;
        ctx.font = `${
          size.width ? (size.width < 425 ? "15px" : "24px") : "24px"
        } sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.fillText(text, width / 2, top + height / 2);
        ctx.restore();
      },
    },
  ];

  return (
    <form className="col-span-2 mb-20 grid grid-cols-2 lg:gap-x-10">
      <div className="col-span-2 lg:col-span-1 lg:mb-10">
        <h2 className="mb-2 text-lg leading-10 xl:text-xl">Assets</h2>
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
          <div className="relative col-span-8 flex items-center rounded-lg bg-[#48448061] p-4">
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
        <h2 className="mb-2 text-lg leading-10 xl:text-xl">Liabilities</h2>
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
          <div className="relative col-span-8 flex items-center rounded-lg bg-[#48448061] p-4">
            <label htmlFor="source">Total:</label>
            <input
              className="absolute inset-0 h-full w-full rounded-lg bg-transparent pl-20 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl"
              type="text"
              disabled
              value={debtTotal || 0}
            />
          </div>
          <div className="col-span-9 flex items-center justify-center">
            <AddItem text="Add Liability" addItem={addDebt} />
          </div>
        </div>
      </div>
      {assetTotal > 0 && (
        <div className="col-span-2 my-8 text-center lg:col-span-1 lg:my-0">
          <h3 className="leading-12 mb-4 text-lg lg:hidden lg:text-xl">
            Assets
          </h3>
          <Doughnut
            data={doughnutAssetData}
            options={options}
            plugins={doughnutPluginAssets}
          />
        </div>
      )}
      {debtTotal > 0 && (
        <div className="col-span-2 mb-10 text-center lg:col-span-1">
          <h3 className="leading-12 mb-4 text-lg lg:hidden lg:text-xl">
            Liabilities
          </h3>
          <Doughnut
            data={doughnutDebtData}
            options={options}
            plugins={doughnutPluginLiabilities}
          />
        </div>
      )}
    </form>
  );
};

export default DetailedIncome;
