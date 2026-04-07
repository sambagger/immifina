import type { ReactNode } from "react";
import { landingHowLeadOneLineClass } from "@/lib/landing-copy-classes";

function GraphicProfile() {
  return (
    <svg viewBox="0 0 120 100" className="mx-auto h-24 w-full max-w-[140px] text-landing-body" aria-hidden>
      <circle cx="60" cy="28" r="18" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d="M30 88c0-16 14-28 30-28s30 12 30 28" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <rect x="24" y="52" width="72" height="36" rx="4" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path d="M32 62h24M32 70h40M32 78h32" stroke="currentColor" strokeWidth="1" opacity="0.45" />
    </svg>
  );
}

function GraphicPath() {
  return (
    <svg viewBox="0 0 120 100" className="mx-auto h-24 w-full max-w-[140px] text-landing-body" aria-hidden>
      <path
        d="M12 78 Q40 20 60 50 T108 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="4 3"
      />
      <circle cx="12" cy="78" r="5" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="60" cy="50" r="5" fill="rgba(29,107,79,0.25)" stroke="#1d6b4f" strokeWidth="1.25" />
      <circle cx="108" cy="22" r="5" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d="M56 46l8-6 8 6" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.8" />
    </svg>
  );
}

function GraphicChat() {
  return (
    <svg viewBox="0 0 120 100" className="mx-auto h-24 w-full max-w-[140px] text-landing-body" aria-hidden>
      <rect x="8" y="16" width="88" height="36" rx="8" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path d="M24 70 L36 58 H96 V70 Z" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <rect x="28" y="24" width="48" height="4" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="28" y="34" width="32" height="4" rx="1" fill="currentColor" opacity="0.25" />
      <circle cx="100" cy="78" r="14" fill="none" stroke="#1d6b4f" strokeWidth="1.25" opacity="0.95" />
      <path d="M94 78h12M100 72v12" stroke="#1d6b4f" strokeWidth="1.25" />
    </svg>
  );
}

const graphics: ReactNode[] = [<GraphicProfile key="g1" />, <GraphicPath key="g2" />, <GraphicChat key="g3" />];

export function LandingHowPanel({
  titleLine1,
  titleLine2,
  lead,
  steps,
}: {
  titleLine1: string;
  titleLine2: string;
  lead: string;
  steps: { title: string; body: string }[];
}) {
  return (
    <div>
      <div className="flex flex-col items-center text-center">
        <h2 className="font-display text-3xl leading-tight text-landing-title md:text-4xl lg:text-[2.75rem]">
          <span>{titleLine1}</span>
          {titleLine2 ? (
            <>
              {" "}
              <span className="italic">{titleLine2}</span>
            </>
          ) : null}
        </h2>
        <div className="mt-8 w-full max-w-full overflow-x-auto text-center md:mt-10">
          <p className={`inline-block max-w-none whitespace-nowrap text-center ${landingHowLeadOneLineClass}`}>
            {lead}
          </p>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-[28px] border border-white/15 bg-black/50 shadow-soft backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        <div className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="px-6 py-8 transition-colors duration-300 hover:bg-white/[0.07] md:px-8 md:py-10"
            >
              <div className="mb-4 flex min-h-[5.5rem] items-center justify-center">{graphics[i]}</div>
              <h3 className="font-display text-lg font-semibold text-landing-title md:text-xl">{step.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-landing-body md:text-base">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
