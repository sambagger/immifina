"use client";

import { useTranslations } from "next-intl";
import type { CreditPhase } from "@/lib/onboarding-logic";
import { Card } from "@/components/ui/Card";

const FOCUS_KEYS: Record<CreditPhase, "focusFirst_no_history" | "focusFirst_building" | "focusFirst_establishing" | "focusFirst_optimizing"> = {
  no_history: "focusFirst_no_history",
  building: "focusFirst_building",
  establishing: "focusFirst_establishing",
  optimizing: "focusFirst_optimizing",
};

export function CreditFocusSection({ phase }: { phase: CreditPhase }) {
  const t = useTranslations("credit");
  const lines = t(FOCUS_KEYS[phase])
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Card className="border-accent/30 bg-accent-light/10">
      <h2 className="text-lg font-semibold text-ink">{t("focusFirstTitle")}</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
        {lines.map((line) => (
          <li key={line}>{line.replace(/^•\s*/, "")}</li>
        ))}
      </ul>
    </Card>
  );
}
