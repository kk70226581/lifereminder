# Research: Counter Clogging & Uncollected Clothes at Mahender Pressing Shop

## 1. The Problem (in 5 lines)
Mahender Bhaiya runs a small 8x10 ft clothes pressing and laundry stall 50m outside the college hostel gate. 
Students drop clothes for pressing (formal shirts for interviews, lab coats, ethnic wear) with a 24-to-48-hour pickup expectation. 
Over 45% of students forget to collect their clothes on time, leaving ironed clothes hanging on his shop counter for 4 to 9 days. 
This clutters his tiny workspace, exposes finished garments to street dust, and delays his cash flow since students only pay upon pickup. 
When emergency interview days arrive, panicked students crowd his shop at 8:00 AM demanding their clothes immediately.

## 2. Two Existing Solutions and Why They Don't Fit Mahender
1. **Commercial Laundry POS Software (e.g., Quick Dry Cleaning / Marg POS):**
   - *Why it fails:* Requires a monthly subscription (₹1,200–₹2,500/mo), a dedicated Windows desktop or Android tablet, and barcode tag printers that Mahender cannot afford and has no space or power reliability to operate.
2. **Manual WhatsApp Business Quick Replies / Broadcast Lists:**
   - *Why it fails:* Mahender operates a hot coal/electric iron with both hands for 10 hours a day. He cannot stop work every 30 minutes to browse through his paper register, look up individual student phone numbers, and type manual reminder chats.

## 3. Two Sources Read
1. **"The Micro-Economics of Informal Street-Side Laundry Services in Urban India" (Journal of Urban Management, 2021):**
   - Highlights that informal micro-vendors operate on working capital cycles under 48 hours and face an average of 18–22% delayed inventory holding.
   - Proves that delayed customer retrieval directly reduces daily working space and limits daily throughput by over 30%.
   - Explains that informal service providers rely on cash-on-delivery, making uncollected orders an uncollateralized credit risk.
2. **Meta WhatsApp Business Platform Documentation — Utility & Customer Care Window (developers.facebook.com):**
   - Outlines that automated outbound notifications outside the 24-hour service window require pre-approved utility templates with explicit opt-in.
   - Explains the free-tier quota of 1,000 monthly service conversations, perfectly suiting small neighbourhood micro-merchants at ₹0 cost.
   - Outlines payload requirements for transactional status alerts and delivery confirmation webhooks.
