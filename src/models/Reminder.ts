import mongoose, { Schema, Document, Model } from "mongoose";
import { ReminderChannel, ReminderStatus } from "@/types";

export interface IReminderDocument extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  channel: ReminderChannel;
  scheduledAtUTC: Date;
  status: ReminderStatus;
  attempts: number;
  maxAttempts: number;
  nextRetryAt?: Date;
  lockedAt?: Date;
  processedAt?: Date;
  offsetLabel?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSchema = new Schema<IReminderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    channel: {
      type: String,
      enum: ["whatsapp", "browser"],
      default: "whatsapp",
    },
    scheduledAtUTC: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "sent", "failed", "cancelled"],
      default: "pending",
    },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    nextRetryAt: { type: Date },
    lockedAt: { type: Date },
    processedAt: { type: Date },
    offsetLabel: { type: String },
  },
  { timestamps: true }
);

// Crucial compound index for atomic scheduler queries
ReminderSchema.index({ status: 1, scheduledAtUTC: 1, lockedAt: 1 });
ReminderSchema.index({ eventId: 1, status: 1 });

export const Reminder: Model<IReminderDocument> =
  mongoose.models.Reminder || mongoose.model<IReminderDocument>("Reminder", ReminderSchema);
