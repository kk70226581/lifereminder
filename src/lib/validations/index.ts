import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  timezone: z.string().default("Asia/Kolkata"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const EventCategoryEnum = z.enum([
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
]);

export const EventRecurrenceEnum = z.enum(["none", "daily", "weekly", "monthly", "yearly"]);

export const EventPriorityEnum = z.enum(["low", "medium", "high"]);

export const CreateEventSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(120),
  description: z.string().max(500).optional(),
  category: EventCategoryEnum.default("Personal"),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  eventTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format"),
  timezone: z.string().default("Asia/Kolkata"),
  recurrence: EventRecurrenceEnum.default("none"),
  priority: EventPriorityEnum.default("medium"),
  reminderOffsets: z
    .array(
      z.enum([
        "30d",
        "7d",
        "3d",
        "1d",
        "12h",
        "1h",
        "exact",
      ])
    )
    .default(["1d", "1h"]),
});

export const UpdateEventSchema = CreateEventSchema.partial().extend({
  status: z.enum(["active", "completed", "postponed", "cancelled"]).optional(),
});

export const PostponeEventSchema = z.object({
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  eventTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:mm format"),
});

export const WhatsAppSettingsSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[1-9]\d{9,14}$/, "Must be a valid international phone number with country code (e.g., +919876543210)"),
  consentStatus: z.boolean().refine((val) => val === true, {
    message: "Explicit WhatsApp consent is required to send reminders.",
  }),
  preferredLanguage: z.string().default("en"),
});
