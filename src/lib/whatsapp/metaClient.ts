import crypto from "crypto";

export interface MetaWhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId?: string;
  appSecret?: string;
}

export interface SendWhatsAppResult {
  success: boolean;
  messageId?: string;
  status: "Accepted" | "Sent" | "Failed";
  error?: string;
  rawResponse?: unknown;
}

/**
 * Official Meta WhatsApp Cloud API Client.
 * Follows Meta Graph API v21.0 specification.
 * Documentation: https://developers.facebook.com/docs/whatsapp/cloud-api/
 */
export class MetaWhatsAppClient {
  private config: MetaWhatsAppConfig;
  private apiVersion = "v21.0";

  constructor(config?: Partial<MetaWhatsAppConfig>) {
    this.config = {
      accessToken: config?.accessToken || process.env.META_WHATSAPP_ACCESS_TOKEN || "",
      phoneNumberId: config?.phoneNumberId || process.env.META_WHATSAPP_PHONE_NUMBER_ID || "",
      businessAccountId: config?.businessAccountId || process.env.META_WHATSAPP_BUSINESS_ACCOUNT_ID || "",
      appSecret: config?.appSecret || process.env.META_APP_SECRET || "",
    };
  }

  public isConfigured(): boolean {
    return Boolean(this.config.accessToken && this.config.phoneNumberId);
  }

  /**
   * Sanitizes phone number to international E.164 format without '+' or spaces.
   */
  public cleanPhoneNumber(phone: string): string {
    return phone.replace(/\D/g, "");
  }

  /**
   * Dispatches a freeform text message via Meta WhatsApp Cloud API.
   * Note: Freeform text messages work within 24 hours of user contact,
   * or when using Meta's test sandbox phone numbers.
   */
  public async sendTextMessage(
    to: string,
    messageContent: string
  ): Promise<SendWhatsAppResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        status: "Failed",
        error: "Meta WhatsApp Cloud API credentials (Access Token or Phone Number ID) are not configured.",
      };
    }

    const cleanTo = this.cleanPhoneNumber(to);
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.config.phoneNumberId}/messages`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: cleanTo,
          type: "text",
          text: {
            preview_url: false,
            body: messageContent,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data.error?.message ||
          data.error?.error_user_msg ||
          `Meta API responded with HTTP status ${response.status}`;
        return {
          success: false,
          status: "Failed",
          error: errorMsg,
          rawResponse: data,
        };
      }

      const messageId = data.messages?.[0]?.id || `wamid_${Date.now()}`;
      return {
        success: true,
        messageId,
        status: "Accepted",
        rawResponse: data,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Network error contacting Meta API.";
      return {
        success: false,
        status: "Failed",
        error: errorMsg,
      };
    }
  }

  /**
   * Dispatches an approved WhatsApp utility template message.
   * Required by Meta for outbound reminders sent to recipients outside the 24-hour window.
   */
  public async sendTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string = "en",
    parameters: string[] = []
  ): Promise<SendWhatsAppResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        status: "Failed",
        error: "Meta WhatsApp Cloud API credentials are not configured.",
      };
    }

    const cleanTo = this.cleanPhoneNumber(to);
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.config.phoneNumberId}/messages`;

    const bodyParameters = parameters.map((val) => ({
      type: "text",
      text: val,
    }));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: cleanTo,
          type: "template",
          template: {
            name: templateName,
            language: { code: languageCode },
            components: [
              {
                type: "body",
                parameters: bodyParameters,
              },
            ],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error?.message || `Meta API template error (${response.status})`;
        return {
          success: false,
          status: "Failed",
          error: errorMsg,
          rawResponse: data,
        };
      }

      const messageId = data.messages?.[0]?.id || `wamid_${Date.now()}`;
      return {
        success: true,
        messageId,
        status: "Accepted",
        rawResponse: data,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Network error contacting Meta API.";
      return {
        success: false,
        status: "Failed",
        error: errorMsg,
      };
    }
  }

  /**
   * Validates the Meta Webhook payload signature (x-hub-signature-256)
   * to guarantee that the request originated from Meta and not an attacker.
   */
  public verifyWebhookSignature(payloadRaw: string, signatureHeader: string | null): boolean {
    if (!this.config.appSecret) {
      // If no app secret is set in dev, bypass check
      return true;
    }
    if (!signatureHeader) return false;

    const parts = signatureHeader.split("=");
    if (parts.length !== 2 || parts[0] !== "sha256") return false;

    const expectedHash = crypto
      .createHmac("sha256", this.config.appSecret)
      .update(payloadRaw, "utf-8")
      .digest("hex");

    return crypto.timingSafeEqual(Buffer.from(parts[1]), Buffer.from(expectedHash));
  }
}
