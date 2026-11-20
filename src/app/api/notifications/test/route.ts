import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { DataService } from "@/services/dataService";
import { dispatchWhatsAppNotification } from "@/lib/whatsapp/dispatcher";

export async function POST() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await DataService.findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const testEvent = {
      _id: "test_event_id",
      title: "LifeReminder Setup Verification Test",
      category: "Personal",
      eventDate: new Date().toISOString().split("T")[0],
      eventTime: "12:00",
      timezone: user.timezone || "Asia/Kolkata",
      description: "This is a test notification confirming your LifeReminder engine is configured properly.",
    };

    const result = await dispatchWhatsAppNotification({
      user: {
        _id: user._id.toString(),
        name: user.name,
        whatsappNumber: user.whatsappNumber || "+919876543210",
        whatsappConsent: true,
      },
      event: testEvent,
      reminder: {
        _id: "test_reminder_id",
        offsetLabel: "Test Ping",
      },
    });

    // Save to audit log
    const log = await DataService.addNotificationLog({
      userId: user._id.toString(),
      eventId: testEvent._id,
      reminderId: "test_reminder_id",
      channel: "whatsapp",
      messageContent: result.messageContent,
      providerMessageId: result.providerMessageId,
      status: result.status,
      errorMessage: result.errorMessage,
    });

    return NextResponse.json({
      success: true,
      message:
        result.mode === "simulation"
          ? "Simulated WhatsApp message created! Check your Notification History."
          : "WhatsApp message dispatched to Meta API.",
      data: log,
      mode: result.mode,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Test message dispatch failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
