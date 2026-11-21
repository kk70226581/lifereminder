# AI Development & Debugging Chat Transcripts

*Export of prompts and AI assistance interactions used during the 24-hour project cycle.*

---

## Session 1: Problem Ideation & Fieldwork Grounding
**User:**
> "I need to solve a real problem for someone I can name within walking distance of my college hostel for a 1-day B.Tech assignment. It cannot be a generic to-do app, chatbot, or weather app. I spoke to Mahender Bhaiya who runs the pressing and laundry stall near Hostel Gate 2. What is the real bottleneck?"

**AI Assistant:**
> "If you look at informal laundry services in Indian college towns, the problem isn't that customers don't know laundry exists; it's inventory holding time and counter space. An 8x10 shop has limited hanging space. Students treat his shop as free closet storage because hostel wardrobes are crowded. When clothes sit there for 4–5 days, three things break:
> 1. He runs out of hanging space and clean clothes catch street dust.
> 2. His daily working capital is locked up because students pay upon pickup.
> 3. Morning placement rush hours cause chaos when students demand formal clothes they forgot to collect days ago.
>
> A tool that parses his paper ledger drop-offs, calculates overdue counter hours, and dispatches automated WhatsApp pickup alerts directly solves this."

---

## Session 2: Schema & WhatsApp Cloud API Integration
**User:**
> "How do we connect this to the official Meta WhatsApp Cloud API without incurring costs, and what data schema should we use?"

**AI Assistant:**
> "Meta offers a free tier of 1,000 service conversations per month on WhatsApp Cloud API Graph API v21.0. For the data schema in `data.csv`, avoid round numbers and record:
> - `ticket_id`: e.g. TK-101, TK-104
> - `customer_name`: Student name
> - `room_hostel`: e.g. H3-214, H1-108
> - `cloth_count`: Irregular numbers (4, 7, 2, 5, 8)
> - `drop_datetime` and `promised_datetime`
> - `amount_due`: Based on unit pricing (ironing ₹10, wash+iron ₹20, dry clean ₹80–90)
> - `status`: `collected`, `ready_for_pickup`, `overdue_24h`, `overdue_48h`
>
> In Python and Node.js, we construct the HTTPS POST payload to `https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages` with Authorization Bearer token."

---

## Session 3: Debugging Live Meta Token & MongoDB ObjectId Errors
**User:**
> "When triggering direct WhatsApp dispatches, Mongoose threw: `input must be a 24 character hex string, 12 byte Uint8Array, or an integer`. Also Meta gave `code: 190 Session has expired`. How do we fix both?"

**AI Assistant:**
> "Two distinct issues:
> 1. **MongoDB ObjectId Casting:** In `NotificationLog.ts`, `eventId` and `reminderId` were marked as required `Schema.Types.ObjectId`. When test alerts or direct ledger dispatches were triggered without being tied to a pre-existing 24-character MongoDB hex ID, Mongoose crashed. Fix: make `eventId` and `reminderId` optional in `NotificationLog`, and validate `mongoose.Types.ObjectId.isValid()` in `dataService.ts` before casting.
> 2. **Meta Token Expiration (Code 190):** Meta Sandbox provides a 24-hour temporary token. In `metaClient.ts`, add explicit error interception for error code 190 explaining that the token expired and guide the user to refresh it via `developers.facebook.com` or toggle Simulation Mode."
