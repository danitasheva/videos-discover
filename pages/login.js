import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Login.module.css";
import { magic } from "@/lib/magic-client";
import { Roboto_Slab } from "next/font/google";

const robotoSlab = Roboto_Slab({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});
export default function Login() {
  const [userMsg, setUserMsg] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleComplete = () => {
      setLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (email) {
      try {
        const didToken = await magic.auth.loginWithMagicLink({ email });

        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });

          const loggedInResponse = await response.json();

          if (loggedInResponse.done) {
            router.push("/");
          } else {
            setUserMsg("Something went wrong logging in");
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Something went wrong", err);
      }
    } else {
      setUserMsg("Please enter a valid email address");
      setLoading(false);
    }
  };

  const handleOnChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix logo"
                width={128}
                height={34}
              />
            </div>
          </Link>
        </div>
      </header>
      <main styles={styles.main} className={robotoSlab.className}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In </h1>
          <input
            className={styles.emailInput}
            type="text"
            placeholder="Email address"
            value={email}
            onChange={handleOnChange}
          />
          {userMsg ? <p className={styles.userMsg}>{userMsg}</p> : ""}
          <button className={styles.loginBtn} onClick={handleLoginWithEmail}>
            {loading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
}
