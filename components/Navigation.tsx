import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { BsPerson } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";
import useWindowSize from "../lib/Hooks/useWindowSize";
import { Menu } from "@mantine/core";
import { signOut } from "@firebase/auth";
import { auth } from "../lib/firebase";
import { MdLogout } from "react-icons/md";
import toast from "react-hot-toast";
import useGetUserInfo from "../lib/Hooks/useGetUserInfo";

const Navigation = () => {
  const { user } = useContext(UserContext);
  const userInfo = useGetUserInfo(user?.email);
  const size = useWindowSize();

  return (
    <div className="h-8v mr-[10px] flex items-center justify-end px-4 text-white sm:px-8 md:px-8 lg:px-20 xl:px-28">
      {userInfo ? (
        <>
          <Menu
            transition="scale-y"
            transitionDuration={250}
            transitionTimingFunction="ease"
            control={
              <button
                type="button"
                className="flex items-center justify-center rounded-md bg-[#5b43f5c5] px-5 py-2 backdrop-blur-2xl md:mr-4 lg:-mr-6 xl:mr-0"
              >
                <BsPerson size="24" className="mr-7 md:mr-0" />
                <span className="sm:text-md ml-3 mr-8 hidden text-sm md:block">
                  {userInfo.displayName}
                </span>
                <IoIosArrowDown size="18" />
              </button>
            }
            styles={{
              body: {
                backgroundColor: "#5044B9",
                border: "none",
                width: "inherit",
              },
              item: { color: "#fff" },
              label: { color: "#fff" },
              itemHovered: {
                color: "#ccc",
              },
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
            {/* <Menu.Item icon={<BsTrash />} onClick={() => setOpen(true)}>
              Delete my account
            </Menu.Item> */}
          </Menu>
          {/* <Modal
            styles={{
              modal: { backgroundColor: "#302d55" },
              close: { color: "#000000" },
            }}
            opened={open}
            onClose={() => setOpen(false)}
          >
            <div className="flex flex-col items-center justify-center">
              <h1 className="mb-6 text-white">
                Are you sure you want to delete your account?
              </h1>
              <button
                className="rounded-md bg-red-500 px-5 py-3 text-white"
                type="button"
                onClick={() =>
                  deleteDoc(doc(db, "users", `${user.email}`))
                    .then(() => deleteUser(auth.currentUser as User))
                    .then(() => setOpen(false))
                    .then(() =>
                      toast.success(
                        "Your account has been successfully deleted!"
                      )
                    )
                }
              >
                Delete Account
              </button>
            </div>
          </Modal> */}
        </>
      ) : (
        <Link href="/login" passHref>
          <a className="cursor-pointer rounded-lg bg-[#5C43F5] px-5 py-2 font-semibold text-white hover:bg-[#705DF2]">
            Log In
          </a>
        </Link>
      )}
    </div>
  );
};

export default Navigation;
