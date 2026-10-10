import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { localeFromParam } from "@/lib/locale-route";
import { LegalFooter } from "@/components/LegalFooter";
import { LandingPageBackground } from "@/components/landing/LandingPageBackground";
import { LandingNav } from "@/components/landing/LandingNav";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { LandingFeaturesBento } from "@/components/landing/LandingFeaturesBento";
import { LandingHowPanel } from "@/components/landing/LandingHowPanel";
import { LandingProductMockup } from "@/components/landing/LandingProductMockup";
import { HeroMockupFloat } from "@/components/landing/HeroMockupFloat";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextReveal } from "@/components/ui/TextReveal";

const shell = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";
const sectionY = "py-20 md:py-32 lg:py-36";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "landing" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <>
      <LandingPageBackground />
      <LandingNav locale={params.locale} overlay />

      <main className="relative z-10 overflow-x-hidden">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="flex min-h-[100dvh] items-center border-b border-white/[0.06]">
          <div className={`${shell} py-20 md:py-28`}>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-16">

              {/* Left: text */}
              <div>
                <span
                  className="inline-flex items-center rounded-full border border-teal-500/25 bg-teal-950/50 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300"
                  style={{ animation: "fadeUp 400ms cubic-bezier(0.23,1,0.32,1) both" }}
                >
                  {t("heroTagline")}
                </span>

                <h1
                  className="font-display mt-6 text-[clamp(2.75rem,5.5vw,4.5rem)] leading-[1.0] tracking-tight text-white"
                  style={{ animation: "fadeUp 400ms 80ms cubic-bezier(0.23,1,0.32,1) both" }}
                >
                  <span className="block">{t("heroTitleLine1")}</span>
                  <span className="mt-1 block italic text-teal-300">{t("heroTitleLine2Italic")}</span>
                </h1>

                <p
                  className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-200 md:text-xl"
                  style={{ animation: "fadeUp 400ms 140ms cubic-bezier(0.23,1,0.32,1) both" }}
                >
                  {t("heroSubtitle")}
                </p>

                <div
                  className="mt-8 flex flex-wrap items-center gap-3"
                  style={{ animation: "fadeUp 400ms 200ms cubic-bezier(0.23,1,0.32,1) both" }}
                >
                  <Link
                    href="/register"
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-teal-600 px-8 text-sm font-semibold text-white transition-[transform,background-color] duration-150 hover:bg-teal-500 active:scale-[0.97]"
                  >
                    {t("ctaPrimary")}
                    <span aria-hidden>→</span>
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-white/15 px-8 text-sm font-medium text-zinc-300 transition-[transform,border-color,color] duration-150 hover:border-white/25 hover:text-white active:scale-[0.97]"
                  >
                    {t("ctaSecondary")}
                  </a>
                </div>
              </div>

              {/* Right: animated product mockup */}
              <HeroMockupFloat>
                <LandingProductMockup locale={params.locale} />
              </HeroMockupFloat>

            </div>
          </div>
        </section>

        {/* ── Problem ──────────────────────────────────────────── */}
        <ScrollReveal>
          <section className={`border-b border-white/[0.06] ${sectionY}`}>
            <div className={`${shell} flex flex-col items-start gap-6`}>
              <h2 className="font-display max-w-3xl text-3xl text-white md:text-4xl">
                <TextReveal>{t("problemTitle")}</TextReveal>
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
                {t("problemBody")}
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Features ─────────────────────────────────────────── */}
        <ScrollReveal>
          <section id="product-features" className={`scroll-mt-28 border-b border-white/[0.06] ${sectionY}`}>
            <div className={`${shell} flex flex-col gap-8`}>
              <h2 className="font-display text-3xl text-white md:text-4xl">
                <TextReveal>{t("featuresTitle")}</TextReveal>
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

        {/* ── How it works ─────────────────────────────────────── */}
        <ScrollReveal>
          <section id="how-it-works" className={`scroll-mt-28 border-b border-white/[0.06] ${sectionY}`}>
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

        {/* ── Testimonials ─────────────────────────────────────── */}
        <ScrollReveal>
          <section id="testimonials" className={`scroll-mt-28 border-b border-white/[0.06] ${sectionY}`}>
            <div className={shell}>
              <h2 className="font-display text-3xl leading-tight text-white md:text-4xl">
                <TextReveal>{t("testimonialsTitle")}</TextReveal>
              </h2>
              <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr]">
                {/* Featured primary quote */}
                <blockquote className="flex flex-col gap-6 border-l-2 border-teal-500/40 pl-7">
                  <p className="text-xl font-light leading-relaxed text-zinc-100 md:text-2xl">
                    &ldquo;{t("testimonial1Quote")}&rdquo;
                  </p>
                  <footer className="mt-auto">
                    <cite className="not-italic text-sm font-semibold text-white">{t("testimonial1Name")}</cite>
                    <p className="mt-0.5 text-xs text-zinc-600">{t("testimonial1Role")}</p>
                  </footer>
                </blockquote>

                {/* Secondary quotes stacked */}
                <div className="flex flex-col gap-8">
                  {[
                    { quote: t("testimonial2Quote"), name: t("testimonial2Name"), role: t("testimonial2Role") },
                    { quote: t("testimonial3Quote"), name: t("testimonial3Name"), role: t("testimonial3Role") },
                  ].map((item, i) => (
                    <blockquote key={i} className="flex flex-col gap-4 border-l-2 border-teal-500/20 pl-5">
                      <p className="text-sm font-light leading-relaxed text-zinc-400">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                      <footer>
                        <cite className="not-italic text-sm font-semibold text-white">{item.name}</cite>
                        <p className="mt-0.5 text-xs text-zinc-600">{item.role}</p>
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Languages ────────────────────────────────────────── */}
        <ScrollReveal>
          <section className={`border-b border-white/[0.06] ${sectionY}`}>
            <div className={`${shell} flex flex-col items-start gap-6`}>
              <h2 className="font-display max-w-3xl text-3xl text-white md:text-4xl">
                <TextReveal>{t("langTitle")}</TextReveal>
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg">{t("langBody")}</p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {["English", "Español", "中文（简体）"].map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm font-medium text-zinc-300"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Final CTA ────────────────────────────────────────── */}
        <ScrollReveal>
          <section id="feedback" className={`scroll-mt-28 ${sectionY}`}>
            <div className={shell}>
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-8 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] md:px-14 md:py-20">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  {t("ctaOverline")}
                </p>
                <h2 className="font-display mt-5 text-3xl text-white md:text-4xl">
                  <span>{t("ctaBannerTitlePart1")}</span>{" "}
                  <span className="italic text-teal-300">{t("ctaBannerTitleAccent")}</span>
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-base text-zinc-400 md:text-lg">{t("ctaBannerBody")}</p>
                <div className="mt-10 [&_button]:!bg-teal-600 [&_button]:!border-teal-500/40 [&_button]:!text-white [&_button]:hover:!bg-teal-500 [&_input]:border-white/10 [&_input]:bg-white/[0.04] [&_input]:text-white [&_input]:placeholder:text-zinc-600">
                  <WaitlistForm />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <ScrollReveal>
        <footer className="relative z-10 border-t border-white/[0.06] py-12 md:py-16">
          <div className={shell}>
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-2">
                <p className="font-display text-xl text-white">{t("logo")}</p>
                <p className="text-sm text-zinc-600">{t("footerProduct")}</p>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <p className="font-medium text-zinc-400">{t("footerPolicies")}</p>
                <ul className="flex flex-col gap-2 text-zinc-600">
                  <li>
                    <Link href="/terms" className="transition-colors duration-150 hover:text-white">
                      {tc("termsOfService")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="transition-colors duration-150 hover:text-white">
                      {tc("privacyPolicy")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-white/[0.06] pt-8">
              <LegalFooter
                align="left"
                className="!text-zinc-700 [&_a]:!text-zinc-500 [&_p]:!text-zinc-700 [&_span]:!text-zinc-700"
              />
              <p className="mt-4 text-xs text-zinc-700">{tc("copyright")}</p>
            </div>
          </div>
        </footer>
      </ScrollReveal>

      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
