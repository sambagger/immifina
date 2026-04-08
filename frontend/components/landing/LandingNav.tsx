import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LandingNavOverlay } from "@/components/landing/LandingNavOverlay";
import { localeFromParam } from "@/lib/locale-route";
import { routing } from "@/i18n/routing";

export async function LandingNav({
  locale,
  overlay = false,
}: {
  locale?: string;
  /** Fixed bar: clear over hero; glass tint after scroll (see LandingNavOverlay). */
  overlay?: boolean;
}) {
  const loc = locale != null ? localeFromParam(locale) : routing.defaultLocale;
  const t = await getTranslations({ locale: loc, namespace: "nav" });
  const tl = await getTranslations({ locale: loc, namespace: "landing" });

  if (overlay) {
    return <LandingNavOverlay />;
  }

  return (
    <header className="border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <BrandLogo className="text-xl text-ink">{tl("logo")}</BrandLogo>
        <div className="flex items-center gap-3 md:gap-4">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="text-sm font-medium text-muted transition-colors hover:text-accent active:text-accent focus-visible:focus-ring rounded-badge px-2 py-1"
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-[#1d6b4f]/40 bg-[#1d6b4f] px-3 py-2 text-sm font-semibold text-white shadow-[0_3px_14px_rgba(0,0,0,0.2)] transition-[box-shadow] hover:shadow-[0_4px_18px_rgba(0,0,0,0.28)] focus-visible:focus-ring"
          >
            {t("register")}
          </Link>
        </div>
      </div>
    </header>
  );
}
