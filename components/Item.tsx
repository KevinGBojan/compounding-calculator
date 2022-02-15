import { ChangeEvent } from "react";
import { BsTrash } from "react-icons/bs";

const Item = ({
  item,
  itemChangeHandler,
  deleteItem,
}: {
  item: { uid: string; source: string; amount: number };
  itemChangeHandler: (e: ChangeEvent<HTMLInputElement>, uid: string) => void;
  deleteItem: (uid: string) => void;
}) => {
  return (
    <div className="mb-4 grid grid-cols-7 gap-x-12">
      <div className="relative col-span-3 flex items-center rounded-lg bg-[#1A1A1A] p-4">
        <label htmlFor="source">Source:</label>
        <input
          className="absolute inset-0 col-span-3 rounded-lg bg-transparent pl-40 pr-4 outline-1 outline-[#6C62EA]"
          name="source"
          value={item.source}
          onChange={(e) => itemChangeHandler(e, item.uid)}
        />
      </div>
      <div className="relative col-span-3 flex items-center rounded-lg bg-[#1A1A1A] p-4">
        <label htmlFor="amount">Amount:</label>
        <input
          className="absolute inset-0 col-span-3 rounded-lg bg-transparent pl-40 pr-4 outline-1 outline-[#6C62EA]"
          name="amount"
          value={item.amount}
          onChange={(e) => itemChangeHandler(e, item.uid)}
        />
      </div>
      <div className="flex items-center justify-center">
        <BsTrash
          size="16"
          className="col-span-1 cursor-pointer text-white"
          onClick={() => deleteItem(item.uid)}
        />
      </div>
    </div>
  );
};

export default Item;
