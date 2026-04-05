import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { localeFromParam } from "@/lib/locale-route";
import { routing } from "@/i18n/routing";

export async function LandingNav({ locale }: { locale?: string }) {
  const loc = locale != null ? localeFromParam(locale) : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "nav" });
  const tl = await getTranslations({ locale: loc, namespace: "landing" });

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-ink focus-visible:focus-ring rounded-badge px-1"
        >
          {tl("logo")}
        </Link>
        <div className="flex items-center gap-3 md:gap-4">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="text-sm font-medium text-muted transition-colors hover:text-ink focus-visible:focus-ring rounded-badge px-2 py-1"
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            className="rounded-control border border-border bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#185a42] focus-visible:focus-ring"
          >
            {t("register")}
          </Link>
        </div>
      </div>
    </header>
  );
}
