import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getPrevStep } from "@/lib/workflow-templates";

// ─────────────────────────────────────────────────────────────
// PATCH /api/goals/[id]
// Body: { action: "go_back" }
// Goes back one step, removes the completion record.
// ─────────────────────────────────────────────────────────────
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const goalId = params.id;
  const supabase = createServiceClient();

  // Verify ownership
  const { data: goal } = await supabase
    .from("user_goals")
    .select("id, user_id, goal_type, current_step, status")
    .eq("id", goalId)
    .eq("user_id", session.userId)
    .maybeSingle();

  if (!goal) return NextResponse.json({ error: "Goal not found" }, { status: 404 });
  if (goal.current_step === 0) return NextResponse.json({ error: "Already at first step" }, { status: 400 });

  // Fetch user profile to respect skipIf
  const { data: profile } = await supabase
    .from("financial_profiles")
    .select("has_ssn, has_itin, years_in_us, immigration_situation, employment_status, monthly_income")
    .eq("user_id", session.userId)
    .maybeSingle();

  const prevStep = getPrevStep(goal.goal_type, goal.current_step, profile ?? {});

  // Remove completion record for steps we're going back past
  await supabase
    .from("goal_step_completions")
    .delete()
    .eq("user_goal_id", goalId)
    .gte("step_index", prevStep);

  // Update current step and reactivate if completed
  const { data: updated } = await supabase
    .from("user_goals")
    .update({
      current_step: prevStep,
      status: "active",
      completed_at: null,
    })
    .eq("id", goalId)
    .select()
    .single();

  return NextResponse.json({ goal: updated });
}
