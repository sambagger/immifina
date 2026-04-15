import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getStepCount } from "@/lib/workflow-templates";

// ─────────────────────────────────────────────────────────────
// POST /api/goals/[id]/steps/[stepIndex]
// Marks a step as complete and advances current_step.
// ─────────────────────────────────────────────────────────────
export async function POST(
  request: Request,
  { params }: { params: { id: string; stepIndex: string } }
) {
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

  const goalId = params.id;
  const stepIndex = parseInt(params.stepIndex, 10);

  if (!goalId || isNaN(stepIndex) || stepIndex < 0) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Verify this goal belongs to the session user
  const { data: goal, error: goalErr } = await supabase
    .from("user_goals")
    .select("id, user_id, goal_type, current_step, status")
    .eq("id", goalId)
    .eq("user_id", session.userId)
    .maybeSingle();

  if (goalErr || !goal) {
    return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  }

  if (goal.status === "completed") {
    return NextResponse.json({ error: "Goal already completed" }, { status: 409 });
  }

  // Idempotent: if this step was already completed, just return current state
  const { data: existing } = await supabase
    .from("goal_step_completions")
    .select("id")
    .eq("user_goal_id", goalId)
    .eq("step_index", stepIndex)
    .maybeSingle();

  if (!existing) {
    // Record the completion
    const { error: insertErr } = await supabase.from("goal_step_completions").insert({
      user_goal_id: goalId,
      step_index: stepIndex,
    });

    if (insertErr) {
      console.error("[api/goals/steps] insert completion:", insertErr);
      return NextResponse.json({ error: "Failed to record step completion" }, { status: 500 });
    }
  }

  // Advance current_step to stepIndex + 1
  const nextStep = stepIndex + 1;
  const totalSteps = getStepCount(goal.goal_type);
  const goalNowComplete = nextStep >= totalSteps;

  const updatePayload: Record<string, unknown> = {
    current_step: nextStep,
  };

  if (goalNowComplete) {
    updatePayload.status = "completed";
    updatePayload.completed_at = new Date().toISOString();
  }

  const { data: updatedGoal, error: updateErr } = await supabase
    .from("user_goals")
    .update(updatePayload)
    .eq("id", goalId)
    .select()
    .single();

  if (updateErr || !updatedGoal) {
    console.error("[api/goals/steps] update goal:", updateErr);
    return NextResponse.json({ error: "Failed to advance goal" }, { status: 500 });
  }

  return NextResponse.json({
    goal: updatedGoal,
    stepCompleted: stepIndex,
    goalCompleted: goalNowComplete,
  });
}
