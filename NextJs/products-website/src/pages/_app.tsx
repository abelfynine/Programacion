import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head"; // Importa Head
import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Configuración de la fuente Inter desde Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} font-sans antialiased overflow-x-hidden`}>
      <Head>
        {/* Metadatos globales del sitio */}
        <title>Products Website</title>
        <meta name="description" content="Products Website" />
      </Head>
      {/* Barra de navegación global */}
      <Navbar />
      {/* Contenido de cada página */}
      <Component {...pageProps} />
      {/* Footer global */}
      <Footer />
    </div>
  )
}
