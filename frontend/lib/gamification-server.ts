import { createServiceClient } from "@/lib/db";
import { XP_VALUES, getLevelFromXP, type XPEventType } from "@/lib/xp";
import { getBadgesEarned, type BadgeCheckContext } from "@/lib/badges";

type SupabaseClient = ReturnType<typeof createServiceClient>;

export async function awardXP(
  supabase: SupabaseClient,
  userId: string,
  eventType: XPEventType,
  referenceId?: string
): Promise<{ newTotalXP: number; leveledUp: boolean; newLevel: number }> {
  const xpEarned = XP_VALUES[eventType];

  await supabase.from("xp_events").insert({
    user_id: userId,
    event_type: eventType,
    xp_earned: xpEarned,
    reference_id: referenceId ?? null,
  });

  const { data: existing } = await supabase
    .from("user_xp")
    .select("total_xp, level")
    .eq("user_id", userId)
    .maybeSingle();

  const prevXP = existing?.total_xp ?? 0;
  const prevLevel = existing?.level ?? 1;
  const newTotalXP = prevXP + xpEarned;
  const newLevel = getLevelFromXP(newTotalXP).level;

  await supabase.from("user_xp").upsert(
    { user_id: userId, total_xp: newTotalXP, level: newLevel, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );

  return { newTotalXP, leveledUp: newLevel > prevLevel, newLevel };
}

export async function updateStreak(
  supabase: SupabaseClient,
  userId: string
): Promise<{ currentStreak: number; streakBadgeEarned: boolean }> {
  const today = new Date().toISOString().split("T")[0];

  const { data: existing } = await supabase
    .from("user_streaks")
    .select("current_streak, longest_streak, last_active_date")
    .eq("user_id", userId)
    .maybeSingle();

  let currentStreak = 1;
  let longestStreak = 1;

  if (existing) {
    const lastDate = existing.last_active_date;
    if (lastDate === today) {
      return { currentStreak: existing.current_streak, streakBadgeEarned: false };
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastDate === yesterdayStr) {
      currentStreak = existing.current_streak + 1;
    }
    longestStreak = Math.max(currentStreak, existing.longest_streak ?? 1);
  }

  await supabase.from("user_streaks").upsert(
    {
      user_id: userId,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  const streakBadgeEarned = currentStreak === 7;
  return { currentStreak, streakBadgeEarned };
}

export async function awardBadges(
  supabase: SupabaseClient,
  userId: string,
  ctx: BadgeCheckContext
): Promise<string[]> {
  if (ctx.eventType === "goal_complete") {
    const { count } = await supabase
      .from("user_goals")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "completed");
    ctx = { ...ctx, completedGoalCount: count ?? 0 };
  }

  const badgesToEarn = getBadgesEarned(ctx);
  if (badgesToEarn.length === 0) return [];

  const rows = badgesToEarn.map((badge_id) => ({
    user_id: userId,
    badge_id,
    earned_at: new Date().toISOString(),
  }));

  const { data } = await supabase
    .from("user_badges")
    .upsert(rows, { onConflict: "user_id,badge_id", ignoreDuplicates: true })
    .select("badge_id");

  return (data ?? []).map((r) => r.badge_id);
}
