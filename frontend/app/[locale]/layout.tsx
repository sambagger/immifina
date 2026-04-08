import { notFound } from "next/navigation";
import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { EducationalDisclaimerGate } from "@/components/legal/EducationalDisclaimerGate";
import { routing, type Locale } from "@/i18n/routing";
import en from "../../messages/en.json";
import es from "../../messages/es.json";
import zh from "../../messages/zh.json";

/** Same catalogs as `i18n/request.ts` — static imports avoid `getMessages()` pulling @formatjs into static-path workers (vendor-chunks error in dev). */
const messagesByLocale: Record<Locale, AbstractIntlMessages> = {
  en: en as AbstractIntlMessages,
  es: es as AbstractIntlMessages,
  zh: zh as AbstractIntlMessages,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const safeLocale = locale as Locale;
  setRequestLocale(safeLocale);
  const messages = messagesByLocale[safeLocale];

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <EducationalDisclaimerGate>{children}</EducationalDisclaimerGate>
    </NextIntlClientProvider>
  );
}
