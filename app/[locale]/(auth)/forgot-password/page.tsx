import { getTranslations } from "next-intl/server";
import { localeFromParam } from "@/lib/locale-route";
import { Link } from "@/navigation";
import { Card } from "@/components/ui/Card";
import { LegalFooter } from "@/components/LegalFooter";

export default async function ForgotPasswordPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "auth" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <Card variant="glass" className="w-full max-w-md rounded-2xl p-6 md:p-8">
      <h1 className="font-display text-3xl leading-tight text-landing-title md:text-4xl">{t("forgotTitle")}</h1>
      <p className="mt-4 text-sm text-zinc-300">{t("forgotBody")}</p>
      <p className="mt-8">
        <Link
          href="/login"
          className="text-sm font-medium text-landing-title underline-offset-2 transition-colors hover:text-white focus-visible:focus-ring rounded-badge px-1"
        >
          {t("backToLogin")}
        </Link>
      </p>
      <div className="mt-6 space-y-3 border-t border-white/10 pt-4">
        <p className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center text-xs text-zinc-400">
          <Link href="/terms" className="transition-colors hover:text-white">
            {tc("termsOfService")}
          </Link>
          <span aria-hidden className="text-zinc-600">
            ·
          </span>
          <Link href="/privacy" className="transition-colors hover:text-white">
            {tc("privacyPolicy")}
          </Link>
        </p>
        <LegalFooter variant="onDark" />
        <p className="text-center text-xs text-zinc-500">{tc("copyright")}</p>
      </div>
    </Card>
  );
}
