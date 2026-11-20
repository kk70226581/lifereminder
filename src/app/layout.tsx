import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LifeReminder — Never Forget What Matters",
  description:
    "Intelligent, automated WhatsApp reminders for your job interviews, college exams, bill payments, document expiries, and precious milestones.",
  keywords: [
    "LifeReminder",
    "WhatsApp reminders",
    "exam reminder",
    "interview alert",
    "bill reminder",
    "task manager",
    "smart calendar",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
