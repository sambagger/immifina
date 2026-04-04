import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
