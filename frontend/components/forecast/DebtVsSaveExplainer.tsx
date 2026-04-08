"use client";

import { useTranslations } from "next-intl";

type Props = {
  debtAmount: number;
  debtAprPercent: number;
  savingsAprPercent: number;
};

export function DebtVsSaveExplainer({
  debtAmount,
  debtAprPercent,
  savingsAprPercent,
}: Props) {
  const t = useTranslations("forecast.debtExplainer");

  return (
    <div className="rounded-control border border-border bg-accent-light/30 p-5 text-sm text-ink">
      <p className="font-medium text-ink">{t("lead")}</p>
      <p className="mt-3 text-muted">{t("intro", { amount: `$${debtAmount.toLocaleString()}` })}</p>
      <p className="mt-3 text-muted">{t("mathLead")}</p>
      <ul className="mt-2 list-inside list-disc space-y-2 text-muted">
        <li>{t("debtLine", { rate: String(debtAprPercent), cost: String(debtAprPercent) })}</li>
        <li>{t("saveLine", { rate: String(savingsAprPercent), earn: String(savingsAprPercent) })}</li>
      </ul>
      <p className="mt-4 text-muted">{t("pathA")}</p>
      <p className="mt-3 text-muted">{t("pathB")}</p>
      <p className="mt-4 text-muted">{t("noSingleAnswer")}</p>
      <p className="mt-4 rounded-control border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-muted">
        {t("warn")}
      </p>
      <a
        href="https://www.nfcc.org/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-medium text-accent underline-offset-2 hover:underline focus-visible:focus-ring rounded-badge"
      >
        {t("counselingLink")}
      </a>
    </div>
  );
}
