import { Router } from "express";
import bcrypt from "bcryptjs";
import { signSessionToken, setSessionCookie, clearSessionCookie, verifySession } from "../lib/auth.js";
import { createServiceClient, isSupabaseConfigured } from "../lib/db.js";
import { getClientIp } from "../lib/client-ip.js";
import { rateLimit, RATE_LIMITS } from "../lib/rate-limit.js";
import { sanitizeString } from "../lib/sanitize.js";
import { LoginSchema, RegisterSchema } from "../lib/validation.js";

const router = Router();

// POST /auth/login
router.post("/login", async (req, res) => {
  const ip = getClientIp(req);
  const { success } = rateLimit(`auth:${ip}`, RATE_LIMITS.auth);
  if (!success) return res.status(429).json({ error: "Too many requests" });

  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Service unavailable", code: "SERVICE_UNAVAILABLE" });

  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed" });

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
    return res.status(503).json({ error: "Database error", code: "DATABASE_ERROR" });
  }

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid email or password", code: "INVALID_CREDENTIALS" });
  }

  const token = await signSessionToken(user.id);
  setSessionCookie(res, token);
  res.json({ success: true });
});

// POST /auth/register
router.post("/register", async (req, res) => {
  const ip = getClientIp(req);
  const { success } = rateLimit(`auth:${ip}`, RATE_LIMITS.auth);
  if (!success) return res.status(429).json({ error: "Too many requests" });

  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Service unavailable", code: "SERVICE_UNAVAILABLE" });

  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed" });

  const email = sanitizeString(parsed.data.email).toLowerCase();
  const name = sanitizeString(parsed.data.name);
  const { password, preferredLanguage } = parsed.data;

  if (!email || !name) return res.status(400).json({ error: "Validation failed" });

  const password_hash = bcrypt.hashSync(password, 12);
  const supabase = createServiceClient();

  const { data: existing } = await supabase.from("users").select("id").eq("email", email).maybeSingle();
  if (existing) return res.status(409).json({ error: "Conflict" });

  const { data: user, error } = await supabase
    .from("users")
    .insert({ email, password_hash, name, preferred_language: preferredLanguage })
    .select("id, name, email")
    .single();

  if (error || !user) {
    console.error("[auth/register] insert:", error);
    return res.status(503).json({ error: "Could not create account. Try again later.", code: "DATABASE_ERROR" });
  }

  const { error: profileErr } = await supabase.from("financial_profiles").insert({
    user_id: user.id,
    monthly_income: 0,
    monthly_expenses: 0,
    current_savings: 0,
    monthly_savings_goal: 0,
    household_size: 1,
    has_children: false,
  });
  if (profileErr) console.error("[auth/register] financial_profiles insert:", profileErr);

  const token = await signSessionToken(user.id);
  setSessionCookie(res, token);
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
});

// POST /auth/logout
router.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ success: true });
});

// POST /auth/refresh
router.post("/refresh", async (req, res) => {
  const session = await verifySession(req);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const token = await signSessionToken(session.userId);
  setSessionCookie(res, token);
  res.json({ success: true });
});

export default router;
