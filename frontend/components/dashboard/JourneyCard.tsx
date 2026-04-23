"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/navigation";
import { Card } from "@/components/ui/Card";
import {
  getWorkflow,
  getCurrentStep,
  getProgressPct,
  isGoalComplete,
  getStepCount,
  getPrevStep,
  type UserProfile,
} from "@/lib/workflow-templates";
import { getLessonsForStep } from "@/lib/lessons";
import { Quiz } from "@/components/quiz";
import { apiFetch } from "@/lib/api";

// ── Inline Lesson Panel ───────────────────────────────────────
import type { Lesson } from "@/lib/lessons";

type LessonPanelProps = {
  lesson: Lesson;
  onComplete: (passed: boolean, xpGained: number) => void;
};

function LessonPanel({ lesson, onComplete }: LessonPanelProps) {
  const [screen, setScreen] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const totalScreens = lesson.screens.length;
  const isLastScreen = screen === totalScreens - 1;

  if (showQuiz) {
    return (
      <Quiz
        lessonSlug={lesson.slug}
        questions={lesson.quiz}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-amber-400/70">Lesson</p>
        <span className="text-xs text-zinc-500">{screen + 1}/{totalScreens}</span>
      </div>
      <p className="text-xs font-semibold text-amber-300">{lesson.title}</p>
      <p className="text-sm leading-relaxed text-zinc-300">{lesson.screens[screen]}</p>
      <div className="flex gap-1">
        {lesson.screens.map((_, i) => (
          <span
            key={i}
            className={`h-1 w-5 rounded-full transition-colors ${i <= screen ? "bg-amber-400/60" : "bg-white/10"}`}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {screen > 0 && (
          <button
            onClick={() => setScreen((s) => s - 1)}
            className="inline-flex min-h-[32px] items-center justify-center rounded-full border border-white/10 px-3 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={() => (isLastScreen ? setShowQuiz(true) : setScreen((s) => s + 1))}
          className="inline-flex min-h-[32px] items-center justify-center rounded-full border border-amber-500/30 bg-amber-950/30 px-3 text-xs font-medium text-amber-200 hover:bg-amber-950/50 transition-colors"
        >
          {isLastScreen ? "Take the quiz →" : "Next →"}
        </button>
      </div>
    </div>
  );
}

type UserGoal = {
  id: string;
  goal_type: string;
  status: string;
  current_step: number;
  started_at: string;
  completed_at: string | null;
};

type JourneyCardProps = {
  goal: UserGoal;
  profile: UserProfile;
};

export function JourneyCard({ goal, profile }: JourneyCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMarking, setIsMarking] = useState(false);
  const [isGoingBack, setIsGoingBack] = useState(false);
  const [showCelebration, setShowCelebration] = useState(
    goal.status === "completed" || isGoalComplete(goal.goal_type, goal.current_step)
  );
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [xpToast, setXpToast] = useState<string | null>(null);

  const stepLessons = getLessonsForStep(goal.goal_type, goal.current_step);
  const hasLesson = stepLessons.length > 0;
  const lessonForStep = stepLessons[0];
  const lessonComplete = !hasLesson || completedLessons.includes(lessonForStep?.slug ?? "");

  // Fetch which lessons the user has already completed for this step
  useEffect(() => {
    apiFetch("/gamification")
      .then((r) => r.json())
      .then((d: { lessonSlugs?: string[] }) => {
        if (d.lessonSlugs) setCompletedLessons(d.lessonSlugs);
      })
      .catch(() => {});
  }, [goal.goal_type, goal.current_step]);

  const workflow = getWorkflow(goal.goal_type);
  if (!workflow) return null;

  const currentStepIndex = goal.current_step;
  const totalSteps = getStepCount(goal.goal_type);
  const progressPct = getProgressPct(goal.goal_type, currentStepIndex);
  const currentStep = getCurrentStep(goal.goal_type, currentStepIndex);
  const alreadyComplete = isGoalComplete(goal.goal_type, currentStepIndex) || showCelebration;
  const canGoBack = currentStepIndex > 0 && !alreadyComplete;

  // Check if the step we'd go back to is auto-skipped based on profile
  const prevStepIndex = canGoBack ? getPrevStep(goal.goal_type, currentStepIndex, profile) : -1;
  const prevStepSkipped = canGoBack && prevStepIndex === currentStepIndex; // getPrevStep returned same index = nowhere to go back
  const prevStep = canGoBack && !prevStepSkipped ? workflow.steps[prevStepIndex] : null;
  const prevStepAutoCompleted =
    canGoBack &&
    prevStep === null &&
    currentStepIndex > 0 &&
    workflow.steps[currentStepIndex - 1]?.skipIf?.(profile);

  async function handleMarkDone() {
    if (isMarking || alreadyComplete) return;
    setIsMarking(true);
    try {
      const res = await fetch(`/api/goals/${goal.id}/steps/${currentStepIndex}`, {
        method: "POST",
      });
      if (res.ok) {
        const data = (await res.json()) as { goalCompleted?: boolean };
        if (data.goalCompleted) setShowCelebration(true);
        startTransition(() => router.refresh());
      }
    } finally {
      setIsMarking(false);
    }
  }

  async function handleGoBack() {
    if (isGoingBack || !canGoBack) return;
    setIsGoingBack(true);
    try {
      const res = await fetch(`/api/goals/${goal.id}`, { method: "PATCH" });
      if (res.ok) startTransition(() => router.refresh());
    } finally {
      setIsGoingBack(false);
    }
  }

  // ── Celebration state ──────────────────────────────────────
  if (alreadyComplete) {
    return (
      <Card className="relative overflow-hidden border-teal-500/30 bg-teal-950/20">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400/60 to-transparent" />
        <div className="flex items-start gap-4">
          <span className="text-4xl" aria-hidden>🎉</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-teal-300">
              {workflow.label} — Complete!
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {workflow.completionMessage}
            </p>
            <Link
              href="/goals"
              className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-full border border-teal-500/40 bg-teal-900/50 px-5 text-sm font-semibold text-teal-200 hover:bg-teal-900/70 transition-colors"
            >
              Pick your next goal →
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  // ── Active journey card ────────────────────────────────────
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-teal-400/70">Your Journey</p>
          <h2 className="mt-0.5 text-lg font-semibold text-white">
            <span className="mr-2">{workflow.icon}</span>{workflow.label}
          </h2>
        </div>
        <Link
          href="/goals"
          className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400 hover:border-white/20 hover:text-zinc-300 transition-colors"
        >
          Change goal
        </Link>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Step {Math.min(currentStepIndex + 1, totalSteps)} of {totalSteps}</span>
          <span className="font-medium text-teal-400">{progressPct}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-teal-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Current step */}
      {currentStep && (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Current step</p>
          <h3 className="mt-1 font-semibold text-white">{currentStep.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{currentStep.why}</p>

          <ul className="mt-3 space-y-1.5">
            {currentStep.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <span className="mt-0.5 shrink-0 text-teal-400/60">›</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>

          {currentStep.links && currentStep.links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {currentStep.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 hover:border-white/20 hover:text-white transition-colors"
                >
                  {link.label}
                  <span aria-hidden className="text-zinc-500">↗</span>
                </a>
              ))}
            </div>
          )}

          {/* Inline lesson + quiz */}
          {hasLesson && lessonForStep && (
            <div className="mt-4 space-y-3">
              {!completedLessons.includes(lessonForStep.slug) ? (
                <LessonPanel
                  lesson={lessonForStep}
                  onComplete={(passed, xp) => {
                    setCompletedLessons((prev) => [...prev, lessonForStep.slug]);
                    if (xp > 0) {
                      setXpToast(`+${xp} XP`);
                      setTimeout(() => setXpToast(null), 3000);
                    }
                  }}
                />
              ) : (
                <p className="text-xs text-teal-400/70">Lesson complete — actions unlocked.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {xpToast && (
          <span className="text-sm font-medium text-teal-400 animate-pulse">{xpToast}</span>
        )}
        <button
          onClick={handleMarkDone}
          disabled={isMarking || isPending || !lessonComplete}
          title={!lessonComplete ? "Complete the lesson above to unlock this step" : undefined}
          className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border border-teal-500/40 bg-teal-900/40 px-5 text-sm font-semibold text-teal-200 transition-colors hover:bg-teal-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMarking ? (
            <><span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal-300/30 border-t-teal-300" />Saving…</>
          ) : (
            <>✓ Mark as done</>
          )}
        </button>

        {canGoBack && !prevStepAutoCompleted && !prevStepSkipped && (
          <button
            onClick={handleGoBack}
            disabled={isGoingBack || isPending}
            className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 text-sm text-zinc-400 transition-colors hover:text-zinc-200 hover:border-white/25 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGoingBack ? (
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-400/30 border-t-zinc-400" />
            ) : (
              <>← Go back</>
            )}
          </button>
        )}

        {canGoBack && (prevStepAutoCompleted || prevStepSkipped) && (
          <p className="text-xs text-zinc-500 italic">
            Previous step was completed automatically based on your profile
          </p>
        )}

        {currentStep?.chatPrompt && (
          <Link
            href={`/chat?q=${encodeURIComponent(currentStep.chatPrompt)}`}
            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.10] hover:text-white"
          >
            <span aria-hidden>💬</span> Ask ImmiFina about this
          </Link>
        )}
      </div>
    </Card>
  );
}

// ── Pick Your Path (no active goal) ───────────────────────────
export function PickYourPathCard() {
  return (
    <Card className="relative overflow-hidden border-dashed border-white/15">
      <div className="flex items-start gap-4">
        <span className="text-3xl" aria-hidden>🗺️</span>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">Start Your Financial Journey</h2>
          <p className="mt-1.5 text-sm text-zinc-400">
            Choose a goal and ImmiFina will guide you step by step — with plain explanations and free resources at every stage.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: "📈 Build credit", href: "/goals?start=build_credit" },
              { label: "🏦 Open a bank account", href: "/goals?start=bank_account" },
              { label: "💰 Save money", href: "/goals?start=save_plan" },
              { label: "💸 Send money home", href: "/goals?start=remittance" },
            ].map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-zinc-300 hover:border-white/20 hover:text-white transition-colors"
              >
                {g.label}
              </Link>
            ))}
          </div>
          <Link
            href="/goals"
            className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/20 bg-white/[0.07] px-5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.12]"
          >
            See all goals →
          </Link>
        </div>
      </div>
    </Card>
  );
}
