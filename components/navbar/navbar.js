import { useState, useEffect } from "react";
import styles from "./navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { magic } from "@/lib/magic-client";
import logout from "@/pages/api/logout";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const [didToken, setDidToken] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  const getUserData = async () => {
    try {
      const { email, publicAddress } = await magic.user.getMetadata();
      const didToken = await magic.user.getIdToken();
      console.log({ didToken });
      if (email) {
        console.log({ email, publicAddress });
        setUsername(email);
        setDidToken(didToken);
      }
    } catch (err) {
      console.error("Error getting email", err);
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      // await magic.user.logout();
      // console.log("isLoggedIn:", await magic.user.isLoggedIn()); // => `false`
      // router.push("/login");

      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
    } catch (err) {
      console.error("Error logging out", err);
      router.push("/login");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.logoWrapper}>
          <Link className={styles.logoLink} href="/">
            {" "}
            <Image
              src="/static/netflix.svg"
              alt="logo"
              width={128}
              height={30}
            />
          </Link>
        </div>
        <ul className={styles.navItems}>
          <li
            className={styles.navItem}
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
          >
            Home
          </li>
          <li
            className={styles.navItem}
            onClick={(e) => {
              e.preventDefault();
              router.push("/browse/my-list");
            }}
          >
            My list
          </li>
        </ul>

        <nav className={styles.navContainer}>
          <div>
            <button
              className={styles.usernameBtn}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <p className={styles.username}>{username}</p>
              <Image
                src={
                  showDropdown
                    ? "/static/expand_less_white.svg"
                    : "/static/expand_more_white.svg"
                }
                alt="expand dropdown icon"
                width={32}
                height={36}
              />
            </button>
            {showDropdown && (
              <div className={styles.navDropdown}>
                <div onClick={handleSignOut}>
                  <Link href="/login" className={styles.linkName}>
                    Sign Out
                  </Link>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
