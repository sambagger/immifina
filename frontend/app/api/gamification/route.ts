import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getLevelFromXP, getProgressToNextLevel } from "@/lib/xp";

// GET /api/gamification
// Returns the user's XP, level, badges, streak, and lesson completions.
export async function GET(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ xp: 0, level: 1, badges: [], streak: 0, lessonSlugs: [] });
  }

  const supabase = createServiceClient();
  const userId = session.userId;

  const [xpRes, badgesRes, streakRes, lessonsRes] = await Promise.all([
    supabase.from("user_xp").select("total_xp, level").eq("user_id", userId).maybeSingle(),
    supabase.from("user_badges").select("badge_id, earned_at").eq("user_id", userId),
    supabase.from("user_streaks").select("current_streak, longest_streak").eq("user_id", userId).maybeSingle(),
    supabase.from("lesson_completions").select("lesson_slug, quiz_passed").eq("user_id", userId),
  ]);

  const totalXP = xpRes.data?.total_xp ?? 0;
  const level = getLevelFromXP(totalXP);
  const progress = getProgressToNextLevel(totalXP);

  return NextResponse.json({
    xp: totalXP,
    level: level.level,
    levelName: level.name,
    progressPct: progress.progressPct,
    progressXP: progress.progressXP,
    nextLevelXP: progress.nextLevelXP,
    badges: badgesRes.data ?? [],
    streak: streakRes.data?.current_streak ?? 0,
    longestStreak: streakRes.data?.longest_streak ?? 0,
    lessonSlugs: (lessonsRes.data ?? []).map((r: { lesson_slug: string }) => r.lesson_slug),
  });
}
