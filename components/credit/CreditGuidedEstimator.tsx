"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";

type Q = {
  accounts: "none" | "few" | "many";
  oldest: "none" | "lt6" | "6_12" | "1_2" | "3p";
  missed: "na" | "never" | "once" | "several";
  payFull: "na" | "always" | "usually" | "sometimes" | "no";
  inquiries: "0" | "1_2" | "3p";
};

function estimateRange(q: Q): { low: number; high: number } {
  let base = 580;
  if (q.accounts === "none") base = 520;
  else if (q.accounts === "few") base = 600;
  else base = 660;
  if (q.oldest === "none" || q.oldest === "lt6") base -= 40;
  if (q.oldest === "3p") base += 30;
  if (q.missed === "several") base -= 80;
  else if (q.missed === "once") base -= 35;
  if (q.payFull === "always") base += 25;
  else if (q.payFull === "no") base -= 40;
  if (q.inquiries === "3p") base -= 25;
  const spread = 35;
  return {
    low: Math.max(300, Math.round(base - spread)),
    high: Math.min(850, Math.round(base + spread)),
  };
}

export function CreditGuidedEstimator() {
  const t = useTranslations("credit");
  const [q, setQ] = useState<Q>({
    accounts: "none",
    oldest: "none",
    missed: "na",
    payFull: "na",
    inquiries: "0",
  });

  const range = useMemo(() => estimateRange(q), [q]);

  return (
    <Card>
      <h2 className="text-lg font-semibold text-ink">{t("guidedTitle")}</h2>
      <p className="mt-2 text-sm text-muted">{t("guidedLead")}</p>

      <div className="mt-6 space-y-6 text-sm">
        <fieldset>
          <legend className="font-medium text-ink">{t("gqAccounts")}</legend>
          <div className="mt-2 space-y-2">
            {(
              [
                ["none", t("gqAccNone")],
                ["few", t("gqAccFew")],
                ["many", t("gqAccMany")],
              ] as const
            ).map(([v, label]) => (
              <label key={v} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="acc"
                  checked={q.accounts === v}
                  onChange={() => setQ((s) => ({ ...s, accounts: v }))}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-medium text-ink">{t("gqOldest")}</legend>
          <div className="mt-2 space-y-2">
            {(
              [
                ["none", t("gqOldNone")],
                ["lt6", t("gqOldLt6")],
                ["6_12", t("gqOld612")],
                ["1_2", t("gqOld12")],
                ["3p", t("gqOld3p")],
              ] as const
            ).map(([v, label]) => (
              <label key={v} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="old"
                  checked={q.oldest === v}
                  onChange={() => setQ((s) => ({ ...s, oldest: v }))}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-medium text-ink">{t("gqMissed")}</legend>
          <div className="mt-2 space-y-2">
            {(
              [
                ["na", t("gqMissNa")],
                ["never", t("gqMissNever")],
                ["once", t("gqMissOnce")],
                ["several", t("gqMissSeveral")],
              ] as const
            ).map(([v, label]) => (
              <label key={v} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="miss"
                  checked={q.missed === v}
                  onChange={() => setQ((s) => ({ ...s, missed: v }))}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-medium text-ink">{t("gqPayFull")}</legend>
          <div className="mt-2 space-y-2">
            {(
              [
                ["na", t("gqPayNa")],
                ["always", t("gqPayAlways")],
                ["usually", t("gqPayUsually")],
                ["sometimes", t("gqPaySometimes")],
                ["no", t("gqPayNo")],
              ] as const
            ).map(([v, label]) => (
              <label key={v} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pf"
                  checked={q.payFull === v}
                  onChange={() => setQ((s) => ({ ...s, payFull: v }))}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-medium text-ink">{t("gqInq")}</legend>
          <div className="mt-2 space-y-2">
            {(
              [
                ["0", t("gqInq0")],
                ["1_2", t("gqInq12")],
                ["3p", t("gqInq3p")],
              ] as const
            ).map(([v, label]) => (
              <label key={v} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="inq"
                  checked={q.inquiries === v}
                  onChange={() => setQ((s) => ({ ...s, inquiries: v }))}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-8 rounded-control border border-border bg-accent-light/40 p-4">
        <p className="text-sm font-medium text-ink">{t("guidedResult")}</p>
        <p className="mt-2 font-figures text-2xl text-accent-text">
          {range.low} – {range.high}
        </p>
        <p className="mt-2 text-xs text-muted">{t("guidedDisclaimer")}</p>
      </div>
    </Card>
  );
}
