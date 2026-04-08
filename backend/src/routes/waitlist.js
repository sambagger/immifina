import { Router } from "express";
import { Resend } from "resend";
import { createServiceClient, isSupabaseConfigured } from "../lib/db.js";
import { getClientIp } from "../lib/client-ip.js";
import { rateLimit, RATE_LIMITS } from "../lib/rate-limit.js";
import { sanitizeString } from "../lib/sanitize.js";
import { WaitlistSchema } from "../lib/validation.js";

const router = Router();

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

// POST /waitlist
router.post("/", async (req, res) => {
  const ip = getClientIp(req);
  const { success } = rateLimit(`waitlist:${ip}`, RATE_LIMITS.waitlist);
  if (!success) return res.status(429).json({ success: false, message: "Too many attempts. Please try again later." });

  if (!isSupabaseConfigured()) return res.status(503).json({ success: false, message: "Service temporarily unavailable." });

  const resend = resendClient();
  if (!resend) return res.status(503).json({ success: false, message: "Service temporarily unavailable." });

  const parsed = WaitlistSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: "Invalid request." });

  const email = sanitizeString(parsed.data.email).toLowerCase();
  if (!email) return res.status(400).json({ success: false, message: "Invalid request." });

  const supabase = createServiceClient();

  const { data: existing } = await supabase.from("waitlist").select("id").eq("email", email).maybeSingle();
  if (existing) return res.json({ success: true, message: "You're already on the ImmiFina waitlist." });

  const { error: insertError } = await supabase.from("waitlist").insert({
    email,
    ip_address: ip === "unknown" ? null : ip,
  });

  if (insertError) {
    if (insertError.code === "23505") return res.json({ success: true, message: "You're already on the ImmiFina waitlist." });
    console.error("[waitlist] insert:", insertError);
    return res.status(503).json({ success: false, message: "Something went wrong. Please try again later." });
  }

  const { count: totalSignups } = await supabase.from("waitlist").select("*", { count: "exact", head: true });
  const total = String(totalSignups ?? 0);

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
      text: `New signup: ${email}. Total: ${total}.`,
    });
  } catch (e) {
    console.error("[waitlist] notification email:", e);
  }

  res.json({ success: true, message: "You are on the list" });
});

export default router;
