import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { localeFromParam } from "@/lib/locale-route";
import { LegalFooter } from "@/components/LegalFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { LandingFeaturesBento } from "@/components/landing/LandingFeaturesBento";
import { LandingHowPanel } from "@/components/landing/LandingHowPanel";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const shell = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";
const sectionY = "py-16 md:py-24 lg:py-28";
const sectionTitleCenter =
  "font-display max-w-3xl text-3xl text-white md:text-4xl lg:text-[2.75rem]";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "landing" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="min-h-screen bg-[#0c1510] text-white">
      <LandingNav locale={params.locale} />

      <main>
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="border-b border-white/8">
          <div className={`${shell} py-20 md:py-28 lg:py-32`}>
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">

              {/* Left — headline + CTA */}
              <div className="flex flex-col items-start gap-6">
                <span className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-950/60 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300">
                  {t("heroTagline")}
                </span>
                <h1 className="font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-[1.02] tracking-tight text-white">
                  <span className="block">{t("heroTitleLine1")}</span>
                  <span className="mt-1 block italic text-teal-300">{t("heroTitleLine2Italic")}</span>
                </h1>
                <p className="max-w-md text-base leading-relaxed text-zinc-400 md:text-lg">
                  {t("heroSubtitle")}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/register"
                    className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-teal-600 px-7 text-sm font-semibold text-white transition-colors hover:bg-teal-500 active:bg-teal-700"
                  >
                    {t("ctaPrimary")}
                    <span aria-hidden>→</span>
                  </Link>
                  <a
                    href="#how-it-works"
                    className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-white/15 px-7 text-sm font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
                  >
                    {t("ctaSecondary")}
                  </a>
                </div>
              </div>

              {/* Right — stat grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Stat 1 */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
                  <p className="font-display text-[2.8rem] font-bold leading-none tracking-tight text-teal-300 sm:text-[3.4rem]">
                    45M+
                  </p>
                  <p className="mt-2.5 text-xs leading-snug text-zinc-400 sm:text-sm">
                    immigrants living in the U.S. today
                  </p>
                </div>

                {/* Stat 2 */}
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 sm:p-6">
                  <p className="font-display text-[2.8rem] font-bold leading-none tracking-tight text-teal-300 sm:text-[3.4rem]">
                    1 in 3
                  </p>
                  <p className="mt-2.5 text-xs leading-snug text-zinc-400 sm:text-sm">
                    are unbanked or underbanked in the U.S.
                  </p>
                </div>

                {/* Stat 3 — boxed with context */}
                <div className="rounded-2xl border border-teal-500/20 bg-teal-950/20 p-5 sm:p-6">
                  <p className="text-xs font-medium text-zinc-500">Starting from scratch...</p>
                  <p className="mt-2 font-display text-[2.8rem] font-bold leading-none tracking-tight text-white sm:text-[3.4rem]">
                    0
                  </p>
                  <p className="mt-2.5 text-xs leading-snug text-teal-300/80 sm:text-sm">
                    credit score on day one, even with years of history abroad
                  </p>
                </div>

                {/* Stat 4 — boxed with context */}
                <div className="rounded-2xl border border-teal-500/20 bg-teal-950/20 p-5 sm:p-6">
                  <p className="text-xs font-medium text-zinc-500">The good news...</p>
                  <p className="mt-2 font-display text-[2.8rem] font-bold leading-none tracking-tight text-white sm:text-[3.4rem]">
                    6 mo.
                  </p>
                  <p className="mt-2.5 text-xs leading-snug text-teal-300/80 sm:text-sm">
                    to your first U.S. credit score with the right first card
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Problem ──────────────────────────────────────────── */}
        <ScrollReveal>
          <section className={`border-b border-white/8 ${sectionY}`}>
            <div className={`${shell} flex flex-col items-start gap-6`}>
              <h2 className="font-display max-w-3xl text-3xl text-white md:text-4xl lg:text-[2.75rem]">
                {t("problemTitle")}
              </h2>
              <p className="max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
                {t("problemBody")}
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Features ─────────────────────────────────────────── */}
        <ScrollReveal>
          <section
            id="product-features"
            className={`scroll-mt-28 border-b border-white/8 ${sectionY}`}
          >
            <div className={`${shell} flex flex-col gap-8`}>
              <h2 className="font-display text-3xl text-white md:text-4xl lg:text-[2.75rem]">
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

        {/* ── How it works ─────────────────────────────────────── */}
        <ScrollReveal>
          <section id="how-it-works" className={`scroll-mt-28 border-b border-white/8 ${sectionY}`}>
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
          <section id="testimonials" className={`scroll-mt-28 border-b border-white/8 ${sectionY}`}>
            <div className={shell}>
              <h2 className="font-display text-3xl leading-tight text-white md:text-4xl">
                {t("testimonialsTitle")}
              </h2>
              <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  { quote: t("testimonial1Quote"), name: t("testimonial1Name"), role: t("testimonial1Role") },
                  { quote: t("testimonial2Quote"), name: t("testimonial2Name"), role: t("testimonial2Role") },
                  { quote: t("testimonial3Quote"), name: t("testimonial3Name"), role: t("testimonial3Role") },
                ].map((item, i) => (
                  <blockquote
                    key={i}
                    className={`flex flex-col gap-5 border-l-2 border-teal-500/40 pl-6 ${i === 1 ? "md:mt-10" : ""}`}
                  >
                    <p className="text-lg font-light leading-relaxed text-zinc-200">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <footer className="mt-auto">
                      <cite className="not-italic text-sm font-semibold text-white">{item.name}</cite>
                      <p className="mt-0.5 text-xs text-zinc-500">{item.role}</p>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Languages ────────────────────────────────────────── */}
        <ScrollReveal>
          <section className={`border-b border-white/8 ${sectionY}`}>
            <div className={`${shell} flex flex-col items-start gap-6`}>
              <h2 className={sectionTitleCenter}>{t("langTitle")}</h2>
              <p className="max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg">{t("langBody")}</p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {["English", "Español", "中文（简体）"].map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full border border-white/15 bg-white/[0.05] px-5 py-2 text-sm font-medium text-zinc-200"
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
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-14 text-center md:px-14 md:py-20">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  {t("ctaOverline")}
                </p>
                <h2 className="font-display mt-5 text-3xl text-white md:text-4xl lg:text-[2.65rem]">
                  <span>{t("ctaBannerTitlePart1")}</span>{" "}
                  <span className="italic text-teal-300">{t("ctaBannerTitleAccent")}</span>
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-base text-zinc-400 md:text-lg">{t("ctaBannerBody")}</p>
                <div className="mt-10 [&_button]:!bg-teal-600 [&_button]:!border-teal-500/40 [&_button]:!text-white [&_button]:hover:!bg-teal-500 [&_input]:border-white/15 [&_input]:bg-white/[0.05] [&_input]:text-white [&_input]:placeholder:text-zinc-500">
                  <WaitlistForm />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-white/8 py-12 md:py-16">
        <div className={shell}>
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-display text-xl text-white">{t("logo")}</p>
              <p className="text-sm text-zinc-500">{t("footerProduct")}</p>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <p className="font-medium text-zinc-300">{t("footerPolicies")}</p>
              <ul className="flex flex-col gap-2 text-zinc-500">
                <li>
                  <Link href="/terms" className="transition-colors hover:text-white">
                    {tc("termsOfService")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="transition-colors hover:text-white">
                    {tc("privacyPolicy")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/8 pt-8">
            <LegalFooter
              align="left"
              className="!text-zinc-600 [&_a]:!text-zinc-400 [&_p]:!text-zinc-600 [&_span]:!text-zinc-600"
            />
            <p className="mt-4 text-xs text-zinc-600">{tc("copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
