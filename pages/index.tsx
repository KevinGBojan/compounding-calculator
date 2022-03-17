import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { BiReset } from "react-icons/bi";
import { Select } from "@mantine/core";
import { UserContext } from "../lib/context";
import {
  deleteDoc,
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
import DetailedNetWorth from "../components/DetailedNetWorth";
import { NextSeo } from "next-seo";
import { Checkbox } from "@mantine/core";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

//** Immediate To Dos */

// Contact details at the bottom
// SEO i.e., sitemap, robots.txt, alts on images/graphs
// https://github.com/garmeeh/next-seo

// General advice is to make it more playful, should be fun to play around.

// Colors are too similar for the pie charts. Better to have different colors at first and make
// the next ones similar shades.

// Formatting numbers with spaces? Helpful for larger numbers.

// Scroll to bottom
// Responsiveness and spacing

//** Immediate To Dos */

// Next feature: journey to financial independence i.e., show all these things across time
// Next feature: make more fun, playful

//TODO: Input validation
//TODO: Cannot get the "delete account" feature to work consistently
//TODO: Contact info and link to Github repo at the bottom
//TODO: Allow people to delete their account and data.
//TODO: Allow people to specify their own return as well.
//TODO: Allow people to specify their monthly rate at different periods of time.
//TODO: Make non intrusive visual elements with three.js i.e., blobs, waves, particles.
//TODO: Ensure responsiveness esp on very small mobile screens and very large desktop screens.

// * Mobile
// Button doesn't render on iPad and iPhone
// space on top
// Prevent automatic zoom on focus
// save inputs locally in case people filled out and then tries to save but not logged in

// * Desktop
// space between tabs
// tabs centered

// Save inputs if user is not logged in but tries to save inputs
// Populate with local storage if it exists.
// When user finally saves, remove items from local storage.

// Notification that appears, two actions: not now, login

//** Four Big Things Before Wrapping Up */

//TODO: Basic spacing and styling

export default function Page({}) {
  const { user } = useContext(UserContext);
  const size = useWindowSize();

  // checks to see if user record exists, otherwise uploads user details
  useEffect(() => {
    // if user is null, then return.
    if (!user?.displayName) return;

    // Reference user doc
    const ref = doc(db, "users", `${user?.email}`);

    // Check if document exists and upload details if not
    const checkUserDetails = async () => {
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) return;

      await setDoc(ref, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
    };
    checkUserDetails();
  }, [user]);

  // listens to magic link sign up
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      signInWithMagicLink();
      router.push("/");
    }
  }, [user]);

  const settings = useGetSavedSettings();
  const [settingsNames, setSettingsNames] = useState<string[]>([]);

  const [hoverReset, setHoverReset] = useState(false);
  const [currentSetting, setCurrentSetting] = useState<string | null>(null);
  const [savedSetting, setSavedSetting] = useState<DocumentData | null>();

  // when settings change, it changes the state of the names so it can be populated in the dropdown
  useEffect(() => {
    if (!settings) return;

    let displaySettings: string[] = [];
    settings.map((setting) => {
      displaySettings.push(setting.name);
    });
    setSettingsNames(displaySettings);
  }, [settings]);

  useEffect(() => {
    if (!settings) return;
    if (currentSetting) {
      setSavedSetting(
        settings.filter((setting) => setting.name === currentSetting)[0]
      );
    } else {
      setSavedSetting(null);
    }
  }, [settings, currentSetting]);

  // Basic inputs
  const [years, setYears] = useState<string>("10");
  const [savingRate, setSavingRate] = useState<string>("100");
  const [initialInvestment, setInitialInvestment] = useState<string>("10000");
  const [customReturn, setCustomReturn] = useState<string>("0");

  const checkedInitialValues = {
    "6%": true,
    "8%": true,
    "10%": true,
    "12%": true,
    "15%": true,
    "20%": true,
    "26%": true,
    custom: false,
  };

  const [checked, setChecked] = useState(checkedInitialValues);

  const { totals, labels } = useMemo(
    () => calculateInterest(years, savingRate, initialInvestment, customReturn),
    [years, savingRate, initialInvestment, customReturn]
  );

  const [chartData, setChartData] = useState([
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
  ]);

  useEffect(() => {
    const arrayOfData = [
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
      {
        label: `${customReturn}%`,
        data: totals,
        backgroundColor: "#c000fa",
        borderColor: "#c000fa",
        parsing: {
          xAxisKey: "year",
          yAxisKey: "totals.custom",
        },
      },
    ];

    const filteredArrayOfData = arrayOfData.filter((object, index) => {
      const label = object.label;
      if (index < 7) {
        return (checked as any)[label];
      } else {
        return parseFloat(customReturn) > 0 && checked["custom"];
      }
    });

    setChartData(filteredArrayOfData);
  }, [totals, checked, customReturn]);

  const data = {
    labels,
    datasets: chartData,
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
        display: false,
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
  const initialState = [{ uid: uuidv4(), source: "", amount: "0" }];
  const [incomeSources, setIncomeSources] = useState(initialState);
  const [expenses, setExpenses] = useState(initialState);
  const [assets, setAssets] = useState(initialState);
  const [liabilities, setLiabilities] = useState(initialState);
  const [sliderValue, setSliderValue] = useState<number | undefined>(50);

  useEffect(() => {
    if (!savedSetting) return;
    setYears(savedSetting.years);
    setSavingRate(savedSetting.savingRate);
    setInitialInvestment(savedSetting.initialInvestment);
    setIncomeSources(savedSetting.incomeSources);
    setExpenses(savedSetting.expenses);
    setSliderValue(savedSetting.sliderSavingRate);
    setAssets(savedSetting.assets);
    setLiabilities(savedSetting.liabilities);
    setCustomReturn(savedSetting.customReturn);
    setChecked(savedSetting.checked);
  }, [savedSetting]);

  useEffect(() => {
    const settingString: string | null = localStorage.getItem("inputs");
    if (!settingString) return;
    const settingJson = JSON.parse(settingString);

    if (!user) {
      setYears(settingJson.years);
      setSavingRate(settingJson.savingRate);
      setInitialInvestment(settingJson.initialInvestment);
      setIncomeSources(settingJson.incomeSources);
      setExpenses(settingJson.expenses);
      setSliderValue(settingJson.sliderSavingRate);
      setAssets(settingJson.assets);
      setLiabilities(settingJson.liabilities);
      setChecked(settingJson.checked);
      setCustomReturn(settingJson.customReturn);
    } else {
      const slug = settingJson.name.replace(/\s/g, "-").toLowerCase();

      setDoc(doc(db, "users", `${user?.email}`, "settings", `${slug}`), {
        name: settingJson.name,
        years: settingJson.years,
        savingRate: settingJson.savingRate,
        initialInvestment: settingJson.initialInvestment,
        incomeSources: settingJson.incomeSources,
        expenses: settingJson.expenses,
        assets: settingJson.assets,
        liabilities: settingJson.liabilities,
        sliderSavingRate: settingJson.sliderSavingRate,
        checked: settingJson.checked,
        customReturn: settingJson.customReturn,
      })
        .then(() => localStorage.removeItem("inputs"))
        .then(() => setCurrentSetting(settingJson.name))
        .then(() =>
          toast.success("Saved and loaded your session from local storage!")
        );
    }
  }, [user]);

  useEffect(() => {
    if (!detailed) return;
    window.scrollTo(0, document.body.offsetHeight);
  }, [detailed, detailedIncome, detailedNetWorth]);

  return (
    <>
      <NextSeo title="Compounding calculator - visualize your wealth and plan your finances." />
      <main className="px-4 text-white sm:px-8 md:px-12 lg:px-14 xl:px-28">
        <div className="">
          <h1
            className="text-md pt-4 text-center lg:text-xl xl:text-2xl"
            onClick={() =>
              setChartData(chartData.filter((chart) => chart.label !== "26%"))
            }
          >
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
                  setIncomeSources(initialState);
                  setExpenses(initialState);
                  setAssets(initialState);
                  setLiabilities(initialState);
                  setChecked(checkedInitialValues);
                  setCurrentSetting(null);
                  setCustomReturn("0");
                }}
                onMouseOver={() => setHoverReset(true)}
                onMouseOut={() => setHoverReset(false)}
                size="20"
                className="z-3 col-span-2 cursor-pointer text-white"
              />
              <div
                className={`text-md ${
                  hoverReset ? "absolute hidden md:flex" : "hidden"
                } top-8 -left-5 items-center justify-center rounded-md bg-[#3A4374] px-3 py-2 font-semibold text-white duration-300 ease-in-out`}
              >
                Reset
              </div>
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
                const slug = query.replace(/\s/g, "-").toLowerCase();

                const inputs = {
                  name: query,
                  years: years,
                  savingRate: savingRate,
                  initialInvestment: initialInvestment,
                  incomeSources: incomeSources,
                  expenses: expenses,
                  assets: assets,
                  liabilities: liabilities,
                  sliderSavingRate: sliderValue,
                  checked: checked,
                  customReturn: customReturn,
                };

                if (!user) {
                  setCurrentSetting(null);
                  localStorage.setItem("inputs", JSON.stringify(inputs));
                  toast.custom(
                    <div className="flex w-[300px] flex-col rounded-lg bg-[#3A4374] px-6 py-4 text-white">
                      <span className="mb-4 text-justify">
                        Your inputs are saved in your browser&apos;s local
                        storage. Login to save your inputs and take full
                        advantage of the app!
                      </span>
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => toast.remove()}
                          className="mr-5 w-full rounded-lg border-2 border-solid border-red-600 bg-transparent px-5 py-2 font-semibold text-white duration-300 ease-in-out hover:bg-red-600"
                        >
                          Not Now
                        </button>
                        <Link href="/login">
                          <a
                            onClick={() => toast.remove()}
                            className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-[#5C43F5] px-5 py-2 font-semibold text-white duration-300 ease-in-out hover:bg-[#705DF2]"
                          >
                            Log In
                          </a>
                        </Link>
                      </div>
                    </div>
                  );
                } else {
                  await setDoc(
                    doc(db, "users", `${user?.email}`, "settings", `${slug}`),
                    inputs
                  );
                  toast.success("Your inputs got saved!");
                }
              }}
              data={settingsNames}
            />
            {currentSetting && (
              <>
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
                          checked: checked,
                          customReturn: customReturn,
                        }
                      ).then(() => toast.success("Your inputs got saved!"));
                    }
                  }}
                >
                  Save Inputs
                </button>
                <button
                  type="button"
                  className="mx-[10px] rounded-md bg-red-500 px-2 py-1.5 text-xs hover:bg-red-500/80 sm:px-3 sm:text-sm md:px-4"
                  onClick={async () => {
                    if (!user) {
                      toast.error("Please login to save your inputs!");
                    } else {
                      await deleteDoc(
                        doc(
                          db,
                          "users",
                          `${user?.email}`,
                          "settings",
                          `${currentSetting.replace(/\s/g, "-").toLowerCase()}`
                        )
                      )
                        .then(() =>
                          toast.success(
                            `${currentSetting} has been successfully deleted!`
                          )
                        )
                        .then(() => setCurrentSetting(null));
                    }
                  }}
                >
                  Delete Setting
                </button>
              </>
            )}
          </div>
          <Line data={data} options={options} />
        </div>
        <form
          className={`relative mt-16 ${
            !detailed && "mb-60"
          } grid grid-cols-2 gap-x-8 gap-y-4 px-4 sm:mb-0 lg:px-20 xl:px-40`}
        >
          {/* [f6c9de, eeabca, c888a6, ca6e99, c3447f, c2266f, aa0753, c000fa] */}
          <div className="mdlg:w-full xssm:w-[400px] col-span-2 mx-auto flex w-[260px] flex-wrap items-center justify-between rounded-md py-5 text-white backdrop-blur-2xl">
            <div className="flex w-[75px] py-1.5 px-2">
              <Checkbox
                color="violet"
                radius="xl"
                size="md"
                checked={checked["6%"]}
                onChange={(event) =>
                  setChecked({ ...checked, "6%": event.currentTarget.checked })
                }
              />
              <span className="ml-3">6%</span>
            </div>
            <div className="flex w-[75px] py-1.5 px-2">
              <Checkbox
                color="violet"
                radius="xl"
                size="md"
                checked={checked["8%"]}
                onChange={(event) =>
                  setChecked({ ...checked, "8%": event.currentTarget.checked })
                }
              />
              <span className="ml-3">8%</span>
            </div>

            <div className="flex w-[75px] py-1.5 px-2">
              <Checkbox
                color="violet"
                radius="xl"
                size="md"
                checked={checked["10%"]}
                onChange={(event) =>
                  setChecked({ ...checked, "10%": event.currentTarget.checked })
                }
              />
              <span className="ml-3">10%</span>
            </div>

            <div className="flex w-[75px] py-1.5 px-2">
              <Checkbox
                color="violet"
                radius="xl"
                size="md"
                checked={checked["12%"]}
                onChange={(event) =>
                  setChecked({ ...checked, "12%": event.currentTarget.checked })
                }
              />
              <span className="ml-3">12%</span>
            </div>

            <div className="flex w-[75px] py-1.5 px-2">
              <Checkbox
                color="violet"
                radius="xl"
                size="md"
                checked={checked["15%"]}
                onChange={(event) =>
                  setChecked({ ...checked, "15%": event.currentTarget.checked })
                }
              />
              <span className="ml-3">15%</span>
            </div>
            <div className="flex w-[75px] py-1.5 px-2">
              <Checkbox
                color="violet"
                radius="xl"
                size="md"
                checked={checked["20%"]}
                onChange={(event) =>
                  setChecked({ ...checked, "20%": event.currentTarget.checked })
                }
              />
              <span className="ml-3">20%</span>
            </div>
            <div className="flex w-[75px] py-1.5 px-2">
              <Checkbox
                color="violet"
                radius="xl"
                size="md"
                checked={checked["26%"]}
                onChange={(event) =>
                  setChecked({ ...checked, "26%": event.currentTarget.checked })
                }
              />
              <span className="ml-3">26%</span>
            </div>

            <div className="my-2 ml-2 flex w-[170px] items-center rounded-md bg-[#48448061] px-3 py-1.5">
              <Checkbox
                color="violet"
                radius="xl"
                size="md"
                checked={checked.custom}
                onChange={(event) =>
                  setChecked({
                    ...checked,
                    custom: event.currentTarget.checked,
                  })
                }
                className="mr-3"
              />
              <span>Custom</span>
              <input
                value={customReturn}
                onChange={(e) => setCustomReturn(e.target.value)}
                type="number"
                className="ml-3 overflow-x-auto bg-transparent px-0.5 outline-none"
              />
              <span>%</span>
            </div>
          </div>
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
              disabled={detailedIncome && detailed}
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
          <div className="grid grid-cols-2 px-4 lg:px-20 xl:px-40">
            <div className="col-span-2 flex items-center justify-center">
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
              <div className="col-span-2 flex items-center justify-center">
                <button
                  onClick={() => setDetailedNetWorth(!detailedNetWorth)}
                  className="col-span-1 mb-8 w-full rounded-lg bg-[#6C62EA] px-4 py-2 hover:bg-[#7469EB] lg:w-1/2"
                  type="button"
                >
                  Specify assets and liabilities
                </button>
              </div>
              {detailedNetWorth && (
                <DetailedNetWorth
                  assets={assets}
                  setAssets={setAssets}
                  liabilities={liabilities}
                  setLiabilities={setLiabilities}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export const calculateInterest = (
  years: string,
  savingRate: string,
  initialInvestment: string,
  customReturn: string
) => {
  // if (!years || !savingRate || !initialInvestment) return;
  const totals = [];
  const labels = [];

  const parsedCustomReturn = parseFloat(customReturn);
  const parsedYears = parseFloat(years);
  const parsedSavingRate = savingRate ? parseFloat(savingRate) : 0;
  const parsedInitialInvestment = parseFloat(initialInvestment);

  const calculateTotal = (
    years: number,
    savingRate: number,
    initialInvestment: number,
    annualRate: number
  ) => {
    // Value of the initial investment compounded to the present
    const initialInvestmentValue =
      initialInvestment * (1 + annualRate) ** years;

    // Annual rate to monthly rate R = (1+r)^(1/12)
    const monthlyRate = (1 + annualRate) ** (1 / 12) - 1;

    // Value of the monthly investments, annuity formula: coupon * ((1 + r)^n -1)/r
    const savingsValue =
      (savingRate * ((1 + monthlyRate) ** (years * 12) - 1)) / monthlyRate;

    const total = Math.round(initialInvestmentValue + savingsValue);

    return total;
  };

  for (let i = 1; i < parsedYears + 1; i++) {
    const annual6 = calculateTotal(
      i,
      parsedSavingRate,
      parsedInitialInvestment,
      0.06
    );
    const annual8 = calculateTotal(
      i,
      parsedSavingRate,
      parsedInitialInvestment,
      0.08
    );
    const annual10 = calculateTotal(
      i,
      parsedSavingRate,
      parsedInitialInvestment,
      0.1
    );
    const annual12 = calculateTotal(
      i,
      parsedSavingRate,
      parsedInitialInvestment,
      0.12
    );
    const annual15 = calculateTotal(
      i,
      parsedSavingRate,
      parsedInitialInvestment,
      0.15
    );
    const annual20 = calculateTotal(
      i,
      parsedSavingRate,
      parsedInitialInvestment,
      0.2
    );
    const annual26 = calculateTotal(
      i,
      parsedSavingRate,
      parsedInitialInvestment,
      0.26
    );
    const annualCustom = calculateTotal(
      i,
      parsedSavingRate,
      parsedInitialInvestment,
      parsedCustomReturn / 100
    );

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
        custom: annualCustom,
      },
    });
    labels.push(i);
  }

  return { totals, labels };
};
