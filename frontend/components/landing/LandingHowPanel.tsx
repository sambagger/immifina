const ICONS = ["🧭", "📊", "💬"];
const BG = ["#EBF7F2", "#FEF9EC", "#F0F4FF"];
const BORDER = ["#a8e6c7", "#fde68a", "#c7d2fe"];

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
        <h2 className="font-display text-3xl leading-tight text-gray-900 md:text-4xl lg:text-[2.75rem]">
          <span>{titleLine1}</span>
          {titleLine2 ? (
            <>
              {" "}
              <span className="italic text-[#1d6b4f]">{titleLine2}</span>
            </>
          ) : null}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-500 md:text-lg">{lead}</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="relative flex flex-col gap-4 rounded-2xl border border-black/[0.07] bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Connector arrow (desktop) */}
            {i < steps.length - 1 && (
              <div
                className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-gray-300 md:block"
                aria-hidden
              >
                →
              </div>
            )}

            {/* Icon circle */}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl"
              style={{ background: BG[i], borderColor: BORDER[i] }}
            >
              {ICONS[i]}
            </div>

            {/* Step number */}
            <span className="font-figures text-xs font-bold tabular-nums text-gray-300">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div>
              <h3 className="font-display text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
