import { redirect } from "next/navigation";
import { LandingPageBackground } from "@/components/landing/LandingPageBackground";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { fetchWithSession } from "@/lib/server-fetch";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await fetchWithSession("/api/profile");
  if (res.status === 401) {
    redirect("/login");
  }
  if (res.ok) {
    const data = (await res.json()) as { profile: { onboarding_completed_at: string | null } | null };
    if (!data.profile?.onboarding_completed_at) {
      redirect("/onboarding");
    }
  }

  return (
    <div className="relative min-h-screen">
      <LandingPageBackground />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
