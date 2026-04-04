"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import type { Locale } from "@/i18n/routing";

const locales: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "zh", label: "中文" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function setLocale(next: Locale) {
    try {
      localStorage.setItem("immifina-locale", next);
    } catch {
      /* ignore */
    }
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      className={`flex items-center gap-1 rounded-badge border border-border bg-surface p-0.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      {locales.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`rounded-badge px-2.5 py-1 text-xs font-medium transition-colors focus-visible:focus-ring ${
            locale === code
              ? "bg-accent-light text-accent-text"
              : "text-muted hover:bg-accent-light/60"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
