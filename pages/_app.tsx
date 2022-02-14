import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navigation from "../components/Navigation";

// Notifications
import { Toaster } from "react-hot-toast";

// Auth
import { UserContext } from "../lib/context";
import useGetUser from "../lib/Hooks/useGetUser";

function MyApp({ Component, pageProps }: AppProps) {
  const user = useGetUser();

  return (
    <UserContext.Provider value={user}>
      <Navigation />
      <Component {...pageProps} />
      <Toaster
        toastOptions={{
          style: {
            background: "#3A4374",
            color: "white",
          },
        }}
      />
    </UserContext.Provider>
  );
}

export default MyApp;
