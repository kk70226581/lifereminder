import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { DataService } from "@/services/dataService";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const logs = await DataService.getNotificationLogsByUser(session.userId);
    return NextResponse.json({ success: true, data: logs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch notification history.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
