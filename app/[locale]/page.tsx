import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { localeFromParam } from "@/lib/locale-route";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { LegalFooter } from "@/components/LegalFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { Card } from "@/components/ui/Card";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "landing" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <AnimatedBackground />
      <LandingNav locale={params.locale} />
      <main>
        <ScrollReveal>
          <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg text-muted md:text-xl">{t("heroSubtitle")}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex min-h-[44px] items-center justify-center rounded-control border border-accent bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#185a42] active:scale-[0.98] focus-visible:focus-ring"
              >
                {t("ctaPrimary")}
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex min-h-[44px] items-center justify-center rounded-control border border-border bg-surface px-6 py-2 text-sm font-medium text-ink transition-colors hover:bg-accent-light hover:border-border-strong active:scale-[0.98] focus-visible:focus-ring"
              >
                {t("ctaSecondary")}
              </a>
            </div>
          </div>
        </section>
        </ScrollReveal>

        <ScrollReveal>
        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
            <p className="text-center text-sm leading-relaxed text-muted md:text-left">
              {t("stats1")}
            </p>
            <p className="text-center text-sm leading-relaxed text-muted md:text-left">
              {t("stats2")}
            </p>
            <p className="text-center text-sm leading-relaxed text-muted md:text-left">
              {t("stats3")}
            </p>
          </div>
        </section>
        </ScrollReveal>

        <ScrollReveal>
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
          <h2 className="font-display text-3xl text-ink md:text-4xl">{t("problemTitle")}</h2>
          <p className="mt-6 max-w-2xl text-muted">{t("problemBody")}</p>
        </section>
        </ScrollReveal>

        <ScrollReveal>
        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-8 md:pb-20">
          <h2 className="font-display text-3xl text-ink md:text-4xl">{t("featuresTitle")}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card>
              <h3 className="text-lg font-semibold text-ink">{t("featForecastTitle")}</h3>
              <p className="mt-2 text-sm text-muted">{t("featForecastDesc")}</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-ink">{t("featCreditTitle")}</h3>
              <p className="mt-2 text-sm text-muted">{t("featCreditDesc")}</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-ink">{t("featBenefitsTitle")}</h3>
              <p className="mt-2 text-sm text-muted">{t("featBenefitsDesc")}</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-ink">{t("featRemitTitle")}</h3>
              <p className="mt-2 text-sm text-muted">{t("featRemitDesc")}</p>
            </Card>
          </div>
        </section>
        </ScrollReveal>

        <ScrollReveal>
        <section
          id="trust"
          className="border-t border-border bg-surface py-16 md:py-20"
          aria-labelledby="trust-heading"
        >
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <h2
              id="trust-heading"
              className="font-display text-3xl text-ink md:text-4xl"
            >
              {t("trustTitle")}
            </h2>
            <p className="mt-4 max-w-2xl text-muted">{t("trustLead")}</p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Card>
                <h3 className="text-lg font-semibold text-ink">
                  {t("trustDataTitle")}
                </h3>
                <p className="mt-2 text-sm text-muted">{t("trustDataBody")}</p>
              </Card>
              <Card>
                <h3 className="text-lg font-semibold text-ink">
                  {t("trustNoBankTitle")}
                </h3>
                <p className="mt-2 text-sm text-muted">{t("trustNoBankBody")}</p>
              </Card>
              <Card>
                <h3 className="text-lg font-semibold text-ink">
                  {t("trustNoSellTitle")}
                </h3>
                <p className="mt-2 text-sm text-muted">{t("trustNoSellBody")}</p>
              </Card>
            </div>
          </div>
        </section>
        </ScrollReveal>

        <ScrollReveal>
        <section
          id="how-it-works"
          className="border-t border-border bg-blue-light/40 py-16 md:py-20"
        >
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <h2 className="font-display text-3xl text-ink md:text-4xl">{t("howTitle")}</h2>
            <ol className="mt-10 grid gap-10 md:grid-cols-3">
              <li>
                <span className="font-figures text-2xl text-blue">01</span>
                <h3 className="mt-2 text-lg font-semibold text-ink">{t("how1Title")}</h3>
                <p className="mt-2 text-sm text-muted">{t("how1Body")}</p>
              </li>
              <li>
                <span className="font-figures text-2xl text-blue">02</span>
                <h3 className="mt-2 text-lg font-semibold text-ink">{t("how2Title")}</h3>
                <p className="mt-2 text-sm text-muted">{t("how2Body")}</p>
              </li>
              <li>
                <span className="font-figures text-2xl text-blue">03</span>
                <h3 className="mt-2 text-lg font-semibold text-ink">{t("how3Title")}</h3>
                <p className="mt-2 text-sm text-muted">{t("how3Body")}</p>
              </li>
            </ol>
          </div>
        </section>
        </ScrollReveal>

        <ScrollReveal>
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-20">
          <h2 className="font-display text-3xl text-ink md:text-4xl">{t("langTitle")}</h2>
          <p className="mt-4 max-w-xl text-muted">{t("langBody")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-badge border border-border bg-surface px-4 py-2 text-sm text-ink">
              English
            </span>
            <span className="rounded-badge border border-border bg-surface px-4 py-2 text-sm text-ink">
              Español
            </span>
            <span className="rounded-badge border border-border bg-surface px-4 py-2 text-sm text-ink">
              中文（简体）
            </span>
          </div>
        </section>
        </ScrollReveal>

        <ScrollReveal>
        <section className="border-t border-border bg-accent-light/50 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center md:px-8">
            <h2 className="font-display text-3xl text-ink md:text-4xl">{t("ctaBannerTitle")}</h2>
            <p className="mx-auto mt-4 max-w-lg text-muted">{t("ctaBannerBody")}</p>
            <div className="mt-8">
              <WaitlistForm />
            </div>
          </div>
        </section>
        </ScrollReveal>
      </main>

      <ScrollReveal>
      <footer className="border-t border-border bg-surface py-6 md:py-6">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-lg text-ink">{t("logo")}</p>
              <p className="mt-1 text-sm text-muted">{t("footerProduct")}</p>
            </div>
            <div className="text-sm">
              <p className="font-medium text-ink">{t("footerPolicies")}</p>
              <ul className="mt-2 space-y-1.5 text-muted">
                <li>
                  <Link
                    href="/terms"
                    className="transition-colors hover:text-ink focus-visible:focus-ring rounded-sm"
                  >
                    {tc("termsOfService")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="transition-colors hover:text-ink focus-visible:focus-ring rounded-sm"
                  >
                    {tc("privacyPolicy")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 border-t border-border pt-4">
            <LegalFooter align="left" className="max-w-3xl" />
            <p className="mt-3 text-xs text-muted">{tc("copyright")}</p>
          </div>
        </div>
      </footer>
      </ScrollReveal>
    </>
  );
}
