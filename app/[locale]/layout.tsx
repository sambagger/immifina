import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { EducationalDisclaimerGate } from "@/components/legal/EducationalDisclaimerGate";
import { routing, type Locale } from "@/i18n/routing";

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
  const messages = await getMessages({ locale: safeLocale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <EducationalDisclaimerGate>{children}</EducationalDisclaimerGate>
    </NextIntlClientProvider>
  );
}
