import { getTranslations } from "next-intl/server";
import { localeFromParam } from "@/lib/locale-route";
import { fetchWithSession } from "@/lib/server-fetch";
import { detectCreditPhase, type FinancialProfileRow } from "@/lib/onboarding-logic";
import { Card } from "@/components/ui/Card";
import { CreditGuidedEstimator } from "@/components/credit/CreditGuidedEstimator";

export default async function CreditPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "credit" });
  const res = await fetchWithSession("/api/profile");
  let phase: ReturnType<typeof detectCreditPhase> = "no_history";
  if (res.ok) {
    const data = (await res.json()) as { profile: FinancialProfileRow | null };
    phase = detectCreditPhase(data.profile);
  }
  const phaseKey = `phase_${phase}` as const;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="font-display text-3xl text-ink md:text-4xl">{t("title")}</h1>

      <Card>
        <p className="text-sm font-medium text-accent-text">{t("phaseLabel")}</p>
        <h2 className="mt-1 font-display text-xl text-ink">{t(phaseKey)}</h2>
        <p className="mt-3 text-sm text-muted">{t(`${phaseKey}Body`)}</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("whatTitle")}</h2>
        <p className="mt-3 text-sm text-muted">{t("whatBodyExtended")}</p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("rangePoor")}</li>
          <li>{t("rangeFair")}</li>
          <li>{t("rangeGood")}</li>
          <li>{t("rangeVg")}</li>
          <li>{t("rangeEx")}</li>
        </ul>
        <p className="mt-4 text-sm text-muted">{t("invisible")}</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("whyImmigrantTitle")}</h2>
        <p className="mt-3 text-sm text-muted">{t("whyImmigrantBody")}</p>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("factorsTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("payment")}</li>
          <li>{t("utilization")}</li>
          <li>{t("age")}</li>
          <li>{t("mix")}</li>
          <li>{t("inquiries")}</li>
        </ul>
      </Card>

      <CreditGuidedEstimator />

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("planTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("planCitizen")}</li>
          <li>{t("planVisa")}</li>
          <li>{t("planOther")}</li>
        </ul>
      </Card>
    </div>
  );
}
