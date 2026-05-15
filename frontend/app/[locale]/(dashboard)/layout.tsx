import { redirect } from "next/navigation";
import { DashboardChrome } from "@/components/dashboard/DashboardChrome";
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

  return <DashboardChrome>{children}</DashboardChrome>;
}
