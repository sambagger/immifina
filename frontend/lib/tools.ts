/**
 * ImmiFina Tool Use
 * Gives Claude the ability to take real actions during conversations:
 * - Look up live exchange rates
 * - Mark goal steps complete from chat
 * - Find free VITA tax prep locations near the user
 */

import Anthropic from "@anthropic-ai/sdk";
import { createServiceClient } from "@/lib/db";
import { getWorkflow, getStepCount } from "@/lib/workflow-templates";

// ─── Tool Definitions ────────────────────────────────────────────────────────
// These tell Claude what tools exist and when to use them.

export const IMMIFINA_TOOLS: Anthropic.Tool[] = [
  {
    name: "get_exchange_rate",
    description:
      "Get a live exchange rate and convert an amount between currencies. Use this whenever the user asks about sending money abroad, remittances, wire transfers, or says anything like 'how much is $X in pesos/pesos/rupees/etc.' Always use real-time data rather than guessing.",
    input_schema: {
      type: "object" as const,
      properties: {
        from_currency: {
          type: "string",
          description: "Source currency ISO code (e.g. USD)",
        },
        to_currency: {
          type: "string",
          description:
            "Target currency ISO code (e.g. MXN, PHP, INR, GTQ, HNL, DOP, CNY, VND, KOR, NGN, GHS)",
        },
        amount: {
          type: "number",
          description: "Amount in the source currency to convert",
        },
      },
      required: ["from_currency", "to_currency", "amount"],
    },
  },
  {
    name: "update_goal_step",
    description:
      "Mark the user's current goal step as complete when they tell you they've finished it. Use when the user says things like 'I did it', 'I opened the account', 'I applied', 'I got it', 'done', 'I completed this', 'mark it done', or similar confirmation that they finished the current step.",
    input_schema: {
      type: "object" as const,
      properties: {
        confirmed: {
          type: "boolean",
          description:
            "Set to true only when the user has clearly stated they completed the current step",
        },
      },
      required: ["confirmed"],
    },
  },
  {
    name: "find_vita_locations",
    description:
      "Find free IRS-certified tax preparation (VITA) locations near the user. Use when user asks where to get free tax help, how to file taxes for free, VITA sites, free tax prep near me, or anything about getting help filing their tax return without paying.",
    input_schema: {
      type: "object" as const,
      properties: {
        zip_code: {
          type: "string",
          description: "User's 5-digit US ZIP code",
        },
      },
      required: ["zip_code"],
    },
  },
];

// ─── Tool Implementations ─────────────────────────────────────────────────────

async function getExchangeRate(input: {
  from_currency: string;
  to_currency: string;
  amount: number;
}): Promise<Record<string, unknown>> {
  const from = input.from_currency.toUpperCase();
  const to = input.to_currency.toUpperCase();
  const amount = Number(input.amount);

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`, {
      next: { revalidate: 3600 }, // cache 1 hour
    });

    if (!res.ok) {
      return { error: "Could not fetch exchange rate. Please check a live source like Wise or Google." };
    }

    const data = await res.json();

    if (data.result !== "success") {
      return { error: `Exchange rate API error: ${data["error-type"] ?? "unknown"}` };
    }

    const rate = data.rates[to];
    if (!rate) {
      return { error: `Currency code "${to}" not found. Try a standard ISO code like MXN, PHP, INR, GTQ.` };
    }

    const converted = parseFloat((amount * rate).toFixed(2));

    return {
      from,
      to,
      amount,
      converted,
      rate: parseFloat(rate.toFixed(6)),
      last_updated: data.time_last_update_utc,
      disclaimer:
        "This is a mid-market rate. Transfer services like Wise, Remitly, and Western Union will charge a spread and/or fee on top of this rate.",
    };
  } catch {
    return {
      error:
        "Could not reach the exchange rate service. For live rates try wise.com/us/currency-converter or Google.",
    };
  }
}

async function updateGoalStep(
  input: { confirmed: boolean },
  userId: string
): Promise<Record<string, unknown>> {
  if (!input.confirmed) {
    return { success: false, message: "Step not marked complete — confirmation was false." };
  }

  const supabase = createServiceClient();

  const { data: goal } = await supabase
    .from("user_goals")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("started_at", { ascending: false })
    .maybeSingle();

  if (!goal) {
    return {
      success: false,
      message: "No active goal found. The user may need to pick a goal on the dashboard first.",
    };
  }

  const workflow = getWorkflow(goal.goal_type);
  const totalSteps = getStepCount(goal.goal_type);
  const completedStep = goal.current_step;
  const nextStep = completedStep + 1;
  const isLastStep = nextStep >= totalSteps;

  // Record the completion
  await supabase
    .from("goal_step_completions")
    .upsert(
      { user_goal_id: goal.id, step_index: completedStep },
      { onConflict: "user_goal_id,step_index" }
    );

  // Advance or complete the goal
  await supabase
    .from("user_goals")
    .update({
      current_step: isLastStep ? completedStep : nextStep,
      status: isLastStep ? "completed" : "active",
      ...(isLastStep ? { completed_at: new Date().toISOString() } : {}),
    })
    .eq("id", goal.id);

  const nextStepTitle = isLastStep ? null : workflow?.steps[nextStep]?.title ?? null;

  return {
    success: true,
    goal_type: goal.goal_type,
    goal_label: workflow?.label ?? goal.goal_type,
    completed_step_index: completedStep,
    completed_step_title: workflow?.steps[completedStep]?.title ?? null,
    is_goal_complete: isLastStep,
    next_step_index: isLastStep ? null : nextStep,
    next_step_title: nextStepTitle,
    message: isLastStep
      ? `You've completed the "${workflow?.label}" goal — congratulations! Visit your dashboard to pick your next goal.`
      : `Step marked complete. Your next step is: "${nextStepTitle}".`,
  };
}

async function findVitaLocations(input: {
  zip_code: string;
}): Promise<Record<string, unknown>> {
  const zip = input.zip_code.replace(/\D/g, "").slice(0, 5);

  if (zip.length !== 5) {
    return { error: "Please provide a valid 5-digit US ZIP code." };
  }

  return {
    zip_code: zip,
    search_url: `https://irs.treasury.gov/freetaxprep/?zipCode=${zip}&radius=25`,
    aarp_url: `https://www.aarp.org/money/taxes/aarp_taxaide/`,
    phone: "1-800-906-9887",
    key_facts: [
      "VITA is 100% free for people who earn ~$67,000 or less per year",
      "All volunteers are IRS-certified",
      "Many VITA sites support multiple languages including Spanish",
      "VITA can prepare both federal and state returns",
      "ITIN holders (no SSN) can use VITA — volunteers know how to handle this",
    ],
    tip: "Call the IRS helpline (1-800-906-9887) to find a site that speaks your language or handles ITIN filers.",
  };
}

// ─── Tool Dispatcher ─────────────────────────────────────────────────────────

export async function executeTool(
  name: string,
  input: Record<string, unknown>,
  context: { userId: string }
): Promise<Record<string, unknown>> {
  switch (name) {
    case "get_exchange_rate":
      return getExchangeRate(
        input as { from_currency: string; to_currency: string; amount: number }
      );

    case "update_goal_step":
      return updateGoalStep(input as { confirmed: boolean }, context.userId);

    case "find_vita_locations":
      return findVitaLocations(input as { zip_code: string });

    default:
      return { error: `Unknown tool: ${name}` };
  }
}
