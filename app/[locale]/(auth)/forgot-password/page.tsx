import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Card } from "@/components/ui/Card";
import { LegalFooter } from "@/components/LegalFooter";

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

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
      <div className="mt-8 border-t border-border pt-6">
        <LegalFooter />
      </div>
    </Card>
  );
}
