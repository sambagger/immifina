"use client";

import type { ReactNode } from "react";
import { LandingPageBackground } from "@/components/landing/LandingPageBackground";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

/** One client root so background + shell share React (avoids invalid hook calls when a server layout renders multiple client siblings). */
export function DashboardChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <LandingPageBackground />
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}
