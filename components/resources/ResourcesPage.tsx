"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { EducationalDisclaimer } from "@/components/ui/EducationalDisclaimer";

export function ResourcesPage() {
  const t = useTranslations("resources");

  return (
    <div className="space-y-8">
      <Card>
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted">{t("body")}</p>
      </Card>
      <EducationalDisclaimer topic="general" />
    </div>
  );
}
