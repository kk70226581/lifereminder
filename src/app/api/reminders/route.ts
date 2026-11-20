import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { DataService } from "@/services/dataService";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reminders = await DataService.getRemindersByUser(session.userId);
    return NextResponse.json({ success: true, data: reminders });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch reminders.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
