import { ChangeEvent } from "react";
import { BsTrash } from "react-icons/bs";
import { sourceType } from "./DetailedIncome";

const Item = ({
  item,
  itemChangeHandler,
  deleteItem,
  sources,
}: {
  item: { uid: string; source: string; amount: string };
  itemChangeHandler: (e: ChangeEvent<HTMLInputElement>, uid: string) => void;
  deleteItem: (uid: string) => void;
  sources: sourceType[];
}) => {
  const index = sources.map((income) => income.uid).indexOf(item.uid);

  return (
    <div className="grid-cols-20 mb-4 grid gap-x-2 md:gap-x-4">
      {index < 1 && (
        <>
          <div className="text-md col-span-8 xl:text-lg">Source</div>
          <div className="text-md col-span-8 xl:text-lg">Amount</div>
        </>
      )}

      <div className="relative col-span-8 flex items-center rounded-lg bg-[#48448061] px-2 py-6">
        <input
          className="absolute inset-0 h-full w-full rounded-lg bg-transparent pl-8 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl md:pl-12"
          type="text"
          name="source"
          value={item.source}
          onChange={(e) => itemChangeHandler(e, item.uid)}
        />
      </div>
      <div className="relative col-span-8 flex items-center rounded-lg bg-[#48448061] p-4">
        <input
          className="absolute inset-0 h-full w-full rounded-lg bg-transparent pl-8 pr-4 outline-none focus:border-2 focus:border-solid focus:border-[#847ed6] focus:shadow-2xl md:pl-12"
          name="amount"
          type="number"
          value={item.amount}
          min={0}
          onChange={(e) => itemChangeHandler(e, item.uid)}
        />
      </div>
      <div className="col-span-4 flex items-center justify-center">
        {index > 0 && (
          <BsTrash
            size="16"
            className="cursor-pointer text-white"
            onClick={() => deleteItem(item.uid)}
          />
        )}
      </div>
    </div>
  );
};

export default Item;
