import { notFound } from "next/navigation";
import { Link } from "@/navigation";
import { getLearnTopic, LEARN_TOPICS } from "@/lib/learn-topics";
import { LearnTopicViewer } from "@/components/learn/LearnTopicViewer";

export function generateStaticParams() {
  return LEARN_TOPICS.map((t) => ({ topic: t.slug }));
}

export default function LearnTopicPage({
  params,
}: {
  params: { topic: string };
}) {
  const topic = getLearnTopic(params.topic);
  if (!topic) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      {/* Back */}
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        ← All topics
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{topic.icon}</span>
        <div>
          <h1 className="font-display text-2xl text-white md:text-3xl">{topic.title}</h1>
          <p className="mt-0.5 text-sm text-zinc-400">{topic.tagline}</p>
        </div>
      </div>

      {/* Interactive step viewer */}
      <LearnTopicViewer topic={topic} />
    </div>
  );
}
