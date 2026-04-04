import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-0 flex min-h-screen items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
