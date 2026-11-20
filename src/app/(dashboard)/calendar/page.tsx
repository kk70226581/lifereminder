"use client";

import { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { IEvent } from "@/types";
import { CreateEventModal } from "@/components/events/CreateEventModal";

const CATEGORY_COLORS: Record<string, string> = {
  Career: "bg-blue-100 text-blue-800 border-blue-200",
  Education: "bg-purple-100 text-purple-800 border-purple-200",
  Birthday: "bg-pink-100 text-pink-800 border-pink-200",
  Anniversary: "bg-rose-100 text-rose-800 border-rose-200",
  Finance: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Health: "bg-red-100 text-red-800 border-red-200",
  Documents: "bg-amber-100 text-amber-800 border-amber-200",
  Travel: "bg-cyan-100 text-cyan-800 border-cyan-200",
  Personal: "bg-indigo-100 text-indigo-800 border-indigo-200",
  Other: "bg-slate-100 text-slate-800 border-slate-200",
};

export default function CalendarPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 10, 1));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setEvents(data.data || []);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function handleDateClick(day: number) {
    const formatted = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDateStr(formatted);
    setIsModalOpen(true);
  }

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interactive Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View your scheduled events and click any date to add a milestone directly.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedDateStr(undefined);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Month Navigation Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            <span>
              {monthName} {year}
            </span>
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(2026, 10, 1))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl"
            >
              Reset
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 border border-slate-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold uppercase tracking-wider text-slate-500 py-3">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
          {blanksArray.map((_, i) => (
            <div key={`blank-${i}`} className="min-h-[105px] bg-slate-50/50 p-2" />
          ))}

          {daysArray.map((day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const dayEvents = events.filter((e) => e.eventDate === dateStr);

            return (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                className="min-h-[105px] p-2 hover:bg-emerald-50/30 transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-slate-700">
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {dayEvents.length} alert{dayEvents.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 2).map((ev) => (
                    <div
                      key={ev._id}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border ${
                        CATEGORY_COLORS[ev.category] || "bg-slate-100 text-slate-800 border-slate-200"
                      }`}
                      title={`${ev.title} (${ev.eventTime})`}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[9px] text-slate-500 font-medium pl-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CreateEventModal
        key={selectedDateStr || "calendar-default"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={() => {
          fetch("/api/events")
            .then((res) => res.json())
            .then((data) => setEvents(data.data || []));
        }}
        initialDate={selectedDateStr}
      />
    </div>
  );
}
