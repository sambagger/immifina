/** Types and helpers for onboarding personalization (dashboard, credit phase, next steps). */

export type ImmigrationSituation =
  | "us_citizen"
  | "green_card"
  | "visa"
  | "daca"
  | "other";

export type PrimaryGoal =
  | "build_credit"
  | "bank_account"
  | "save_plan"
  | "remittance"
  | "taxes"
  | "home"
  | "business";

export type CreditPhase = "no_history" | "building" | "establishing" | "optimizing";

export type FinancialProfileRow = {
  monthly_income: number | string | null;
  monthly_expenses: number | string | null;
  current_savings: number | string | null;
  monthly_savings_goal: number | string | null;
  household_size: number | null;
  state_of_residence: string | null;
  has_children: boolean | null;
  onboarding_completed_at: string | null;
  immigration_situation: string | null;
  has_ssn: boolean | null;
  has_itin: boolean | null;
  years_in_us: number | null;
  country_of_origin: string | null;
  primary_goal: string | null;
  employment_status: string | null;
  children_under_18: boolean | null;
  current_debt: number | string | null;
  expense_housing?: number | string | null;
  expense_food?: number | string | null;
  expense_transport?: number | string | null;
  expense_utilities?: number | string | null;
  expense_remittance?: number | string | null;
  expense_other?: number | string | null;
  monthly_can_save?: number | string | null;
};

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function detectCreditPhase(p: FinancialProfileRow | null): CreditPhase {
  if (!p) return "no_history";
  const hasSSN = Boolean(p.has_ssn);
  const hasITIN = Boolean(p.has_itin);
  const years = p.years_in_us ?? 0;
  if (!hasSSN && !hasITIN) return "no_history";
  if (years < 1) return "no_history";
  if (years < 2) return "building";
  if (years < 4) return "establishing";
  return "optimizing";
}

export type NextStep = {
  title: string;
  description: string;
  href: string;
  cta: string;
};

export function getNextSteps(p: FinancialProfileRow | null): NextStep[] {
  const goal = p?.primary_goal ?? "";
  const income = num(p?.monthly_income);
  const expenses = num(p?.monthly_expenses);
  const surplus = income - expenses;
  const savings = num(p?.current_savings);
  const phase = detectCreditPhase(p);

  const steps: NextStep[] = [];

  if (goal === "build_credit" || phase === "no_history") {
    steps.push({
      title: "Start building U.S. credit",
      description:
        "A secured credit card is a common first step when you have little or no U.S. credit history.",
      href: "/credit",
      cta: "Open credit guide",
    });
  }

  if (goal === "bank_account") {
    steps.push({
      title: "Open a bank account",
      description:
        "A checking account helps you pay bills, get paid, and start your financial footprint in the U.S.",
      href: "/chat",
      cta: "Ask the assistant",
    });
  }

  if (goal === "remittance") {
    steps.push({
      title: "Compare ways to send money home",
      description: "Fees and exchange rates vary a lot — small differences add up over a year.",
      href: "/remittance",
      cta: "Compare providers",
    });
  }

  if (goal === "save_plan" || goal === "home") {
    steps.push({
      title: "See your savings forecast",
      description: "Project where steady saving could take you with conservative assumptions.",
      href: "/forecast",
      cta: "Run forecast",
    });
  }

  if (goal === "taxes") {
    steps.push({
      title: "Learn about U.S. taxes",
      description:
        "Tax rules depend on your status and income. Use the assistant for educational explanations — not legal advice.",
      href: "/chat",
      cta: "Ask the assistant",
    });
  }

  if (surplus < 0) {
    steps.push({
      title: "Review your monthly budget",
      description:
        "Your expenses are higher than your income in our snapshot. Small category changes can help.",
      href: "/forecast",
      cta: "Review numbers",
    });
  }

  if (savings < expenses && surplus >= 0) {
    steps.push({
      title: "Build an emergency fund",
      description: `A first goal is often one month of expenses (~$${Math.round(expenses).toLocaleString()}).`,
      href: "/forecast",
      cta: "Plan savings",
    });
  }

  steps.push({
    title: "See programs you may qualify for",
    description: "Many benefits depend on income, household size, and state — always confirm with official sources.",
    href: "/benefits",
    cta: "Benefits finder",
  });

  // Dedupe by href, keep order
  const seen = new Set<string>();
  return steps.filter((s) => {
    if (seen.has(s.href)) return false;
    seen.add(s.href);
    return true;
  }).slice(0, 5);
}

/**
 * 0–100 “foundation” meter. After onboarding, most fields are filled so the score
 * often sits at ~90 until the last segment moves:
 * - 5 pts: SSN or ITIN noted on the profile (Settings)
 * - 5 pts: emergency savings toward one month of expenses (savings ÷ monthly expenses, capped)
 *
 * Previously the last 10 pts required only SSN/ITIN, so many users were stuck at 90%.
 */
export function foundationProgressPct(p: FinancialProfileRow | null): number {
  if (!p?.onboarding_completed_at) return 0;
  let score = 25; // completed onboarding
  if (num(p.monthly_income) > 0 && num(p.monthly_expenses) >= 0) score += 25;
  if (num(p.current_savings) >= 0) score += 15;
  if (p.primary_goal) score += 15;
  if (p.state_of_residence) score += 10;
  if (p.has_ssn || p.has_itin) score += 5;
  const exp = num(p.monthly_expenses);
  const sav = num(p.current_savings);
  if (exp > 0) {
    score += Math.round(Math.min(5, (sav / exp) * 5));
  }
  return Math.min(100, score);
}
