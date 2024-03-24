import { Html, Head, Main, NextScript } from "next/document";
// import { Roboto_Slab } from "next/font/google";

export default function Document() {
  // const robotoSlab = Roboto_Slab({
  //   display: "swap",
  //   subsets: ["latin"],
  //   weight: ["400", "500", "600", "700"],
  //   variable: "--font-roboto",
  // });
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
