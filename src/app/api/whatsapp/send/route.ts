import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { DataService } from "@/services/dataService";
import { dispatchWhatsAppNotification } from "@/lib/whatsapp/dispatcher";

export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { to, message, forceLive } = body;

    const user = await DataService.findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const recipientPhone = to || user.whatsappNumber;
    if (!recipientPhone) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid destination WhatsApp number." },
        { status: 400 }
      );
    }

    const testEvent = {
      _id: "instant_send_event",
      title: "Direct WhatsApp Reminder",
      category: "Personal",
      eventDate: new Date().toISOString().split("T")[0],
      eventTime: "Now",
      timezone: user.timezone || "Asia/Kolkata",
      description: message || "Direct alert sent from LifeReminder control panel.",
    };

    const result = await dispatchWhatsAppNotification({
      user: {
        _id: user._id.toString(),
        name: user.name,
        whatsappNumber: recipientPhone,
        whatsappConsent: true,
      },
      event: testEvent,
      reminder: {
        _id: `instant_rem_${Date.now()}`,
        offsetLabel: "Instant Send",
      },
      forceLive: Boolean(forceLive),
    });

    // Save into Notification Log
    await DataService.addNotificationLog({
      userId: user._id.toString(),
      eventId: testEvent._id,
      reminderId: `instant_rem_${Date.now()}`,
      channel: "whatsapp",
      messageContent: result.messageContent,
      providerMessageId: result.providerMessageId,
      status: result.status,
      errorMessage: result.errorMessage,
    });

    return NextResponse.json({
      success: result.success,
      mode: result.mode,
      status: result.status,
      providerMessageId: result.providerMessageId,
      message: result.success
        ? result.mode === "live"
          ? "Message sent to recipient via Meta WhatsApp Cloud API!"
          : "Message generated in Simulation Mode (₹0 cost)."
        : result.errorMessage || "Failed to dispatch message.",
      error: result.errorMessage,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Error sending message.";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
