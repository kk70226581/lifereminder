"use client";

import { useEffect, useState } from "react";
import { History, Send, CheckCheck, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface NotificationLogItem {
  _id: string;
  eventId?: { title?: string };
  status: string;
  createdAt: string;
  messageContent: string;
  providerMessageId?: string;
  channel: string;
}

export default function NotificationsPage() {
  const [logs, setLogs] = useState<NotificationLogItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          setLogs(data.data || []);
        }
      })
      .catch(() => {
        if (!ignore) {
          setMessage("Failed to load notification logs.");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSendTest() {
    try {
      const res = await fetch("/api/notifications/test", { method: "POST" });
      const data = await res.json();
      setMessage(data.message || "Test alert recorded!");
      // Reload logs
      const refreshRes = await fetch("/api/notifications");
      const refreshData = await refreshRes.json();
      setLogs(refreshData.data || []);
    } catch {
      setMessage("Failed to send test alert.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notification Audit History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete audit trail of all WhatsApp messages, statuses, and delivery confirmations.
          </p>
        </div>

        <button
          onClick={handleSendTest}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Send Test Simulation</span>
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="text-xs font-semibold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Notifications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Delivered & Simulated Messages ({logs.length})</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">WHATSAPP_MODE: simulation</span>
        </div>

        {logs.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Send className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No notification logs recorded yet</p>
            <p className="text-xs text-slate-500">
              When reminders are due, or when you click &ldquo;Send Test Simulation&rdquo;, records will
              appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log._id} className="p-4 sm:p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {log.eventId?.title || "Life Event Notification"}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {log.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{formatDate(log.createdAt)}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                </div>

                <div className="bg-[#EFEAE2] p-4 rounded-xl text-xs text-slate-900 border border-slate-200 whitespace-pre-line leading-relaxed max-w-2xl font-sans">
                  {log.messageContent}
                </div>

                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-4 flex-wrap">
                  <span>Provider Msg ID: {log.providerMessageId || "N/A"}</span>
                  <span>Channel: {log.channel}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
