export type BadgeId =
  | "first_step"
  | "credit_starter"
  | "money_mover"
  | "paycheck_pro"
  | "streak_7"
  | "bilingual"
  | "bank_builder"
  | "saver"
  | "tax_ready"
  | "goal_getter";

export type Badge = {
  id: BadgeId;
  label: string;
  description: string;
  icon: string;
};

export const BADGES: Record<BadgeId, Badge> = {
  first_step: {
    id: "first_step",
    label: "First Step",
    description: "Complete any workflow step",
    icon: "✦",
  },
  credit_starter: {
    id: "credit_starter",
    label: "Credit Starter",
    description: "Complete the Build U.S. Credit goal",
    icon: "✦",
  },
  money_mover: {
    id: "money_mover",
    label: "Money Mover",
    description: "Complete the Remittance goal",
    icon: "✦",
  },
  paycheck_pro: {
    id: "paycheck_pro",
    label: "Paycheck Pro",
    description: "Pass the paycheck lesson quiz with a perfect score",
    icon: "✦",
  },
  streak_7: {
    id: "streak_7",
    label: "7-Day Streak",
    description: "Complete an action 7 days in a row",
    icon: "✦",
  },
  bilingual: {
    id: "bilingual",
    label: "Bilingual",
    description: "Complete a lesson in a non-English language",
    icon: "✦",
  },
  bank_builder: {
    id: "bank_builder",
    label: "Bank Builder",
    description: "Complete the Open a Bank Account goal",
    icon: "✦",
  },
  saver: {
    id: "saver",
    label: "Saver",
    description: "Complete the Save Plan goal",
    icon: "✦",
  },
  tax_ready: {
    id: "tax_ready",
    label: "Tax Ready",
    description: "Complete the Taxes goal",
    icon: "✦",
  },
  goal_getter: {
    id: "goal_getter",
    label: "Goal Getter",
    description: "Complete any 3 goals",
    icon: "✦",
  },
};

export type BadgeCheckContext = {
  eventType: "step_complete" | "goal_complete" | "quiz_pass";
  goalType?: string;
  lessonSlug?: string;
  quizScore?: number;
  totalQuizQuestions?: number;
  completedGoalCount?: number;
  stepIndex?: number;
};

export function getBadgesEarned(ctx: BadgeCheckContext): BadgeId[] {
  const earned: BadgeId[] = [];

  if (ctx.eventType === "step_complete" && ctx.stepIndex === 0) {
    earned.push("first_step");
  }

  if (ctx.eventType === "goal_complete") {
    if (ctx.goalType === "build_credit") earned.push("credit_starter");
    if (ctx.goalType === "remittance") earned.push("money_mover");
    if (ctx.goalType === "bank_account") earned.push("bank_builder");
    if (ctx.goalType === "save_plan") earned.push("saver");
    if (ctx.goalType === "taxes") earned.push("tax_ready");
    if ((ctx.completedGoalCount ?? 0) >= 3) earned.push("goal_getter");
  }

  if (
    ctx.eventType === "quiz_pass" &&
    ctx.lessonSlug === "paycheck-deductions" &&
    ctx.quizScore === ctx.totalQuizQuestions
  ) {
    earned.push("paycheck_pro");
  }

  return earned;
}
