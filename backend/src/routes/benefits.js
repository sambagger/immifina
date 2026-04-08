import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { getClientIp } from "../lib/client-ip.js";
import { matchBenefits } from "../lib/benefits-engine.js";
import { rateLimit, RATE_LIMITS } from "../lib/rate-limit.js";
import { BenefitsInputSchema } from "../lib/validation.js";

const router = Router();

// POST /benefits
router.post("/", requireAuth, async (req, res) => {
  const ip = getClientIp(req);
  const { success } = rateLimit(`benefits:${req.session.userId}:${ip}`, RATE_LIMITS.forecast);
  if (!success) return res.status(429).json({ error: "Too many requests" });

  const parsed = BenefitsInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed" });

  const programs = matchBenefits(parsed.data);
  res.json({ programs });
});

export default router;
