/**
 * Automatic Reminder Calculation and Scheduler Engine.
 * Converts local event date & time to UTC and calculates trigger execution times.
 */

export type OffsetType = "30d" | "7d" | "3d" | "1d" | "12h" | "1h" | "exact";

export interface ReminderTriggerOption {
  value: OffsetType;
  label: string;
  millisecondsBefore: number;
}

export const REMINDER_TRIGGER_OPTIONS: ReminderTriggerOption[] = [
  { value: "30d", label: "30 days before", millisecondsBefore: 30 * 24 * 60 * 60 * 1000 },
  { value: "7d", label: "7 days before", millisecondsBefore: 7 * 24 * 60 * 60 * 1000 },
  { value: "3d", label: "3 days before", millisecondsBefore: 3 * 24 * 60 * 60 * 1000 },
  { value: "1d", label: "1 day before", millisecondsBefore: 24 * 60 * 60 * 1000 },
  { value: "12h", label: "12 hours before", millisecondsBefore: 12 * 60 * 60 * 1000 },
  { value: "1h", label: "1 hour before", millisecondsBefore: 60 * 60 * 1000 },
  { value: "exact", label: "At event time", millisecondsBefore: 0 },
];

/**
 * Calculates the exact UTC Date of an event based on date (YYYY-MM-DD),
 * time (HH:mm) and the user's timezone.
 */
export function calculateEventUTC(
  dateStr: string,
  timeStr: string,
  timezone: string = "Asia/Kolkata"
): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);

  // Construct target local date string
  // Use Intl formatting to determine UTC offset for the given timezone
  const dateObj = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));

  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(dateObj);
    const localVals: Record<string, number> = {};
    for (const p of parts) {
      if (p.type !== "literal") {
        localVals[p.type] = Number(p.value);
      }
    }

    // Offset in milliseconds between UTC and the requested timezone
    const localTimeFromParts = Date.UTC(
      localVals.year,
      localVals.month - 1,
      localVals.day,
      localVals.hour === 24 ? 0 : localVals.hour,
      localVals.minute,
      localVals.second
    );

    const diff = localTimeFromParts - dateObj.getTime();
    return new Date(dateObj.getTime() - diff);
  } catch {
    // Fallback if timezone string is invalid
    return new Date(`${dateStr}T${timeStr}:00`);
  }
}

/**
 * Given an event's UTC date, calculates scheduled execution timestamps
 * for each selected reminder trigger.
 */
export function calculateReminderSchedules(
  eventDateTimeUTC: Date,
  offsets: OffsetType[]
): { scheduledAtUTC: Date; offsetLabel: string }[] {
  const eventTimeMs = eventDateTimeUTC.getTime();

  return offsets.map((offset) => {
    const option = REMINDER_TRIGGER_OPTIONS.find((o) => o.value === offset) || {
      value: offset,
      label: offset,
      millisecondsBefore: 0,
    };

    const scheduledTime = new Date(eventTimeMs - option.millisecondsBefore);
    return {
      scheduledAtUTC: scheduledTime,
      offsetLabel: option.label,
    };
  });
}
