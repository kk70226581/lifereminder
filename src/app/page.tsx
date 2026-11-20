import Link from "next/link";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
  ArrowRight,
  Send,
  CheckCheck,
  Lock,
  ChevronRight,
  Award,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* ------------------------------------------------------------- */}
      {/* NAVIGATION BAR                                                */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-700 bg-clip-text text-transparent">
                LifeReminder
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Free
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">
              Features
            </a>
            <a href="#preview" className="hover:text-emerald-600 transition-colors">
              WhatsApp Preview
            </a>
            <a href="#use-cases" className="hover:text-emerald-600 transition-colors">
              Use Cases
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm shadow-emerald-600/30 transition-all hover:shadow-md"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION                                                  */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Automated WhatsApp Life Assistant
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Never Forget <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                What Matters
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Life gets hectic. LifeReminder sends automatic, high-priority WhatsApp alerts for job
              interviews, college exams, insurance renewals, and family milestones — even when your
              browser is closed.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl shadow-sm transition-all"
              >
                Login to Dashboard
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                No App Download Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Official WhatsApp Cloud API
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Zero Cost Starter
              </span>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* WHATSAPP INTERACTIVE ILLUSTRATION MOCKUP                     */}
          {/* ------------------------------------------------------------- */}
          <div id="preview" className="mt-16 max-w-4xl mx-auto">
            <div className="bg-slate-900 p-2 sm:p-4 rounded-3xl shadow-2xl border border-slate-800">
              {/* WhatsApp App Mockup Container */}
              <div className="bg-[#EFEAE2] rounded-2xl overflow-hidden shadow-inner flex flex-col min-h-[420px]">
                {/* Header */}
                <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white shadow">
                      LR
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm sm:text-base">LifeReminder Assistant</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      </div>
                      <span className="text-xs text-emerald-100">Official Business Account</span>
                    </div>
                  </div>
                  <div className="text-xs bg-emerald-800/60 px-2.5 py-1 rounded text-emerald-100 font-mono">
                    WhatsApp Cloud API
                  </div>
                </div>

                {/* Chat Bubble Area */}
                <div className="p-4 sm:p-6 space-y-4 flex-1 flex flex-col justify-center">
                  <div className="text-center">
                    <span className="text-[11px] bg-white/80 text-slate-600 px-3 py-1 rounded-full shadow-sm">
                      Today
                    </span>
                  </div>

                  {/* Incoming WhatsApp Message Mockup */}
                  <div className="max-w-md bg-white rounded-2xl rounded-tl-sm p-4 shadow-md space-y-2.5 border border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <Bell className="w-3.5 h-3.5" /> High Priority Reminder
                      </span>
                      <span className="text-[11px]">10:00 AM</span>
                    </div>

                    <p className="text-sm text-slate-800 leading-relaxed">
                      Hello <strong>Alex</strong>! 👋
                      <br /><br />
                      This is your <strong>LifeReminder assistant</strong>.
                      <br /><br />
                      A friendly reminder that you have <strong>Senior Engineer Job Interview</strong> tomorrow at <strong>10:30 AM (IST)</strong>.
                      <br /><br />
                      📌 <em>&ldquo;Prepare system design notes and keep portfolio links handy.&rdquo;</em>
                      <br /><br />
                      Please prepare accordingly. Have a great day!
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono text-[10px]">
                        Event: Career
                      </span>
                      <span className="flex items-center gap-1 text-teal-600 font-medium">
                        Delivered
                        <CheckCheck className="w-3.5 h-3.5 text-teal-600" />
                      </span>
                    </div>
                  </div>

                  {/* Second Reminder Example */}
                  <div className="max-w-md bg-white rounded-2xl rounded-tl-sm p-3.5 shadow-md space-y-1.5 border border-slate-100 self-start">
                    <p className="text-xs text-slate-700">
                      🎂 Reminder: <strong>Mom&apos;s Birthday</strong> is in 3 days (Nov 24). Don&apos;t forget to order the custom gift!
                    </p>
                    <div className="flex justify-end items-center gap-1 text-[10px] text-slate-400">
                      <span>09:00 AM</span>
                      <CheckCheck className="w-3.5 h-3.5 text-teal-600" />
                    </div>
                  </div>
                </div>

                {/* Input Simulation Footer */}
                <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-3 border-t border-slate-200">
                  <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-slate-400">
                    Automated delivery powered by LifeReminder Engine...
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* HOW IT WORKS SECTION                                          */}
      {/* ------------------------------------------------------------- */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Simple 3-Step Process
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              How LifeReminder Works
            </h3>
            <p className="text-slate-600">
              Set it once and get on with your life. The background scheduler handles the rest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                01
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Add Your Event</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enter your upcoming event title, date, time, category, and local timezone. Categorize
                as career, health, finance, or exams.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 font-extrabold text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                02
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Configure Reminders</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose multiple triggers: 30 days, 7 days, 1 day, or 1 hour before. You can set
                recurring rules for birthdays or monthly bills.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 font-extrabold text-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                03
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Receive WhatsApp Alert</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Our reliable background scheduler claims due reminders and sends crisp messages
                directly to your WhatsApp phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* KEY FEATURES SECTION                                          */}
      {/* ------------------------------------------------------------- */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Core Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Built for Absolute Reliability
            </h3>
            <p className="text-slate-600">
              Designed with enterprise architecture principles to make sure no reminder is ever
              lost or duplicated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">WhatsApp Direct Delivery</h4>
              <p className="text-sm text-slate-600">
                Email inboxes are flooded; app push notifications get cleared. WhatsApp messages get
                seen within minutes.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Browser-Independent</h4>
              <p className="text-sm text-slate-600">
                You do not need to keep the tab open or laptop running. Scheduled jobs run on cloud
                workers around the clock.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Multi-Tier Alerts</h4>
              <p className="text-sm text-slate-600">
                Set progressive nudges: 1 month before for passport renewal, 1 week before for prep,
                and morning-of for action.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Idempotent & Atomic Claims</h4>
              <p className="text-sm text-slate-600">
                MongoDB atomic locks ensure that two concurrent workers will never send duplicate
                reminders for the same event.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Recurrence Engine</h4>
              <p className="text-sm text-slate-600">
                Automate yearly birthdays, monthly insurance premiums, or weekly team check-ins with
                safe horizon scheduling.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Privacy & Explicit Consent</h4>
              <p className="text-sm text-slate-600">
                Strict compliance with WhatsApp Business Platform policies. Clear opt-in consent and
                instant withdrawal controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* USE CASES / CATEGORIES SECTION                                */}
      {/* ------------------------------------------------------------- */}
      <section id="use-cases" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              Life Categories
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Never Miss a Deadline Again
            </h3>
            <p className="text-slate-600">
              Organize every aspect of your life with dedicated categorization and custom schedules.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { title: "Job Interviews", icon: "💼", desc: "Pre-interview alert & prep notes" },
              { title: "College Exams", icon: "📚", desc: "Syllabus checkpoints & exam day" },
              { title: "Birthdays & Anniversaries", icon: "🎂", desc: "Early gift shopping & day-of" },
              { title: "Insurance Renewals", icon: "🛡️", desc: "Auto, health & life policies" },
              { title: "Loan EMIs & Bills", icon: "💳", desc: "Due dates before penalties" },
              { title: "Passport & Licences", icon: "🛂", desc: "6-month and 30-day expiry nudges" },
              { title: "Doctor Appointments", icon: "🩺", desc: "Consultations & test fasting" },
              { title: "Meetings & Work", icon: "🤝", desc: "Client calls & presentations" },
              { title: "Travel Dates", icon: "✈️", desc: "Web check-in & boarding alerts" },
              { title: "Personal Tasks", icon: "⭐", desc: "Custom goals & family to-dos" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center hover:border-emerald-400 hover:bg-emerald-50/40 transition-colors"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-semibold text-sm text-slate-800 mb-1">{item.title}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* CALL TO ACTION                                                */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Award className="w-4 h-4" /> 100% Free Forever Starter Tier
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Stop Relying on Memory. <br />
            Let LifeReminder Handle It.
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Create an account in 30 seconds. No credit card required. Receive your first WhatsApp
            reminder today.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              <span>Create Free Account</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER                                                        */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Bell className="w-4 h-4" />
                </div>
                <span>LifeReminder</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm">
                Never forget what matters. Automatic WhatsApp alerts for your exams, interviews,
                milestones, and life deadlines.
              </p>
              <div className="text-xs text-slate-500">
                Official Meta WhatsApp Cloud API Ready · Powered by MongoDB Atlas
              </div>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
                Product
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-emerald-400 transition-colors">
                    Key Features
                  </a>
                </li>
                <li>
                  <a href="#preview" className="hover:text-emerald-400 transition-colors">
                    WhatsApp Mockup
                  </a>
                </li>
                <li>
                  <Link href="/register" className="hover:text-emerald-400 transition-colors">
                    Get Started Free
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">
                Account & Access
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/login" className="hover:text-emerald-400 transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-emerald-400 transition-colors">
                    Register
                  </Link>
                </li>
                <li>
                  <span className="text-slate-500">WHATSAPP_MODE: simulation</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              &copy; 2026 LifeReminder. All rights reserved.
            </div>
            <div>
              Designed with 100% free-tier architecture for budget-conscious developers and users.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
