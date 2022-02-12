import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { BsMoonFill } from "react-icons/bs";
import { IoIosSunny } from "react-icons/io";

const Navigation = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [modal, setModal] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const renderThemeChanger = () => {
    if (!mounted) return null;
    const currentTheme = theme === "system" ? systemTheme : theme;
    if (currentTheme === "dark") {
      return (
        <>
          <div className="relative rounded-md px-2 py-2 hover:bg-[#394150]">
            <IoIosSunny
              className="h-7 w-7 text-[#9BA3AF]"
              role="button"
              onClick={() => setTheme("light")}
              onMouseOver={() => setModal("light")}
              onMouseOut={() => setModal("")}
            />
            {modal === "light" && (
              <div className="bg-pallet-300 text-pallet-100 text-md absolute top-14 -left-16 flex w-48 items-center justify-center rounded-md py-2 px-2 font-semibold">
                Toggle light mode
              </div>
            )}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="relative rounded-md px-2 py-2 hover:bg-[#F3F4F6]">
            <BsMoonFill
              className="h-6 w-6 text-[#6C727F]"
              role="button"
              onClick={() => setTheme("dark")}
              onMouseOver={() => setModal("dark")}
              onMouseOut={() => setModal("")}
            />
            {modal === "dark" && (
              <div className="text-md absolute top-14 -left-16 flex w-48 items-center justify-center rounded-md bg-[#121826] py-2 px-2 font-semibold text-white">
                Toggle dark mode
              </div>
            )}
          </div>
        </>
      );
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      {renderThemeChanger()}
    </div>
  );
};

export default Navigation;
