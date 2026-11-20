import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Event } from "@/models/Event";
import { Reminder } from "@/models/Reminder";
import { NotificationLog } from "@/models/NotificationLog";
import { WhatsAppSettings } from "@/models/WhatsAppSettings";
import { hashPassword } from "@/lib/auth";
import { calculateEventUTC, calculateReminderSchedules, OffsetType } from "@/lib/scheduler/engine";
import {
  EventCategory,
  EventPriority,
  EventRecurrence,
  EventStatus,
  IEvent,
  INotificationLog,
  IReminder,
  IUser,
  NotificationStatus,
} from "@/types";
import mongoose from "mongoose";

// In-Memory Fallback State (Active whenever MongoDB Atlas credentials are not yet configured)
interface InMemoryDb {
  users: Array<IUser & { passwordHash: string }>;
  events: Array<IEvent & { reminderOffsets?: string[] }>;
  reminders: Array<IReminder & { offsetLabel?: string }>;
  notificationLogs: INotificationLog[];
  whatsappSettings: Record<string, { phoneNumber: string; consentStatus: boolean; consentTimestamp: Date }>;
  initialized: boolean;
}

interface PopulatedReminderUser {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  whatsappNumber?: string;
  whatsappConsent?: boolean;
}

interface PopulatedReminderEvent {
  _id: mongoose.Types.ObjectId | string;
  title: string;
  category: EventCategory;
  eventDate: string;
  eventTime: string;
  timezone: string;
  description?: string;
  status: EventStatus;
}

const memoryDb: InMemoryDb = {
  users: [],
  events: [],
  reminders: [],
  notificationLogs: [],
  whatsappSettings: {},
  initialized: false,
};

async function seedInMemoryDb() {
  if (memoryDb.initialized) return;

  const defaultHash = await hashPassword("demo123");
  const demoUserId = "64f1a2b3c4d5e6f7a8b9c0d1";

  memoryDb.users.push({
    _id: demoUserId,
    name: "Alex Johnson",
    email: "alex@lifereminder.com",
    passwordHash: defaultHash,
    whatsappNumber: "+919876543210",
    timezone: "Asia/Kolkata",
    emailVerified: true,
    whatsappConsent: true,
    whatsappConsentAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  memoryDb.whatsappSettings[demoUserId] = {
    phoneNumber: "+919876543210",
    consentStatus: true,
    consentTimestamp: new Date(),
  };

  const sampleEvents = [
    {
      _id: "64f1a2b3c4d5e6f7a8b9c0d2",
      userId: demoUserId,
      title: "Senior Full-Stack Engineer Interview",
      description: "Technical architecture & system design round. Keep portfolio links ready.",
      category: "Career" as EventCategory,
      eventDate: "2026-11-25",
      eventTime: "10:30",
      timezone: "Asia/Kolkata",
      eventDateTimeUTC: calculateEventUTC("2026-11-25", "10:30", "Asia/Kolkata"),
      recurrence: "none" as EventRecurrence,
      priority: "high" as EventPriority,
      status: "active" as EventStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "64f1a2b3c4d5e6f7a8b9c0d3",
      userId: demoUserId,
      title: "Mom's Birthday Celebration",
      description: "Order personalized photo cake and book dinner table.",
      category: "Birthday" as EventCategory,
      eventDate: "2026-11-28",
      eventTime: "19:00",
      timezone: "Asia/Kolkata",
      eventDateTimeUTC: calculateEventUTC("2026-11-28", "19:00", "Asia/Kolkata"),
      recurrence: "yearly" as EventRecurrence,
      priority: "high" as EventPriority,
      status: "active" as EventStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "64f1a2b3c4d5e6f7a8b9c0d4",
      userId: demoUserId,
      title: "Car Comprehensive Insurance Renewal",
      description: "Policy #HD-89212. Compare no-claim bonus quotes before payment.",
      category: "Finance" as EventCategory,
      eventDate: "2026-12-05",
      eventTime: "11:00",
      timezone: "Asia/Kolkata",
      eventDateTimeUTC: calculateEventUTC("2026-12-05", "11:00", "Asia/Kolkata"),
      recurrence: "yearly" as EventRecurrence,
      priority: "medium" as EventPriority,
      status: "active" as EventStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      _id: "64f1a2b3c4d5e6f7a8b9c0d5",
      userId: demoUserId,
      title: "Final Semester Examination: Distributed Systems",
      description: "Paper 402. Bring student ID card and hall ticket printout.",
      category: "Education" as EventCategory,
      eventDate: "2026-11-30",
      eventTime: "09:30",
      timezone: "Asia/Kolkata",
      eventDateTimeUTC: calculateEventUTC("2026-11-30", "09:30", "Asia/Kolkata"),
      recurrence: "none" as EventRecurrence,
      priority: "high" as EventPriority,
      status: "active" as EventStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  memoryDb.events.push(...sampleEvents);

  // Add sample reminders
  for (const ev of sampleEvents) {
    const schedules = calculateReminderSchedules(ev.eventDateTimeUTC, ["1d", "1h"]);
    for (const s of schedules) {
      memoryDb.reminders.push({
        _id: new mongoose.Types.ObjectId().toString(),
        userId: demoUserId,
        eventId: ev._id,
        channel: "whatsapp",
        scheduledAtUTC: s.scheduledAtUTC,
        status: "pending",
        attempts: 0,
        maxAttempts: 3,
        offsetLabel: s.offsetLabel,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  // Add a sample simulated notification log
  memoryDb.notificationLogs.push({
    _id: "64f1a2b3c4d5e6f7a8b9c0d9",
    userId: demoUserId,
    eventId: sampleEvents[0]._id,
    reminderId: memoryDb.reminders[0]._id,
    channel: "whatsapp",
    messageContent:
      "Hello Alex Johnson! 👋\n\nThis is your LifeReminder assistant.\n\n🔔 A friendly reminder that you have *Senior Full-Stack Engineer Interview* scheduled for *2026-11-25* at *10:30*.\n📁 Category: Career\n📌 Notes: \"Technical architecture & system design round. Keep portfolio links ready.\"\n\nPlease prepare accordingly. Have a great day!",
    providerMessageId: "sim_msg_test_welcome_demo",
    status: "Simulated",
    sentAt: new Date(Date.now() - 3600000),
    deliveredAt: new Date(Date.now() - 3500000),
    readAt: new Date(Date.now() - 3400000),
    createdAt: new Date(Date.now() - 3600000),
  });

  memoryDb.initialized = true;
}

/**
 * Checks whether live MongoDB connection is available or if fallback should be used.
 */
async function isMongoLive(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("<username>") || uri.includes("<password>")) {
    return false;
  }
  try {
    await connectToDatabase();
    return true;
  } catch {
    return false;
  }
}

export const DataService = {
  // --------------------------------------------------------------------------
  // USER OPERATIONS
  // --------------------------------------------------------------------------
  async findUserByEmail(email: string) {
    const live = await isMongoLive();
    if (live) {
      return User.findOne({ email: email.toLowerCase() }).lean();
    }
    await seedInMemoryDb();
    return memoryDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id: string) {
    const live = await isMongoLive();
    if (live) {
      return User.findById(id).lean();
    }
    await seedInMemoryDb();
    return memoryDb.users.find((u) => u._id.toString() === id.toString()) || null;
  },

  async createUser(data: { name: string; email: string; passwordHash: string; timezone?: string }) {
    const live = await isMongoLive();
    if (live) {
      const newUser = await User.create({
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        timezone: data.timezone || "Asia/Kolkata",
        emailVerified: false,
        whatsappConsent: false,
      });
      return newUser.toObject();
    }

    await seedInMemoryDb();
    const newUser: IUser & { passwordHash: string } = {
      _id: new mongoose.Types.ObjectId().toString(),
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      timezone: data.timezone || "Asia/Kolkata",
      emailVerified: false,
      whatsappConsent: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryDb.users.push(newUser);
    return newUser;
  },

  async updateUserWhatsApp(userId: string, data: { phoneNumber: string; consentStatus: boolean }) {
    const live = await isMongoLive();
    if (live) {
      await User.findByIdAndUpdate(userId, {
        whatsappNumber: data.phoneNumber,
        whatsappConsent: data.consentStatus,
        whatsappConsentAt: data.consentStatus ? new Date() : undefined,
      });

      await WhatsAppSettings.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        {
          phoneNumber: data.phoneNumber,
          consentStatus: data.consentStatus,
          consentTimestamp: new Date(),
        },
        { upsert: true, new: true }
      );
      return true;
    }

    await seedInMemoryDb();
    const user = memoryDb.users.find((u) => u._id.toString() === userId.toString());
    if (user) {
      user.whatsappNumber = data.phoneNumber;
      user.whatsappConsent = data.consentStatus;
      user.whatsappConsentAt = data.consentStatus ? new Date() : undefined;
    }
    memoryDb.whatsappSettings[userId] = {
      phoneNumber: data.phoneNumber,
      consentStatus: data.consentStatus,
      consentTimestamp: new Date(),
    };
    return true;
  },

  // --------------------------------------------------------------------------
  // EVENT OPERATIONS
  // --------------------------------------------------------------------------
  async getEventsByUser(userId: string, filter?: { category?: string; status?: string }) {
    const live = await isMongoLive();
    if (live) {
      const query: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };
      if (filter?.category && filter.category !== "All") query.category = filter.category;
      if (filter?.status && filter.status !== "All") query.status = filter.status;
      return Event.find(query).sort({ eventDateTimeUTC: 1 }).lean();
    }

    await seedInMemoryDb();
    return memoryDb.events
      .filter((e) => {
        if (e.userId.toString() !== userId.toString()) return false;
        if (filter?.category && filter.category !== "All" && e.category !== filter.category) return false;
        if (filter?.status && filter.status !== "All" && e.status !== filter.status) return false;
        return true;
      })
      .sort((a, b) => new Date(a.eventDateTimeUTC).getTime() - new Date(b.eventDateTimeUTC).getTime());
  },

  async getEventById(eventId: string, userId: string) {
    const live = await isMongoLive();
    if (live) {
      return Event.findOne({
        _id: new mongoose.Types.ObjectId(eventId),
        userId: new mongoose.Types.ObjectId(userId),
      }).lean();
    }

    await seedInMemoryDb();
    return (
      memoryDb.events.find(
        (e) => e._id.toString() === eventId.toString() && e.userId.toString() === userId.toString()
      ) || null
    );
  },

  async createEvent(
    userId: string,
    data: {
      title: string;
      description?: string;
      category: EventCategory;
      eventDate: string;
      eventTime: string;
      timezone: string;
      recurrence: EventRecurrence;
      priority: EventPriority;
      reminderOffsets: OffsetType[];
    }
  ) {
    const utcDate = calculateEventUTC(data.eventDate, data.eventTime, data.timezone);
    const live = await isMongoLive();

    if (live) {
      const newEvent = await Event.create({
        userId: new mongoose.Types.ObjectId(userId),
        title: data.title,
        description: data.description,
        category: data.category,
        eventDate: data.eventDate,
        eventTime: data.eventTime,
        timezone: data.timezone,
        eventDateTimeUTC: utcDate,
        recurrence: data.recurrence,
        priority: data.priority,
        status: "active",
      });

      // Generate Reminders
      const schedules = calculateReminderSchedules(utcDate, data.reminderOffsets);
      const reminderDocs = schedules.map((s) => ({
        userId: new mongoose.Types.ObjectId(userId),
        eventId: newEvent._id,
        channel: "whatsapp",
        scheduledAtUTC: s.scheduledAtUTC,
        status: "pending",
        offsetLabel: s.offsetLabel,
        attempts: 0,
        maxAttempts: 3,
      }));

      await Reminder.insertMany(reminderDocs);
      return newEvent.toObject();
    }

    await seedInMemoryDb();
    const eventId = new mongoose.Types.ObjectId().toString();
    const newEvent: IEvent = {
      _id: eventId,
      userId,
      title: data.title,
      description: data.description,
      category: data.category,
      eventDate: data.eventDate,
      eventTime: data.eventTime,
      timezone: data.timezone,
      eventDateTimeUTC: utcDate,
      recurrence: data.recurrence,
      priority: data.priority,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryDb.events.push(newEvent);

    // Create Reminders in Memory
    const schedules = calculateReminderSchedules(utcDate, data.reminderOffsets);
    for (const s of schedules) {
      memoryDb.reminders.push({
        _id: new mongoose.Types.ObjectId().toString(),
        userId,
        eventId,
        channel: "whatsapp",
        scheduledAtUTC: s.scheduledAtUTC,
        status: "pending",
        attempts: 0,
        maxAttempts: 3,
        offsetLabel: s.offsetLabel,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return newEvent;
  },

  async updateEvent(
    eventId: string,
    userId: string,
    data: Partial<IEvent> & { reminderOffsets?: OffsetType[] }
  ) {
    const live = await isMongoLive();
    if (live) {
      const updateData: Record<string, unknown> = { ...data };
      if (data.eventDate && data.eventTime) {
        updateData.eventDateTimeUTC = calculateEventUTC(
          data.eventDate,
          data.eventTime,
          data.timezone || "Asia/Kolkata"
        );
      }
      const updated = await Event.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(eventId), userId: new mongoose.Types.ObjectId(userId) },
        updateData,
        { new: true }
      ).lean();
      return updated;
    }

    await seedInMemoryDb();
    const event = memoryDb.events.find(
      (e) => e._id.toString() === eventId.toString() && e.userId.toString() === userId.toString()
    );
    if (!event) return null;

    Object.assign(event, data, { updatedAt: new Date() });
    if (data.eventDate && data.eventTime) {
      event.eventDateTimeUTC = calculateEventUTC(
        data.eventDate,
        data.eventTime,
        data.timezone || event.timezone
      );
    }
    return event;
  },

  async deleteEvent(eventId: string, userId: string) {
    const live = await isMongoLive();
    if (live) {
      await Event.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(eventId),
        userId: new mongoose.Types.ObjectId(userId),
      });
      await Reminder.deleteMany({ eventId: new mongoose.Types.ObjectId(eventId) });
      return true;
    }

    await seedInMemoryDb();
    memoryDb.events = memoryDb.events.filter(
      (e) => !(e._id.toString() === eventId.toString() && e.userId.toString() === userId.toString())
    );
    memoryDb.reminders = memoryDb.reminders.filter((r) => r.eventId.toString() !== eventId.toString());
    return true;
  },

  async completeEvent(eventId: string, userId: string) {
    const live = await isMongoLive();
    if (live) {
      const ev = await Event.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(eventId), userId: new mongoose.Types.ObjectId(userId) },
        { status: "completed" },
        { new: true }
      );
      // Cancel remaining pending reminders
      await Reminder.updateMany(
        { eventId: new mongoose.Types.ObjectId(eventId), status: "pending" },
        { status: "cancelled" }
      );
      return ev;
    }

    await seedInMemoryDb();
    const event = memoryDb.events.find(
      (e) => e._id.toString() === eventId.toString() && e.userId.toString() === userId.toString()
    );
    if (event) {
      event.status = "completed";
      event.updatedAt = new Date();
    }
    for (const r of memoryDb.reminders) {
      if (r.eventId.toString() === eventId.toString() && r.status === "pending") {
        r.status = "cancelled";
      }
    }
    return event;
  },

  async postponeEvent(eventId: string, userId: string, newDate: string, newTime: string) {
    const event = await this.getEventById(eventId, userId);
    if (!event) return null;

    const newUTC = calculateEventUTC(newDate, newTime, event.timezone);
    return this.updateEvent(eventId, userId, {
      eventDate: newDate,
      eventTime: newTime,
      eventDateTimeUTC: newUTC,
      status: "postponed",
    });
  },

  // --------------------------------------------------------------------------
  // REMINDERS & NOTIFICATION LOGS
  // --------------------------------------------------------------------------
  async getRemindersByUser(userId: string) {
    const live = await isMongoLive();
    if (live) {
      return Reminder.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ scheduledAtUTC: 1 })
        .populate("eventId", "title category eventDate eventTime")
        .lean();
    }

    await seedInMemoryDb();
    return memoryDb.reminders
      .filter((r) => r.userId.toString() === userId.toString())
      .map((r) => {
        const ev = memoryDb.events.find((e) => e._id.toString() === r.eventId.toString());
        return {
          ...r,
          eventId: ev ? { _id: ev._id, title: ev.title, category: ev.category, eventDate: ev.eventDate, eventTime: ev.eventTime } : null,
        };
      })
      .sort((a, b) => new Date(a.scheduledAtUTC).getTime() - new Date(b.scheduledAtUTC).getTime());
  },

  async getNotificationLogsByUser(userId: string) {
    const live = await isMongoLive();
    if (live) {
      return NotificationLog.find({ userId: new mongoose.Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("eventId", "title category")
        .lean();
    }

    await seedInMemoryDb();
    return memoryDb.notificationLogs
      .filter((n) => n.userId.toString() === userId.toString())
      .map((n) => {
        const ev = memoryDb.events.find((e) => e._id.toString() === n.eventId.toString());
        return {
          ...n,
          eventId: ev ? { _id: ev._id, title: ev.title, category: ev.category } : null,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addNotificationLog(logData: {
    userId: string;
    eventId: string;
    reminderId: string;
    channel: "whatsapp" | "browser";
    messageContent: string;
    providerMessageId?: string;
    status: NotificationStatus;
    errorMessage?: string;
  }) {
    const live = await isMongoLive();
    if (live) {
      return NotificationLog.create({
        ...logData,
        userId: new mongoose.Types.ObjectId(logData.userId),
        eventId: new mongoose.Types.ObjectId(logData.eventId),
        reminderId: new mongoose.Types.ObjectId(logData.reminderId),
        sentAt: new Date(),
        deliveredAt: new Date(),
      });
    }

    await seedInMemoryDb();
    const newLog: INotificationLog = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...logData,
      sentAt: new Date(),
      deliveredAt: new Date(),
      readAt: undefined,
      createdAt: new Date(),
    };
    memoryDb.notificationLogs.unshift(newLog);
    return newLog;
  },

  // --------------------------------------------------------------------------
  // SCHEDULER ENGINE: ATOMIC CLAIM & DISPATCH
  // --------------------------------------------------------------------------
  async claimAndProcessDueReminders() {
    const now = new Date();
    const processed: Array<{ reminderId: string; status: string; title: string }> = [];

    const live = await isMongoLive();
    if (live) {
      // Find up to 25 due reminders that are not locked
      const dueReminders = await Reminder.find({
        status: "pending",
        scheduledAtUTC: { $lte: now },
        $or: [{ lockedAt: null }, { lockedAt: { $lt: new Date(now.getTime() - 5 * 60 * 1000) } }],
      })
        .limit(25)
        .populate("eventId")
        .populate("userId");

      for (const rem of dueReminders) {
        // Atomic lock
        const locked = await Reminder.findOneAndUpdate(
          { _id: rem._id, status: "pending" },
          { status: "processing", lockedAt: now }
        );
        if (!locked) continue;

        const event = rem.eventId as unknown as PopulatedReminderEvent;
        const user = rem.userId as unknown as PopulatedReminderUser;

        if (!event || event.status !== "active") {
          await Reminder.findByIdAndUpdate(rem._id, { status: "cancelled", processedAt: now });
          continue;
        }

        // Dispatch
        const { dispatchWhatsAppNotification } = await import("@/lib/whatsapp/dispatcher");
        const res = await dispatchWhatsAppNotification({
          user: {
            _id: user._id.toString(),
            name: user.name,
            whatsappNumber: user.whatsappNumber,
            whatsappConsent: user.whatsappConsent,
          },
          event: {
            _id: event._id.toString(),
            title: event.title,
            category: event.category,
            eventDate: event.eventDate,
            eventTime: event.eventTime,
            timezone: event.timezone,
            description: event.description,
          },
          reminder: {
            _id: rem._id.toString(),
            offsetLabel: rem.offsetLabel,
          },
        });

        await this.addNotificationLog({
          userId: user._id.toString(),
          eventId: event._id.toString(),
          reminderId: rem._id.toString(),
          channel: "whatsapp",
          messageContent: res.messageContent,
          providerMessageId: res.providerMessageId,
          status: res.status,
          errorMessage: res.errorMessage,
        });

        await Reminder.findByIdAndUpdate(rem._id, {
          status: res.success ? "sent" : "failed",
          processedAt: now,
          attempts: rem.attempts + 1,
        });

        processed.push({ reminderId: rem._id.toString(), status: res.status, title: event.title });
      }

      return processed;
    }

    // In-Memory Execution
    await seedInMemoryDb();
    const dueReminders = memoryDb.reminders.filter(
      (r) => r.status === "pending" && new Date(r.scheduledAtUTC).getTime() <= now.getTime()
    );

    for (const rem of dueReminders) {
      rem.status = "processing";
      rem.lockedAt = now;

      const event = memoryDb.events.find((e) => e._id.toString() === rem.eventId.toString());
      const user = memoryDb.users.find((u) => u._id.toString() === rem.userId.toString());

      if (!event || event.status !== "active") {
        rem.status = "cancelled";
        rem.processedAt = now;
        continue;
      }

      const { dispatchWhatsAppNotification } = await import("@/lib/whatsapp/dispatcher");
      const res = await dispatchWhatsAppNotification({
        user: {
          _id: user?._id || rem.userId,
          name: user?.name || "User",
          whatsappNumber: user?.whatsappNumber,
          whatsappConsent: user?.whatsappConsent,
        },
        event: {
          _id: event._id,
          title: event.title,
          category: event.category,
          eventDate: event.eventDate,
          eventTime: event.eventTime,
          timezone: event.timezone,
          description: event.description,
        },
        reminder: {
          _id: rem._id,
          offsetLabel: rem.offsetLabel,
        },
      });

      await this.addNotificationLog({
        userId: rem.userId,
        eventId: event._id,
        reminderId: rem._id,
        channel: "whatsapp",
        messageContent: res.messageContent,
        providerMessageId: res.providerMessageId,
        status: res.status,
        errorMessage: res.errorMessage,
      });

      rem.status = res.success ? "sent" : "failed";
      rem.processedAt = now;
      rem.attempts += 1;

      processed.push({ reminderId: rem._id, status: res.status, title: event.title });
    }

    return processed;
  },
};
