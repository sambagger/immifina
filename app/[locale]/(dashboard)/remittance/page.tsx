import { getTranslations } from "next-intl/server";
import { localeFromParam } from "@/lib/locale-route";
import { RemittanceClient } from "@/components/remittance/RemittanceClient";

export default async function RemittancePage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "remittance" });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="font-display text-3xl text-ink md:text-4xl">{t("title")}</h1>
      <RemittanceClient />
    </div>
  );
}
