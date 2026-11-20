"use client";

import { useEffect, useState } from "react";
import { Clock, Play, CheckCircle2, RefreshCw, Smartphone } from "lucide-react";

interface ReminderListItem {
  _id: string;
  eventId?: {
    title?: string;
    category?: string;
  };
  scheduledAtUTC: string;
  status: string;
  offsetLabel?: string;
  attempts: number;
  maxAttempts: number;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ReminderListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch("/api/reminders")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setReminders(data.data || []);
        }
      })
      .catch(() => {
        if (!ignore) {
          setStatusMessage("Failed to load reminders.");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function loadReminders() {
    setLoading(true);
    try {
      const res = await fetch("/api/reminders");
      const data = await res.json();
      setReminders(data.data || []);
    } catch {
      setStatusMessage("Failed to load reminders.");
    } finally {
      setLoading(false);
    }
  }

  async function handleTriggerScheduler() {
    setProcessing(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/internal/process-reminders", { method: "POST" });
      const data = await res.json();
      setStatusMessage(
        `Scheduler triggered! ${data.count} due reminder(s) claimed and dispatched.`
      );
      loadReminders();
    } catch {
      setStatusMessage("Failed to execute reminder process.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Automated Reminder Queue
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status of atomic reminder records scheduled for WhatsApp dispatch.
          </p>
        </div>

        <button
          onClick={handleTriggerScheduler}
          disabled={processing}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto disabled:opacity-50"
        >
          <Play className={`w-4 h-4 ${processing ? "animate-spin" : ""}`} />
          <span>Process Due Reminders Now</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-xs font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Info card */}
      <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 flex items-start gap-3">
        <Smartphone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong className="text-emerald-400">Background Worker Reliability:</strong> When you
          close this browser, your reminders continue to run on schedule. Each reminder is claimed
          using atomic locks in MongoDB, guaranteeing zero duplicate dispatches and automatic
          retries with exponential backoff if a network error occurs.
        </div>
      </div>

      {/* Reminders Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Scheduled Trigger Records ({reminders.length})</span>
          </h2>
          <button
            onClick={loadReminders}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">Loading reminders...</div>
        ) : reminders.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No scheduled reminders in queue</p>
            <p className="text-xs text-slate-500">Create an event to generate automatic reminder schedules.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reminders.map((r) => {
              const eventTitle = r.eventId?.title || "Life Event";
              const category = r.eventId?.category || "General";
              return (
                <div key={r._id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{eventTitle}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.status === "sent"
                            ? "bg-emerald-50 text-emerald-700"
                            : r.status === "processing"
                            ? "bg-amber-50 text-amber-700"
                            : r.status === "cancelled"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Trigger: <strong>{r.offsetLabel || "Scheduled time"}</strong></span>
                      <span>•</span>
                      <span>UTC: {new Date(r.scheduledAtUTC).toUTCString()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 self-end sm:self-center font-mono">
                    Attempts: {r.attempts} / {r.maxAttempts}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
