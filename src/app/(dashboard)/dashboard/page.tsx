"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Send,
  CheckCheck,
  Sparkles,
  Play,
  Check,
  ChevronRight,
} from "lucide-react";
import { IEvent, INotificationLog } from "@/types";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { formatDate, formatTime } from "@/lib/utils";

export default function DashboardPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [notifications, setNotifications] = useState<INotificationLog[]>([]);
  const [userName, setUserName] = useState("Alex");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [runningScheduler, setRunningScheduler] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [userRes, eventsRes, notifRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/events"),
        fetch("/api/notifications"),
      ]);

      if (userRes.ok) {
        const u = await userRes.json();
        if (u.user?.name) setUserName(u.user.name);
      }

      if (eventsRes.ok) {
        const ev = await eventsRes.json();
        setEvents(ev.data || []);
      }

      if (notifRes.ok) {
        const notifs = await notifRes.json();
        setNotifications(notifs.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRunScheduler() {
    setRunningScheduler(true);
    setActionMessage(null);
    try {
      const res = await fetch("/api/internal/process-reminders", { method: "POST" });
      const data = await res.json();
      setActionMessage(
        data.count > 0
          ? `Engine ran: Processed ${data.count} due reminders!`
          : "Engine checked: No reminders currently overdue. All queues clear!"
      );
      loadData();
    } catch {
      setActionMessage("Scheduler test run completed.");
    } finally {
      setRunningScheduler(false);
    }
  }

  async function handleSendTestAlert() {
    setActionMessage(null);
    try {
      const res = await fetch("/api/notifications/test", { method: "POST" });
      const data = await res.json();
      setActionMessage(data.message || "Test alert generated!");
      loadData();
    } catch {
      setActionMessage("Failed to send test alert.");
    }
  }

  async function handleCompleteEvent(eventId: string) {
    try {
      await fetch(`/api/events/${eventId}/complete`, { method: "POST" });
      setActionMessage("Event marked as completed! Pending reminders cancelled.");
      loadData();
    } catch {
      setActionMessage("Failed to complete event.");
    }
  }

  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.status === "active");
  const completedEvents = events.filter((e) => e.status === "completed").length;
  const upcomingSoon = activeEvents.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------- */}
      {/* HEADER & QUICK ACTIONS                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is your automated reminder overview for upcoming milestones.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRunScheduler}
            disabled={runningScheduler}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-sm transition-all"
            title="Triggers the automatic reminder scheduler immediately"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-600 ${runningScheduler ? "animate-spin" : ""}`} />
            <span>Run Scheduler Now</span>
          </button>

          <button
            onClick={handleSendTestAlert}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all"
            title="Generates a simulated WhatsApp notification"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Test WhatsApp Alert</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-xs text-emerald-600 font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STAT CARDS                                                    */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Events
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {totalEvents}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active / Upcoming
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {activeEvents.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Completed
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-700 mt-1">
              {completedEvents}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              WhatsApp Alerts Sent
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 mt-1">
              {notifications.length}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Send className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TWO COLUMN GRID: UPCOMING EVENTS & LIVE NOTIFICATIONS FEED    */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span>Upcoming Milestones</span>
            </h2>
            <Link
              href="/events"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingSoon.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm text-slate-600 font-medium">No active upcoming events</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
                >
                  Create Your First Event
                </button>
              </div>
            ) : (
              upcomingSoon.map((ev) => (
                <div
                  key={ev._id}
                  className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ev.category}
                      </span>
                      {ev.priority === "high" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          HIGH PRIORITY
                        </span>
                      )}
                      {ev.recurrence !== "none" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700">
                          Repeats {ev.recurrence}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{ev.title}</h3>
                    {ev.description && (
                      <p className="text-xs text-slate-500 line-clamp-1">{ev.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {ev.eventDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {formatTime(ev.eventTime)}
                      </span>
                      <span>({ev.timezone})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleCompleteEvent(ev._id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      title="Mark as completed"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </button>
                    <Link
                      href={`/events`}
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-teal-600" />
              <span>Recent WhatsApp Alerts</span>
            </h2>
            <Link
              href="/notifications"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Full History
            </Link>
          </div>

          <div className="bg-slate-900 rounded-2xl p-3 shadow-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-emerald-400 pb-2 border-b border-slate-800 px-1">
              <span className="font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Notification Stream
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                Mode: Simulation
              </span>
            </div>

            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs space-y-2">
                <p>No WhatsApp notifications generated yet.</p>
                <button
                  onClick={handleSendTestAlert}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg text-xs"
                >
                  Send Test Simulation
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {notifications.slice(0, 3).map((n) => (
                  <div
                    key={n._id}
                    className="bg-[#EFEAE2] rounded-xl p-3 shadow text-slate-900 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200/70 pb-1 text-[11px] text-slate-500">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <Bell className="w-3 h-3" /> LifeReminder Bot
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.2 rounded text-[9px]">
                        {n.status}
                      </span>
                    </div>

                    <p className="whitespace-pre-line text-[11px] text-slate-800 leading-relaxed font-sans">
                      {n.messageContent}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{formatDate(n.createdAt)}</span>
                      <span className="flex items-center gap-1 text-teal-700 font-semibold">
                        <CheckCheck className="w-3.5 h-3.5 text-teal-600" />
                        {n.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={loadData}
      />
    </div>
  );
}
