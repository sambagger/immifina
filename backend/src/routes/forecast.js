import { Router } from "express";
import { requireAuth } from "../lib/auth.js";
import { getClientIp } from "../lib/client-ip.js";
import { projectSavings, monthsToTarget } from "../lib/forecast.js";
import { rateLimit, RATE_LIMITS } from "../lib/rate-limit.js";
import { ForecastInputSchema } from "../lib/validation.js";

const router = Router();
const MEDIAN_HOME = 400_000;
const DOWN_PCT = 0.2;

// POST /forecast
router.post("/", requireAuth, async (req, res) => {
  const ip = getClientIp(req);
  const { success } = rateLimit(`forecast:${req.session.userId}:${ip}`, RATE_LIMITS.forecast);
  if (!success) return res.status(429).json({ error: "Too many requests" });

  const parsed = ForecastInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed" });

  const { monthlyIncome, monthlyExpenses, currentSavings, monthlySavingsGoal, yearsToProject } = parsed.data;
  const monthlySurplus = Math.max(0, monthlyIncome - monthlyExpenses);

  const pathSavings = projectSavings(currentSavings, monthlySurplus, 0.04, yearsToProject);
  const targetPath = projectSavings(currentSavings, monthlySavingsGoal, 0.04, yearsToProject);
  const emergencyTarget = monthlyExpenses * 3;
  const emergencyMonths = monthsToTarget(currentSavings, emergencyTarget, monthlySurplus);
  const downPayment = MEDIAN_HOME * DOWN_PCT;
  const downPaymentMonths = monthsToTarget(currentSavings, downPayment, monthlySurplus);
  const downPaymentYears = downPaymentMonths === null ? null : Math.round((downPaymentMonths / 12) * 10) / 10;

  res.json({
    projections: { currentPath: pathSavings, targetPath },
    milestones: {
      endBalanceCurrent: pathSavings[pathSavings.length - 1] ?? currentSavings,
      endBalanceTarget: targetPath[targetPath.length - 1] ?? currentSavings,
      years: yearsToProject,
      emergencyFundMonths: emergencyMonths,
      downPaymentYears,
      monthlySurplus,
    },
  });
});

export default router;
