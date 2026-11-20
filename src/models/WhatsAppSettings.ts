import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWhatsAppSettingsDocument extends Document {
  userId: mongoose.Types.ObjectId;
  phoneNumber: string;
  consentStatus: boolean;
  consentTimestamp: Date;
  preferredLanguage: string;
  createdAt: Date;
  updatedAt: Date;
}

const WhatsAppSettingsSchema = new Schema<IWhatsAppSettingsDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    phoneNumber: { type: String, required: true, trim: true },
    consentStatus: { type: Boolean, required: true, default: false },
    consentTimestamp: { type: Date, required: true, default: Date.now },
    preferredLanguage: { type: String, default: "en" },
  },
  { timestamps: true }
);

export const WhatsAppSettings: Model<IWhatsAppSettingsDocument> =
  mongoose.models.WhatsAppSettings ||
  mongoose.model<IWhatsAppSettingsDocument>("WhatsAppSettings", WhatsAppSettingsSchema);
