import { NextResponse } from "next/server";
import { jsonWithSessionCookie, verifySession } from "@/lib/auth";

export async function POST() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return jsonWithSessionCookie({ success: true }, session.userId);
}
