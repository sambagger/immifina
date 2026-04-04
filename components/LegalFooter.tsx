"use client";

import { useTranslations } from "next-intl";

export function LegalFooter({ className = "" }: { className?: string }) {
  const t = useTranslations("common");

  return (
    <p
      className={`text-center text-xs leading-relaxed text-muted ${className}`}
      role="contentinfo"
    >
      {t("legalDisclaimer")}
    </p>
  );
}
