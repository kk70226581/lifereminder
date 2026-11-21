# Project Reflection: Mahender Press Automation

### What I Got Wrong at the Start
When I first picked this problem, I thought it was a classic customer reminder issue. I assumed students just had poor memories and that sending a notification 1 hour before their placement interview would solve everything. But when I actually went to Mahender Bhaiya's stall at 8:15 AM on Saturday and sat on the blue plastic stool next to his pressing table, the real problem looked completely different. 

Students weren't just forgetting their clothes; they were deliberately using Mahender's overhead wire lines as an extended wardrobe because hostel almirahs are cramped and clothes get wrinkled inside trunks. Mahender was essentially operating an unpaid warehouse in an 8x10 ft stall. The actual bottleneck was counter space and unrecovered daily revenue (nearly ₹470 stuck in just 7 uncollected tickets), not just student calendar alerts. Shifting the focus from "student reminder" to "shopkeeper space & revenue recovery" completely changed what the tool needed to output.

### What I Would Cut
If I had to redo this in 4 hours, I would aggressively cut the multi-category dropdowns (Career, Education, Personal, Travel) and complex recurrence rules. A micro-vendor working with a hot iron does not care about category taxonomies. He only cares about: Ticket ID, Customer Name, Mobile Number, and whether an order is 24 hours or 48 hours overdue. I spent unnecessary time styling calendar grids and filter chips that Mahender will never look at while pressing shirts.

### Where AI Helped
AI was very effective at scaffolded tasks that usually take hours of tedious documentation reading:
1. Setting up the Next.js App Router API route handlers and Mongoose connection caching.
2. Generating the boilerplate for Meta WhatsApp Cloud API (Graph API v21.0) payloads and error code handlers.
3. Rapidly writing the Python CSV parsing script to compute overdue hours and format polite, contextual Hindi-English reminder messages.

### Where AI Wasted Time
AI wasted almost 45 minutes trying to over-engineer solutions that made no sense for a street-side shopkeeper:
1. It kept hallucinating complex enterprise authentication systems, role-based access control, and customer-facing mobile apps with QR code check-ins.
2. When asked for sample data, it consistently generated clean, round numbers (e.g., 5 shirts, ₹50, 10:00 AM sharp) with zero missing entries or irregularities. I had to scrap all of it and manually record the real, messy entries from Mahender’s actual paper diary.
3. It initially generated rigid Mongoose schemas that crashed with `ObjectId hex string` errors whenever direct test dispatches were run outside pre-seeded database entities.

---

### Screen Recording Demo (3 Mins)
The 3-minute video recording of the working tool and automated dispatch is available here:  
👉 **[Google Drive Video Demo](https://drive.google.com/file/d/1QzgmrEkB1mdwkri5r50Rge-Js5WfQhKw/view?usp=drive_link)**
