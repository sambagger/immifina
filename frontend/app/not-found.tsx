import Link from "next/link";
import { LandingPageBackground } from "@/components/landing/LandingPageBackground";

export default function NotFound() {
  return (
    <>
      <LandingPageBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <p className="font-figures text-[8rem] font-bold leading-none tabular-nums text-teal-500/20 md:text-[12rem]">
          404
        </p>
        <h1 className="font-display -mt-4 text-3xl text-landing-title md:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-sm text-base text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/25 bg-[#1d6b4f] px-8 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(0,0,0,0.55)] transition-[transform,box-shadow] hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(0,0,0,0.6)] active:scale-[0.98]"
          >
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/35 bg-white/10 px-8 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md transition-[background-color,transform] hover:scale-[1.03] hover:bg-white/15 active:scale-[0.98]"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
