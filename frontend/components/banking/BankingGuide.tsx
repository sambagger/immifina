"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { EducationalDisclaimer } from "@/components/ui/EducationalDisclaimer";
import type { FinancialProfileRow } from "@/lib/onboarding-logic";
import { apiFetch } from "@/lib/api";

export function BankingGuide() {
  const t = useTranslations("banking");
  const [situation, setSituation] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch("/profile");
        if (!res.ok) return;
        const data = (await res.json()) as { profile: FinancialProfileRow | null };
        if (cancelled || !data.profile?.immigration_situation) return;
        setSituation(data.profile.immigration_situation);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const docBlock =
    situation === "us_citizen" || situation === "green_card"
      ? t("s2Citizen")
      : situation === "visa"
        ? t("s2Visa")
        : t("s2Other");

  return (
    <div className="space-y-8">
      <div>
        <p className="text-lg font-medium text-ink">{t("hook")}</p>
        <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>
      </div>

      <Card className="border-accent/25 bg-accent-light/10">
        <h2 className="text-lg font-semibold text-ink">{t("decisionTitle")}</h2>
        <ul className="mt-4 space-y-4 text-sm">
          <li>
            <span className="font-medium text-ink">{t("decisionLowFeesLabel")}</span>
            <span className="text-muted"> — </span>
            <span className="text-muted">{t("decisionLowFeesHint")}</span>
          </li>
          <li>
            <span className="font-medium text-ink">{t("decisionInPersonLabel")}</span>
            <span className="text-muted"> — </span>
            <span className="text-muted">{t("decisionInPersonHint")}</span>
          </li>
          <li>
            <span className="font-medium text-ink">{t("decisionSecondChanceLabel")}</span>
            <span className="text-muted"> — </span>
            <span className="text-muted">{t("decisionSecondChanceHint")}</span>
          </li>
        </ul>
        <p className="mt-4 text-xs text-faint">{t("decisionNote")}</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("s1Title")}</h2>
        <p className="mt-4 whitespace-pre-line text-sm text-muted">{t("s1Body")}</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("s2Title")}</h2>
        <p className="mt-4 whitespace-pre-line text-sm text-muted">{docBlock}</p>
        <p className="mt-4 text-sm font-medium text-ink">{t("s2Note")}</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("s3Title")}</h2>
        <p className="mt-4 whitespace-pre-line text-sm text-muted">{t("s3Body")}</p>
      </Card>

      <details className="details-disclosure group rounded-control border border-border bg-surface">
        <summary className="cursor-pointer p-4 font-semibold text-ink">
          {t("s4Title")}
        </summary>
        <div className="border-t border-border p-4">
          <p className="whitespace-pre-line text-sm text-muted">{t("s4Body")}</p>
        </div>
      </details>

      <details className="details-disclosure group rounded-control border border-border bg-surface">
        <summary className="cursor-pointer p-4 font-semibold text-ink">
          {t("s5Title")}
        </summary>
        <div className="border-t border-border p-4">
          <p className="whitespace-pre-line text-sm text-muted">{t("s5Body")}</p>
        </div>
      </details>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("nextStepsTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("nextStep1")}</li>
          <li>{t("nextStep2")}</li>
          <li>{t("nextStep3")}</li>
        </ul>
      </Card>

      <EducationalDisclaimer topic="banking" />
    </div>
  );
}
