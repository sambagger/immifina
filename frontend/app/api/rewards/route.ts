import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { REWARDS, isRewardUnlocked, type RewardId } from "@/lib/rewards";

// GET /api/rewards — list rewards with unlock status
export async function GET(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ xp: 0, rewards: REWARDS.map((r) => ({ ...r, unlocked: false, redeemed: false })) });
  }

  const supabase = createServiceClient();
  const [xpRes, redeemedRes] = await Promise.all([
    supabase.from("user_xp").select("total_xp").eq("user_id", session.userId).maybeSingle(),
    supabase.from("user_rewards").select("reward_id").eq("user_id", session.userId),
  ]);

  const totalXP = xpRes.data?.total_xp ?? 0;
  const redeemedIds = new Set((redeemedRes.data ?? []).map((r: { reward_id: string }) => r.reward_id));

  return NextResponse.json({
    xp: totalXP,
    rewards: REWARDS.map((r) => ({
      ...r,
      unlocked: isRewardUnlocked(r.id, totalXP),
      redeemed: redeemedIds.has(r.id),
    })),
  });
}

// POST /api/rewards — redeem a reward
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { rewardId } = body as { rewardId?: string };
  if (!rewardId || !REWARDS.find((r) => r.id === rewardId)) {
    return NextResponse.json({ error: "Invalid reward" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: xpRow } = await supabase
    .from("user_xp").select("total_xp").eq("user_id", session.userId).maybeSingle();

  const totalXP = xpRow?.total_xp ?? 0;
  if (!isRewardUnlocked(rewardId as RewardId, totalXP)) {
    const reward = REWARDS.find((r) => r.id === rewardId)!;
    return NextResponse.json(
      { error: `Need ${reward.xpRequired} XP`, xpRequired: reward.xpRequired, currentXP: totalXP },
      { status: 403 }
    );
  }

  await supabase
    .from("user_rewards")
    .upsert({ user_id: session.userId, reward_id: rewardId }, { onConflict: "user_id,reward_id", ignoreDuplicates: true });

  return NextResponse.json({ redeemed: true, rewardId });
}
