import type { Metadata } from "next";
import { Inter, Archivo_Black } from "next/font/google";
import { routing } from "@/i18n/routing";
import { ChunkErrorRecovery } from "@/components/ChunkErrorRecovery";
import "../css/globals.css";

/**
 * Do not use getLocale() here — it pulls @formatjs into the root bundle and breaks
 * Next dev static-path workers (Cannot find module './vendor-chunks/@formatjs.js').
 * With localePrefix "never", use default; nested layouts still localize content.
 */
const HTML_LANG = routing.defaultLocale;

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/** Headings & display — Archivo Black. */
const archivoBlack = Archivo_Black({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo-black",
  display: "swap",
  weight: ["400"],
});

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://immifina.org").replace(
  /\/$/,
  ""
);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ImmiFina — Your financial future, in plain language",
  description:
    "Understand your money and what to do next — for immigrants and first-generation Americans navigating the U.S. financial system.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ImmiFina",
    title: "ImmiFina — Your financial future, in plain language",
    description:
      "Understand your money and what to do next — for immigrants and first-generation Americans navigating the U.S. financial system.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={HTML_LANG}>
      <head>
        {process.env.NEXT_PUBLIC_CF_BEACON_TOKEN ? (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token":"${process.env.NEXT_PUBLIC_CF_BEACON_TOKEN}"}`}
          />
        ) : null}
      </head>
      <body
        className={`${inter.variable} ${archivoBlack.variable} min-h-screen font-sans antialiased`}
      >
        <ChunkErrorRecovery />
        {children}
      </body>
    </html>
  );
}
