import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { DataService } from "@/services/dataService";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const updated = await DataService.completeEvent(id, session.userId);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Event not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Event marked as completed." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to complete event.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
