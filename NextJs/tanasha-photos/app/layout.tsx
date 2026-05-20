import "./globals.css";
import { Inter, Cormorant_Garamond } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: {
    default: "Tanasha | Photos",
    template: "%s | Tanasha Photos",
  },
  description: "Portafolio de fotografía de Tania Espino",

  // OPEN GRAPH (Facebook, WhatsApp, LinkedIn)
  openGraph: {
    title: "Tanasha | Photos",
    description: "Portafolio de fotografía artística en Torreón Coahuila",
    url: "https://tanashaphotos.github.io/ws-photography/",
    siteName: "Tanasha Photos",
    images: [
      {
        url: "https://tanashaphotos.github.io/ws-photography/images/preview.png",
        width: 1200,
        height: 630,
        alt: "Tanasha Photos",
      },
    ],
    locale: "es_MX",
    type: "website",
  },

  // Twitter (X)
  twitter: {
    card: "summary_large_image",
    title: "Tanasha | Photos",
    description: "Portafolio de fotografía artística en Torreón Coahuila",
    images: ["https://tanashaphotos.github.io/ws-photography/images/preview.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
