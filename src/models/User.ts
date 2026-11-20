import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  whatsappNumber?: string;
  timezone: string;
  emailVerified: boolean;
  whatsappConsent: boolean;
  whatsappConsentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    whatsappNumber: { type: String, trim: true },
    timezone: { type: String, default: "Asia/Kolkata" },
    emailVerified: { type: Boolean, default: false },
    whatsappConsent: { type: Boolean, default: false },
    whatsappConsentAt: { type: Date },
  },
  { timestamps: true }
);

// Prevent model recompilation during Next.js hot-reloads
export const User: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
