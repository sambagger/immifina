import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { monthsToTarget, projectSavings } from "@/lib/forecast";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { ForecastInputSchema } from "@/lib/validation";

const MEDIAN_HOME = 400_000;
const DOWN_PCT = 0.2;

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = rateLimit(`forecast:${session.userId}:${ip}`, RATE_LIMITS.forecast);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ForecastInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const {
    monthlyIncome,
    monthlyExpenses,
    currentSavings,
    monthlySavingsGoal,
    yearsToProject,
  } = parsed.data;

  const monthlySurplus = Math.max(0, monthlyIncome - monthlyExpenses);
  const pathSavings = projectSavings(
    currentSavings,
    monthlySurplus,
    0.04,
    yearsToProject
  );
  const targetPath = projectSavings(
    currentSavings,
    monthlySavingsGoal,
    0.04,
    yearsToProject
  );

  const emergencyTarget = monthlyExpenses * 3;
  const emergencyMonths = monthsToTarget(
    currentSavings,
    emergencyTarget,
    monthlySurplus
  );

  const downPayment = MEDIAN_HOME * DOWN_PCT;
  const downPaymentMonths = monthsToTarget(currentSavings, downPayment, monthlySurplus);
  const downPaymentYears =
    downPaymentMonths === null
      ? null
      : Math.round((downPaymentMonths / 12) * 10) / 10;

  return NextResponse.json({
    projections: {
      currentPath: pathSavings,
      targetPath,
    },
    milestones: {
      endBalanceCurrent: pathSavings[pathSavings.length - 1] ?? currentSavings,
      endBalanceTarget: targetPath[targetPath.length - 1] ?? currentSavings,
      years: yearsToProject,
      emergencyFundMonths: emergencyMonths,
      downPaymentYears,
      monthlySurplus,
    },
  });
}
