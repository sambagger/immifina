import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { WORKFLOWS, type PrimaryGoal } from "@/lib/workflow-templates";

const VALID_GOAL_TYPES = Object.keys(WORKFLOWS) as PrimaryGoal[];

// ─────────────────────────────────────────────────────────────
// GET /api/goals
// Returns the user's active goal with step completions.
// ─────────────────────────────────────────────────────────────
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

  // Fetch the active goal (most recently started, status = 'active')
  const { data: goal, error } = await supabase
    .from("user_goals")
    .select("*")
    .eq("user_id", session.userId)
    .eq("status", "active")
    .order("started_at", { ascending: false })
    .maybeSingle();

  if (error) {
    console.error("[api/goals] GET:", error);
    return NextResponse.json({ error: "Failed to load goal" }, { status: 500 });
  }

  if (!goal) {
    return NextResponse.json({ goal: null, completions: [] });
  }

  // Fetch step completions for this goal
  const { data: completions } = await supabase
    .from("goal_step_completions")
    .select("step_index, completed_at")
    .eq("user_goal_id", goal.id)
    .order("step_index", { ascending: true });

  return NextResponse.json({
    goal,
    completions: completions ?? [],
  });
}

// ─────────────────────────────────────────────────────────────
// POST /api/goals
// Body: { goalType: PrimaryGoal }
// Creates or re-activates a user goal.
// ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
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

  const { goalType } = body as { goalType?: string };

  if (!goalType || !VALID_GOAL_TYPES.includes(goalType as PrimaryGoal)) {
    return NextResponse.json(
      { error: "Invalid goal type", validTypes: VALID_GOAL_TYPES },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Pause any currently active goals first
  await supabase
    .from("user_goals")
    .update({ status: "paused" })
    .eq("user_id", session.userId)
    .eq("status", "active");

  // Upsert: if the user already had this goal (completed or paused), reactivate it.
  // Otherwise create fresh.
  const { data: existing } = await supabase
    .from("user_goals")
    .select("id, current_step, status")
    .eq("user_id", session.userId)
    .eq("goal_type", goalType)
    .maybeSingle();

  let goal;
  if (existing) {
    // Reactivate existing goal (keep progress)
    const { data, error } = await supabase
      .from("user_goals")
      .update({ status: "active", started_at: new Date().toISOString(), completed_at: null })
      .eq("id", existing.id)
      .select()
      .single();

    if (error || !data) {
      console.error("[api/goals] POST update:", error);
      return NextResponse.json({ error: "Failed to activate goal" }, { status: 500 });
    }
    goal = data;
  } else {
    // Create fresh goal
    const { data, error } = await supabase
      .from("user_goals")
      .insert({
        user_id: session.userId,
        goal_type: goalType,
        status: "active",
        current_step: 0,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("[api/goals] POST insert:", error);
      return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
    }
    goal = data;
  }

  return NextResponse.json({ goal }, { status: 201 });
}
