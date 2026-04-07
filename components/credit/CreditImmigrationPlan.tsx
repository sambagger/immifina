"use client";

import { useTranslations } from "next-intl";

function Term({ titleKey, defKey }: { titleKey: string; defKey: string }) {
  const t = useTranslations("credit");
  return (
    <div>
      <dt className="font-medium text-ink">{t(titleKey)}</dt>
      <dd className="mt-0.5 leading-relaxed">{t(defKey)}</dd>
    </div>
  );
}

export function CreditImmigrationPlan() {
  const t = useTranslations("credit");

  return (
    <div className="mt-4 space-y-3">
      <details className="details-disclosure details-disclosure--summary-trailing rounded-control border border-border bg-bg p-3 text-left">
        <summary className="cursor-pointer">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-snug text-ink">{t("planCitizenLabel")}</p>
            <p className="mt-1 text-sm text-muted">{t("planCitizenAction")}</p>
          </div>
          <span className="shrink-0 pt-0.5 text-xs font-medium leading-none text-accent">
            {t("planTermsExpand")}
          </span>
        </summary>
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-xs font-medium text-ink">{t("planTermsExplain")}</p>
          <dl className="mt-2 space-y-2.5 text-xs text-muted">
            <Term titleKey="planTermAnnualFee_title" defKey="planTermAnnualFee_def" />
            <Term titleKey="planTermAutopay_title" defKey="planTermAutopay_def" />
            <Term titleKey="planTermUtilization_title" defKey="planTermUtilization_def" />
          </dl>
        </div>
      </details>

      <details className="details-disclosure details-disclosure--summary-trailing rounded-control border border-border bg-bg p-3 text-left">
        <summary className="cursor-pointer">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-snug text-ink">{t("planVisaLabel")}</p>
            <p className="mt-1 text-sm text-muted">{t("planVisaAction")}</p>
          </div>
          <span className="shrink-0 pt-0.5 text-xs font-medium leading-none text-accent">
            {t("planTermsExpand")}
          </span>
        </summary>
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-xs font-medium text-ink">{t("planTermsExplain")}</p>
          <dl className="mt-2 space-y-2.5 text-xs text-muted">
            <Term titleKey="planTermIssuer_title" defKey="planTermIssuer_def" />
            <Term titleKey="planTermSecured_title" defKey="planTermSecured_def" />
            <Term titleKey="planTermCreditBuilder_title" defKey="planTermCreditBuilder_def" />
          </dl>
        </div>
      </details>

      <details className="details-disclosure details-disclosure--summary-trailing rounded-control border border-border bg-bg p-3 text-left">
        <summary className="cursor-pointer">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-snug text-ink">{t("planOtherLabel")}</p>
            <p className="mt-1 text-sm text-muted">{t("planOtherAction")}</p>
          </div>
          <span className="shrink-0 pt-0.5 text-xs font-medium leading-none text-accent">
            {t("planTermsExpand")}
          </span>
        </summary>
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-xs font-medium text-ink">{t("planTermsExplain")}</p>
          <dl className="mt-2 space-y-2.5 text-xs text-muted">
            <Term titleKey="planTermDocument_title" defKey="planTermDocument_def" />
            <Term titleKey="planTermThinFile_title" defKey="planTermThinFile_def" />
          </dl>
        </div>
      </details>
    </div>
  );
}
