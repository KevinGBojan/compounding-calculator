import { Tooltip } from "@mantine/core";
import React from "react";
import { AiFillPlusCircle } from "react-icons/ai";

const AddItem = ({ text, addItem }: { text: string; addItem: () => void }) => (
  <Tooltip
    color="violet"
    label={text}
    transition="rotate-right"
    transitionDuration={300}
    transitionTimingFunction="ease"
  >
    <AiFillPlusCircle
      size="32"
      className="cursor-pointer text-[#5C43F5] hover:text-[#705DF2]"
      type="button"
      onClick={() => addItem()}
    />
  </Tooltip>
);

export default AddItem;
