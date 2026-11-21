import mongoose, { Schema, Document, Model } from "mongoose";
import { NotificationStatus, ReminderChannel } from "@/types";

export interface INotificationLogDocument extends Document {
  userId: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  reminderId?: mongoose.Types.ObjectId;
  channel: ReminderChannel;
  messageContent: string;
  providerMessageId?: string;
  status: NotificationStatus;
  errorMessage?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  createdAt: Date;
}

const NotificationLogSchema = new Schema<INotificationLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: false },
    reminderId: { type: Schema.Types.ObjectId, ref: "Reminder", required: false },
    channel: { type: String, enum: ["whatsapp", "browser"], default: "whatsapp" },
    messageContent: { type: String, required: true },
    providerMessageId: { type: String },
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Simulated",
        "Accepted",
        "Sent",
        "Delivered",
        "Read",
        "Failed",
        "Cancelled",
      ],
      default: "Simulated",
    },
    errorMessage: { type: String },
    sentAt: { type: Date },
    deliveredAt: { type: Date },
    readAt: { type: Date },
  },
  { timestamps: true }
);

// Compound index for user notification log pagination
NotificationLogSchema.index({ userId: 1, createdAt: -1 });

export const NotificationLog: Model<INotificationLogDocument> =
  mongoose.models.NotificationLog ||
  mongoose.model<INotificationLogDocument>("NotificationLog", NotificationLogSchema);
