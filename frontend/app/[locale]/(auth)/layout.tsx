import { LandingPageBackground } from "@/components/landing/LandingPageBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <LandingPageBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
