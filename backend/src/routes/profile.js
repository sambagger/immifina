import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { getClientIp } from "../lib/client-ip.js";
import { createServiceClient, isSupabaseConfigured } from "../lib/db.js";
import { rateLimit, RATE_LIMITS } from "../lib/rate-limit.js";
import { sanitizeNumber, sanitizeString } from "../lib/sanitize.js";
import { ProfilePatchSchema } from "../lib/validation.js";

const router = Router();

function toNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

function immigrationSituationToUserStatus(s) {
  const map = {
    us_citizen: "U.S. citizen",
    green_card: "Permanent resident",
    visa: "Visa holder",
    daca: "DACA",
    other: "Other / prefer not to say",
  };
  return map[s] ?? s;
}

// GET /profile
router.get("/", requireAuth, async (req, res) => {
  const ip = getClientIp(req);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) return res.status(429).json({ error: "Too many requests" });
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Service unavailable" });

  const supabase = createServiceClient();
  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("id, email, name, preferred_language, immigration_status")
    .eq("id", req.session.userId)
    .single();

  if (userErr || !user) return res.status(404).json({ error: "Not found" });

  const { data: profile } = await supabase
    .from("financial_profiles")
    .select("*")
    .eq("user_id", req.session.userId)
    .maybeSingle();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, title, created_at")
    .eq("user_id", req.session.userId)
    .order("created_at", { ascending: false })
    .limit(3);

  res.json({ user, profile: profile ?? null, recentConversations: conversations ?? [] });
});

// PATCH /profile
router.patch("/", requireAuth, async (req, res) => {
  const ip = getClientIp(req);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) return res.status(429).json({ error: "Too many requests" });
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Service unavailable" });

  const parsed = ProfilePatchSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed" });

  const supabase = createServiceClient();
  const d = parsed.data;

  // Update users table
  if (d.name !== undefined || d.preferredLanguage !== undefined || d.immigrationSituation !== undefined) {
    const updates = {};
    if (d.name !== undefined) updates.name = sanitizeString(d.name);
    if (d.preferredLanguage !== undefined) updates.preferred_language = d.preferredLanguage;
    if (d.immigrationSituation !== undefined) updates.immigration_status = immigrationSituationToUserStatus(d.immigrationSituation);
    if (Object.keys(updates).length > 0) {
      await supabase.from("users").update(updates).eq("id", req.session.userId);
    }
  }

  // Build financial_profiles update
  const fin = {};
  if (d.monthlyIncome !== undefined)     fin.monthly_income = sanitizeNumber(d.monthlyIncome);
  if (d.monthlyExpenses !== undefined)   fin.monthly_expenses = sanitizeNumber(d.monthlyExpenses);
  if (d.currentSavings !== undefined)    fin.current_savings = sanitizeNumber(d.currentSavings);
  if (d.monthlySavingsGoal !== undefined) fin.monthly_savings_goal = sanitizeNumber(d.monthlySavingsGoal);
  if (d.householdSize !== undefined)     fin.household_size = d.householdSize;
  if (d.stateOfResidence !== undefined)  fin.state_of_residence = d.stateOfResidence ? sanitizeString(d.stateOfResidence).toUpperCase().slice(0, 2) : null;
  if (d.childrenUnder18 !== undefined)   fin.has_children = d.childrenUnder18;
  else if (d.hasChildren !== undefined)  fin.has_children = d.hasChildren;
  if (d.immigrationSituation !== undefined) fin.immigration_situation = d.immigrationSituation;
  if (d.hasSsn !== undefined)            fin.has_ssn = d.hasSsn;
  if (d.hasItin !== undefined)           fin.has_itin = d.hasItin;
  if (d.yearsInUs !== undefined)         fin.years_in_us = d.yearsInUs;
  if (d.countryOfOrigin !== undefined)   fin.country_of_origin = sanitizeString(d.countryOfOrigin);
  if (d.primaryGoal !== undefined)       fin.primary_goal = d.primaryGoal;
  if (d.employmentStatus !== undefined)  fin.employment_status = d.employmentStatus;
  if (d.currentDebt !== undefined)       fin.current_debt = sanitizeNumber(d.currentDebt);
  if (d.expenseHousing !== undefined)    fin.expense_housing = sanitizeNumber(d.expenseHousing);
  if (d.expenseFood !== undefined)       fin.expense_food = sanitizeNumber(d.expenseFood);
  if (d.expenseTransport !== undefined)  fin.expense_transport = sanitizeNumber(d.expenseTransport);
  if (d.expenseUtilities !== undefined)  fin.expense_utilities = sanitizeNumber(d.expenseUtilities);
  if (d.expenseRemittance !== undefined) fin.expense_remittance = sanitizeNumber(d.expenseRemittance);
  if (d.expenseOther !== undefined)      fin.expense_other = sanitizeNumber(d.expenseOther);
  if (d.monthlyCanSave !== undefined)    fin.monthly_can_save = sanitizeNumber(d.monthlyCanSave);

  if (d.completeOnboarding === true) {
    fin.onboarding_completed_at = new Date().toISOString();
    if (d.expenseHousing !== undefined || d.expenseFood !== undefined || d.expenseTransport !== undefined ||
        d.expenseUtilities !== undefined || d.expenseRemittance !== undefined || d.expenseOther !== undefined) {
      const { data: existing } = await supabase
        .from("financial_profiles")
        .select("expense_housing, expense_food, expense_transport, expense_utilities, expense_remittance, expense_other")
        .eq("user_id", req.session.userId)
        .maybeSingle();
      const pick = (patch, row) => patch !== undefined ? sanitizeNumber(patch) : toNum(row);
      fin.monthly_expenses = Math.round((
        pick(d.expenseHousing, existing?.expense_housing) +
        pick(d.expenseFood, existing?.expense_food) +
        pick(d.expenseTransport, existing?.expense_transport) +
        pick(d.expenseUtilities, existing?.expense_utilities) +
        pick(d.expenseRemittance, existing?.expense_remittance) +
        pick(d.expenseOther, existing?.expense_other)
      ) * 100) / 100;
    }
    if (d.monthlyCanSave !== undefined) fin.monthly_savings_goal = sanitizeNumber(d.monthlyCanSave);
  }

  if (Object.keys(fin).length > 0) {
    fin.updated_at = new Date().toISOString();
    const { data: existingRow } = await supabase
      .from("financial_profiles")
      .select("id")
      .eq("user_id", req.session.userId)
      .maybeSingle();

    const { error: writeErr } = existingRow
      ? await supabase.from("financial_profiles").update(fin).eq("user_id", req.session.userId)
      : await supabase.from("financial_profiles").insert({ user_id: req.session.userId, ...fin });

    if (writeErr) {
      console.error("[profile] PATCH financial_profiles:", writeErr);
      return res.status(500).json({ error: "Could not save profile" });
    }
  }

  res.json({ success: true });
});

export default router;
