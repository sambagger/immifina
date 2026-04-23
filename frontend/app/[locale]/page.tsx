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
          <section className="relative z-10 min-h-screen">
            <div className={`${shell} relative z-10 pb-12 pt-28 md:pb-16 md:pt-36`}>
              <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
                {/* Copy — left-aligned on desktop, centered on mobile */}
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <span className="animate-slide-up animate-pill-glow stagger-1 inline-flex items-center rounded-full border border-teal-500/30 bg-teal-950/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300">
                    {t("heroTagline")}
                  </span>
                  <h1 className="font-display mt-6 text-[clamp(2.4rem,4.6vw,4rem)] leading-[1.03]">
                    <span className="animate-slide-up stagger-2 block text-landing-title">{t("heroTitleLine1")}</span>
                    <span className="animate-slide-up stagger-3 mt-1 block whitespace-nowrap italic text-landing-title md:mt-1">
                      {t("heroTitleLine2Italic")}
                    </span>
                  </h1>
                  <p className="animate-slide-up stagger-4 mt-6 max-w-lg text-base leading-relaxed text-landing-body md:text-lg">
                    {t("heroSubtitle")}
                  </p>
                  <div className="animate-slide-up stagger-5 mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start md:mt-10">
                    <Link
                      href="/register"
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-white/25 bg-[#1d6b4f] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(0,0,0,0.55),0_2px_8px_rgba(0,0,0,0.45)] transition-[transform,box-shadow] hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(0,0,0,0.6)] active:scale-[0.98] focus-visible:focus-ring md:px-8"
                    >
                      {t("ctaPrimary")}
                      <span aria-hidden>→</span>
                    </Link>
                    <a
                      href="#how-it-works"
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/35 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md transition-[background-color,transform] hover:scale-[1.03] hover:bg-white/15 active:scale-[0.98] focus-visible:focus-ring md:px-8"
                    >
                      {t("ctaSecondary")}
                    </a>
                  </div>
                </div>
                {/* Mockup — right column, floats gently */}
                <LandingInteractiveCard className="animate-slide-up animate-float stagger-3 w-full">
                  <LandingProductMockup locale={params.locale} />
                </LandingInteractiveCard>
              </div>
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
              <h2 className="font-display text-3xl leading-tight text-landing-title md:text-4xl lg:text-[2.75rem]">
                {t("testimonialsTitle")}
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
                <blockquote className="flex flex-col gap-5 border-l-2 border-teal-500/50 pl-6">
                  <p className="text-xl font-light leading-relaxed text-landing-title">
                    &ldquo;{t("testimonial1Quote")}&rdquo;
                  </p>
                  <footer className="mt-auto">
                    <cite className="font-display not-italic text-sm font-semibold text-landing-title">
                      {t("testimonial1Name")}
                    </cite>
                    <p className="mt-0.5 text-xs text-zinc-400">{t("testimonial1Role")}</p>
                  </footer>
                </blockquote>
                <blockquote className="flex flex-col gap-5 border-l-2 border-teal-500/50 pl-6 md:mt-10">
                  <p className="text-xl font-light leading-relaxed text-landing-title">
                    &ldquo;{t("testimonial2Quote")}&rdquo;
                  </p>
                  <footer className="mt-auto">
                    <cite className="font-display not-italic text-sm font-semibold text-landing-title">
                      {t("testimonial2Name")}
                    </cite>
                    <p className="mt-0.5 text-xs text-zinc-400">{t("testimonial2Role")}</p>
                  </footer>
                </blockquote>
                <blockquote className="flex flex-col gap-5 border-l-2 border-teal-500/50 pl-6">
                  <p className="text-xl font-light leading-relaxed text-landing-title">
                    &ldquo;{t("testimonial3Quote")}&rdquo;
                  </p>
                  <footer className="mt-auto">
                    <cite className="font-display not-italic text-sm font-semibold text-landing-title">
                      {t("testimonial3Name")}
                    </cite>
                    <p className="mt-0.5 text-xs text-zinc-400">{t("testimonial3Role")}</p>
                  </footer>
                </blockquote>
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

        {/* ── Guides section ──────────────────────────────── */}
        <ScrollReveal>
          <section id="guides" className={`scroll-mt-28 border-t border-white/10 ${sectionY}`}>
            <div className={shell}>
              <div className="flex flex-col items-center text-center gap-4">
                <span className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-950/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300">
                  Free Guides
                </span>
                <h2 className={sectionTitleCenter}>
                  Everything you need to know about money in the U.S.
                </h2>
                <p className="max-w-xl text-lg leading-relaxed text-landing-body">
                  Plain-language explanations of the U.S. financial system — no jargon, no assumptions. Read before you sign up.
                </p>
              </div>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { slug: "itin", title: "What Is an ITIN?", desc: "Who needs one, how to apply, and what doors it opens." },
                  { slug: "secured-cards", title: "How Secured Credit Cards Work", desc: "Build U.S. credit from scratch — even without an SSN." },
                  { slug: "building-credit-no-ssn", title: "Building Credit Without an SSN", desc: "Credit builder loans, authorized users, and ITIN cards." },
                  { slug: "remittance-options", title: "Sending Money Home for Less", desc: "How to compare providers and avoid hidden fees." },
                  { slug: "vita-free-taxes", title: "File Your Taxes Free with VITA", desc: "Free IRS-sponsored tax help for immigrants and low-income filers." },
                  { slug: "w2-explained", title: "Your W-2 Explained", desc: "Every box on your W-2 in plain language." },
                  { slug: "itin-banking", title: "Opening a Bank Account with an ITIN", desc: "Banks that accept ITIN holders and what you'll need." },
                  { slug: "public-charge-rule", title: "Public Charge Rule", desc: "Which benefits are safe to use and which aren't." },
                  { slug: "paycheck-deductions", title: "Understanding Your Paycheck", desc: "FICA, federal tax, and why your take-home is less than your salary." },
                ].map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all hover:border-teal-500/30 hover:bg-teal-950/20"
                  >
                    <div>
                      <p className="font-semibold text-white group-hover:text-teal-100 transition-colors">
                        {guide.title}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-zinc-400">{guide.desc}</p>
                    </div>
                    <span className="mt-auto text-xs text-teal-500/70 group-hover:text-teal-400 transition-colors">
                      Read guide →
                    </span>
                  </Link>
                ))}
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
