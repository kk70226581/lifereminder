export type EventCategory =
  | "Personal"
  | "Birthday"
  | "Anniversary"
  | "Education"
  | "Career"
  | "Health"
  | "Finance"
  | "Travel"
  | "Documents"
  | "Other";

export type EventRecurrence = "none" | "daily" | "weekly" | "monthly" | "yearly";

export type EventPriority = "low" | "medium" | "high";

export type EventStatus = "active" | "completed" | "postponed" | "cancelled";

export type ReminderChannel = "whatsapp" | "browser";

export type ReminderStatus = "pending" | "processing" | "sent" | "failed" | "cancelled";

export type NotificationStatus =
  | "Pending"
  | "Processing"
  | "Simulated"
  | "Accepted"
  | "Sent"
  | "Delivered"
  | "Read"
  | "Failed"
  | "Cancelled";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  whatsappNumber?: string;
  timezone: string;
  emailVerified: boolean;
  whatsappConsent: boolean;
  whatsappConsentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category: EventCategory;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:mm
  timezone: string;
  eventDateTimeUTC: Date;
  recurrence: EventRecurrence;
  priority: EventPriority;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReminder {
  _id: string;
  userId: string;
  eventId: string;
  channel: ReminderChannel;
  scheduledAtUTC: Date;
  status: ReminderStatus;
  attempts: number;
  maxAttempts: number;
  nextRetryAt?: Date;
  lockedAt?: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationLog {
  _id: string;
  userId: string;
  eventId: string;
  reminderId: string;
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

export interface IWhatsAppSettings {
  _id: string;
  userId: string;
  phoneNumber: string;
  consentStatus: boolean;
  consentTimestamp: Date;
  preferredLanguage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
