import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head/>
      {/* <Head>
        use react helmet to fix it 
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Serif:wght@200;300&display=swap"
          rel="stylesheet"
        />
      </Head> */}
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
