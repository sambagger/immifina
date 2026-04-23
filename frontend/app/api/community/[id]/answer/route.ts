import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// GET /api/community/[id]/answer — fetch answers for a post
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ answers: [] });

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("community_answers")
    .select("id, content, upvote_count, is_accepted, created_at")
    .eq("post_id", params.id)
    .eq("is_removed", false)
    .order("is_accepted", { ascending: false })
    .order("upvote_count", { ascending: false })
    .order("created_at", { ascending: true });

  return NextResponse.json({ answers: data ?? [] });
}

// POST /api/community/[id]/answer — post an answer
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`write:${ip}`, RATE_LIMITS.api);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { content } = body as { content?: string };
  if (!content || content.trim().length < 5) {
    return NextResponse.json({ error: "Answer must be at least 5 characters" }, { status: 400 });
  }
  if (content.length > 1000) {
    return NextResponse.json({ error: "Answer must be under 1000 characters" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: answer, error } = await supabase
    .from("community_answers")
    .insert({ post_id: params.id, user_id: session.userId, content: content.trim() })
    .select("id, content, upvote_count, is_accepted, created_at")
    .single();

  if (error || !answer) return NextResponse.json({ error: "Failed to post answer" }, { status: 500 });

  // Increment answer count on post
  await supabase.rpc("increment_post_answers", { post_id: params.id });

  return NextResponse.json({ answer }, { status: 201 });
}
