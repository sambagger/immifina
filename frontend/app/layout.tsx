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
  title: {
    default: "ImmiFina — Financial guidance for immigrants in the U.S.",
    template: "%s | ImmiFina",
  },
  description:
    "Free financial guidance for immigrants and first-generation Americans. Learn how to build credit without an SSN, open a bank account with an ITIN, file taxes for free, and send money home for less.",
  keywords: [
    "financial help for immigrants",
    "build credit without SSN",
    "ITIN bank account",
    "how to get ITIN",
    "free tax help immigrants",
    "VITA free tax preparation",
    "send money home cheaply",
    "immigrant finance USA",
    "financial guide immigrants",
    "secured credit card no SSN",
  ],
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
    title: "ImmiFina — Financial guidance for immigrants in the U.S.",
    description:
      "Free financial guidance for immigrants and first-generation Americans. Build credit, open a bank account, file taxes free, and send money home for less.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImmiFina — Financial guidance for immigrants in the U.S.",
    description:
      "Free financial guidance for immigrants and first-generation Americans. Build credit, open a bank account, file taxes free, and send money home for less.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ImmiFina",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  description:
    "Free financial guidance for immigrants and first-generation Americans living in the United States. Learn how to build credit without an SSN, open a bank account with an ITIN, file taxes for free with VITA, and send money home for less.",
  foundingDate: "2024",
  areaServed: "US",
  audience: {
    "@type": "Audience",
    audienceType: "Immigrants, first-generation Americans, visa holders, green card holders",
  },
  sameAs: [
    "https://twitter.com/immifina",
    "https://www.linkedin.com/company/immifina",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ImmiFina",
  url: SITE_URL,
  description: "Financial guidance for immigrants in the U.S.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/guides?q={search_term_string}`,
    "query-input": "required name=search_term_string",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
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
