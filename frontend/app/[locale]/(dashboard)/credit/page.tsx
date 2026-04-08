import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { localeFromParam } from "@/lib/locale-route";
import { fetchWithSession } from "@/lib/server-fetch";
import { detectCreditPhase, type FinancialProfileRow } from "@/lib/onboarding-logic";
import { Card } from "@/components/ui/Card";
import { EducationalDisclaimer } from "@/components/ui/EducationalDisclaimer";
import { CreditGuidedEstimator } from "@/components/credit/CreditGuidedEstimator";
import { CreditImmigrationPlan } from "@/components/credit/CreditImmigrationPlan";
import {
  CreditEmotionalAcknowledgment,
  ITINCreditPath,
  PredatoryLendingSection,
} from "@/components/credit/CreditPrdSections";
import { CreditFocusSection } from "@/components/credit/CreditFocusSection";

export default async function CreditPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "credit" });
  const res = await fetchWithSession("/api/profile");
  let phase: ReturnType<typeof detectCreditPhase> = "no_history";
  let profile: FinancialProfileRow | null = null;
  if (res.ok) {
    const data = (await res.json()) as { profile: FinancialProfileRow | null };
    profile = data.profile;
    phase = detectCreditPhase(data.profile);
  }
  const phaseKey = `phase_${phase}` as const;
  const showItinPath = Boolean(profile?.has_itin) && !Boolean(profile?.has_ssn);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="font-display text-3xl text-ink md:text-4xl">{t("title")}</h1>

      <CreditEmotionalAcknowledgment />

      {showItinPath ? (
        <Card>
          <ITINCreditPath />
        </Card>
      ) : null}

      <Card>
        <p className="text-sm font-medium text-accent-text">{t("phaseLabel")}</p>
        <h2 className="mt-1 font-display text-xl text-ink">{t(phaseKey)}</h2>
        <p className="mt-3 text-sm text-muted">{t(`${phaseKey}Body`)}</p>
      </Card>

      <CreditFocusSection phase={phase} />

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("mattersMostTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("payment")}</li>
          <li>{t("utilization")}</li>
          <li>{t("age")}</li>
          <li>{t("mix")}</li>
          <li>{t("inquiries")}</li>
        </ul>
      </Card>

      <details className="details-disclosure group rounded-control border border-border bg-surface">
        <summary className="cursor-pointer p-4 font-semibold text-ink">
          {t("whatTitle")}
        </summary>
        <div className="border-t border-border p-4">
          <p className="text-sm text-muted">{t("whatBodyExtended")}</p>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
            <li>{t("rangePoor")}</li>
            <li>{t("rangeFair")}</li>
            <li>{t("rangeGood")}</li>
            <li>{t("rangeVg")}</li>
            <li>{t("rangeEx")}</li>
          </ul>
          <p className="mt-4 text-sm text-muted">{t("invisible")}</p>
        </div>
      </details>

      <details className="details-disclosure group rounded-control border border-border bg-surface">
        <summary className="cursor-pointer p-4 font-semibold text-ink">
          {t("whyImmigrantTitle")}
        </summary>
        <div className="border-t border-border p-4">
          <p className="text-sm text-muted">{t("whyImmigrantBody")}</p>
        </div>
      </details>

      <CreditGuidedEstimator />

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("planTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("planLead")}</p>
        <CreditImmigrationPlan />
      </Card>

      <PredatoryLendingSection />

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("actionNextTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("actionNext1")}</li>
          <li>{t("actionNext2")}</li>
          <li>{t("actionNext3")}</li>
        </ul>
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <Link href="/settings" className="font-medium text-accent underline-offset-2 hover:underline">
            {t("linkSettings")}
          </Link>
          <Link href="/chat" className="font-medium text-accent underline-offset-2 hover:underline">
            {t("linkChat")}
          </Link>
          <Link href="/resources" className="font-medium text-accent underline-offset-2 hover:underline">
            {t("linkResources")}
          </Link>
        </p>
      </Card>

      <EducationalDisclaimer topic="credit" />
    </div>
  );
}
