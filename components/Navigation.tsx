import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { BsPerson } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { motion, AnimateSharedLayout } from "framer-motion";

const Navigation = () => {
  const { user } = useContext(UserContext);

  const [hovered, setHovered] = useState(false);

  return (
    <div className="mr-[10px] flex h-10v items-center justify-end px-4 text-white sm:px-8 md:px-8 lg:px-20 xl:px-28">
      {user ? (
        <>
          <motion.button
            // layoutId="hover"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            type="button"
            className="flex items-center justify-center rounded-md bg-[#27272769] px-5 py-3 backdrop-blur-2xl"
          >
            <BsPerson size="24" />
            <span className="ml-3 mr-8">{user.displayName}</span>
            <IoIosArrowDown size="18" />
          </motion.button>
        </>
      ) : (
        <Link href="/login">
          <button
            type="button"
            className="rounded-lg bg-[#5C43F5] px-5 py-3 font-semibold text-white hover:bg-[#705DF2]"
          >
            Log In
          </button>
        </Link>
      )}
    </div>
  );
};

export default Navigation;
