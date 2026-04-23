/**
 * ImmiFina Situation-Aware Nudges
 *
 * Rule-based insights computed from the user's profile and active goal.
 * No AI call needed — these are specific, calculated, and instant.
 *
 * Each nudge has a type so the UI can style it appropriately:
 * - "insight"  → blue/neutral — interesting fact about their situation
 * - "action"   → emerald — specific next action they can take right now
 * - "warning"  → amber — something that needs attention
 * - "milestone" → purple — celebrating progress
 */

import type { UserProfile } from "@/lib/workflow-templates";

export type Nudge = {
  type: "insight" | "action" | "warning" | "milestone";
  headline: string;
  body: string;
  cta?: { label: string; href: string };
};

type FullProfile = UserProfile & {
  monthly_income?: number | null;
  monthly_expenses?: number | null;
  monthly_can_save?: number | null;
  current_savings?: number | null;
  current_debt?: number | null;
  expense_remittance?: number | null;
  state_of_residence?: string | null;
  primary_goal?: string | null;
  country_of_origin?: string | null;
};

type ActiveGoal = {
  goal_type: string;
  current_step: number;
  status: string;
} | null;

/**
 * Returns the single most relevant nudge for this user.
 * Priority: warning > action > insight > milestone.
 */
export function getNudge(profile: FullProfile, activeGoal: ActiveGoal): Nudge | null {
  const income = Number(profile.monthly_income ?? 0);
  const expenses = Number(profile.monthly_expenses ?? 0);
  const canSave = Number(profile.monthly_can_save ?? Math.max(0, income - expenses));
  const savings = Number(profile.current_savings ?? 0);
  const debt = Number(profile.current_debt ?? 0);
  const remittance = Number(profile.expense_remittance ?? 0);
  const surplus = income - expenses;
  const goalType = activeGoal?.goal_type ?? profile.primary_goal ?? "";
  const step = activeGoal?.current_step ?? 0;
  const hasId = !!(profile.has_ssn || profile.has_itin);

  // ── Warnings (highest priority) ───────────────────────────
  if (income > 0 && surplus < 0) {
    return {
      type: "warning",
      headline: "Your expenses exceed your income",
      body: `You're spending $${Math.abs(Math.round(surplus)).toLocaleString()} more than you earn each month. Before focusing on ${goalLabel(goalType)}, it may help to review your largest expense categories.`,
      cta: { label: "Update your numbers", href: "/settings" },
    };
  }

  // ── Goal-specific action nudges ────────────────────────────
  if (goalType === "build_credit") {
    if (!hasId) {
      return {
        type: "action",
        headline: "Getting an ITIN is your first step",
        body: "To open a secured credit card, most issuers need an SSN or ITIN. An ITIN application takes 7–11 weeks — starting now means you're credit-ready that much sooner.",
        cta: { label: "Read the ITIN guide", href: "/guides/itin" },
      };
    }

    if (step === 1 && canSave > 0) {
      const monthsToDeposit = canSave >= 200 ? 0 : Math.ceil((200 - savings) / canSave);
      if (monthsToDeposit <= 0) {
        return {
          type: "action",
          headline: "You have enough saved for a secured card deposit",
          body: "Most secured cards require $200–$500 as a deposit. Based on your savings, you can open one now. Look for a card that reports to all three credit bureaus.",
          cta: { label: "How secured cards work", href: "/guides/secured-cards" },
        };
      }
      return {
        type: "insight",
        headline: `Secured card deposit ready in ~${monthsToDeposit} month${monthsToDeposit !== 1 ? "s" : ""}`,
        body: `A $200 secured card deposit at your current savings rate ($${Math.round(canSave).toLocaleString()}/mo) puts you on track for ${monthsToDeposit <= 1 ? "next month" : `${monthsToDeposit} months from now`}.`,
      };
    }

    if (step >= 2) {
      return {
        type: "insight",
        headline: "Payment history is 35% of your credit score",
        body: "The single most important thing you can do right now is pay your card on time, every month. Even one missed payment can set progress back significantly.",
        cta: { label: "Ask ImmiFina about this", href: "/chat?q=How+do+I+set+up+autopay+on+my+secured+card" },
      };
    }
  }

  if (goalType === "bank_account") {
    return {
      type: "action",
      headline: hasId ? "You can open an account with your ITIN or SSN" : "You can open a bank account without an SSN",
      body: hasId
        ? "Many banks and credit unions accept ITINs to open checking accounts. Call ahead and ask specifically about ITIN accounts before visiting."
        : "A passport and proof of address is often enough. Community banks and credit unions are typically more flexible than large national banks.",
      cta: { label: "Banking with an ITIN guide", href: "/guides/itin-banking" },
    };
  }

  if (goalType === "save_plan") {
    if (surplus > 0 && canSave > 0) {
      const emergencyTarget = expenses;
      const monthsToEmergency =
        emergencyTarget > 0 && savings < emergencyTarget
          ? Math.ceil((emergencyTarget - savings) / canSave)
          : 0;

      if (monthsToEmergency > 0) {
        return {
          type: "action",
          headline: `Emergency fund: ${monthsToEmergency} month${monthsToEmergency !== 1 ? "s" : ""} away`,
          body: `At $${Math.round(canSave).toLocaleString()}/month saved, you'd reach one month of expenses ($${Math.round(emergencyTarget).toLocaleString()}) in ${monthsToEmergency} month${monthsToEmergency !== 1 ? "s" : ""}. Automating this transfer on payday makes it happen without thinking.`,
          cta: { label: "How to automate savings", href: "/chat?q=How+do+I+automate+my+savings" },
        };
      }

      return {
        type: "milestone",
        headline: "Your emergency fund is on track",
        body: `You have $${Math.round(savings).toLocaleString()} saved — that covers ${expenses > 0 ? Math.round((savings / expenses) * 10) / 10 : "?"} month(s) of expenses. Next goal: build toward 3 months.`,
      };
    }
  }

  if (goalType === "remittance") {
    if (remittance > 0) {
      const annualRemittance = remittance * 12;
      const estimatedSavings = Math.round(annualRemittance * 0.04); // ~4% savings from switching providers
      return {
        type: "insight",
        headline: `You could save ~$${estimatedSavings}/year on transfers`,
        body: `You're sending about $${remittance.toLocaleString()}/month. Most transfer services charge 3–5% in fees and exchange rate margins. Switching to a lower-cost provider could save around $${estimatedSavings} annually.`,
        cta: { label: "Compare remittance options", href: "/guides/remittance-options" },
      };
    }
    return {
      type: "action",
      headline: "Compare providers before your next transfer",
      body: "Exchange rate margins — not just fees — are where most money is lost. Use remittanceprices.worldbank.org to compare the true cost for your destination country.",
      cta: { label: "How remittances work", href: "/guides/remittance-options" },
    };
  }

  if (goalType === "taxes") {
    return {
      type: "action",
      headline: "VITA prepares your taxes for free",
      body: "If you earn under $67,000, IRS-certified VITA volunteers file your federal and state return at no cost — and can help you apply for an ITIN at the same time.",
      cta: { label: "Find a VITA site", href: "/guides/vita-free-taxes" },
    };
  }

  if (goalType === "home") {
    if (!hasId) {
      return {
        type: "insight",
        headline: "ITIN mortgages exist for non-SSN holders",
        body: "Some community banks and credit unions offer mortgages to ITIN holders. Building credit now directly increases the loan terms you'll qualify for later.",
        cta: { label: "Ask ImmiFina", href: "/chat?q=Can+I+get+a+mortgage+with+an+ITIN" },
      };
    }
    return {
      type: "insight",
      headline: "Credit score is the #1 factor in your mortgage rate",
      body: "A difference of 50 points in credit score can mean a 0.5–1% difference in interest rate — adding up to tens of thousands of dollars over a 30-year loan. Focus on credit first.",
    };
  }

  if (goalType === "business") {
    return {
      type: "action",
      headline: "You can form an LLC without a U.S. Social Security Number",
      body: "Non-citizens and non-residents can form LLCs in most states. After forming, apply for an EIN from the IRS — you can do this with just an ITIN.",
      cta: { label: "Starting a business guide", href: "/chat?q=Can+I+form+an+LLC+without+an+SSN" },
    };
  }

  // ── General insights (fallback) ────────────────────────────
  if (debt > 0 && income > 0) {
    const debtToIncome = debt / income;
    if (debtToIncome > 3) {
      return {
        type: "warning",
        headline: "High debt may affect your next steps",
        body: `Your current debt ($${debt.toLocaleString()}) is high relative to your monthly income. Many lenders consider debt-to-income ratio when deciding on loans and credit cards.`,
        cta: { label: "Ask ImmiFina", href: "/chat?q=How+does+debt+affect+my+ability+to+build+credit" },
      };
    }
  }

  if (!profile.primary_goal) {
    return {
      type: "action",
      headline: "Pick a goal to get personalized guidance",
      body: "ImmiFina guides you step by step based on your situation. Choose one thing to focus on and we'll map out the path.",
      cta: { label: "Choose your goal", href: "/goals" },
    };
  }

  return null;
}

function goalLabel(goalType: string): string {
  const labels: Record<string, string> = {
    build_credit: "building credit",
    bank_account: "opening a bank account",
    save_plan: "saving",
    remittance: "sending money home",
    taxes: "filing taxes",
    home: "buying a home",
    business: "starting a business",
  };
  return labels[goalType] ?? "your goal";
}
