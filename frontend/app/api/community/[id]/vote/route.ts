import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { getClientIp } from "@/lib/client-ip";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

// POST /api/community/[id]/vote — toggle upvote
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const ip = getClientIp(request);
  const { success } = rateLimit(`api:${ip}`, RATE_LIMITS.api);
  if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const supabase = createServiceClient();
  const postId = params.id;

  const { data: existing } = await supabase
    .from("community_votes")
    .select("id")
    .eq("user_id", session.userId)
    .eq("post_id", postId)
    .maybeSingle();

  if (existing) {
    await supabase.from("community_votes").delete().eq("id", existing.id);
    await supabase.rpc("decrement_post_upvotes", { post_id: postId });
    return NextResponse.json({ voted: false });
  } else {
    await supabase.from("community_votes").insert({ user_id: session.userId, post_id: postId });
    await supabase.rpc("increment_post_upvotes", { post_id: postId });
    return NextResponse.json({ voted: true });
  }
}
