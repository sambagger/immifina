import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/navigation";
import { localeFromParam } from "@/lib/locale-route";
import { fetchWithSession } from "@/lib/server-fetch";
import { Card } from "@/components/ui/Card";
import { type FinancialProfileRow } from "@/lib/onboarding-logic";
import { JourneyCard, PickYourPathCard } from "@/components/dashboard/JourneyCard";
import { getWorkflow, getSmartStartStep, type UserProfile } from "@/lib/workflow-templates";
import { getNudge } from "@/lib/nudges";

type ProfileResponse = {
  user: { name: string; email: string };
  profile: FinancialProfileRow | null;
  recentConversations: { id: string; title: string | null; created_at: string }[];
};

type GoalResponse = {
  goal: {
    id: string;
    goal_type: string;
    status: string;
    current_step: number;
    started_at: string;
    completed_at: string | null;
  } | null;
  completions: { step_index: number; completed_at: string }[];
};

// Goal-specific starter chat prompts
const GOAL_PROMPTS: Record<string, string[]> = {
  build_credit: [
    "Can I build credit in the U.S. with an ITIN instead of an SSN?",
    "How do secured credit cards work and how do I choose one?",
    "How long does it take to get my first credit score?",
  ],
  bank_account: [
    "What ID documents do banks accept from immigrants?",
    "Are there banks that let me open an account without an SSN?",
    "What's the difference between a checking and savings account?",
  ],
  save_plan: [
    "How do I figure out how much I can realistically save each month?",
    "What is a high-yield savings account and how do I find one?",
    "Can immigrants with an ITIN open an IRA or 401(k)?",
  ],
  remittance: [
    "How do I compare remittance providers to find the lowest fees?",
    "What's the difference between an exchange rate margin and a transfer fee?",
    "Which remittance apps work best for sending money to my country?",
  ],
  taxes: [
    "Do I need to file U.S. taxes if I'm not a citizen?",
    "What is an ITIN and how do I apply for one?",
    "What is VITA and how can they help me file for free?",
  ],
  home: [
    "Can immigrants get a mortgage in the U.S.?",
    "What credit score do I need to buy a home?",
    "What does an ITIN mortgage look like compared to a regular mortgage?",
  ],
  business: [
    "Can I start an LLC if I'm not a U.S. citizen?",
    "How do I get an EIN with just an ITIN?",
    "How much should I set aside for self-employment taxes?",
  ],
};

const DEFAULT_PROMPTS = [
  "What's a good first step for managing money as a new immigrant?",
  "How do I start building credit in the U.S.?",
  "Can I send money home and still save for myself?",
];

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}

export default async function DashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = localeFromParam(params.locale);
  const t = await getTranslations({ locale, namespace: "dashboard" });

  const [profileRes, goalRes, gamificationRes] = await Promise.all([
    fetchWithSession("/api/profile"),
    fetchWithSession("/api/goals"),
    fetchWithSession("/api/gamification"),
  ]);

  if (profileRes.status === 401) redirect("/login");

  if (!profileRes.ok) {
    return (
      <div className="rounded-card border border-amber bg-amber-light p-6 text-amber">
        <p>{t("profileSkeleton")}</p>
      </div>
    );
  }

  const data = (await profileRes.json()) as ProfileResponse;
  const goalData = goalRes.ok ? ((await goalRes.json()) as GoalResponse) : null;
  const gamification = gamificationRes.ok
    ? ((await gamificationRes.json()) as {
        xp: number;
        level: number;
        levelName: string;
        progressPct: number;
        progressXP: number;
        nextLevelXP: number | null;
        streak: number;
        badges: { badge_id: string; earned_at: string }[];
      })
    : null;

  const p = data.profile;
  const income = Number(p?.monthly_income ?? 0);
  const expenses = Number(p?.monthly_expenses ?? 0);
  const surplus = income - expenses;
  const savings = Number(p?.current_savings ?? 0);

  const activeGoal = goalData?.goal ?? null;
  const goalWorkflow = activeGoal ? getWorkflow(activeGoal.goal_type) : null;

  // Build profile for smart step skipping
  const userProfile: UserProfile = {
    has_ssn: p?.has_ssn,
    has_itin: p?.has_itin,
    years_in_us: p?.years_in_us,
    immigration_situation: p?.immigration_situation,
    employment_status: p?.employment_status,
    monthly_income: p?.monthly_income != null ? Number(p.monthly_income) : null,
  };

  // If active goal's current_step is 0 and user profile means they should skip ahead, advance it
  // (This handles existing goals created before smart skipping was added)
  const smartStart = activeGoal
    ? getSmartStartStep(activeGoal.goal_type, userProfile)
    : 0;
  const effectiveStep = activeGoal
    ? Math.max(activeGoal.current_step, smartStart)
    : 0;
  const adjustedGoal = activeGoal && effectiveStep !== activeGoal.current_step
    ? { ...activeGoal, current_step: effectiveStep }
    : activeGoal;

  // Compute situation-aware nudge
  const nudge = getNudge(
    {
      ...userProfile,
      monthly_income: p?.monthly_income != null ? Number(p.monthly_income) : null,
      monthly_expenses: p?.monthly_expenses != null ? Number(p.monthly_expenses) : null,
      monthly_can_save: p?.monthly_can_save != null ? Number(p.monthly_can_save) : null,
      current_savings: p?.current_savings != null ? Number(p.current_savings) : null,
      current_debt: p?.current_debt != null ? Number(p.current_debt) : null,
      expense_remittance: p?.expense_remittance != null ? Number(p.expense_remittance) : null,
      primary_goal: p?.primary_goal,
    },
    adjustedGoal
      ? { goal_type: adjustedGoal.goal_type, current_step: adjustedGoal.current_step, status: adjustedGoal.status }
      : null
  );

  const chatPrompts = activeGoal && GOAL_PROMPTS[activeGoal.goal_type]
    ? GOAL_PROMPTS[activeGoal.goal_type]
    : DEFAULT_PROMPTS;

  // Immigration status label for banner
  const immigrationLabel = (() => {
    const s = p?.immigration_situation ?? "";
    const map: Record<string, string> = {
      us_citizen: "U.S. citizen",
      green_card: "Permanent resident",
      visa: "Visa holder",
      daca: "DACA",
      other: "Immigrant",
    };
    return map[s] ?? null;
  })();

  return (
    <div className="space-y-6">
      {/* ── Greeting + situation ──────────────────────────────── */}
      <div>
        <h1 className="font-display text-3xl text-white md:text-4xl">
          {getGreeting(data.user.name)}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
          {immigrationLabel && <span>{immigrationLabel}</span>}
          {immigrationLabel && goalWorkflow && <span className="text-zinc-600" aria-hidden>•</span>}
          {goalWorkflow && (
            <span>{goalWorkflow.icon} {goalWorkflow.label}</span>
          )}
          {activeGoal?.status === "active" && goalWorkflow && (
            <>
              <span className="text-zinc-600" aria-hidden>•</span>
              <span className="text-teal-400">
                Step {Math.min(effectiveStep + 1, goalWorkflow.steps.length)} of {goalWorkflow.steps.length}
              </span>
            </>
          )}
          {!immigrationLabel && !goalWorkflow && (
            <span>{t("journeyLead")}</span>
          )}
        </div>
      </div>

      {/* ── XP / Level bar ───────────────────────────────────── */}
      {gamification && (gamification.xp > 0 || gamification.streak > 0) && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-400">{gamification.levelName}</span>
                <span className="text-xs text-zinc-600">Lv.{gamification.level}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-teal-400 transition-all duration-500"
                    style={{ width: `${gamification.progressPct}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-500 font-figures">
                  {gamification.xp} XP
                  {gamification.nextLevelXP && ` / ${gamification.nextLevelXP}`}
                </span>
              </div>
            </div>
          </div>
          {gamification.streak >= 2 && (
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span className="text-xs text-zinc-400">{gamification.streak}-day streak</span>
            </div>
          )}
          {gamification.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 ml-auto shrink-0">
              {gamification.badges.slice(0, 4).map((b) => (
                <span
                  key={b.badge_id}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-xs text-zinc-400"
                >
                  {b.badge_id.replace(/_/g, " ")}
                </span>
              ))}
              {gamification.badges.length > 4 && (
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-xs text-zinc-500">
                  +{gamification.badges.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Journey card ─────────────────────────────────────── */}
      {adjustedGoal ? (
        <JourneyCard goal={adjustedGoal} profile={userProfile} />
      ) : (
        <PickYourPathCard />
      )}

      {/* ── Situation-aware nudge ────────────────────────────── */}
      {nudge && (
        <div className={`rounded-2xl border px-4 py-4 ${
          nudge.type === "warning"   ? "border-amber-500/30 bg-amber-950/20" :
          nudge.type === "action"    ? "border-teal-500/25 bg-teal-950/15" :
          nudge.type === "milestone" ? "border-purple-500/25 bg-purple-950/15" :
                                       "border-white/10 bg-white/[0.04]"
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0" aria-hidden>{nudge.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${
                nudge.type === "warning"   ? "text-amber-300" :
                nudge.type === "action"    ? "text-teal-300" :
                nudge.type === "milestone" ? "text-purple-300" :
                                             "text-white"
              }`}>
                {nudge.headline}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{nudge.body}</p>
              {nudge.cta && (
                <Link
                  href={nudge.cta.href}
                  className="mt-2 inline-flex text-xs font-medium text-teal-400 hover:text-teal-300 underline-offset-2 hover:underline transition-colors"
                >
                  {nudge.cta.label} →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Financial snapshot (compact) ─────────────────────── */}
      {(income > 0 || expenses > 0 || savings > 0) && (
        <Card>
          <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
            Your numbers
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <dt className="text-xs text-zinc-500">Monthly income</dt>
              <dd className="font-figures mt-0.5 text-base font-medium text-white">
                ${income.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Monthly expenses</dt>
              <dd className="font-figures mt-0.5 text-base font-medium text-white">
                ${expenses.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Monthly surplus</dt>
              <dd className={`font-figures mt-0.5 text-base font-medium ${surplus < 0 ? "text-red-400" : "text-teal-400"}`}>
                ${Math.round(surplus).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Savings</dt>
              <dd className="font-figures mt-0.5 text-base font-medium text-white">
                ${savings.toLocaleString()}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-zinc-600">
            <Link href="/settings" className="text-zinc-500 hover:text-zinc-300 underline-offset-2 hover:underline">
              Update your numbers
            </Link>
          </p>
        </Card>
      )}

      {/* ── Goal-aware chat prompts ───────────────────────────── */}
      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          {activeGoal && goalWorkflow ? `Ask about ${goalWorkflow.label}` : "Ask ImmiFina"}
        </h2>
        <div className="mt-3 flex flex-col gap-2">
          {chatPrompts.map((prompt) => (
            <Link
              key={prompt}
              href={`/chat?q=${encodeURIComponent(prompt)}`}
              className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
            >
              <span className="mt-px shrink-0 text-teal-400/70" aria-hidden>›</span>
              {prompt}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Quick links ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
        <Link href="/forecast" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          Financial forecast →
        </Link>
        <span className="text-zinc-700">·</span>
        <Link href="/benefits" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          Benefits finder →
        </Link>
        <span className="text-zinc-700">·</span>
        <Link href="/settings" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          Settings →
        </Link>
      </div>
    </div>
  );
}
