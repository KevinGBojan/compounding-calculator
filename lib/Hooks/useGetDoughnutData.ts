import { sourceType } from "../../components/DetailedIncome";

const useGetDoughnutData = (array: sourceType[]) => {
  const labels: string[] = [];
  const amounts: number[] = [];

  array?.map((stream) => labels.push(stream.source));
  array?.map((stream) => amounts.push(parseFloat(stream.amount)));

  return { labels, amounts };
};

export default useGetDoughnutData;
