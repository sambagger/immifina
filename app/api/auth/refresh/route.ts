import { NextResponse } from "next/server";
import { setSessionCookieOnResponse, verifySession } from "@/lib/auth";

export async function POST() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = NextResponse.json({ success: true });
  return setSessionCookieOnResponse(res, session.userId);
}
