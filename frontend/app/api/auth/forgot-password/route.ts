import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";
import { z } from "zod";
import { randomBytes } from "crypto";

const Schema = z.object({ email: z.string().email().max(255) });

// 3 attempts per hour per IP
const FORGOT_LIMIT = { windowMs: 60 * 60 * 1000, maxRequests: 3 };

function resendClient() {
  const key = process.env.RESEND_API_KEY?.trim();
  return key ? new Resend(key) : null;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`forgot:${ip}`, FORGOT_LIMIT);
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
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const email = sanitizeString(parsed.data.email).toLowerCase();

  const supabase = createServiceClient();
  const { data: user } = await supabase
    .from("users")
    .select("id, name")
    .eq("email", email)
    .maybeSingle();

  // Always return 200 — don't reveal whether the email exists
  if (!user) {
    return NextResponse.json({ success: true });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await supabase
    .from("users")
    .update({ password_reset_token: token, password_reset_expires_at: expiresAt.toISOString() })
    .eq("id", user.id);

  const resend = resendClient();
  if (resend) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://immifina.org";
    const link = `${appUrl}/reset-password?token=${token}`;
    try {
      await resend.emails.send({
        from: "ImmiFina <info@immifina.org>",
        to: email,
        subject: "Reset your ImmiFina password",
        text: `Hi ${user.name ?? "there"},\n\nYou requested a password reset for your ImmiFina account.\n\nClick the link below to set a new password (valid for 1 hour):\n${link}\n\nIf you didn't request this, you can safely ignore this email.\n\n— The ImmiFina Team\ninfo@immifina.org`,
      });
    } catch (e) {
      console.error("[forgot-password] resend:", e);
    }
  }

  return NextResponse.json({ success: true });
}
