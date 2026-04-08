"use client";

import { useTranslations } from "next-intl";

export function CreditEmotionalAcknowledgment() {
  const t = useTranslations("credit.emotional");
  return (
    <div className="rounded-control border-2 border-accent/40 bg-accent-light/40 p-6 text-sm leading-relaxed text-ink">
      <p className="whitespace-pre-line">{t("body")}</p>
    </div>
  );
}

export function ITINCreditPath() {
  const t = useTranslations("credit.itinPath");
  return (
    <div className="space-y-4 text-sm text-muted">
      <h2 className="text-lg font-semibold text-ink">{t("title")}</h2>
      <p className="whitespace-pre-line">{t("intro")}</p>
      <p className="whitespace-pre-line">{t("important")}</p>
      <h3 className="font-semibold text-ink">{t("optionsTitle")}</h3>
      <ol className="list-inside list-decimal space-y-4">
        <li className="pl-1">
          <span className="font-medium text-ink">{t("opt1Title")}</span>
          <p className="mt-2 whitespace-pre-line">{t("opt1Body")}</p>
        </li>
        <li className="pl-1">
          <span className="font-medium text-ink">{t("opt2Title")}</span>
          <p className="mt-2 whitespace-pre-line">{t("opt2Body")}</p>
        </li>
        <li className="pl-1">
          <span className="font-medium text-ink">{t("opt3Title")}</span>
          <p className="mt-2 whitespace-pre-line">{t("opt3Body")}</p>
          <a
            href="https://www.novacredit.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-medium text-accent underline-offset-2 hover:underline"
          >
            novacredit.com
          </a>
        </li>
        <li className="pl-1">
          <span className="font-medium text-ink">{t("opt4Title")}</span>
          <p className="mt-2 whitespace-pre-line">{t("opt4Body")}</p>
        </li>
      </ol>
      <p className="rounded-control border border-amber-500/40 bg-amber-500/10 p-3 text-xs">{t("warn")}</p>
    </div>
  );
}

export function PredatoryLendingSection() {
  const t = useTranslations("credit.predatory");
  return (
    <details className="details-disclosure group rounded-control border border-border bg-surface">
      <summary className="cursor-pointer p-4 font-semibold text-ink">
        {t("summaryTitle")}
      </summary>
      <div className="space-y-4 border-t border-border p-4 text-sm text-muted">
        <p className="whitespace-pre-line">{t("intro")}</p>
        <section>
          <h3 className="font-semibold text-ink">{t("paydayTitle")}</h3>
          <p className="mt-2 whitespace-pre-line">{t("paydayBody")}</p>
        </section>
        <section>
          <h3 className="font-semibold text-ink">{t("noCreditTitle")}</h3>
          <p className="mt-2 whitespace-pre-line">{t("noCreditBody")}</p>
        </section>
        <section>
          <h3 className="font-semibold text-ink">{t("rentToOwnTitle")}</h3>
          <p className="mt-2 whitespace-pre-line">{t("rentToOwnBody")}</p>
        </section>
        <section>
          <h3 className="font-semibold text-ink">{t("repairTitle")}</h3>
          <p className="mt-2 whitespace-pre-line">{t("repairBody")}</p>
        </section>
        <p className="whitespace-pre-line">{t("principle")}</p>
        <p className="rounded-control border border-border bg-bg p-3 text-xs">{t("warn")}</p>
        <a
          href="https://www.nfcc.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-medium text-accent underline-offset-2 hover:underline"
        >
          {t("counselingLink")}
        </a>
      </div>
    </details>
  );
}
