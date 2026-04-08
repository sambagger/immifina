import type { ReactNode } from "react";

/**
 * Hero copy only — flower background is `LandingPageBackground` (fixed, full scroll).
 */
export function LandingHero({ children }: { children: ReactNode }) {
  return (
    <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 pb-20 pt-32 text-center md:px-8 md:pb-28 md:pt-36">
      {children}
    </section>
  );
}
