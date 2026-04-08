import { Router } from "express";
import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { requireAuth } from "../lib/auth.js";
import { createServiceClient, isSupabaseConfigured } from "../lib/db.js";
import { rateLimit, RATE_LIMITS } from "../lib/rate-limit.js";
import { sanitizeString } from "../lib/sanitize.js";
import { ChatMessageSchema } from "../lib/validation.js";

const router = Router();
const MODEL = "claude-sonnet-4-20250514";

function anthropicUserVisibleMessage(err) {
  if (err instanceof APIError && err.error && typeof err.error === "object") {
    const nested = err.error?.error?.message;
    if (typeof nested === "string" && nested.length > 0) return nested;
    if (typeof err.error?.message === "string" && err.error.message.length > 0) return err.error.message;
  }
  return err instanceof Error ? err.message : String(err);
}

async function buildUserContext(userId) {
  if (!isSupabaseConfigured()) return "{}";
  const supabase = createServiceClient();
  const { data: user } = await supabase
    .from("users")
    .select("name, preferred_language, immigration_status")
    .eq("id", userId)
    .maybeSingle();
  const { data: profile } = await supabase
    .from("financial_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  const income = Number(profile?.monthly_income ?? 0);
  const expenses = Number(profile?.monthly_expenses ?? 0);
  return JSON.stringify({
    user,
    profile,
    derived: {
      monthlySurplus: income - expenses,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      currentSavings: Number(profile?.current_savings ?? 0),
    },
  });
}

// POST /ai/chat
router.post("/chat", requireAuth, async (req, res) => {
  const { success } = rateLimit(`chat:${req.session.userId}`, RATE_LIMITS.chat);
  if (!success) return res.status(429).json({ error: "Too many requests" });

  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Service unavailable" });

  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) return res.status(503).json({ error: "AI not configured" });

  const parsed = ChatMessageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed" });

  const message = sanitizeString(parsed.data.message);
  if (!message || message.length > 2000) return res.status(400).json({ error: "Invalid message" });

  const supabase = createServiceClient();
  let conversationId = parsed.data.conversationId;

  const { data: userRow } = await supabase
    .from("users")
    .select("preferred_language")
    .eq("id", req.session.userId)
    .maybeSingle();
  const convLang = ["es", "zh"].includes(userRow?.preferred_language) ? userRow.preferred_language : "en";

  if (!conversationId) {
    const { data: conv, error: cErr } = await supabase
      .from("conversations")
      .insert({ user_id: req.session.userId, title: message.slice(0, 80), language: convLang })
      .select("id")
      .single();
    if (cErr || !conv) return res.status(500).json({ error: "Server error" });
    conversationId = conv.id;
  } else {
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", req.session.userId)
      .maybeSingle();
    if (!existing) return res.status(404).json({ error: "Not found" });
  }

  const { data: historyRows } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(20);

  const userContext = await buildUserContext(req.session.userId);
  const systemPrompt = `You are ImmiFina's financial guide — knowledgeable, patient, and culturally sensitive. You help immigrants and first-generation Americans understand the U.S. financial system.

Communication style:
- Plain language first; define any necessary jargon immediately.
- Acknowledge that U.S. systems are confusing and often not designed for newcomers — it is not the user's fault.
- Explain WHY something matters before WHAT to do; use concrete examples and round numbers when helpful.
- Give specific, actionable next steps, not vague tips. Use the user's profile context when relevant.
- Be encouraging; normalize not knowing these systems.
- Respond in the same language the user writes in.

You can help with: banking, credit and secured cards, budgeting, taxes and ITIN/SSN at a high level, remittances, benefits programs (educational overview), paychecks and forms, renting vs buying (educational).

You must NOT: recommend specific investments or securities; give immigration legal advice; tell users to sign or not sign legal documents; guarantee outcomes; diagnose complex tax situations (suggest VITA or a licensed CPA instead).

Framing rules:
- Never say "you should" — say "some people consider" or "one approach is"
- Never say "you must" — say "typically required" or "commonly asked for"
- Never guarantee outcomes — say "may" and "can" not "will" and "does"
- Always offer the option of free professional help (VITA, nonprofit credit counseling, immigration legal aid)

Always end substantive answers about personal financial decisions with:
"This is educational guidance, not financial advice. For decisions specific to your situation, consider speaking with a financial counselor or advisor. Many community organizations offer free financial counseling."

User profile JSON:
${userContext}`;

  const history = (historyRows ?? []).map((m) => ({ role: m.role, content: m.content }));
  const client = new Anthropic({ apiKey });

  let reply;
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      temperature: 0.7,
      system: systemPrompt,
      messages: [...history, { role: "user", content: message }],
    });
    const block = response.content.find((b) => b.type === "text");
    reply = block?.text ?? "";
    if (!reply) return res.status(500).json({ error: "Empty response" });
  } catch (e) {
    console.error(e);
    let userMessage = anthropicUserVisibleMessage(e);
    if (userMessage.length > 800) userMessage = userMessage.slice(0, 800) + "…";
    return res.status(500).json({ error: userMessage.trim() });
  }

  await supabase.from("messages").insert([
    { conversation_id: conversationId, role: "user", content: message },
    { conversation_id: conversationId, role: "assistant", content: reply },
  ]);

  res.json({ reply, conversationId });
});

export default router;
