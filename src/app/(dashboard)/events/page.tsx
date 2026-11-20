"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Bell,
  Calendar,
  Clock,
  Plus,
  Search,
  Trash2,
  Check,
  RotateCcw,
} from "lucide-react";
import { IEvent } from "@/types";
import { CreateEventModal } from "@/components/events/CreateEventModal";
import { formatTime } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Career",
  "Education",
  "Birthday",
  "Anniversary",
  "Finance",
  "Health",
  "Documents",
  "Travel",
  "Personal",
  "Other",
];

export default function EventsPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Postpone modal state
  const [postponeEventId, setPostponeEventId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("10:00");

  const refreshEvents = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedStatus !== "All") params.set("status", selectedStatus);

    fetch(`/api/events?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setEvents(data.data || []))
      .catch(() => setMessage("Failed to load events."));
  }, [selectedCategory, selectedStatus]);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedStatus !== "All") params.set("status", selectedStatus);

    fetch(`/api/events?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setEvents(data.data || []);
        }
      })
      .catch(() => {
        if (!ignore) {
          setMessage("Failed to load events.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedCategory, selectedStatus]);

  async function handleComplete(id: string) {
    try {
      await fetch(`/api/events/${id}/complete`, { method: "POST" });
      setMessage("Event marked as completed! Future reminders cancelled.");
      refreshEvents();
    } catch {
      setMessage("Failed to complete event.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event and its reminders?")) return;
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      setMessage("Event deleted.");
      refreshEvents();
    } catch {
      setMessage("Failed to delete event.");
    }
  }

  async function handlePostponeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!postponeEventId) return;

    try {
      await fetch(`/api/events/${postponeEventId}/postpone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventDate: newDate, eventTime: newTime }),
      });
      setMessage("Event postponed and reminders rescheduled!");
      setPostponeEventId(null);
      refreshEvents();
    } catch {
      setMessage("Failed to postpone event.");
    }
  }

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    (e.description && e.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Events & Milestones
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your life deadlines, exams, interviews, and automated WhatsApp alert schedules.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-xs font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="All">Status: All</option>
            <option value="active">Status: Active</option>
            <option value="completed">Status: Completed</option>
            <option value="postponed">Status: Postponed</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800">No events found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t added any events in this filter yet. Create one now to start receiving
              automated WhatsApp alerts!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
            >
              Add First Event
            </button>
          </div>
        ) : (
          filteredEvents.map((ev) => (
            <div
              key={ev._id}
              className={`p-5 bg-white rounded-2xl border transition-all ${
                ev.status === "completed"
                  ? "border-slate-200 bg-slate-50/50 opacity-70"
                  : "border-slate-200 hover:border-emerald-300 shadow-sm"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {ev.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ev.status === "completed"
                          ? "bg-purple-50 text-purple-700"
                          : ev.status === "postponed"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {ev.status}
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

                  <h3
                    className={`text-lg font-bold ${
                      ev.status === "completed" ? "line-through text-slate-500" : "text-slate-900"
                    }`}
                  >
                    {ev.title}
                  </h3>

                  {ev.description && (
                    <p className="text-xs text-slate-600">{ev.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
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

                <div className="flex items-center gap-2 self-end md:self-center">
                  {ev.status !== "completed" && (
                    <>
                      <button
                        onClick={() => handleComplete(ev._id)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                        title="Mark complete"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Complete</span>
                      </button>

                      <button
                        onClick={() => {
                          setPostponeEventId(ev._id);
                          setNewDate(ev.eventDate);
                          setNewTime(ev.eventTime);
                        }}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
                        title="Postpone"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Postpone</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(ev._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {postponeEventId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Postpone Event</h3>
            <p className="text-xs text-slate-500">
              Select the new date and time. Future reminders will be automatically recalculated!
            </p>

            <form onSubmit={handlePostponeSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Time</label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPostponeEventId(null)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
                >
                  Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={refreshEvents}
      />
    </div>
  );
}
