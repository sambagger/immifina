import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";
import { RegisterSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = rateLimit(`auth:${ip}`, RATE_LIMITS.auth);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
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

  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const email = sanitizeString(parsed.data.email).toLowerCase();
  const name = sanitizeString(parsed.data.name);
  const password = parsed.data.password;
  const preferredLanguage = parsed.data.preferredLanguage;

  if (!email || !name) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const password_hash = bcrypt.hashSync(password, 12);

  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Conflict" }, { status: 409 });
  }

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      email,
      password_hash,
      name,
      preferred_language: preferredLanguage,
    })
    .select("id, name, email")
    .single();

  if (error || !user) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  await supabase.from("financial_profiles").insert({
    user_id: user.id,
    monthly_income: 0,
    monthly_expenses: 0,
    current_savings: 0,
    monthly_savings_goal: 0,
    household_size: 1,
    has_children: false,
  });

  await createSession(user.id);

  return NextResponse.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
