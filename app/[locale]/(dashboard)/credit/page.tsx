import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/Card";
import { CreditSimulator } from "@/components/credit/CreditSimulator";

export default async function CreditPage() {
  const t = await getTranslations("credit");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <h1 className="font-display text-3xl text-ink md:text-4xl">{t("title")}</h1>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("whatTitle")}</h2>
        <p className="mt-3 text-sm text-muted">{t("whatBody")}</p>
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

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("assessTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("assessBody")}</p>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>• {t("qNew")}</li>
          <li>• {t("qSecured")}</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("planTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("planCitizen")}</li>
          <li>{t("planVisa")}</li>
          <li>{t("planOther")}</li>
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-ink">{t("stepsTitle")}</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          <li>{t("stepSecured")}</li>
          <li>{t("stepBuilder")}</li>
          <li>{t("stepAU")}</li>
        </ul>
      </Card>

      <CreditSimulator />
    </div>
  );
}
