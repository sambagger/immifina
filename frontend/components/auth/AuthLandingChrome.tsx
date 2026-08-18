"use client";

import type { ReactNode } from "react";
import { LandingPageBackground } from "@/components/landing/LandingPageBackground";

/** Single client boundary for auth pages that use the starfield background. */
export function AuthLandingChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <LandingPageBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
