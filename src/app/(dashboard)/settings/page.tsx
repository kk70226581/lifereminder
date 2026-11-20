"use client";

import { useEffect, useState } from "react";
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  ShieldCheck,
  ExternalLink,
  Zap,
} from "lucide-react";

export default function SettingsPage() {
  const [phoneNumber, setPhoneNumber] = useState("+919876543210");
  const [consentStatus, setConsentStatus] = useState(true);
  const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);
  const [mode, setMode] = useState("simulation");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [metaConfigured, setMetaConfigured] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [hasPhoneNumberId, setHasPhoneNumberId] = useState(false);

  // Direct Test State
  const [testNumber, setTestNumber] = useState("+919876543210");
  const [testMessage, setTestMessage] = useState("Hi from LifeReminder! Your WhatsApp integration is fully active.");
  const [forceLive, setForceLive] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testFeedback, setTestFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetch("/api/whatsapp/settings"), fetch("/api/auth/me")]).then(
      async ([wRes, uRes]) => {
        if (wRes.ok) {
          const wData = await wRes.json();
          if (wData.data?.phoneNumber) {
            setPhoneNumber(wData.data.phoneNumber);
            setTestNumber(wData.data.phoneNumber);
          }
          if (wData.data?.consentStatus !== undefined) setConsentStatus(wData.data.consentStatus);
          if (wData.data?.consentTimestamp) setConsentTimestamp(wData.data.consentTimestamp);
          if (wData.data?.mode) setMode(wData.data.mode);
          setMetaConfigured(Boolean(wData.data?.metaConfigured));
          setHasAccessToken(Boolean(wData.data?.hasAccessToken));
          setHasPhoneNumberId(Boolean(wData.data?.hasPhoneNumberId));
        }
        if (uRes.ok) {
          const uData = await uRes.json();
          if (uData.user?.email) setUserEmail(uData.user.email);
          if (uData.user?.name) setUserName(uData.user.name);
          if (uData.user?.timezone) setTimezone(uData.user.timezone);
        }
      }
    );
  }, []);

  async function handleSaveWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/whatsapp/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          consentStatus,
          preferredLanguage: "en",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update WhatsApp settings.");
      }

      setStatusMessage("WhatsApp phone number and consent saved successfully!");
      setConsentTimestamp(new Date().toISOString());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving settings.";
      setStatusMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDirectTest(e: React.FormEvent) {
    e.preventDefault();
    setSendingTest(true);
    setTestFeedback(null);

    try {
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testNumber,
          message: testMessage,
          forceLive,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setTestFeedback({
          success: false,
          message: data.error || data.message || "Failed to dispatch message.",
        });
      } else {
        setTestFeedback({
          success: true,
          message: `${data.message} (Provider ID: ${data.providerMessageId || "N/A"})`,
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Network error during dispatch.";
      setTestFeedback({ success: false, message: errorMsg });
    } finally {
      setSendingTest(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          WhatsApp & Profile Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your WhatsApp delivery preferences, explicit consent, and profile details.
        </p>
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

      {/* Meta WhatsApp Cloud API Status Panel */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-900">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base">Meta WhatsApp Cloud API Status</h2>
              <p className="text-xs text-slate-400">Official Business Platform integration status</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-800 border border-slate-700 text-slate-300">
              Active Mode: <strong className="text-emerald-400 font-mono">{mode.toUpperCase()}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block mb-1">Access Token</span>
            <span
              className={`font-semibold flex items-center gap-1 ${
                hasAccessToken ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {hasAccessToken ? "✓ Configured in .env.local" : "⚠ Missing (Using Simulation)"}
            </span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block mb-1">Phone Number ID</span>
            <span
              className={`font-semibold flex items-center gap-1 ${
                hasPhoneNumberId ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {hasPhoneNumberId ? "✓ Configured in .env.local" : "⚠ Missing (Using Simulation)"}
            </span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block mb-1">Meta Free Tier</span>
            <span className="text-emerald-400 font-semibold">1,000 Free Conversations / Mo</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Configuration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Recipient Phone & Consent</h2>
              <p className="text-xs text-slate-500">Your registered WhatsApp destination number</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveWhatsApp} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              WhatsApp Phone Number (with Country Code) *
            </label>
            <input
              type="text"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+919876543210"
              className="w-full sm:max-w-md px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
            />
            <p className="text-xs text-slate-400 mt-1">
              Include your country code (e.g. +91 for India, +1 for US/Canada).
            </p>
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consentStatus}
                onChange={(e) => setConsentStatus(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <div>
                <span className="text-xs font-bold text-emerald-950 block">
                  Explicit Opt-In & Delivery Consent
                </span>
                <span className="text-xs text-emerald-800 leading-relaxed block mt-0.5">
                  I give explicit permission to LifeReminder to send me scheduled WhatsApp reminder
                  messages for my chosen events via the Meta WhatsApp Cloud API. I understand I can
                  withdraw this consent at any time.
                </span>
              </div>
            </label>

            {consentTimestamp && (
              <div className="text-[11px] text-emerald-700 pl-7">
                Consent recorded on: {new Date(consentTimestamp).toLocaleString()}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setConsentStatus(false);
                setStatusMessage("WhatsApp consent withdrawn. Reminders will be paused.");
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              Withdraw WhatsApp Consent
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save WhatsApp Settings</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Direct WhatsApp Test Dispatcher */}
      <div className="bg-white rounded-2xl border-2 border-emerald-500/30 shadow-md p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg">Direct WhatsApp Test Center</h2>
              <p className="text-xs text-slate-500">Test sending reminders to your phone or inspect live delivery</p>
            </div>
          </div>

          {/* Quick Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setForceLive(false)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                !forceLive
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🧪 Simulation Mode (Free & Instant)
            </button>
            <button
              type="button"
              onClick={() => setForceLive(true)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                forceLive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              📲 Live Meta Cloud API
            </button>
          </div>
        </div>

        {testFeedback && (
          <div
            className={`p-4 rounded-xl text-sm space-y-2 border ${
              testFeedback.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-2 font-semibold">
              {testFeedback.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              )}
              <span>{testFeedback.message}</span>
            </div>

            {/* Helpful beginner guidance if Meta returns the allowed list error */}
            {!testFeedback.success && testFeedback.message.includes("131030") && (
              <div className="p-3 bg-white rounded-lg border border-rose-200 text-xs text-slate-700 space-y-1.5">
                <p className="font-bold text-rose-700">
                  💡 Why did this error happen?
                </p>
                <p>
                  Because your Meta App is in <strong>Development Sandbox</strong> mode, Meta only sends messages to phone numbers that you have registered in your Meta test list.
                </p>
                <p>
                  <strong>To fix in 30 seconds:</strong> Go to your open Meta Developers tab &rarr; under <strong>&quot;Recipient&quot;</strong>, click <strong>&quot;Manage phone number list&quot;</strong> &rarr; enter your mobile number &rarr; type the 6-digit WhatsApp OTP code. Once verified, you can send unlimited test messages!
                </p>
                <p className="text-emerald-700 font-semibold pt-1">
                  ✨ Or switch the button above to <strong>&quot;🧪 Simulation Mode&quot;</strong> to test all features instantly without OTP!
                </p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleDirectTest} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Recipient WhatsApp Phone Number
              </label>
              {testNumber && (
                <button
                  type="button"
                  onClick={() => setTestNumber("")}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Clear Number
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                placeholder="+919876543210 (Country code + 10 digits)"
                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl text-slate-900 font-bold text-base tracking-wide focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Format: Country code followed by your mobile number (e.g. <code>+919876543210</code> for India, <code>+12025550123</code> for US).
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Reminder Message Content
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-400">Quick Fill:</span>
                <button
                  type="button"
                  onClick={() => setTestMessage("Reminder: Senior Full-Stack Engineer Interview is tomorrow at 10:30 AM!")}
                  className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
                >
                  💼 Interview
                </button>
                <button
                  type="button"
                  onClick={() => setTestMessage("Reminder: Distributed Systems final exam on Nov 30 at 9:30 AM. Hall ticket mandatory!")}
                  className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
                >
                  📚 Exam
                </button>
                <button
                  type="button"
                  onClick={() => setTestMessage("Reminder: Mom's 50th Birthday in 3 days! Don't forget the cake reservation.")}
                  className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
                >
                  🎂 Birthday
                </button>
              </div>
            </div>
            <textarea
              rows={3}
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={sendingTest}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {sendingTest ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching via Meta WhatsApp API...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {forceLive
                    ? "Send Real Message to My Phone 📲"
                    : "Send Simulated Message (Free & Safe) 🧪"}
                </span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Guide: How to Get Real Meta WhatsApp Credentials Free */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>How to Enable Live Meta WhatsApp Cloud API (Free Tier)</span>
        </h3>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 leading-relaxed">
          <li>
            Go to{" "}
            <a
              href="https://developers.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 font-semibold hover:underline inline-flex items-center gap-1"
            >
              developers.facebook.com <ExternalLink className="w-3 h-3" />
            </a>{" "}
            and create a free Developer Account.
          </li>
          <li>Click <strong>Create App</strong> and choose <strong>Other</strong> &gt; <strong>Business</strong>.</li>
          <li>Add the <strong>WhatsApp</strong> product to your new app.</li>
          <li>
            Under <strong>WhatsApp &gt; API Setup</strong>, copy:
            <ul className="list-disc list-inside pl-4 pt-1 space-y-1 font-mono text-slate-700">
              <li>Temporary Access Token &rarr; <code>META_WHATSAPP_ACCESS_TOKEN</code></li>
              <li>Phone Number ID &rarr; <code>META_WHATSAPP_PHONE_NUMBER_ID</code></li>
              <li>WhatsApp Business Account ID &rarr; <code>META_WHATSAPP_BUSINESS_ACCOUNT_ID</code></li>
            </ul>
          </li>
          <li>Add your own mobile number under <strong>To</strong> in the Meta test dashboard to receive test messages.</li>
          <li>
            In <code>.env.local</code>, set <code>WHATSAPP_MODE=&quot;live&quot;</code> and paste your tokens!
          </li>
        </ol>
      </div>

      {/* Account Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-base">Account Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-xs text-slate-400 block">Name</span>
            <span className="font-semibold text-slate-800">{userName || "Alex Johnson"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Email Address</span>
            <span className="font-semibold text-slate-800">{userEmail || "alex@lifereminder.com"}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Default Timezone</span>
            <span className="font-semibold text-slate-800">{timezone}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Meta API Integration</span>
            <span className={`font-semibold ${metaConfigured ? "text-emerald-600" : "text-amber-600"}`}>
              {metaConfigured ? "Ready & Configured" : "Simulation Mode Active"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
