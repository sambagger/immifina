import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const Schema = z.object({
  token: z.string().min(1).max(128),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
});

const RESET_LIMIT = { windowMs: 15 * 60 * 1000, maxRequests: 5 };

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`reset:${ip}`, RESET_LIMIT);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", code: "VALIDATION_FAILED" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: user } = await supabase
    .from("users")
    .select("id, password_reset_token, password_reset_expires_at")
    .eq("password_reset_token", parsed.data.token)
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: "Invalid or expired link", code: "INVALID_TOKEN" }, { status: 400 });
  }

  const expiresAt = user.password_reset_expires_at ? new Date(user.password_reset_expires_at) : null;
  if (!expiresAt || expiresAt < new Date()) {
    return NextResponse.json({ error: "Link has expired", code: "TOKEN_EXPIRED" }, { status: 400 });
  }

  const password_hash = bcrypt.hashSync(parsed.data.password, 12);

  await supabase
    .from("users")
    .update({
      password_hash,
      password_reset_token: null,
      password_reset_expires_at: null,
    })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}
