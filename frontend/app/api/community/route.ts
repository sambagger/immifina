import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { isRewardUnlocked } from "@/lib/rewards";

const VALID_CATEGORIES = ["credit", "banking", "taxes", "remittance", "general"];
const VALID_VISA_TAGS = ["h1b", "green_card", "daca", "f1", "other", null];

// GET /api/community?category=&cursor=
export async function GET(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isSupabaseConfigured()) return NextResponse.json({ posts: [], hasMore: false });

  const url = new URL(request.url);
  const category = url.searchParams.get("category") ?? "all";
  const cursor = url.searchParams.get("cursor");
  const PAGE_SIZE = 20;

  const supabase = createServiceClient();
  let query = supabase
    .from("community_posts")
    .select("id, content, category, visa_tag, upvote_count, answer_count, created_at")
    .eq("is_removed", false)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE + 1);

  if (category !== "all") query = query.eq("category", category);
  if (cursor) query = query.lt("created_at", cursor);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });

  // Fetch which posts the current user has voted on
  const postIds = (data ?? []).slice(0, PAGE_SIZE).map((p) => p.id);
  const { data: votes } = postIds.length
    ? await supabase
        .from("community_votes")
        .select("post_id")
        .eq("user_id", session.userId)
        .in("post_id", postIds)
    : { data: [] };

  const votedSet = new Set((votes ?? []).map((v: { post_id: string }) => v.post_id));
  const posts = (data ?? []).slice(0, PAGE_SIZE).map((p) => ({
    ...p,
    hasVoted: votedSet.has(p.id),
  }));

  return NextResponse.json({
    posts,
    hasMore: (data ?? []).length > PAGE_SIZE,
    nextCursor: posts[posts.length - 1]?.created_at ?? null,
  });
}

// POST /api/community
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`write:${ip}`, RATE_LIMITS.api);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const supabase = createServiceClient();

  // Check XP gate
  const { data: xpRow } = await supabase
    .from("user_xp")
    .select("total_xp")
    .eq("user_id", session.userId)
    .maybeSingle();

  const totalXP = xpRow?.total_xp ?? 0;
  if (!isRewardUnlocked("community_posting", totalXP)) {
    return NextResponse.json(
      { error: "You need 500 XP to post in the community", xpRequired: 500, currentXP: totalXP },
      { status: 403 }
    );
  }

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { content, category = "general", visaTag } = body as {
    content?: string; category?: string; visaTag?: string | null;
  };

  if (!content || content.trim().length < 10) {
    return NextResponse.json({ error: "Post must be at least 10 characters" }, { status: 400 });
  }
  if (content.length > 1000) {
    return NextResponse.json({ error: "Post must be under 1000 characters" }, { status: 400 });
  }
  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (visaTag !== undefined && visaTag !== null && !VALID_VISA_TAGS.includes(visaTag)) {
    return NextResponse.json({ error: "Invalid visa tag" }, { status: 400 });
  }

  const { data: post, error } = await supabase
    .from("community_posts")
    .insert({
      user_id: session.userId,
      content: content.trim(),
      category,
      visa_tag: visaTag ?? null,
    })
    .select("id, content, category, visa_tag, upvote_count, answer_count, created_at")
    .single();

  if (error || !post) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }

  return NextResponse.json({ post }, { status: 201 });
}
