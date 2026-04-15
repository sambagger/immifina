import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/navigation";
import { LandingPageBackground } from "@/components/landing/LandingPageBackground";
import { LandingNav } from "@/components/landing/LandingNav";
import { LegalFooter } from "@/components/LegalFooter";
import { ARTICLES } from "@/lib/knowledge-base/articles";

const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://immifina.org").replace(/\/$/, "");

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) return {};

  // Use the first paragraph as the meta description (capped at 160 chars)
  const firstPara = article.body.split(/\n\n+/)[0].trim();
  const description =
    firstPara.length > 160 ? firstPara.slice(0, 157) + "…" : firstPara;

  const canonicalUrl = `${SITE_URL}/guides/${article.slug}`;

  return {
    title: `${article.title} | ImmiFina`,
    description,
    openGraph: {
      title: `${article.title} | ImmiFina`,
      description,
      url: canonicalUrl,
      type: "article",
      siteName: "ImmiFina",
    },
    twitter: {
      card: "summary",
      title: `${article.title} | ImmiFina`,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

const CATEGORY_LABEL: Record<string, string> = {
  credit: "Credit",
  banking: "Banking",
  taxes: "Taxes",
  remittance: "Sending Money",
  paycheck: "Paycheck",
  benefits: "Benefits",
  immigration: "Immigration",
  savings: "Savings",
};

export default function GuidePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const article = ARTICLES.find((a) => a.slug === params.slug);
  if (!article) notFound();

  const paragraphs = article.body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Related guides (same category, excluding current)
  const related = ARTICLES.filter(
    (a) => a.slug !== article.slug && a.category === article.category
  ).slice(0, 3);

  const allOthers = related.length < 2
    ? ARTICLES.filter((a) => a.slug !== article.slug && a.category !== article.category).slice(0, 3 - related.length)
    : [];

  const suggestions = [...related, ...allOthers];

  const canonicalUrl = `${SITE_URL}/guides/${article.slug}`;
  const firstPara = article.body.split(/\n\n+/)[0].trim();
  const description = firstPara.length > 160 ? firstPara.slice(0, 157) + "…" : firstPara;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    url: canonicalUrl,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: "ImmiFina",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png` },
    },
    about: {
      "@type": "Thing",
      name: "Immigrant personal finance in the United States",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Immigrants, visa holders, green card holders in the US",
    },
    articleSection: CATEGORY_LABEL[article.category] ?? article.category,
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <LandingPageBackground />
      <LandingNav locale={params.locale} overlay />

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-24 pt-32 sm:px-6">
        {/* Back */}
        <Link
          href="/#guides"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          ← All guides
        </Link>

        {/* Header */}
        <div className="mt-6">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-medium text-zinc-300">
            {CATEGORY_LABEL[article.category] ?? article.category}
          </span>
          <h1 className="font-display mt-4 text-3xl leading-tight text-white md:text-4xl">
            {article.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">ImmiFina Knowledge Base · Free guide</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-400">
          This is educational information, not legal or financial advice. For decisions specific to your situation, consider speaking with a qualified professional. Many offer free services for immigrants.
        </div>

        {/* Body */}
        <article className="mt-8 space-y-5">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-base leading-relaxed text-zinc-300">
              {para}
            </p>
          ))}
        </article>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-teal-500/20 bg-teal-950/30 p-6 text-center">
          <p className="font-semibold text-white">Ready to take action?</p>
          <p className="mt-2 text-sm text-zinc-400">
            ImmiFina guides you step by step based on your specific situation — immigration status, income, and goals.
          </p>
          <Link
            href="/register"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/25 bg-[#1d6b4f] px-7 text-sm font-semibold text-white transition hover:bg-[#185a42]"
          >
            Start your free journey →
          </Link>
        </div>

        {/* Related guides */}
        {suggestions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">More guides</h2>
            <div className="mt-4 flex flex-col gap-3">
              {suggestions.map((g) => (
                <Link
                  key={g.slug}
                  href={`/guides/${g.slug}`}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
                >
                  {g.title}
                  <span className="text-zinc-600">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-white/10 py-10">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <LegalFooter align="left" className="!text-zinc-500 [&_a]:!text-zinc-400" />
        </div>
      </footer>
    </>
  );
}
