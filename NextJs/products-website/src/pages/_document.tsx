import { Html, Head, Main, NextScript } from "next/document";
import { BASE_PATH } from "@/lib/basePath";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Favicon */}
        <link rel="icon" href={`${BASE_PATH}/favicon.ico`} />
      </Head>
      <body className="antialiased" style={{ backgroundColor: "#C8C9CA" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
