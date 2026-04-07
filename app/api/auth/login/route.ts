import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { jsonWithSessionCookie } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";
import { LoginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`auth:${ip}`, RATE_LIMITS.auth);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Service unavailable", code: "SERVICE_UNAVAILABLE" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const email = sanitizeString(parsed.data.email).toLowerCase();
  const password = parsed.data.password;

  const supabase = createServiceClient();
  const { data: user, error: queryError } = await supabase
    .from("users")
    .select("id, password_hash")
    .eq("email", email)
    .maybeSingle();

  if (queryError) {
    console.error("[auth/login] supabase:", queryError.message);
    return NextResponse.json(
      { error: "Database error", code: "DATABASE_ERROR" },
      { status: 503 }
    );
  }

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password", code: "INVALID_CREDENTIALS" },
      { status: 401 }
    );
  }

  if (!bcrypt.compareSync(password, user.password_hash)) {
    return NextResponse.json(
      { error: "Invalid email or password", code: "INVALID_CREDENTIALS" },
      { status: 401 }
    );
  }

  return jsonWithSessionCookie({ success: true }, user.id);
}
