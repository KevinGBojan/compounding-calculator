import React, { useContext, useEffect, useState } from "react";
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
import { v4 as uuidv4 } from "uuid";

import useCalculateInterest from "../lib/Hooks/useCalculateInterest";
import { BiReset } from "react-icons/bi";
import { Select } from "@mantine/core";
import { UserContext } from "../lib/context";
import {
  doc,
  DocumentData,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, signInWithMagicLink } from "../lib/firebase";
import useGetSavedSettings from "../lib/Hooks/useGetSavedSettings";
import toast from "react-hot-toast";
import useWindowSize from "../lib/Hooks/useWindowSize";
import { isSignInWithEmailLink } from "firebase/auth";
import router from "next/router";
import DetailedIncome from "../components/DetailedIncome";
import DetailedFees from "../components/DetailedFees";
import DetailedNetWorth from "../components/DetailedNetWorth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Page({}) {
  //TODO: Why does the calculator break down when handling high negative values?
  //TODO: Allow people to delete an existing setting.
  //TODO: Allow people to delete their account and data.
  //TODO: Need Firestore access to reading users collection, everything else needs to check for user uid and only allow user to read or write.
  //TODO: Allow people to specify their own return as well.
  //TODO: Allow people to specify their monthly rate at different periods of time.
  //TODO: Detailed fees section
  //TODO: Make non intrusive visual elements with three.js i.e., blobs, waves, particles.
  //TODO: Ensure responsiveness esp on very small mobile screens and very large desktop screens.

  // * General
  // Placeholders for items
  // Button doesn't render on iPad and iPhone
  // Slider should be at 50% by default

  // * Mobile
  // space on top
  // button is too on the bottom
  // input zooms in, has to zoom out
  // button doesn't look right
  // save inputs locally in case people filled out and then tries to save but not logged in

  // * Desktop
  // space between tabs
  // tabs centered

  const { user } = useContext(UserContext);
  const size = useWindowSize();

  // checks to see if user record exists, otherwise uploads user details
  useEffect(() => {
    // if user is null, then return.
    if (!user) return;

    // Reference user doc
    const ref = doc(db, "users", `${user?.email}`);

    // Check if document exists and upload details if not
    const checkUserDetails = async () => {
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) return;

      await setDoc(ref, {
        uid: user.uid,
        email: user.email,
      });
    };
    checkUserDetails();
  }, [user]);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithMagicLink();
      router.push("/");
    }
  }, [user]);

  const settings = useGetSavedSettings();
  const [settingsNames, setSettingsNames] = useState<string[]>([]);

  // when settings change, it changes the state of the names so it can be populated in the dropdown
  useEffect(() => {
    if (!settings) return;
    let displaySettings: string[] = [];
    settings.map((setting) => {
      displaySettings.push(setting.name);
    });
    setSettingsNames(displaySettings);
  }, [settings]);

  const [hoverReset, setHoverReset] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<string | null>(null);
  const [savedSetting, setSavedSetting] = useState<DocumentData[] | null>();

  useEffect(() => {
    if (!settings) return;
    if (currentSetting) {
      setSavedSetting(
        settings.filter((setting) => setting.name === currentSetting)
      );
    } else {
      setSavedSetting(null);
    }
  }, [settings, currentSetting]);

  // Basic inputs
  const [years, setYears] = useState<string>("10");
  const [savingRate, setSavingRate] = useState<string>("100");
  const [initialInvestment, setInitialInvestment] = useState<string>("10000");

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
      tooltip: {
        callbacks: {
          title: function () {
            return "";
          },
        },
      },
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

  // Detailed inputs
  const [detailed, setDetailed] = useState(false);
  const [detailedIncome, setDetailedIncome] = useState(false);
  const [detailedNetWorth, setDetailedNetWorth] = useState(false);
  const [detailedFeeStructure, setDetailedFeeStructure] = useState(false);
  const initialState = [{ uid: uuidv4(), source: "", amount: "0" }];
  const [incomeSources, setIncomeSources] = useState(initialState);
  const [expenses, setExpenses] = useState(initialState);
  const [assets, setAssets] = useState(initialState);
  const [liabilities, setLiabilities] = useState(initialState);
  const [sliderValue, setSliderValue] = useState<number | undefined>(0);

  useEffect(() => {
    savedSetting?.map((setting) => {
      setYears(setting.years);
      setSavingRate(setting.savingRate);
      setInitialInvestment(setting.initialInvestment);
      setIncomeSources(setting.incomeSources);
      setExpenses(setting.expenses);
      setSliderValue(setting.sliderSavingRate);
      setAssets(setting.assets);
      setLiabilities(setting.liabilities);
    });
  }, [savedSetting]);

  return (
    <main className="px-4 text-white sm:px-8 md:px-12 lg:px-14 xl:px-28">
      <div className="h-15v">
        <h1 className="text-md pt-4 text-center lg:text-xl xl:text-2xl">
          Visualize your future wealth using the power of compound interest
        </h1>
        <h2 className="md:text-md mx-auto w-11/12 py-4 text-center text-xs tracking-wider opacity-50 sm:w-2/3 sm:text-sm xl:text-lg">
          &quot;Compound interest is the eight wonder of the world. He who
          understands it, earns it. He who doesn&apos;t, pays it.&quot; Albert
          Einstein
        </h2>
      </div>
      <div className="h-50v">
        <div className="flex items-center justify-end">
          <div className="relative mr-4">
            <BiReset
              onClick={() => {
                setYears("10");
                setSavingRate("100");
                setInitialInvestment("10000");
                setSliderValue(0);
                setDetailed(false);
                setDetailedIncome(false);
                setDetailedNetWorth(false);
                setDetailedFeeStructure(false);
                setIncomeSources(initialState);
                setExpenses(initialState);
                setAssets(initialState);
                setLiabilities(initialState);
              }}
              onMouseOver={() => setHoverReset(true)}
              onMouseOut={() => setHoverReset(false)}
              size="20"
              className="z-3 col-span-2 cursor-pointer text-white"
            />
            {hoverReset && (
              <div className="text-md absolute top-8 -left-5 flex items-center justify-center rounded-md bg-[#121826] px-3 py-2 font-semibold text-white">
                Reset
              </div>
            )}
          </div>
          <Select
            sx={{
              outline: "none",
              marginRight: 10,
              width: `${
                size.width ? (size.width < 375 ? "100px" : "150px") : "150px"
              }`,
            }}
            dropdownPosition="bottom"
            placeholder="Save your inputs"
            value={currentSetting}
            onChange={(e) => setCurrentSetting(e)}
            clearable
            nothingFound="No saved settings"
            searchable
            creatable
            maxDropdownHeight={200}
            getCreateLabel={(query) => `+ Create ${query}`}
            onCreate={async (query) => {
              if (!user) {
                toast.error("Please login to save your inputs!");
              } else {
                await setDoc(
                  doc(
                    db,
                    "users",
                    `${user?.email}`,
                    "settings",
                    `${query.replace(/\s/g, "-").toLowerCase()}`
                  ),
                  {
                    name: query,
                    years: years,
                    savingRate: savingRate,
                    initialInvestment: initialInvestment,
                    incomeSources: incomeSources,
                    expenses: expenses,
                    assets: assets,
                    liabilities: liabilities,
                    sliderSavingRate: sliderValue,
                  }
                );
              }
            }}
            data={settingsNames}
          />
          {currentSetting && (
            <button
              type="button"
              className="mx-[10px] rounded-md bg-[#5C43F5] px-2 py-1.5 text-xs hover:bg-[#705DF2] sm:px-3 sm:text-sm md:px-4"
              onClick={async () => {
                if (!user) {
                  toast.error("Please login to save your inputs!");
                } else {
                  await updateDoc(
                    doc(
                      db,
                      "users",
                      `${user?.email}`,
                      "settings",
                      `${currentSetting.replace(/\s/g, "-").toLowerCase()}`
                    ),
                    {
                      years: years,
                      savingRate: savingRate,
                      initialInvestment: initialInvestment,
                      incomeSources: incomeSources,
                      expenses: expenses,
                      sliderSavingRate: sliderValue,
                      assets: assets,
                      liabilities: liabilities,
                    }
                  ).then(() =>
                    toast.success("Your setting has successfully saved!")
                  );
                }
              }}
            >
              Save Inputs
            </button>
          )}
        </div>
        <Line data={data} options={options} />
      </div>
      <form className="h-15v relative mt-16 grid grid-cols-2 gap-x-8 gap-y-4 px-4 lg:px-20 xl:px-40">
        <div className="md:text-md relative col-span-2 flex items-center rounded-lg bg-[#48448061] p-4 text-sm  sm:col-span-1 xl:text-lg">
          <label htmlFor="initialInvestment" className="font-semibold">
            Initial Investment <span className="text-gray-500">*</span>
          </label>
          <input
            className="absolute inset-0 h-full w-full rounded-lg bg-transparent  pl-52 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl md:pl-60 xl:pl-80"
            type="number"
            name="initialInvestment"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
          />
        </div>
        <div className="md:text-md relative col-span-2 flex items-center rounded-lg bg-[#48448061] p-4 text-sm  sm:col-span-1 xl:text-lg">
          <label htmlFor="savingRate" className="font-semibold">
            Monthly Contribution <span className="text-gray-500">*</span>
          </label>
          <input
            className="absolute inset-0 h-full w-full rounded-lg bg-transparent pl-52 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl md:pl-60 xl:pl-80"
            type="number"
            name="savingRate"
            value={savingRate}
            disabled={detailedIncome}
            onChange={(e) => setSavingRate(e.target.value)}
          />
        </div>
        <div className="md:text-md relative col-span-2 flex items-center rounded-lg bg-[#48448061] p-4  text-sm sm:col-span-1 xl:text-lg">
          <label htmlFor="years" className="font-semibold">
            Length of Time in Years <span className="text-gray-500">*</span>
          </label>
          <input
            className="absolute inset-0 h-full w-full rounded-lg bg-transparent  pl-52 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl md:pl-60 xl:pl-80"
            type="number"
            name="years"
            value={years}
            onChange={(e) => setYears(e.target.value)}
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

      {detailed && (
        <div className="mt-28 grid grid-cols-2 px-4 sm:mt-12 lg:px-20 xl:px-40">
          <div className="col-span-2">
            <button
              onClick={() => setDetailedIncome(!detailedIncome)}
              className="my-8 w-full rounded-lg bg-[#6C62EA] px-4 py-2 hover:bg-[#7469EB] lg:w-1/2"
              type="button"
            >
              Specify your income, expenses, and saving rate
            </button>
          </div>
          {detailedIncome && (
            <DetailedIncome
              sliderValue={sliderValue}
              setSliderValue={setSliderValue}
              savingRate={savingRate}
              setSavingRate={setSavingRate}
              incomeSources={incomeSources}
              setIncomeSources={setIncomeSources}
              expenses={expenses}
              setExpenses={setExpenses}
            />
          )}
          <div className="col-span-2">
            <button
              onClick={() => setDetailedNetWorth(!detailedNetWorth)}
              className="col-span-1 mb-8 w-full rounded-lg bg-[#6C62EA] px-4 py-2 hover:bg-[#7469EB] lg:w-1/2"
              type="button"
            >
              Specify assets and liabilities
            </button>
            {detailedNetWorth && (
              <DetailedNetWorth
                assets={assets}
                setAssets={setAssets}
                liabilities={liabilities}
                setLiabilities={setLiabilities}
              />
            )}
          </div>
          {/* <div className="col-span-2">
            <button
              onClick={() => setDetailedFeeStructure(!detailedFeeStructure)}
              className="col-span-1 mb-8 w-full rounded-lg bg-[#6C62EA] px-4 py-2 hover:bg-[#7469EB] lg:w-1/2"
              type="button"
            >
              Explore how trading fees, management fees, and inflation impact
              your future wealth
            </button>
          </div>
          {detailedFeeStructure && <DetailedFees years={years} />} */}
        </div>
      )}
    </main>
  );
}
