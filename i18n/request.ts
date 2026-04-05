import { getRequestConfig } from "next-intl/server";
import en from "../messages/en.json";
import es from "../messages/es.json";
import zh from "../messages/zh.json";
import { routing } from "./routing";

const messagesByLocale = {
  en,
  es,
  zh,
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale;
  }

  const safe = locale as keyof typeof messagesByLocale;
  return {
    locale,
    messages: messagesByLocale[safe] ?? messagesByLocale.en,
  };
});
