import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { CreateEventSchema } from "@/lib/validations";
import { DataService } from "@/services/dataService";

export async function GET(req: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const status = searchParams.get("status") || undefined;

  try {
    const events = await DataService.getEventsByUser(session.userId, { category, status });
    return NextResponse.json({ success: true, data: events });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch events.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = CreateEventSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const event = await DataService.createEvent(session.userId, validated.data);

    return NextResponse.json(
      { success: true, message: "Event created successfully with reminders.", data: event },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create event.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
