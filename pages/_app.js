import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { magic } from "@/lib/magic-client";
import { useRouter } from "next/router";
import Loading from "@/components/loading/loading";
import { Roboto_Slab } from "next/font/google";

const robotoSlab = Roboto_Slab({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});

export default function App({ Component, pageProps }) {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleLoggedIn = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        router.push("/");
      } else {
        router.push("/login");
      }
    };
    handleLoggedIn();
  }, []);

  useEffect(() => {
    // console.log({ router });
    const handleComplete = () => {
      setLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events?.off("routeChangeComplete", handleComplete);
      router.events?.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return loading ? (
    <Loading />
  ) : (
    <Component {...pageProps} className={robotoSlab.className} />
  );
  // return <Component {...pageProps} />;
}
