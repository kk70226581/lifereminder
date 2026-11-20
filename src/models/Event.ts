import mongoose, { Schema, Document, Model } from "mongoose";
import { EventCategory, EventPriority, EventRecurrence, EventStatus } from "@/types";

export interface IEventDocument extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: EventCategory;
  eventDate: string;
  eventTime: string;
  timezone: string;
  eventDateTimeUTC: Date;
  recurrence: EventRecurrence;
  priority: EventPriority;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEventDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Personal",
        "Birthday",
        "Anniversary",
        "Education",
        "Career",
        "Health",
        "Finance",
        "Travel",
        "Documents",
        "Other",
      ],
      default: "Personal",
    },
    eventDate: { type: String, required: true },
    eventTime: { type: String, required: true },
    timezone: { type: String, default: "Asia/Kolkata" },
    eventDateTimeUTC: { type: Date, required: true, index: true },
    recurrence: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly", "yearly"],
      default: "none",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["active", "completed", "postponed", "cancelled"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for querying user's active events ordered by date
EventSchema.index({ userId: 1, eventDateTimeUTC: 1 });

export const Event: Model<IEventDocument> =
  mongoose.models.Event || mongoose.model<IEventDocument>("Event", EventSchema);
