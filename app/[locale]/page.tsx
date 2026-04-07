import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { localeFromParam } from "@/lib/locale-route";
import { LegalFooter } from "@/components/LegalFooter";
import { LandingPageBackground } from "@/components/landing/LandingPageBackground";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingProductMockup } from "@/components/landing/LandingProductMockup";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { LandingFeaturesBento } from "@/components/landing/LandingFeaturesBento";
import { LandingHowPanel } from "@/components/landing/LandingHowPanel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { LandingInteractiveCard } from "@/components/landing/LandingInteractiveCard";
import { landingLargeBodyClass } from "@/lib/landing-copy-classes";

/** Centered page width + horizontal padding (all landing sections). */
const shell = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";
/** Vertical rhythm between major sections. */
const sectionY = "py-16 md:py-24 lg:py-28";
/** Centered section headings (problem, testimonials, languages, etc.). */
const sectionTitleCenter =
  "font-display max-w-3xl text-3xl text-landing-title md:text-4xl lg:text-[2.75rem] xl:text-[3rem] 2xl:text-[3.35rem]";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "landing" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <LandingPageBackground />
      <LandingNav locale={params.locale} overlay />
      <main className="relative z-10">
        <ScrollReveal>
          <section className="relative z-10">
            <div className={`${shell} pb-8 pt-28 text-center md:pb-12 md:pt-32`}>
              <div className="mx-auto max-w-3xl">
                <h1 className="font-display text-[clamp(2.55rem,6.4vw,4.15rem)] font-semibold leading-[1.06] tracking-tight">
                  <span className="block text-landing-title">{t("heroTitleLine1")}</span>
                  <span className="mt-2 block font-normal italic text-landing-title md:mt-3">
                    {t("heroTitleLine2Italic")}
                  </span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl font-sans text-sm font-medium tracking-wide text-landing-body md:text-base">
                  {t("heroTagline")}
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-landing-body md:text-lg">
                  {t("heroSubtitle")}
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:mt-12">
                  <Link
                    href="/register"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 bg-[#1d6b4f] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] hover:shadow-[0_6px_28px_rgba(0,0,0,0.6)] active:scale-[0.98] focus-visible:focus-ring md:px-8"
                  >
                    {t("ctaPrimary")}
                    <span aria-hidden>→</span>
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md transition-[background-color,transform] hover:bg-white/15 active:scale-[0.98] focus-visible:focus-ring md:px-8"
                  >
                    {t("ctaSecondary")}
                  </a>
                </div>
              </div>
            </div>
            <div className={`${shell} pt-0`}>
              <LandingInteractiveCard className="w-full">
                <LandingProductMockup locale={params.locale} />
              </LandingInteractiveCard>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className={`border-t border-white/10 ${sectionY}`}>
            <div className={`${shell} flex flex-col items-center gap-6 text-center md:gap-8`}>
              <h2 className={sectionTitleCenter}>{t("problemTitle")}</h2>
              <p className={landingLargeBodyClass}>{t("problemBody")}</p>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section
            id="product-features"
            className={`scroll-mt-28 border-t border-white/10 ${sectionY}`}
          >
            <div className={`${shell} flex flex-col gap-6 md:gap-8`}>
              <h2 className="font-display text-3xl text-landing-title md:text-4xl lg:text-[2.75rem]">
                {t("featuresTitle")}
              </h2>
              <LandingFeaturesBento
                headingLine1={t("featForecastHeadingLine1")}
                headingAccent={t("featForecastHeadingAccent")}
                lead={t("featForecastLead")}
                snapshotLabel={t("featChartSnapshotLabel")}
                bullets={[
                  { title: t("featBulletForecastTitle"), description: t("featBulletForecastDesc") },
                  { title: t("featBulletCreditTitle"), description: t("featBulletCreditDesc") },
                  { title: t("featBulletPaycheckTitle"), description: t("featBulletPaycheckDesc") },
                  { title: t("featBulletBenefitsTitle"), description: t("featBulletBenefitsDesc") },
                  { title: t("featBulletBankingTitle"), description: t("featBulletBankingDesc") },
                  { title: t("featBulletRemitTitle"), description: t("featBulletRemitDesc") },
                ]}
              />
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="how-it-works" className={`scroll-mt-28 border-t border-white/10 ${sectionY}`}>
            <div className={shell}>
              <LandingHowPanel
                titleLine1={t("howTitleLine1")}
                titleLine2={t("howTitleLine2Italic")}
                lead={t("howLead")}
                steps={[
                  { title: t("how1Title"), body: t("how1Body") },
                  { title: t("how2Title"), body: t("how2Body") },
                  { title: t("how3Title"), body: t("how3Body") },
                ]}
              />
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="testimonials" className={`scroll-mt-28 border-t border-white/10 ${sectionY}`}>
            <div className={shell}>
              <div>
                <div className="flex flex-col items-center text-center">
                  <h2 className="font-display text-3xl leading-tight text-landing-title md:text-4xl lg:text-[2.75rem]">
                    {t("testimonialsTitle")}
                  </h2>
                </div>
                <div className="mt-10 overflow-hidden rounded-[28px] border border-white/15 bg-black/50 shadow-soft backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                  <div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
                    <blockquote className="flex h-full min-h-0 flex-col px-6 py-8 text-center transition-colors duration-300 hover:bg-white/[0.07] md:px-8 md:py-10 md:text-left">
                      <p className="flex-1 text-lg leading-relaxed text-landing-body">{t("testimonial1Quote")}</p>
                      <footer className="mt-auto flex flex-col items-center gap-1 pt-6 md:items-start">
                        <cite className="font-display not-italic text-lg font-semibold text-landing-title">
                          {t("testimonial1Name")}
                        </cite>
                        <p className="text-sm text-zinc-200">{t("testimonial1Role")}</p>
                      </footer>
                    </blockquote>
                    <blockquote className="flex h-full min-h-0 flex-col px-6 py-8 text-center transition-colors duration-300 hover:bg-white/[0.07] md:px-8 md:py-10 md:text-left">
                      <p className="flex-1 text-lg leading-relaxed text-landing-body">{t("testimonial2Quote")}</p>
                      <footer className="mt-auto flex flex-col items-center gap-1 pt-6 md:items-start">
                        <cite className="font-display not-italic text-lg font-semibold text-landing-title">
                          {t("testimonial2Name")}
                        </cite>
                        <p className="text-sm text-zinc-200">{t("testimonial2Role")}</p>
                      </footer>
                    </blockquote>
                    <blockquote className="flex h-full min-h-0 flex-col px-6 py-8 text-center transition-colors duration-300 hover:bg-white/[0.07] md:px-8 md:py-10 md:text-left">
                      <p className="flex-1 text-lg leading-relaxed text-landing-body">{t("testimonial3Quote")}</p>
                      <footer className="mt-auto flex flex-col items-center gap-1 pt-6 md:items-start">
                        <cite className="font-display not-italic text-lg font-semibold text-landing-title">
                          {t("testimonial3Name")}
                        </cite>
                        <p className="text-sm text-zinc-200">{t("testimonial3Role")}</p>
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className={`border-t border-white/10 ${sectionY}`}>
            <div className={`${shell} flex flex-col items-center gap-6 text-center md:gap-8`}>
              <h2 className={sectionTitleCenter}>{t("langTitle")}</h2>
              <p className="max-w-xl text-lg leading-relaxed text-landing-body">{t("langBody")}</p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <span className="rounded-full border border-white/25 bg-black/50 px-5 py-2.5 text-sm font-medium text-white shadow-soft backdrop-blur-md">
                  English
                </span>
                <span className="rounded-full border border-white/25 bg-black/50 px-5 py-2.5 text-sm font-medium text-white shadow-soft backdrop-blur-md">
                  Español
                </span>
                <span className="rounded-full border border-white/25 bg-black/50 px-5 py-2.5 text-sm font-medium text-white shadow-soft backdrop-blur-md">
                  中文（简体）
                </span>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="feedback" className={`scroll-mt-28 border-t border-white/10 ${sectionY}`}>
            <div className={shell}>
              <div className="overflow-hidden rounded-[28px] border border-white/15 bg-black/50 px-6 py-12 text-center shadow-soft backdrop-blur-xl md:px-12 md:py-16">
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-zinc-200 md:text-sm">
                  {t("ctaOverline")}
                </p>
                <h2 className="font-display mt-4 text-3xl text-landing-title md:mt-6 md:text-4xl lg:text-[2.65rem]">
                  <span>{t("ctaBannerTitlePart1")}</span>{" "}
                  <span className="italic text-landing-title">{t("ctaBannerTitleAccent")}</span>
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-lg text-landing-body md:mt-6">{t("ctaBannerBody")}</p>
                <div className="mt-10 [&_button]:border-accent [&_button]:!bg-[#1d6b4f] [&_button]:!text-white [&_button]:hover:!bg-[#185a42] [&_input]:border-white/20 [&_input]:bg-black/40 [&_input]:text-white [&_input]:placeholder:text-zinc-400">
                  <WaitlistForm />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      <ScrollReveal>
        <footer className="relative z-10 border-t border-white/10 py-12 md:py-16">
          <div className={shell}>
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-2">
                <p className="font-display text-xl text-landing-title">{t("logo")}</p>
                <p className="text-sm text-landing-body">{t("footerProduct")}</p>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <p className="font-medium text-landing-title">{t("footerPolicies")}</p>
                <ul className="flex flex-col gap-2 text-landing-body">
                  <li>
                    <Link
                      href="/terms"
                      className="rounded-sm text-landing-body transition-colors hover:text-white focus-visible:focus-ring"
                    >
                      {tc("termsOfService")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="rounded-sm text-landing-body transition-colors hover:text-white focus-visible:focus-ring"
                    >
                      {tc("privacyPolicy")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-white/15 pt-8">
              <LegalFooter
                align="left"
                className="!text-landing-body [&_a]:!text-white [&_p]:!text-landing-body [&_span]:!text-landing-body"
              />
              <p className="mt-4 text-xs text-zinc-200">{tc("copyright")}</p>
            </div>
          </div>
        </footer>
      </ScrollReveal>
    </>
  );
}
