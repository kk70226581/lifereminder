import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { PostponeEventSchema } from "@/lib/validations";
import { DataService } from "@/services/dataService";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await req.json();
    const validated = PostponeEventSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { eventDate, eventTime } = validated.data;
    const updated = await DataService.postponeEvent(id, session.userId, eventDate, eventTime);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Event not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Event postponed and reminders rescheduled.",
      data: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to postpone event.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
