import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ImmiFina — Your financial future, in plain language",
  description:
    "Forward-looking financial guidance for immigrants and first-generation Americans.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${poppins.variable} min-h-screen font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
