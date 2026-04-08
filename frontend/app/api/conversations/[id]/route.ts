import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { createServiceClient, isSupabaseConfigured } from "@/lib/db";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = rateLimit(`conv-msg:${session.userId}`, RATE_LIMITS.api);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const supabase = createServiceClient();
  const { data: conv, error: convErr } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", id)
    .eq("user_id", session.userId)
    .maybeSingle();

  if (convErr) {
    console.error(convErr);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
  if (!conv) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: messages, error: msgErr } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })
    .limit(200);

  if (msgErr) {
    console.error(msgErr);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  return NextResponse.json({ messages: messages ?? [] });
}
