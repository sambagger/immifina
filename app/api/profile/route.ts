import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeNumber, sanitizeString } from "@/lib/sanitize";
import { z } from "zod";

const PatchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  preferredLanguage: z.enum(["en", "es", "zh"]).optional(),
  monthlyIncome: z.number().min(0).max(999999).optional(),
  monthlyExpenses: z.number().min(0).max(999999).optional(),
  currentSavings: z.number().min(0).max(999999999).optional(),
  monthlySavingsGoal: z.number().min(0).max(999999).optional(),
  householdSize: z.number().int().min(1).max(20).optional(),
  stateOfResidence: z.string().length(2).nullable().optional(),
  hasChildren: z.boolean().optional(),
});

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
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
    .select("id, email, name, preferred_language")
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
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
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

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (parsed.data.name !== undefined || parsed.data.preferredLanguage !== undefined) {
    const updates: Record<string, string> = {};
    if (parsed.data.name !== undefined) updates.name = sanitizeString(parsed.data.name);
    if (parsed.data.preferredLanguage !== undefined) {
      updates.preferred_language = parsed.data.preferredLanguage;
    }
    await supabase.from("users").update(updates).eq("id", session.userId);
  }

  const fin: Record<string, unknown> = {};
  if (parsed.data.monthlyIncome !== undefined) {
    fin.monthly_income = sanitizeNumber(parsed.data.monthlyIncome);
  }
  if (parsed.data.monthlyExpenses !== undefined) {
    fin.monthly_expenses = sanitizeNumber(parsed.data.monthlyExpenses);
  }
  if (parsed.data.currentSavings !== undefined) {
    fin.current_savings = sanitizeNumber(parsed.data.currentSavings);
  }
  if (parsed.data.monthlySavingsGoal !== undefined) {
    fin.monthly_savings_goal = sanitizeNumber(parsed.data.monthlySavingsGoal);
  }
  if (parsed.data.householdSize !== undefined) {
    fin.household_size = parsed.data.householdSize;
  }
  if (parsed.data.stateOfResidence !== undefined) {
    fin.state_of_residence = parsed.data.stateOfResidence
      ? sanitizeString(parsed.data.stateOfResidence).toUpperCase().slice(0, 2)
      : null;
  }
  if (parsed.data.hasChildren !== undefined) {
    fin.has_children = parsed.data.hasChildren;
  }

  if (Object.keys(fin).length > 0) {
    fin.updated_at = new Date().toISOString();
    await supabase.from("financial_profiles").update(fin).eq("user_id", session.userId);
  }

  return NextResponse.json({ success: true });
}
