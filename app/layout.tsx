import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { routing } from "@/i18n/routing";
import "./globals.css";

/**
 * Do not use getLocale() here — it pulls @formatjs into the root bundle and breaks
 * Next dev static-path workers (Cannot find module './vendor-chunks/@formatjs.js').
 * With localePrefix "never", use default; nested layouts still localize content.
 */
const HTML_LANG = routing.defaultLocale;

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://immifina.org"
  ),
  title: "ImmiFina — Your financial future, in plain language",
  description:
    "Understand your money and what to do next — for immigrants and first-generation Americans navigating the U.S. financial system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={HTML_LANG}>
      <body className={`${poppins.variable} min-h-screen font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
