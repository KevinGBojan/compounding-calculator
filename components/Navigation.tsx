import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { BsPerson } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { motion, AnimateSharedLayout } from "framer-motion";
import router from "next/router";

const Navigation = () => {
  const { user } = useContext(UserContext);

  const [hovered, setHovered] = useState(false);

  //TODO: Use Link instead of router
  // <Link> will create a <a> tag, which means your links will be detected when crawlers scrape your site.

  return (
    <div className="h-10v mr-[10px] flex items-center justify-end px-4 text-white sm:px-8 md:px-8 lg:px-20 xl:px-28">
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
        <button
          onClick={() => router.push("/login")}
          type="button"
          className="rounded-lg bg-[#5C43F5] px-5 py-3 font-semibold text-white hover:bg-[#705DF2]"
        >
          Log In
        </button>
      )}
    </div>
  );
};

export default Navigation;
