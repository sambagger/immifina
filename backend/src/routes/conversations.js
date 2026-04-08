import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { createServiceClient, isSupabaseConfigured } from "../lib/db.js";
import { rateLimit, RATE_LIMITS } from "../lib/rate-limit.js";

const router = Router();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// GET /conversations
router.get("/", requireAuth, async (req, res) => {
  const { success } = rateLimit(`conv-list:${req.session.userId}`, RATE_LIMITS.api);
  if (!success) return res.status(429).json({ error: "Too many requests" });
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Service unavailable" });

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("conversations")
    .select("id, title, language, created_at")
    .eq("user_id", req.session.userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[conversations]", error);
    return res.status(500).json({ error: "Server error" });
  }
  res.json({ conversations: data ?? [] });
});

// GET /conversations/:id
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  if (!id || !UUID_RE.test(id)) return res.status(400).json({ error: "Invalid id" });

  const { success } = rateLimit(`conv-msg:${req.session.userId}`, RATE_LIMITS.api);
  if (!success) return res.status(429).json({ error: "Too many requests" });
  if (!isSupabaseConfigured()) return res.status(503).json({ error: "Service unavailable" });

  const supabase = createServiceClient();
  const { data: conv, error: convErr } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", id)
    .eq("user_id", req.session.userId)
    .maybeSingle();

  if (convErr) return res.status(500).json({ error: "Server error" });
  if (!conv) return res.status(404).json({ error: "Not found" });

  const { data: messages, error: msgErr } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })
    .limit(200);

  if (msgErr) return res.status(500).json({ error: "Server error" });
  res.json({ messages: messages ?? [] });
});

export default router;
