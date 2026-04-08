import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { LandingNav } from "@/components/landing/LandingNav";

export default function OnboardingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <LandingNav locale={params.locale} />
      <main className="relative z-0 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {children}
      </main>
    </div>
  );
}
