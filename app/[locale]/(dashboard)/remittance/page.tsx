import { getTranslations } from "next-intl/server";
import { RemittanceClient } from "@/components/remittance/RemittanceClient";

export default async function RemittancePage() {
  const t = await getTranslations("remittance");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-3xl text-ink md:text-4xl">{t("title")}</h1>
      <RemittanceClient />
    </div>
  );
}
