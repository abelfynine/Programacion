import { Html, Head, Main, NextScript } from "next/document";
import { BASE_PATH } from "@/lib/basePath";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Favicon */}
        <link rel="icon" href={`${BASE_PATH}/favicon.ico`} />
        <link rel="shortcut icon" href={`${BASE_PATH}/favicon.ico`} />
        <link rel="apple-touch-icon" href={`${BASE_PATH}/favicon.ico`} />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}