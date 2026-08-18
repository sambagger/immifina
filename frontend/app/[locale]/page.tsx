import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { localeFromParam } from "@/lib/locale-route";
import { LegalFooter } from "@/components/LegalFooter";
import { LandingPageBackground } from "@/components/landing/LandingPageBackground";
import { LandingNav } from "@/components/landing/LandingNav";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { LandingFeaturesBento } from "@/components/landing/LandingFeaturesBento";
import { LandingHowPanel } from "@/components/landing/LandingHowPanel";
import { CursorSparkle } from "@/components/landing/CursorSparkle";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TextReveal } from "@/components/ui/TextReveal";
import { ARTICLES } from "@/lib/knowledge-base/articles";

const shell = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";
const sectionY = "py-20 md:py-32";

const BADGES = [
  { text: "build credit ✓", top: "22%", left: "4%", color: "#EBF7F2", border: "#a8e6c7", rot: "-4deg", delay: "0ms" },
  { text: "no SSN needed", top: "15%", right: "6%", color: "#FEF9EC", border: "#fde68a", rot: "3deg", delay: "80ms" },
  { text: "free tax help", top: "68%", left: "2%", color: "#EBF7F2", border: "#a8e6c7", rot: "2deg", delay: "160ms" },
  { text: "bank with ITIN", top: "72%", right: "3%", color: "#F0FDF4", border: "#bbf7d0", rot: "-3deg", delay: "240ms" },
  { text: "in your language", top: "42%", right: "2%", color: "#FFF7ED", border: "#fed7aa", rot: "4deg", delay: "320ms" },
];

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "landing" });
  const tc = await getTranslations({ locale, namespace: "common" });

  const guidesByCategory: Record<string, typeof ARTICLES> = {};
  for (const a of ARTICLES) {
    if (!guidesByCategory[a.category]) guidesByCategory[a.category] = [];
    guidesByCategory[a.category].push(a);
  }

  return (
    <>
      <LandingPageBackground />
      <CursorSparkle />
      <LandingNav locale={params.locale} overlay />

      <main className="relative z-10 overflow-x-hidden">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden border-b border-black/[0.06]">
          {/* Floating badges */}
          {BADGES.map((b) => (
            <div
              key={b.text}
              className="pointer-events-none absolute hidden select-none rounded-full border px-4 py-2 text-sm font-medium text-gray-700 shadow-sm lg:block"
              style={{
                background: b.color,
                borderColor: b.border,
                top: b.top,
                left: b.left,
                right: b.right,
                transform: `rotate(${b.rot})`,
                animation: `heroBadge 6s ${b.delay} ease-in-out infinite`,
              }}
            >
              {b.text}
            </div>
          ))}

          <div className={`${shell} py-24 md:py-32`}>
            <div className="mx-auto max-w-2xl text-center">
              {/* Tag */}
              <span
                className="inline-flex items-center rounded-full border border-[#1d6b4f]/20 bg-[#1d6b4f]/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1d6b4f]"
                style={{ animation: "fadeUp 400ms cubic-bezier(0.23,1,0.32,1) both" }}
              >
                {t("heroTagline")}
              </span>

              {/* Headline */}
              <h1
                className="font-display mt-7 text-[clamp(2.8rem,6vw,5rem)] leading-[1.0] tracking-tight text-gray-900"
                style={{ animation: "fadeUp 400ms 80ms cubic-bezier(0.23,1,0.32,1) both" }}
              >
                <span className="block">{t("heroTitleLine1")}</span>
                <span className="mt-1 block italic text-[#1d6b4f]">{t("heroTitleLine2Italic")}</span>
              </h1>

              {/* Subtitle */}
              <p
                className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-gray-500"
                style={{ animation: "fadeUp 400ms 140ms cubic-bezier(0.23,1,0.32,1) both" }}
              >
                Free financial guidance for immigrants — credit, taxes, banking, and more.
              </p>

              {/* CTAs */}
              <div
                className="mt-8 flex flex-wrap items-center justify-center gap-3"
                style={{ animation: "fadeUp 400ms 200ms cubic-bezier(0.23,1,0.32,1) both" }}
              >
                <Link
                  href="/register"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#1d6b4f] px-8 text-sm font-semibold text-white shadow-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97]"
                >
                  {t("ctaPrimary")}
                  <span aria-hidden>→</span>
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-black/12 bg-white/60 px-8 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97]"
                >
                  {t("ctaSecondary")}
                </a>
              </div>

              {/* Social proof */}
              <p
                className="mt-8 text-xs text-gray-400"
                style={{ animation: "fadeUp 400ms 280ms cubic-bezier(0.23,1,0.32,1) both" }}
              >
                Free · No bank connection required · English, Español, 中文
              </p>
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────── */}
        <ScrollReveal>
          <section id="how-it-works" className={`scroll-mt-28 border-b border-black/[0.06] ${sectionY}`}>
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

        {/* ── Features ─────────────────────────────────────────── */}
        <ScrollReveal>
          <section id="product-features" className={`scroll-mt-28 border-b border-black/[0.06] ${sectionY}`}>
            <div className={`${shell} flex flex-col gap-8`}>
              <h2 className="font-display text-3xl text-gray-900 md:text-4xl">
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

        {/* ── Guides ───────────────────────────────────────────── */}
        <ScrollReveal>
          <section id="guides" className={`scroll-mt-28 border-b border-black/[0.06] ${sectionY}`}>
            <div className={`${shell} flex flex-col gap-10`}>
              <div>
                <h2 className="font-display text-3xl text-gray-900 md:text-4xl">
                  <TextReveal>Free guides</TextReveal>
                </h2>
                <p className="mt-3 text-gray-500">Plain-language explanations for every part of U.S. finances.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ARTICLES.slice(0, 9).map((a) => (
                  <Link
                    key={a.slug}
                    href={`/guides/${a.slug}`}
                    className="group flex flex-col gap-2 rounded-2xl border border-black/[0.07] bg-white/50 px-5 py-4 shadow-sm backdrop-blur-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#1d6b4f]/25 hover:shadow-md"
                  >
                    <span className="inline-flex w-fit items-center rounded-full border border-[#1d6b4f]/15 bg-[#1d6b4f]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#1d6b4f]">
                      {a.category}
                    </span>
                    <p className="text-sm font-medium leading-snug text-gray-800 transition-colors group-hover:text-gray-900">
                      {a.title}
                    </p>
                  </Link>
                ))}
              </div>
              {ARTICLES.length > 9 && (
                <div className="text-center">
                  <Link
                    href="/guides"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1d6b4f] hover:underline"
                  >
                    View all {ARTICLES.length} guides →
                  </Link>
                </div>
              )}
            </div>
          </section>
        </ScrollReveal>

        {/* ── Testimonials ─────────────────────────────────────── */}
        <ScrollReveal>
          <section id="testimonials" className={`scroll-mt-28 border-b border-black/[0.06] ${sectionY}`}>
            <div className={shell}>
              <h2 className="font-display text-3xl leading-tight text-gray-900 md:text-4xl">
                <TextReveal>{t("testimonialsTitle")}</TextReveal>
              </h2>
              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                {[
                  { quote: t("testimonial1Quote"), name: t("testimonial1Name"), role: t("testimonial1Role") },
                  { quote: t("testimonial2Quote"), name: t("testimonial2Name"), role: t("testimonial2Role") },
                  { quote: t("testimonial3Quote"), name: t("testimonial3Name"), role: t("testimonial3Role") },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-5 rounded-2xl border border-black/[0.07] bg-white/60 p-6 shadow-sm backdrop-blur-sm"
                  >
                    <p className="text-[15px] leading-relaxed text-gray-700">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="mt-auto">
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── Languages ────────────────────────────────────────── */}
        <ScrollReveal>
          <section className={`border-b border-black/[0.06] ${sectionY}`}>
            <div className={`${shell} flex flex-col items-center gap-6 text-center`}>
              <h2 className="font-display max-w-xl text-3xl text-gray-900 md:text-4xl">
                <TextReveal>{t("langTitle")}</TextReveal>
              </h2>
              <p className="max-w-sm text-gray-500">{t("langBody")}</p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {["English", "Español", "中文（简体）"].map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full border border-black/[0.08] bg-white/70 px-5 py-2 text-sm font-medium text-gray-700 shadow-sm"
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
              <div className="rounded-3xl border border-[#1d6b4f]/15 bg-[#1d6b4f]/[0.04] px-8 py-14 text-center md:px-14 md:py-20">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1d6b4f]/70">
                  {t("ctaOverline")}
                </p>
                <h2 className="font-display mt-5 text-3xl text-gray-900 md:text-4xl">
                  <span>{t("ctaBannerTitlePart1")}</span>{" "}
                  <span className="italic text-[#1d6b4f]">{t("ctaBannerTitleAccent")}</span>
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base text-gray-500">{t("ctaBannerBody")}</p>
                <div className="mt-8 [&_button]:!bg-[#1d6b4f] [&_button]:!border-[#1d6b4f]/40 [&_button]:!text-white [&_button]:hover:!bg-[#185a42] [&_input]:border-black/10 [&_input]:bg-white [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400">
                  <WaitlistForm />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <ScrollReveal>
        <footer className="relative z-10 border-t border-black/[0.06] py-12 md:py-16">
          <div className={shell}>
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-2">
                <p className="font-display text-xl text-gray-900">{t("logo")}</p>
                <p className="text-sm text-gray-400">{t("footerProduct")}</p>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <p className="font-medium text-gray-500">{t("footerPolicies")}</p>
                <ul className="flex flex-col gap-2 text-gray-400">
                  <li>
                    <Link href="/terms" className="transition-colors duration-150 hover:text-gray-700">
                      {tc("termsOfService")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="transition-colors duration-150 hover:text-gray-700">
                      {tc("privacyPolicy")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-black/[0.06] pt-8">
              <LegalFooter
                align="left"
                className="!text-gray-400 [&_a]:!text-gray-500 [&_p]:!text-gray-400 [&_span]:!text-gray-400"
              />
              <p className="mt-4 text-xs text-gray-400">{tc("copyright")}</p>
            </div>
          </div>
        </footer>
      </ScrollReveal>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroBadge {
          0%, 100% { transform: rotate(var(--rot, 0deg)) translateY(0px); }
          50% { transform: rotate(var(--rot, 0deg)) translateY(-6px); }
        }
      `}</style>
    </>
  );
}
