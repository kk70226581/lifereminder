import { NextResponse } from "next/server";
import { MetaWhatsAppClient } from "@/lib/whatsapp/metaClient";
import { NotificationLog } from "@/models/NotificationLog";
import { connectToDatabase } from "@/lib/mongodb";

/**
 * Meta WhatsApp Cloud API Webhook.
 * Handles:
 * 1. GET: Webhook verification challenge during setup in Meta App Dashboard.
 * 2. POST: Real-time message status updates (sent, delivered, read, failed).
 */

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.META_WHATSAPP_VERIFY_TOKEN || "lifereminder_verify_secret_token";

  if (mode === "subscribe" && token === verifyToken) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Verification token mismatch" }, { status: 403 });
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("x-hub-signature-256");

  const client = new MetaWhatsAppClient();
  const isValid = client.verifyWebhookSignature(rawBody, signatureHeader);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid webhook HMAC signature" }, { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody);

    // Meta sends status updates in entry[].changes[].value.statuses[]
    const entries = payload.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const statuses = change.value?.statuses || [];
        for (const st of statuses) {
          const providerId = st.id;
          const statusType = st.status; // 'sent' | 'delivered' | 'read' | 'failed'
          const timestamp = st.timestamp ? new Date(Number(st.timestamp) * 1000) : new Date();

          try {
            await connectToDatabase();
            const updateFields: Record<string, unknown> = {};

            if (statusType === "sent") {
              updateFields.status = "Sent";
              updateFields.sentAt = timestamp;
            } else if (statusType === "delivered") {
              updateFields.status = "Delivered";
              updateFields.deliveredAt = timestamp;
            } else if (statusType === "read") {
              updateFields.status = "Read";
              updateFields.readAt = timestamp;
            } else if (statusType === "failed") {
              updateFields.status = "Failed";
              updateFields.errorMessage = st.errors?.[0]?.message || "Delivery failed by provider.";
            }

            if (Object.keys(updateFields).length > 0) {
              await NotificationLog.findOneAndUpdate(
                { providerMessageId: providerId },
                updateFields
              );
            }
          } catch (dbErr) {
            console.error("Webhook DB update failed:", dbErr);
          }
        }
      }
    }

    return NextResponse.json({ success: true, processed: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("Webhook error:", err);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
