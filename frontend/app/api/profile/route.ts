import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getClientIp } from "@/lib/client-ip";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeNumber, sanitizeString } from "@/lib/sanitize";
import { ProfilePatchSchema } from "@/lib/validation";

function toNum(x: unknown): number {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function immigrationSituationToUserStatus(s: string): string {
  const map: Record<string, string> = {
    us_citizen: "U.S. citizen",
    green_card: "Permanent resident",
    visa: "Visa holder",
    daca: "DACA",
    other: "Other / prefer not to say",
  };
  return map[s] ?? s;
}

/** PostgREST PGRST204 when a column is not in the DB (migration not applied). */
function missingColumnFromPostgrestMessage(message: string): string | null {
  const m = message.match(/Could not find the '([^']+)' column/);
  return m?.[1] ?? null;
}

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const supabase = createServiceClient();

  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("id, email, name, preferred_language, immigration_status")
    .eq("id", session.userId)
    .single();

  if (userErr || !user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: profile } = await supabase
    .from("financial_profiles")
    .select("*")
    .eq("user_id", session.userId)
    .maybeSingle();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title, created_at")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: false })
    .limit(3);

  return NextResponse.json({
    user,
    profile: profile ?? null,
    recentConversations: conversations ?? [],
  });
}

export async function PATCH(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ProfilePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const d = parsed.data;

  if (d.name !== undefined || d.preferredLanguage !== undefined || d.immigrationSituation !== undefined) {
    const updates: Record<string, string> = {};
    if (d.name !== undefined) updates.name = sanitizeString(d.name);
    if (d.preferredLanguage !== undefined) {
      updates.preferred_language = d.preferredLanguage;
    }
    if (d.immigrationSituation !== undefined) {
      updates.immigration_status = immigrationSituationToUserStatus(d.immigrationSituation);
    }
    if (Object.keys(updates).length > 0) {
      await supabase.from("users").update(updates).eq("id", session.userId);
    }
  }

  const fin: Record<string, unknown> = {};
  if (d.monthlyIncome !== undefined) fin.monthly_income = sanitizeNumber(d.monthlyIncome);
  if (d.monthlyExpenses !== undefined) fin.monthly_expenses = sanitizeNumber(d.monthlyExpenses);
  if (d.currentSavings !== undefined) fin.current_savings = sanitizeNumber(d.currentSavings);
  if (d.monthlySavingsGoal !== undefined) fin.monthly_savings_goal = sanitizeNumber(d.monthlySavingsGoal);
  if (d.householdSize !== undefined) fin.household_size = d.householdSize;
  if (d.stateOfResidence !== undefined) {
    fin.state_of_residence = d.stateOfResidence
      ? sanitizeString(d.stateOfResidence).toUpperCase().slice(0, 2)
      : null;
  }
  if (d.childrenUnder18 !== undefined) {
    fin.has_children = d.childrenUnder18;
  } else if (d.hasChildren !== undefined) {
    fin.has_children = d.hasChildren;
  }

  if (d.immigrationSituation !== undefined) fin.immigration_situation = d.immigrationSituation;
  if (d.hasSsn !== undefined) fin.has_ssn = d.hasSsn;
  if (d.hasItin !== undefined) fin.has_itin = d.hasItin;
  if (d.yearsInUs !== undefined) fin.years_in_us = d.yearsInUs;
  if (d.countryOfOrigin !== undefined) fin.country_of_origin = sanitizeString(d.countryOfOrigin);
  if (d.primaryGoal !== undefined) fin.primary_goal = d.primaryGoal;
  if (d.employmentStatus !== undefined) fin.employment_status = d.employmentStatus;
  if (d.currentDebt !== undefined) fin.current_debt = sanitizeNumber(d.currentDebt);
  if (d.expenseHousing !== undefined) fin.expense_housing = sanitizeNumber(d.expenseHousing);
  if (d.expenseFood !== undefined) fin.expense_food = sanitizeNumber(d.expenseFood);
  if (d.expenseTransport !== undefined) fin.expense_transport = sanitizeNumber(d.expenseTransport);
  if (d.expenseUtilities !== undefined) fin.expense_utilities = sanitizeNumber(d.expenseUtilities);
  if (d.expenseRemittance !== undefined) fin.expense_remittance = sanitizeNumber(d.expenseRemittance);
  if (d.expenseOther !== undefined) fin.expense_other = sanitizeNumber(d.expenseOther);
  if (d.monthlyCanSave !== undefined) fin.monthly_can_save = sanitizeNumber(d.monthlyCanSave);

  if (d.completeOnboarding === true) {
    fin.onboarding_completed_at = new Date().toISOString();
    if (
      d.expenseHousing !== undefined ||
      d.expenseFood !== undefined ||
      d.expenseTransport !== undefined ||
      d.expenseUtilities !== undefined ||
      d.expenseRemittance !== undefined ||
      d.expenseOther !== undefined
    ) {
      const { data: existing } = await supabase
        .from("financial_profiles")
        .select(
          "expense_housing, expense_food, expense_transport, expense_utilities, expense_remittance, expense_other"
        )
        .eq("user_id", session.userId)
        .maybeSingle();
      const pick = (patch: number | undefined, row: unknown) =>
        patch !== undefined ? sanitizeNumber(patch) : toNum(row);
      const total =
        pick(d.expenseHousing, existing?.expense_housing) +
        pick(d.expenseFood, existing?.expense_food) +
        pick(d.expenseTransport, existing?.expense_transport) +
        pick(d.expenseUtilities, existing?.expense_utilities) +
        pick(d.expenseRemittance, existing?.expense_remittance) +
        pick(d.expenseOther, existing?.expense_other);
      fin.monthly_expenses = Math.round(total * 100) / 100;
    }
    if (d.monthlyCanSave !== undefined) {
      fin.monthly_savings_goal = sanitizeNumber(d.monthlyCanSave);
    }
  }

  if (Object.keys(fin).length > 0) {
    fin.updated_at = new Date().toISOString();

    const { data: existingRow } = await supabase
      .from("financial_profiles")
      .select("id")
      .eq("user_id", session.userId)
      .maybeSingle();

    let payload: Record<string, unknown> = { ...fin };
    const needOnboardingAt = d.completeOnboarding === true;
    let saved = false;

    for (let attempt = 0; attempt < 24; attempt++) {
      const rowOp = existingRow
        ? supabase.from("financial_profiles").update(payload).eq("user_id", session.userId)
        : supabase.from("financial_profiles").insert({
            user_id: session.userId,
            ...payload,
          });

      const { error: writeErr } = await rowOp;
      if (!writeErr) {
        saved = true;
        break;
      }

      const isMissingCol =
        writeErr.code === "PGRST204" || writeErr.message?.includes("schema cache");
      const badCol = isMissingCol ? missingColumnFromPostgrestMessage(writeErr.message ?? "") : null;

      if (!isMissingCol || !badCol || !(badCol in payload)) {
        console.error("[api/profile] PATCH financial_profiles:", writeErr);
        return NextResponse.json({ error: "Could not save profile" }, { status: 500 });
      }

      if (badCol === "onboarding_completed_at" && needOnboardingAt) {
        console.error("[api/profile] PATCH missing onboarding_completed_at column — run supabase/migrations/002_onboarding.sql");
        return NextResponse.json(
          {
            error:
              "Database is missing required columns. Apply supabase/migrations/002_onboarding.sql in the Supabase SQL editor.",
            code: "MIGRATION_REQUIRED",
          },
          { status: 503 }
        );
      }

      console.warn(`[api/profile] omitting column '${badCol}' (add via migration or refresh schema cache)`);
      const next = { ...payload };
      delete next[badCol];
      payload = next;

      if (Object.keys(payload).length === 0) {
        return NextResponse.json({ error: "Could not save profile" }, { status: 500 });
      }
    }

    if (!saved) {
      return NextResponse.json({ error: "Could not save profile" }, { status: 500 });
    }
  }

  // Auto-bootstrap a goal from primary_goal when onboarding completes
  if (d.completeOnboarding === true && d.primaryGoal) {
    try {
      const goalType = d.primaryGoal;
      const VALID_GOAL_TYPES = [
        "build_credit",
        "bank_account",
        "save_plan",
        "remittance",
        "taxes",
        "home",
        "business",
      ];
      if (VALID_GOAL_TYPES.includes(goalType)) {
        // Only create if user has no active goal yet
        const { data: existingGoal } = await supabase
          .from("user_goals")
          .select("id")
          .eq("user_id", session.userId)
          .eq("status", "active")
          .maybeSingle();

        if (!existingGoal) {
          const { data: existingType } = await supabase
            .from("user_goals")
            .select("id")
            .eq("user_id", session.userId)
            .eq("goal_type", goalType)
            .maybeSingle();

          if (existingType) {
            await supabase
              .from("user_goals")
              .update({ status: "active", started_at: new Date().toISOString(), completed_at: null })
              .eq("id", existingType.id);
          } else {
            await supabase.from("user_goals").insert({
              user_id: session.userId,
              goal_type: goalType,
              status: "active",
              current_step: 0,
            });
          }
        }
      }
    } catch (goalErr) {
      // Non-fatal: goal bootstrap failed but onboarding still succeeded
      console.warn("[api/profile] goal bootstrap failed:", goalErr);
    }
  }

  return NextResponse.json({ success: true });
}
