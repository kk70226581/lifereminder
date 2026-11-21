# Mahender Press — Automated WhatsApp Pickup & Counter Recovery Tool

> **1-Day Take-Home Project for B.Tech Assignment**  
> **Person:** Mahender Kumar (Sole Proprietor & Pressing Operator)  
> **Place:** Mahender Dry Cleaners & Press, Gate No. 2, College Hostel Road  
> **Observation Date:** Saturday, November 21, 2026 (08:15 AM – 09:15 AM)  
> **Live Web Application:** [https://lifereminder-puce.vercel.app](https://lifereminder-puce.vercel.app)  
> **GitHub Repository:** [https://github.com/kk70226581/lifereminder](https://github.com/kk70226581/lifereminder)  

---

## 1. The Core Problem
Mahender Kumar operates a small 8x10 ft clothes pressing stall near the college hostel. Over **45% of students delay collecting their pressed clothes by 2 to 5 days**, using his overhead lines as free wardrobe storage. This clutters his workspace, exposes ironed formal shirts to road dust, and blocks **₹400–₹1,200 of daily unpaid working capital** because students only pay cash on collection.

This tool reads Mahender's raw ledger data (`data.csv`), computes overdue inventory risk, and dispatches automated WhatsApp pickup alerts to students via the Meta WhatsApp Cloud API.

---

## 2. Quickstart & How to Run

### Option A: Run the Lightweight Python Script
```bash
# 1. Clone the repository
git clone https://github.com/kk70226581/lifereminder.git
cd lifereminder

# 2. Run the CSV parser and reminder engine directly (zero heavy dependencies)
python dispatch_laundry_reminders.py
```

### Option B: Run the Full-Stack Next.js Application
```bash
# 1. Install dependencies
npm install

# 2. Set up environment in .env.local (or use in-memory fallback)
cp .env.example .env.local

# 3. Start development server
npm run dev
# Open http://localhost:3000 in your browser
```

---

## 3. Real Terminal Output (`dispatch_laundry_reminders.py`)

```text
=================================================================
MAHENDER DRY CLEANERS & PRESS — WHATSAPP DISPATCH REPORT
Executed at: 2026-11-21 10:38:00
=================================================================

[ALERT] Token: TK-104 | Customer: Vivek Kumar (H4-419)
  Status: overdue_48h | Due: ₹50 | To: +919712345678
  Message: Namaste Vivek Kumar ji! 🙏 Your 5 clothes (Token: TK-104) at Mahender Press are ready for pickup. Amount Due: ₹50. Please collect from shop near Hostel Gate to prevent counter crowding. Thank you!

[ALERT] Token: TK-106 | Customer: Karthik R (H3-105)
  Status: overdue_48h | Due: ₹60 | To: +919988776655
  Message: Namaste Karthik R ji! 🙏 Your 6 clothes (Token: TK-106) at Mahender Press are ready for pickup. Amount Due: ₹60. Please collect from shop near Hostel Gate to prevent counter crowding. Thank you!

[ALERT] Token: TK-107 | Customer: Devendra Pal (H1-412)
  Status: ready_for_pickup | Due: ₹80 | To: +919123456780
  Message: Namaste Devendra Pal ji! 🙏 Your 1 clothes (Token: TK-107) at Mahender Press are ready for pickup. Amount Due: ₹80. Please collect from shop near Hostel Gate to prevent counter crowding. Thank you!

[ALERT] Token: TK-108 | Customer: Rohan Mehta (H2-211)
  Status: ready_for_pickup | Due: ₹160 | To: +919345678901
  Message: Namaste Rohan Mehta ji! 🙏 Your 8 clothes (Token: TK-108) at Mahender Press are ready for pickup. Amount Due: ₹160. Please collect from shop near Hostel Gate to prevent counter crowding. Thank you!

[ALERT] Token: TK-110 | Customer: Abhishek Raj (H3-318)
  Status: overdue_24h | Due: ₹40 | To: +919456789012
  Message: Namaste Abhishek Raj ji! 🙏 Your 4 clothes (Token: TK-110) at Mahender Press are ready for pickup. Amount Due: ₹40. Please collect from shop near Hostel Gate to prevent counter crowding. Thank you!

[ALERT] Token: TK-112 | Customer: Farhan Khan (H1-220)
  Status: overdue_24h | Due: ₹50 | To: +919876501234
  Message: Namaste Farhan Khan ji! 🙏 Your 5 clothes (Token: TK-112) at Mahender Press are ready for pickup. Amount Due: ₹50. Please collect from shop near Hostel Gate to prevent counter crowding. Thank you!

[ALERT] Token: TK-114 | Customer: Manish Seth (H4-205)
  Status: ready_for_pickup | Due: ₹30 | To: +919654321098
  Message: Namaste Manish Seth ji! 🙏 Your 3 clothes (Token: TK-114) at Mahender Press are ready for pickup. Amount Due: ₹30. Please collect from shop near Hostel Gate to prevent counter crowding. Thank you!

=================================================================
SUMMARY METRICS:
  • Total Garments Monitored: 22
  • Overdue Tickets (Taking Counter Space): 4
  • Ready for Immediate Pickup: 3
  • Total Blocked Capital on Counter: ₹470
=================================================================
```

---

## 4. What This Tool Gets Wrong (Honest Limitations)
1. **Third-Party / Roommate Pickups:** If a hostel roommate collects clothes on behalf of a friend without explicitly mentioning the token number to Mahender, the tool keeps flagging the order as uncollected.
2. **Changed or Inactive WhatsApp Numbers:** If a student enters a secondary phone number without an active WhatsApp account, the Meta Cloud API returns a failed status with no SMS fallback.
3. **Meta Cloud API 24-Hour Policy Window:** Meta requires pre-approved utility templates for proactive alerts sent after 24 hours of inactivity from the recipient.
4. **No Digital Ledger Input:** Currently requires transcription from physical diary to `data.csv`.

---

## 5. Submission Artifacts
- **Step 1:** [`research.md`](./research.md) — 5-line problem, 2 failed solutions, 2 read sources.
- **Step 2:** [`fieldwork.md`](./fieldwork.md) — On-site observations, interview quotes, surprise finding.
- **Data:** [`data.csv`](./data.csv) — 22 real transcribed ledger rows.
- **Step 3 Code:** [`dispatch_laundry_reminders.py`](./dispatch_laundry_reminders.py) — Working CLI dispatcher.
- **Step 4:** [`reflection.md`](./reflection.md) — Honest engineering reflection.
- **AI Logs:** [`ai-chats/`](./ai-chats/) — Exported AI prompt transcripts.
