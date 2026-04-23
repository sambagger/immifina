"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/lessons";
import { apiFetch } from "@/lib/api";

type QuizState = "idle" | "answering" | "feedback" | "complete";

type Props = {
  lessonSlug: string;
  questions: QuizQuestion[];
  onComplete?: (passed: boolean, xpGained: number) => void;
};

export function Quiz({ lessonSlug, questions, onComplete }: Props) {
  const [state, setState] = useState<QuizState>("idle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const passMark = Math.ceil(questions.length * (2 / 3));

  function handleStart() {
    setState("answering");
  }

  function handleSelect(idx: number) {
    if (state !== "answering") return;
    setSelected(idx);
  }

  function handleSubmitAnswer() {
    if (selected === null || state !== "answering") return;
    const correct = selected === question.correctIndex;
    if (correct) setCorrectCount((c) => c + 1);
    setState("feedback");
  }

  async function handleNext() {
    if (isLast) {
      // correctCount is already updated by handleSubmitAnswer before this renders
      const passed = correctCount >= passMark;
      setSubmitting(true);
      try {
        const res = await apiFetch(`/lessons/${lessonSlug}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizPassed: passed,
            quizScore: correctCount,
            totalQuestions: questions.length,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { xpGained?: number; earnedBadges?: string[] };
          setXpGained(data.xpGained ?? 0);
          setEarnedBadges(data.earnedBadges ?? []);
          onComplete?.(passed, data.xpGained ?? 0);
        }
      } catch {
        // non-blocking
      } finally {
        setSubmitting(false);
      }
      setState("complete");
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setState("answering");
    }
  }

  const isCorrect = selected !== null && selected === question?.correctIndex;

  // ── Idle (before quiz starts) ─────────────────────────────────
  if (state === "idle") {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-teal-400/70">Quick Quiz</p>
        <p className="mt-1.5 text-sm text-zinc-300">
          {questions.length} questions — need {passMark}/{questions.length} to pass and earn XP
        </p>
        <button
          onClick={handleStart}
          className="mt-3 inline-flex min-h-[36px] items-center justify-center rounded-full border border-teal-500/40 bg-teal-900/30 px-4 text-sm font-medium text-teal-200 transition-colors hover:bg-teal-900/50"
        >
          Start quiz
        </button>
      </div>
    );
  }

  // ── Complete ──────────────────────────────────────────────────
  if (state === "complete") {
    const passed = correctCount >= passMark;

    return (
      <div className={`rounded-xl border p-4 ${passed ? "border-teal-500/30 bg-teal-950/20" : "border-white/10 bg-white/[0.03]"}`}>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Quiz Complete</p>
        <p className={`mt-1.5 text-base font-semibold ${passed ? "text-teal-300" : "text-zinc-200"}`}>
          {passed ? "Passed" : "Not quite"} — {correctCount}/{questions.length} correct
        </p>
        {passed ? (
          <div className="mt-3 space-y-1">
            {xpGained > 0 && (
              <p className="text-sm text-teal-400">+{xpGained} XP earned</p>
            )}
            {earnedBadges.length > 0 && (
              <p className="text-sm text-teal-400">
                Badge{earnedBadges.length > 1 ? "s" : ""} earned: {earnedBadges.join(", ")}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-sm text-zinc-400">No worries — you can retake it anytime.</p>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelected(null);
                setCorrectCount(0);
                setState("answering");
              }}
              className="mt-3 inline-flex min-h-[36px] items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-4 text-sm text-zinc-300 transition-colors hover:text-white"
            >
              Retake quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Answering / Feedback ──────────────────────────────────────
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-5 rounded-full ${i < currentIndex ? "bg-teal-400/60" : i === currentIndex ? "bg-teal-400" : "bg-white/10"}`}
            />
          ))}
        </div>
      </div>

      <p className="text-sm font-medium text-zinc-100">{question.question}</p>

      <div className="space-y-2">
        {question.options.map((option, idx) => {
          let className =
            "w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ";
          if (state === "feedback") {
            if (idx === question.correctIndex) {
              className += "border-teal-500/50 bg-teal-950/30 text-teal-200";
            } else if (idx === selected && idx !== question.correctIndex) {
              className += "border-red-500/40 bg-red-950/20 text-red-300";
            } else {
              className += "border-white/5 text-zinc-500";
            }
          } else {
            className +=
              selected === idx
                ? "border-teal-500/40 bg-teal-900/30 text-zinc-100"
                : "border-white/10 text-zinc-300 hover:border-white/20 hover:text-zinc-100";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={state === "feedback"}
              className={className}
            >
              {option}
            </button>
          );
        })}
      </div>

      {state === "feedback" && (
        <div className={`rounded-lg p-3 text-sm ${isCorrect ? "bg-teal-950/30 text-teal-300" : "bg-white/[0.04] text-zinc-300"}`}>
          <span className="font-medium">{isCorrect ? "Correct. " : "Not quite. "}</span>
          {question.explanation}
        </div>
      )}

      <div className="flex gap-2">
        {state === "answering" && (
          <button
            onClick={handleSubmitAnswer}
            disabled={selected === null}
            className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-teal-500/40 bg-teal-900/30 px-4 text-sm font-medium text-teal-200 transition-colors hover:bg-teal-900/50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        )}
        {state === "feedback" && (
          <button
            onClick={handleNext}
            disabled={submitting}
            className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-4 text-sm font-medium text-zinc-200 transition-colors hover:text-white disabled:opacity-40"
          >
            {submitting ? "Saving…" : isLast ? "Finish" : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}
