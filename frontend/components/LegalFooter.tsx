"use client";

import { useTranslations } from "next-intl";
import { getContactEmail } from "@/lib/legal/contact";

export function LegalFooter({
  className = "",
  align = "center",
  variant = "default",
}: {
  className?: string;
  align?: "center" | "left" | "right";
  /** Landing / auth glass — zinc + mint link */
  variant?: "default" | "onDark";
}) {
  const t = useTranslations("common");
  const alignClass =
    align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";
  const contactEmail = getContactEmail();
  const muted = variant === "onDark" ? "text-zinc-400" : "text-muted";
  const linkClass =
    variant === "onDark"
      ? "font-medium text-landing-title underline-offset-2 hover:underline focus-visible:focus-ring rounded-sm"
      : "font-medium text-accent underline-offset-2 hover:underline focus-visible:focus-ring rounded-sm";

  return (
    <div className={`space-y-2 text-xs leading-relaxed ${muted} ${alignClass} ${className}`} role="contentinfo">
      <p>{t("legalDisclaimer")}</p>
      <p>
        <span className={variant === "onDark" ? "text-zinc-500" : "text-muted"}>{t("footerContact")} </span>
        <a href={`mailto:${contactEmail}`} className={linkClass}>
          {contactEmail}
        </a>
      </p>
    </div>
  );
}
