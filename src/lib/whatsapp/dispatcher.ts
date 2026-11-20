import { EventCategory, NotificationStatus } from "@/types";
import { MetaWhatsAppClient } from "@/lib/whatsapp/metaClient";

export interface SendMessageParams {
  user: {
    _id: string;
    name: string;
    whatsappNumber?: string;
    whatsappConsent?: boolean;
  };
  event: {
    _id: string;
    title: string;
    category: EventCategory | string;
    eventDate: string;
    eventTime: string;
    timezone: string;
    description?: string;
  };
  reminder: {
    _id: string;
    offsetLabel?: string;
  };
  forceLive?: boolean;
}

export interface DispatchResult {
  success: boolean;
  mode: "simulation" | "live";
  providerMessageId?: string;
  status: NotificationStatus;
  messageContent: string;
  errorMessage?: string;
}

/**
 * Formats a clean, high-priority WhatsApp reminder message.
 */
export function formatReminderMessage(
  userName: string,
  eventTitle: string,
  eventDate: string,
  eventTime: string,
  category: string,
  description?: string
): string {
  const noteSection = description
    ? `\n📌 *Notes:* "${description}"\n`
    : "";

  return (
    `Hello ${userName}! 👋\n\n` +
    `This is your *LifeReminder* assistant.\n\n` +
    `🔔 *Reminder:* You have *${eventTitle}* scheduled for *${eventDate}* at *${eventTime}*.\n` +
    `📁 *Category:* ${category}\n` +
    noteSection +
    `\nPlease prepare accordingly. Have a productive day! 🚀`
  );
}

/**
 * Dispatches a WhatsApp notification.
 * Supports both Simulation Mode (100% Free) and Live Meta WhatsApp Cloud API.
 */
export async function dispatchWhatsAppNotification(
  params: SendMessageParams
): Promise<DispatchResult> {
  const envMode = (process.env.WHATSAPP_MODE || "simulation").toLowerCase();
  const isLive = params.forceLive || envMode === "live";

  const userName = params.user.name || "Valued User";
  const messageContent = formatReminderMessage(
    userName,
    params.event.title,
    params.event.eventDate,
    params.event.eventTime,
    params.event.category,
    params.event.description
  );

  // 1. SIMULATION MODE (100% Free, Safe, Local)
  if (!isLive) {
    const providerMessageId = `sim_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return {
      success: true,
      mode: "simulation",
      providerMessageId,
      status: "Simulated",
      messageContent,
    };
  }

  // 2. REAL META WHATSAPP CLOUD API (Live Delivery)
  const client = new MetaWhatsAppClient();

  if (!client.isConfigured()) {
    return {
      success: false,
      mode: "live",
      status: "Failed",
      messageContent,
      errorMessage:
        "Meta WhatsApp Cloud API credentials missing in .env.local (META_WHATSAPP_ACCESS_TOKEN and META_WHATSAPP_PHONE_NUMBER_ID required).",
    };
  }

  const recipientNumber = params.user.whatsappNumber;
  if (!recipientNumber) {
    return {
      success: false,
      mode: "live",
      status: "Failed",
      messageContent,
      errorMessage: "Recipient does not have a registered WhatsApp phone number.",
    };
  }

  if (!params.user.whatsappConsent) {
    return {
      success: false,
      mode: "live",
      status: "Failed",
      messageContent,
      errorMessage: "Explicit user consent is required before sending WhatsApp messages.",
    };
  }

  // Attempt sending real message via Meta WhatsApp Cloud API
  const sendRes = await client.sendTextMessage(recipientNumber, messageContent);

  if (!sendRes.success) {
    return {
      success: false,
      mode: "live",
      status: "Failed",
      messageContent,
      errorMessage: sendRes.error || "Meta WhatsApp Cloud API rejected the message.",
    };
  }

  return {
    success: true,
    mode: "live",
    providerMessageId: sendRes.messageId,
    status: "Accepted",
    messageContent,
  };
}
