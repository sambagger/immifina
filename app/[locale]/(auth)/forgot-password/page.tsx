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
    <Card className="w-full max-w-md">
      <h1 className="font-display text-2xl text-ink">{t("forgotTitle")}</h1>
      <p className="mt-4 text-sm text-muted">{t("forgotBody")}</p>
      <p className="mt-8">
        <Link
          href="/login"
          className="text-sm font-medium text-accent underline-offset-2 hover:underline focus-visible:focus-ring rounded-badge px-1"
        >
          {t("backToLogin")}
        </Link>
      </p>
      <div className="mt-6 space-y-3 border-t border-border pt-4">
        <p className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-center text-xs text-muted">
          <Link href="/terms" className="hover:text-ink">
            {tc("termsOfService")}
          </Link>
          <span aria-hidden className="text-border-strong">
            ·
          </span>
          <Link href="/privacy" className="hover:text-ink">
            {tc("privacyPolicy")}
          </Link>
        </p>
        <LegalFooter />
        <p className="text-center text-xs text-muted">{tc("copyright")}</p>
      </div>
    </Card>
  );
}
