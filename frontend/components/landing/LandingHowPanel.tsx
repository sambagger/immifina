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
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl leading-tight text-landing-title md:text-4xl lg:text-[2.75rem]">
          <span>{titleLine1}</span>
          {titleLine2 ? (
            <>
              {" "}
              <span className="italic">{titleLine2}</span>
            </>
          ) : null}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-landing-body md:text-lg">{lead}</p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-0">
        {steps.map((step, i) => (
          <div key={step.title} className="relative md:pr-12 md:last:pr-0">
            {/* Dashed connector between steps (desktop only) */}
            {i < steps.length - 1 && (
              <div
                className="absolute right-0 top-[1.6rem] hidden h-px w-10 border-t border-dashed border-white/20 md:block"
                aria-hidden
              />
            )}

            {/* Step number */}
            <span className="animate-number-breathe font-figures block text-[3.5rem] font-bold leading-none tabular-nums text-emerald-500 md:text-[4rem]">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Divider under number */}
            <div className="mt-4 h-px w-8 bg-emerald-500/40" aria-hidden />

            {/* Content */}
            <h3 className="font-display mt-5 text-lg font-semibold text-landing-title md:text-xl">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-landing-body md:text-base">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
