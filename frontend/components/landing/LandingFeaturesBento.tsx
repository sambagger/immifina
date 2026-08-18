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
    <div className="rounded-3xl border border-black/[0.07] bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-[box-shadow] duration-300 hover:shadow-md md:p-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="min-w-0">
          <h3 className="font-display text-2xl leading-tight tracking-tight text-gray-900 md:text-3xl lg:text-[2.15rem] whitespace-nowrap">
            <span>{headingLine1}</span> <span className="italic text-[#1d6b4f]">{headingAccent}</span>
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-500 md:text-base">{lead}</p>
          <ul className="mt-8 space-y-3.5">
            {bullets.map((b) => (
              <li key={b.title} className="flex gap-3 text-left">
                <span className="mt-0.5 shrink-0 text-[#1d6b4f]" aria-hidden>✓</span>
                <div className="min-w-0 text-sm leading-snug md:text-[15px]">
                  <span className="font-semibold text-gray-800">{b.title}</span>
                  <span className="text-gray-500"> — {b.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="group/snapshot flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-black/[0.07] bg-white shadow-sm transition-all duration-300 hover:border-[#1d6b4f]/25 hover:shadow-md lg:min-h-[300px]">
          <div className="flex items-center gap-2 border-b border-black/[0.06] px-3 py-2.5 sm:px-4">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-black/10" />
              <span className="h-2 w-2 rounded-full bg-black/10" />
              <span className="h-2 w-2 rounded-full bg-black/10" />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">{snapshotLabel}</span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col justify-center px-3 py-4 sm:px-4 sm:py-5">
            <LandingForecastMiniChart className="transition-[filter] duration-300 group-hover/snapshot:brightness-105" />
          </div>
        </div>
      </div>
    </div>
  );
}
