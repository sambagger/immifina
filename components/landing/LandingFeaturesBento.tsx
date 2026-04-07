import { LandingForecastMiniChart } from "@/components/landing/LandingForecastMiniChart";

type Bullet = { title: string; description: string };

export function LandingFeaturesBento({
  headingLine1,
  headingAccent,
  lead,
  snapshotLabel,
  bullets = [],
}: {
  headingLine1: string;
  headingAccent: string;
  lead: string;
  snapshotLabel: string;
  bullets?: Bullet[];
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/50 p-6 shadow-soft backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-black/[0.42] hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)] md:p-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-tight tracking-tight text-landing-title md:text-3xl lg:text-[2.15rem]">
            <span>{headingLine1}</span> <span className="italic">{headingAccent}</span>
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-landing-body md:text-base">{lead}</p>
          <ul className="mt-8 space-y-4">
            {bullets.map((b) => (
              <li key={b.title} className="flex gap-3 text-left">
                <span className="mt-0.5 shrink-0 font-bold leading-none text-landing-title" aria-hidden>
                  •
                </span>
                <div className="min-w-0 text-sm leading-snug md:text-[15px]">
                  <span className="font-semibold text-landing-body">{b.title}</span>
                  <span className="text-zinc-200"> — {b.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="group/snapshot flex min-h-[260px] flex-col overflow-hidden rounded-xl border border-white/15 bg-black/40 shadow-inner transition-all duration-300 hover:border-[#5ed4a8]/45 hover:bg-black/55 hover:shadow-[0_0_0_1px_rgba(94,212,168,0.15),0_12px_40px_rgba(0,0,0,0.35)] lg:min-h-[300px]">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5 sm:px-4">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">{snapshotLabel}</span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center px-3 py-4 sm:px-4 sm:py-5">
            <LandingForecastMiniChart className="transition-[filter] duration-300 group-hover/snapshot:brightness-110" />
          </div>
        </div>
      </div>
    </div>
  );
}
