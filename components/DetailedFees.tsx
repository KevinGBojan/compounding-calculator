import { useEffect, useState } from "react";
import useCalculateFees from "../lib/Hooks/useCalculateFees";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { Select, Slider, NumberInput } from "@mantine/core";

//management fees (provide dropdown with standard fee structures?)
// there is no skin in the game with no hurdle - they relish the wins but don't suffer the losses

const DetailedFees = ({ years }: { years: string }) => {
  const [sliderValue, setSliderValue] = useState<number | undefined>(0);
  const [returns, setReturns] = useState<number>(0);
  const [inflation, setInflation] = useState<number>(0.05);
  const [managementFees, setManagementFees] = useState<{
    fixed: number;
    performance: number;
    hurdle: number;
  }>({ fixed: 0.02, performance: 0.2, hurdle: 0.06 });
  const [indexFees, setIndexFees] = useState<number>(0.006);

  useEffect(() => {
    if (typeof sliderValue == "undefined") {
      setReturns(0);
    } else {
      setReturns(sliderValue);
    }
  }, [sliderValue]);

  const impact = useCalculateFees(
    years,
    returns,
    inflation,
    indexFees,
    managementFees
  );

  const datasetsOptions = {
    inflation: [
      {
        label: "your wealth",
        data: impact.totalWithoutInflation,
        backgroundColor: "#b7edf6",
      },
      {
        label: "inflation",
        data: impact.inflationPercentages,
        backgroundColor: "#11b7d4",
      },
    ],
    indexFees: [
      {
        label: "your wealth",
        data: impact.totalWithoutIndexFees,
        backgroundColor: "#b7edf6",
      },
      {
        label: "index fees",
        data: impact.indexFeesPercentages,
        backgroundColor: "#745bc7",
      },
    ],
    managementFees: [
      {
        label: "Your Wealth",
        data: impact.totalWithoutFees,
        backgroundColor: "#b7edf6",
      },
      {
        label: "Fixed Management Fees",
        data: impact.fixedFeesPercentages,
        backgroundColor: "#6042c3",
      },
      {
        label: "Performance Management Fees",
        data: impact.performanceFeesPercentages,
        backgroundColor: "#e032c9",
      },
    ],
  };

  const [datasets, setDatasets] = useState<
    {
      label: string;
      data: number[];
      backgroundColor: string;
    }[]
  >(datasetsOptions?.inflation);
  const [toggleDataset, setToggleDataset] = useState<string | null>(
    "inflation"
  );

  useEffect(() => {
    switch (toggleDataset) {
      case "inflation":
        setDatasets(datasetsOptions.inflation);
        break;
      case "indexFees":
        setDatasets(datasetsOptions.indexFees);
        break;
      case "managementFees":
        setDatasets(datasetsOptions.managementFees);
        break;
    }
  }, [toggleDataset]);

  const data = {
    labels: impact.labels,
    datasets: datasets,
  };

  const options = {
    plugins: {},
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div className="col-span-2">
      <h2 className="text-center text-lg">
        Visualize how inflation, management fees, and trading or index fees are
        impacting your wealth
      </h2>
      <div className="flex flex-col lg:flex-row">
        <div>
          <Select
            className="col-span-2"
            label="Select what you want to visualize"
            placeholder="Pick one"
            data={[
              { value: "inflation", label: "Inflation" },
              { value: "indexFees", label: "Trading or Indexing Fees" },
              { value: "managementFees", label: "Management Fee Structure" },
            ]}
            value={toggleDataset}
            onChange={(e) => setToggleDataset(e)}
          />
          {/* <input
            type="range"
            min="0"
            max="50"
            value={sliderValue}
            onChange={(e) => setSliderValue(e.target.value)}
          /> */}
          <Slider
            min={0}
            max={50}
            className="col-span-2 my-8"
            label={(value) => `${value}%`}
            value={sliderValue}
            labelTransition="skew-down"
            labelTransitionDuration={150}
            labelTransitionTimingFunction="ease"
            onChange={(e) => setSliderValue(e)}
            marks={[
              { value: 10, label: "10%" },
              { value: 25, label: "25%" },
              { value: 40, label: "40%" },
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

          <div>
            {toggleDataset === "inflation" && (
              <div>
                <NumberInput />
              </div>
            )}
            {toggleDataset === "indexFees" && (
              <div>
                <NumberInput />
              </div>
            )}
            {toggleDataset === "managementFees" && (
              <div>
                <NumberInput />
                <NumberInput />
                <NumberInput />
              </div>
            )}
            // Depending on what is selected, inputs pop up to the right. //
            Restrict input so you can parse it properly
          </div>
        </div>
      </div>

      <Bar data={data} options={options} />
    </div>
  );
};

export default DetailedFees;
