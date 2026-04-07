import { getTranslations } from "next-intl/server";
import { localeFromParam } from "@/lib/locale-route";
import { BankingGuide } from "@/components/banking/BankingGuide";

export default async function BankingPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "banking" });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-3xl text-ink md:text-4xl">{t("title")}</h1>
      <BankingGuide />
    </div>
  );
}
