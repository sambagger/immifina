"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { WORKFLOWS, ALL_GOALS, type PrimaryGoal } from "@/lib/workflow-templates";

function GoalGrid() {
  const router = useRouter();


  const [selecting, setSelecting] = useState<PrimaryGoal | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(goalType: PrimaryGoal) {
    if (selecting) return;
    setSelecting(goalType);
    setError(null);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goalType }),
      });
      if (!res.ok) {
        setError("Couldn't start that goal. Please try again.");
        return;
      }
      // refresh() clears the Next.js router cache so dashboard re-fetches fresh goal data
      router.refresh();
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSelecting(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-white md:text-4xl">
          Choose Your Goal
        </h1>
        <p className="mt-2 text-zinc-400">
          Pick the one thing you want to focus on right now. ImmiFina will guide
          you through it — step by step. You can switch goals at any time.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Goal cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {ALL_GOALS.map((goalType) => {
          const wf = WORKFLOWS[goalType];
          const isLoading = selecting === goalType;
          const isDisabled = selecting !== null && !isLoading;

          return (
            <button
              key={goalType}
              onClick={() => handleSelect(goalType)}
              disabled={isDisabled || isLoading}
              className={`group relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all
                ${isLoading
                  ? "border-teal-500/50 bg-teal-950/30 opacity-100"
                  : isDisabled
                  ? "border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed"
                  : "border-white/10 bg-white/[0.04] hover:border-teal-500/40 hover:bg-teal-950/20 cursor-pointer active:scale-[0.98]"
                }`}
            >
              {/* Text */}
              <div className="flex-1">
                <p className="font-semibold text-white group-hover:text-teal-100 transition-colors">
                  {wf.label}
                </p>
                <p className="mt-1 text-sm text-zinc-400 leading-snug">
                  {wf.description}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  {wf.steps.length} steps
                </p>
              </div>

              {/* Loading spinner */}
              {isLoading && (
                <span className="absolute right-4 top-4 inline-block h-4 w-4 animate-spin rounded-full border-2 border-teal-300/30 border-t-teal-300" />
              )}

              {/* Arrow */}
              {!isLoading && (
                <span className="absolute right-4 top-4 text-zinc-600 group-hover:text-teal-400 transition-colors text-sm" aria-hidden>
                  →
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-zinc-600">
        Not sure where to start?{" "}
        <a
          href="/chat"
          className="text-zinc-400 underline-offset-2 hover:underline hover:text-zinc-300"
        >
          Ask ImmiFina
        </a>{" "}
        and describe your situation — the AI can suggest a goal.
      </p>
    </div>
  );
}

export default function GoalsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl bg-white/[0.04]" />
            ))}
          </div>
        </div>
      }
    >
      <GoalGrid />
    </Suspense>
  );
}
