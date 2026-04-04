import { getTranslations } from "next-intl/server";
import { BenefitsClient } from "@/components/benefits/BenefitsClient";

export default async function BenefitsPage() {
  const t = await getTranslations("benefits");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-3xl text-ink md:text-4xl">{t("title")}</h1>
      <BenefitsClient />
    </div>
  );
}
