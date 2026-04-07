import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { getClientIp } from "@/lib/client-ip";
import { matchBenefits } from "@/lib/benefits-engine";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { BenefitsInputSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = getClientIp(request);
  const { success } = rateLimit(`benefits:${session.userId}:${ip}`, RATE_LIMITS.forecast);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BenefitsInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const programs = matchBenefits(parsed.data);

  return NextResponse.json({ programs });
}
