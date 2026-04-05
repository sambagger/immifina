import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { localeFromParam } from "@/lib/locale-route";
import { fetchWithSession } from "@/lib/server-fetch";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default async function OnboardingPage({ params }: { params: { locale: string } }) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "onboarding" });
  const res = await fetchWithSession("/api/profile");

  if (res.status === 401) {
    redirect("/login");
  }

  if (res.ok) {
    const data = (await res.json()) as { profile: { onboarding_completed_at: string | null } | null };
    if (data.profile?.onboarding_completed_at) {
      redirect("/dashboard");
    }
  }

  return (
    <div>
      <h1 className="font-display text-center text-3xl text-ink md:text-4xl">{t("title")}</h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted">{t("intro")}</p>
      <div className="mt-10">
        <OnboardingWizard />
      </div>
    </div>
  );
}
