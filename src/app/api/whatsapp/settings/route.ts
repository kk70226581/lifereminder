import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { WhatsAppSettingsSchema } from "@/lib/validations";
import { DataService } from "@/services/dataService";
import { MetaWhatsAppClient } from "@/lib/whatsapp/metaClient";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const user = await DataService.findUserById(session.userId);
  const client = new MetaWhatsAppClient();

  return NextResponse.json({
    success: true,
    data: {
      phoneNumber: user?.whatsappNumber || "",
      consentStatus: user?.whatsappConsent || false,
      consentTimestamp: user?.whatsappConsentAt || null,
      mode: process.env.WHATSAPP_MODE || "simulation",
      metaConfigured: client.isConfigured(),
      hasAccessToken: Boolean(process.env.META_WHATSAPP_ACCESS_TOKEN),
      hasPhoneNumberId: Boolean(process.env.META_WHATSAPP_PHONE_NUMBER_ID),
      hasVerifyToken: Boolean(process.env.META_WHATSAPP_VERIFY_TOKEN),
    },
  });
}

export async function POST(req: Request) {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = WhatsAppSettingsSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    await DataService.updateUserWhatsApp(session.userId, validated.data);

    return NextResponse.json({
      success: true,
      message: "WhatsApp preferences and consent saved successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update WhatsApp settings.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
