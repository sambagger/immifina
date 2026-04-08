import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/routing";

/** Use `params.locale` from `[locale]` routes instead of `getLocale()` in SSG / worker contexts. */
export function localeFromParam(raw: string): Locale {
  if (routing.locales.includes(raw as Locale)) {
    return raw as Locale;
  }
  return routing.defaultLocale;
}
