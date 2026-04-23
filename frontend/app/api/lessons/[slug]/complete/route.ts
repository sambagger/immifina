import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getLessonBySlug } from "@/lib/lessons";
import { awardXP, updateStreak, awardBadges } from "@/lib/gamification-server";

// POST /api/lessons/[slug]/complete
// Body: { quizPassed: boolean; quizScore: number; totalQuestions: number; locale?: string }
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const slug = params.slug;
  const lesson = getLessonBySlug(slug);
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

  let body: { quizPassed?: boolean; quizScore?: number; totalQuestions?: number; locale?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { quizPassed = false, quizScore = 0, totalQuestions = 3, locale } = body;

  const supabase = createServiceClient();
  const userId = session.userId;

  // Idempotent: check if already completed
  const { data: existing } = await supabase
    .from("lesson_completions")
    .select("id, quiz_passed")
    .eq("user_id", userId)
    .eq("lesson_slug", slug)
    .maybeSingle();

  if (!existing) {
    await supabase.from("lesson_completions").insert({
      user_id: userId,
      lesson_slug: slug,
      quiz_passed: quizPassed,
      quiz_score: quizScore,
    });
  } else if (quizPassed && !existing.quiz_passed) {
    // Upgrade if they now passed the quiz
    await supabase
      .from("lesson_completions")
      .update({ quiz_passed: quizPassed, quiz_score: quizScore })
      .eq("user_id", userId)
      .eq("lesson_slug", slug);
  }

  const events: Array<{ type: "lesson_complete" | "quiz_pass"; ref: string }> = [];
  if (!existing) events.push({ type: "lesson_complete", ref: slug });
  if (quizPassed && (!existing || !existing.quiz_passed)) events.push({ type: "quiz_pass", ref: slug });

  let totalXPGained = 0;
  let leveledUp = false;
  let newLevel = 1;

  for (const ev of events) {
    const result = await awardXP(supabase, userId, ev.type, ev.ref);
    totalXPGained += ev.type === "lesson_complete" ? 50 : 75;
    if (result.leveledUp) { leveledUp = true; newLevel = result.newLevel; }
    newLevel = result.newLevel;
  }

  const { streakBadgeEarned } = await updateStreak(supabase, userId);

  const badgeCtx = {
    eventType: "quiz_pass" as const,
    lessonSlug: slug,
    quizScore,
    totalQuizQuestions: totalQuestions,
  };
  const earnedBadges = quizPassed ? await awardBadges(supabase, userId, badgeCtx) : [];

  if (streakBadgeEarned) {
    await awardXP(supabase, userId, "streak_7", "streak");
    await awardBadges(supabase, userId, { eventType: "step_complete", stepIndex: -1 });
    earnedBadges.push("streak_7");
  }

  // Bilingual badge if lesson completed in non-English locale
  if (locale && locale !== "en" && !existing) {
    await awardBadges(supabase, userId, { eventType: "step_complete", stepIndex: -99 });
    const { data: bilingualExists } = await supabase
      .from("user_badges")
      .select("id")
      .eq("user_id", userId)
      .eq("badge_id", "bilingual")
      .maybeSingle();
    if (!bilingualExists) {
      await supabase.from("user_badges").insert({ user_id: userId, badge_id: "bilingual" });
      earnedBadges.push("bilingual");
    }
  }

  return NextResponse.json({
    xpGained: totalXPGained,
    leveledUp,
    newLevel,
    earnedBadges,
  });
}
