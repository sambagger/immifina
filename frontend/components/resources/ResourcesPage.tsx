"use client";

import { EducationalDisclaimer } from "@/components/ui/EducationalDisclaimer";

type ResourceLink = { label: string; url: string; note?: string };
type ResourceGroup = { title: string; links: ResourceLink[] };

const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    title: "Financial Counseling (Free)",
    links: [
      { label: "NFCC — Nonprofit Credit Counseling", url: "https://www.nfcc.org", note: "1-800-388-2227" },
      { label: "CFPB — Consumer Finance Protection Bureau", url: "https://www.consumerfinance.gov", note: "Available in Spanish" },
      { label: "CFPB — Your Money, Your Goals", url: "https://www.consumerfinance.gov/consumer-tools/financial-well-being" },
    ],
  },
  {
    title: "Free Tax Help",
    links: [
      { label: "VITA — IRS Free Tax Preparation", url: "https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers", note: "For income under ~$67k" },
      { label: "AARP Tax Aide", url: "https://www.aarp.org/money/taxes/aarp_taxaide", note: "All ages welcome" },
      { label: "IRS ITIN Information", url: "https://www.irs.gov/individuals/individual-taxpayer-identification-number" },
    ],
  },
  {
    title: "Benefits & Social Services",
    links: [
      { label: "Benefits.gov — Find government benefits", url: "https://www.benefits.gov" },
      { label: "211 — Local social services", url: "https://www.211.org", note: "Call or text 211" },
      { label: "USA.gov — Government programs", url: "https://www.usa.gov/benefits" },
    ],
  },
  {
    title: "Immigration Legal Help (Free or Low Cost)",
    links: [
      { label: "ImmigrationAdvocates.org", url: "https://www.immigrationadvocates.org", note: "Find free legal help near you" },
      { label: "CLINIC — Catholic Legal Immigration Network", url: "https://cliniclegal.org" },
      { label: "AILA — American Immigration Lawyers Assoc.", url: "https://www.aila.org" },
    ],
  },
  {
    title: "Banking Help",
    links: [
      { label: "FDIC — How to open a bank account", url: "https://www.fdic.gov/consumers/assistance/protection/banks.html" },
      { label: "CFPB — Bank account guide", url: "https://www.consumerfinance.gov/consumer-tools/bank-accounts" },
      { label: "BankOn — Find safe, affordable accounts", url: "https://joinbankon.org" },
    ],
  },
  {
    title: "Credit Building",
    links: [
      { label: "CFPB — Building credit guide", url: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores" },
      { label: "AnnualCreditReport.com — Free credit reports", url: "https://www.annualcreditreport.com" },
    ],
  },
];

export function ResourcesPage() {
  return (
    <div className="space-y-8">
      <p className="text-sm text-zinc-400">
        Verified free resources to help you navigate the US financial system. Always confirm an organization is legitimate before sharing personal information.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {RESOURCE_GROUPS.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-sm transition-[border-color] hover:border-white/20"
          >
            <h2 className="text-sm font-semibold text-landing-title">{group.title}</h2>
            <ul className="mt-3 space-y-3">
              {group.links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-0.5"
                  >
                    <span className="text-sm text-zinc-300 underline-offset-2 transition-colors group-hover:text-white group-hover:underline">
                      {link.label} <span className="text-zinc-600 transition-colors group-hover:text-zinc-400">↗</span>
                    </span>
                    {link.note ? (
                      <span className="text-xs text-zinc-500">{link.note}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <EducationalDisclaimer topic="general" />
    </div>
  );
}
