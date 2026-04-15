import { Link } from "@/navigation";
import { LEARN_TOPICS } from "@/lib/learn-topics";

// All cards use the same teal color
const CARD_CLASS = "border-white/10 bg-white/[0.03] hover:border-teal-700/40 hover:bg-teal-950/20";
const BADGE_CLASS = "bg-teal-950/60 text-teal-300 border-teal-500/30";

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-ink md:text-4xl">Learn</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Step-by-step guides to the U.S. financial system — with interactive calculators so you can apply it to your own situation.
        </p>
      </div>

      {/* Topic cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {LEARN_TOPICS.map((topic) => (
          <Link
            key={topic.slug}
            href={`/learn/${topic.slug}`}
            className={`group flex flex-col gap-4 rounded-2xl border p-5 transition-all ${CARD_CLASS}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{topic.icon}</span>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${BADGE_CLASS}`}>
                {topic.steps.length} steps
              </span>
            </div>
            <div>
              <p className="font-semibold text-zinc-100 group-hover:text-white transition-colors">
                {topic.title}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                {topic.tagline}
              </p>
            </div>
            <span className="mt-auto text-xs font-medium text-teal-500 group-hover:text-teal-400 transition-colors">
              Start learning →
            </span>
          </Link>
        ))}
      </div>

      {/* Ask ImmiFina CTA */}
      <div className="rounded-2xl border border-teal-700/30 bg-teal-950/20 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-zinc-200">Have a question about something you read?</p>
          <p className="mt-1 text-sm text-zinc-400">Ask ImmiFina — it knows all these guides and can explain them based on your specific situation.</p>
        </div>
        <Link
          href="/chat"
          className="shrink-0 inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/20 bg-teal-900/50 px-6 text-sm font-semibold text-teal-200 transition hover:bg-teal-900/70"
        >
          Ask a question →
        </Link>
      </div>
    </div>
  );
}
