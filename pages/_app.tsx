import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navigation from "../components/Navigation";

// Notifications
import { Toaster } from "react-hot-toast";

// Auth
import { UserContext } from "../lib/context";
import useGetUser from "../lib/Hooks/useGetUser";

// SEO
import { SocialProfileJsonLd, WebPageJsonLd } from "next-seo";

function MyApp({ Component, pageProps }: AppProps) {
  const user = useGetUser();

  return (
    <UserContext.Provider value={user}>
      <Navigation />
      <Component {...pageProps} />
      <SocialProfileJsonLd
        type="Person"
        name="Kevin George Bojan"
        url="https://www.azurecapital.io/"
        sameAs={[
          "https://nl.linkedin.com/in/kevingbojan",
          "https://twitter.com/bojankevin",
        ]}
      />
      <WebPageJsonLd
        description="Visualize your wealth and plan your finances - all in one place."
        id="https://www.compoundingcalculator.net/#website"
      />
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
