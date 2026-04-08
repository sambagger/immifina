import { getTranslations } from "next-intl/server";
import { localeFromParam } from "@/lib/locale-route";
import { ForecastClient } from "@/components/forecast/ForecastClient";

export default async function ForecastPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "forecast" });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="font-display text-3xl text-ink md:text-4xl">{t("title")}</h1>
      <ForecastClient />
    </div>
  );
}
