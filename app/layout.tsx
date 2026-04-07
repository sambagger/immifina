import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { routing } from "@/i18n/routing";
import "./globals.css";

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

/** Headings & display — Playfair Display; body is Inter. */
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
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
  icons: { icon: "/brand-mark.png" },
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
      <body
        className={`${inter.variable} ${playfair.variable} min-h-screen font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
