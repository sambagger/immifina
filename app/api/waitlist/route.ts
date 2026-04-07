import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { sanitizeString } from "@/lib/sanitize";
import { WaitlistSchema } from "@/lib/validation";

const JSON_HEADERS = { "Content-Type": "application/json" };

const CONFIRMATION_EMAIL_TEXT = `Hi there,

Thank you for joining the ImmiFina waitlist.

We're building a financial guide specifically for immigrants
navigating the US financial system — in your language,
with clear explanations and personalized next steps.

We'll email you as soon as we're ready to launch.

— The ImmiFina Team
info@immifina.org
immifina.org`;

function resendClient() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success: withinLimit } = rateLimit(`waitlist:${ip}`, RATE_LIMITS.waitlist);
  if (!withinLimit) {
    return NextResponse.json(
      { success: false, message: "Too many attempts. Please try again later." },
      { status: 429, headers: JSON_HEADERS }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, message: "Service temporarily unavailable." },
      { status: 503, headers: JSON_HEADERS }
    );
  }

  const resend = resendClient();
  if (!resend) {
    return NextResponse.json(
      { success: false, message: "Service temporarily unavailable." },
      { status: 503, headers: JSON_HEADERS }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400, headers: JSON_HEADERS }
    );
  }

  const parsed = WaitlistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400, headers: JSON_HEADERS }
    );
  }

  const email = sanitizeString(parsed.data.email).toLowerCase();
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Invalid request." },
      { status: 400, headers: JSON_HEADERS }
    );
  }

  const supabase = createServiceClient();

  const { data: existing } = await supabase.from("waitlist").select("id").eq("email", email).maybeSingle();

  if (existing) {
    return NextResponse.json(
      {
        success: true,
        message: "You're already on the ImmiFina waitlist.",
      },
      { headers: JSON_HEADERS }
    );
  }

  const { error: insertError } = await supabase.from("waitlist").insert({
    email,
    ip_address: ip === "unknown" ? null : ip,
  });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        {
          success: true,
          message: "You're already on the ImmiFina waitlist.",
        },
        { headers: JSON_HEADERS }
      );
    }
    console.error("[waitlist] insert:", insertError);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again later." },
      { status: 503, headers: JSON_HEADERS }
    );
  }

  const { count: totalSignups, error: countError } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true });

  const total = countError ? "—" : String(totalSignups ?? 0);

  try {
    await resend.emails.send({
      from: "ImmiFina <info@immifina.org>",
      to: email,
      subject: "You're on the ImmiFina waitlist",
      text: CONFIRMATION_EMAIL_TEXT,
    });
  } catch (e) {
    console.error("[waitlist] confirmation email:", e);
  }

  try {
    await resend.emails.send({
      from: "ImmiFina Waitlist <info@immifina.org>",
      to: "info@immifina.org",
      subject: "New waitlist signup",
      text: `A new person just joined the ImmiFina waitlist. Email: ${email}. Total signups: ${total}.`,
    });
  } catch (e) {
    console.error("[waitlist] notification email:", e);
  }

  return NextResponse.json(
    { success: true, message: "You are on the list" },
    { headers: JSON_HEADERS }
  );
}
