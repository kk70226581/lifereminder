import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { UpdateEventSchema } from "@/lib/validations";
import { DataService } from "@/services/dataService";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const event = await DataService.getEventById(id, session.userId);

  if (!event) {
    return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: event });
}

export async function PATCH(
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
    const validated = UpdateEventSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = await DataService.updateEvent(id, session.userId, validated.data);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Event updated.", data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update event.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await DataService.deleteEvent(id, session.userId);
    return NextResponse.json({ success: true, message: "Event and associated reminders deleted." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete event.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
