import { NextResponse } from "next/server";
import { createSession, verifySession } from "@/lib/auth";

export async function POST() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await createSession(session.userId);
  return NextResponse.json({ success: true });
}
