import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes cleanly and resolves conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into a clean, human-readable string.
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    ...options,
  }).format(d);
}

/**
 * Formats a time string or Date into 12-hour format (e.g. "10:00 AM").
 */
export function formatTime(timeStrOrDate: string | Date): string {
  if (typeof timeStrOrDate === "string" && timeStrOrDate.includes(":")) {
    const [hours, minutes] = timeStrOrDate.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  }
  const d = typeof timeStrOrDate === "string" ? new Date(timeStrOrDate) : timeStrOrDate;
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(d);
}
