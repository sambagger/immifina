"use client";

import { useTranslations } from "next-intl";

export function LegalFooter({
  className = "",
  align = "center",
}: {
  className?: string;
  align?: "center" | "left" | "right";
}) {
  const t = useTranslations("common");
  const alignClass =
    align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";

  return (
    <p
      className={`text-xs leading-relaxed text-muted ${alignClass} ${className}`}
      role="contentinfo"
    >
      {t("legalDisclaimer")}
    </p>
  );
}
