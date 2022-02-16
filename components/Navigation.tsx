import { useContext } from "react";
import { UserContext } from "../lib/context";
import { BsPerson } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import useWindowSize from "../lib/Hooks/useWindowSize";
import { Menu } from "@mantine/core";
import { deleteUser, signOut } from "@firebase/auth";
import { auth, db } from "../lib/firebase";
import { MdLogout } from "react-icons/md";
import { BsTrash } from "react-icons/bs";
import toast from "react-hot-toast";
import { User } from "firebase/auth";
import { deleteDoc } from "@firebase/firestore";
import { doc } from "firebase/firestore";

const Navigation = () => {
  const { user } = useContext(UserContext);
  const size = useWindowSize();

  return (
    <div className="h-8v mr-[10px] flex items-center justify-end px-4 text-white sm:px-8 md:px-8 lg:px-20 xl:px-28">
      {user ? (
        <Menu
          transition="scale-y"
          transitionDuration={250}
          transitionTimingFunction="ease"
          control={
            <button
              type="button"
              className="flex items-center justify-center rounded-md bg-[#5b43f5c5] px-4 py-2 backdrop-blur-2xl"
            >
              <BsPerson
                size={`${size.width ? (size.width < 375 ? "16" : "24") : "24"}`}
              />
              <span className="sm:text-md ml-3 mr-8 text-sm">
                {user.displayName}
              </span>
              <IoIosArrowDown
                size={`${size.width ? (size.width < 375 ? "12" : "18") : "18"}`}
              />
            </button>
          }
          styles={{
            body: { backgroundColor: "#484480", border: "none" },
            item: { color: "#fff" },
            itemHovered: { color: "#ccc" },
          }}
        >
          <Menu.Item
            icon={<MdLogout />}
            onClick={() =>
              signOut(auth).then(() =>
                toast.success("You have successfully been signed out!")
              )
            }
          >
            Logout
          </Menu.Item>
          <Menu.Item
            icon={<BsTrash />}
            onClick={() =>
              deleteDoc(doc(db, "users", `${user.email}`))
                .then(() => deleteUser(auth.currentUser as User))
                .then(() =>
                  toast.success("Your account has been successfully deleted!")
                )
            }
          >
            Delete my account
          </Menu.Item>
        </Menu>
      ) : (
        <Link href="/login" passHref>
          <a className="cursor-pointer rounded-lg bg-[#5C43F5] px-4 py-2 font-semibold text-white hover:bg-[#705DF2]">
            Log In
          </a>
        </Link>
      )}
    </div>
  );
};

export default Navigation;
