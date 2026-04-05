import { redirect } from "next/navigation";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { fetchWithSession } from "@/lib/server-fetch";

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
      <AnimatedBackground />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
