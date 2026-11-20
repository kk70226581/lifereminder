# LifeReminder — Never Forget What Matters

> **Production-minded, budget-conscious web application for automated life milestone and event reminders via WhatsApp.**

LifeReminder is built for individuals who want zero-friction reminders directly on WhatsApp for high-stakes events (job interviews, college exams, insurance renewals, loan EMIs, passport expiries, doctor visits, birthdays). It operates independently of whether the user has their browser open.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js 16 Frontend (SaaS UI)                │
│   Landing Page │ Dashboard │ Calendar │ Settings │ WhatsApp Sim │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS / Server Actions & Route Handlers
┌───────────────────────────────▼─────────────────────────────────┐
│               Next.js App Router Backend                        │
│   - Authentication (Bcrypt + Jose JWT HTTP-only Cookies)        │
│   - Event & Multi-Stage Reminder Services                       │
│   - WhatsApp Formatter & Template Engine                        │
└───────────────┬─────────────────────────────────┬───────────────┘
                │                                 │
                │ Mongoose Pool                   │ Atomic Claim Pings
┌───────────────▼───────────────┐ ┌───────────────▼───────────────┐
│  MongoDB Atlas (M0 Free Tier) │ │  Automated Reminder Engine    │
│  - users                      │ │  - Atomic lock expiration     │
│  - events                     │ │  - Overdue recovery           │
│  - reminders                  │ │  - /api/internal/process-rem. │
│  - notificationLogs           │ └───────────────┬───────────────┘
│  - whatsappSettings           │                 │
└───────────────────────────────┘                 │
                                  ┌───────────────▼───────────────┐
                                  │ WhatsApp Dispatcher           │
                                  │  - Simulation Mode (Free/Dev) │
                                  │  - Meta Cloud API (Prod Live) │
                                  └───────────────────────────────┘
```

---

## 2. Complete Features Implemented

### 📱 1. Landing Page (`/`)
- Brand identity, hero headline: *"Never Forget What Matters"*
- 3-step "How It Works" guide
- Interactive WhatsApp chat reminder simulation mockup
- 6 capability highlights and 10 life categories

### 🔐 2. Authentication (`/login` & `/register`)
- Secure credentials-based authentication with **Bcrypt** password hashing
- Session management using **Jose JWT in httpOnly cookies**
- Password visibility toggles, terms acceptance, validation
- **Quick Demo Login button**: One click fills `alex@lifereminder.com` (`demo123`)

### 📊 3. Central Dashboard (`/dashboard`)
- Stat counters: Total Events, Active/Upcoming, Completed, WhatsApp Alerts Sent
- Quick Action Buttons:
  - **Add Event**: Open full event creation modal
  - **Run Scheduler Now**: Manually execute background cron to claim and dispatch due reminders
  - **Test WhatsApp Alert**: Generate a real-time simulated WhatsApp message
- Upcoming Milestones stream with quick "Done" (mark completed) action
- Live WhatsApp Notification stream with realistic chat bubbles and delivery checkmarks

### 📅 4. Events Management (`/events`)
- Search by keyword and filter by category (Career, Education, Birthday, Health, Finance, etc.)
- Status filtering (Active, Completed, Postponed)
- Complete Event action (cancels remaining pending reminders)
- Postpone Event action (modal to pick new date/time; automatically recalculates all future reminder triggers)
- Delete Event action (cascades and purges associated reminder queue)

### 🗓️ 5. Interactive Calendar (`/calendar`)
- Monthly grid with prev/next navigation
- Category-colored event chips on exact dates
- Click any date to open the Add Event modal with that date pre-selected

### ⏰ 6. Reminder Queue (`/reminders`)
- Real-time view of atomic reminder records
- Status badges: `pending`, `processing`, `sent`, `cancelled`
- Trigger offsets: 30 days, 7 days, 3 days, 1 day, 12 hours, 1 hour before
- Stored in UTC for global accuracy

### 📜 7. Notification Audit History (`/notifications`)
- Full audit log of all delivered and simulated messages
- Formatted WhatsApp message preview
- Provider message ID, channel, timestamps, and delivery verification

### ⚙️ 8. WhatsApp & Profile Settings (`/settings`)
- Phone number input with international country code
- Explicit WhatsApp delivery consent checkbox
- Consent timestamp tracking and instant withdrawal button
- Profile and timezone preferences

---

## 3. Strict Budget & Free-Tier Architecture (₹0 Spent / ₹50 Budget)

| Component | Free Provider | Limits | Architecture Note |
| :--- | :--- | :--- | :--- |
| **Database** | MongoDB Atlas M0 | 512 MB, 500 connections | Indexed queries run in <10ms. Hybrid fallback keeps local dev active even before Atlas credentials are input. |
| **Frontend & API** | Vercel Free Hobby Tier | 100 GB bandwidth | Serverless App Router handles routes and spins down automatically to save cost. |
| **Scheduler** | External Cron / Local Cron | 1-5 min intervals | External cron calls `POST /api/internal/process-reminders` with `CRON_SECRET`. Works even when your browser is closed. |
| **WhatsApp Messages** | Simulation Mode | Unlimited | `WHATSAPP_MODE=simulation` by default. Zero charges, zero API fees. |

---

## 4. Local Quick Start & Testing

The development server is running at:
👉 **[http://localhost:3000](http://localhost:3000)**

### Quick Demo Access:
1. Navigate to **[http://localhost:3000/login](http://localhost:3000/login)**
2. Click **"Fill Demo User"** (or use `alex@lifereminder.com` / `demo123`)
3. Click **Sign In** to open the Dashboard!
