#!/usr/bin/env python3
"""
Mahender Press Automated WhatsApp Reminder Engine
Reads data.csv, flags overdue clothes holding space, and triggers automated WhatsApp alerts.
"""

import csv
import os
import sys
from datetime import datetime
import urllib.request
import json

META_TOKEN = os.environ.get("META_WHATSAPP_ACCESS_TOKEN", "")
PHONE_NUMBER_ID = os.environ.get("META_WHATSAPP_PHONE_NUMBER_ID", "1530937140092492")

def load_data(filepath="data.csv"):
    if not os.path.exists(filepath):
        print(f"Error: {filepath} not found.")
        sys.exit(1)
    
    records = []
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            records.append(row)
    return records

def analyze_and_dispatch(records):
    print("=" * 65)
    print("MAHENDER DRY CLEANERS & PRESS — WHATSAPP DISPATCH REPORT")
    print(f"Executed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 65)

    overdue_count = 0
    total_blocked_cash = 0
    ready_count = 0

    for r in records:
        status = r["status"]
        amount = int(r["amount_due"])

        if status in ["overdue_48h", "overdue_24h", "ready_for_pickup"]:
            total_blocked_cash += amount
            if "overdue" in status:
                overdue_count += 1
            else:
                ready_count += 1

            message = (
                f"Namaste {r['customer_name']} ji! 🙏\n"
                f"Your {r['cloth_count']} clothes (Token: {r['ticket_id']}) at Mahender Press are ready for pickup.\n"
                f"Amount Due: ₹{r['amount_due']}.\n"
                f"Please collect from shop near Hostel Gate to prevent counter crowding. Thank you!"
            )

            print(f"\n[ALERT] Token: {r['ticket_id']} | Customer: {r['customer_name']} ({r['room_hostel']})")
            print(f"  Status: {status} | Due: ₹{amount} | To: {r['phone_number']}")
            print(f"  Message: {message.replace(chr(10), ' ')}")

            # Send Live Meta WhatsApp alert if credentials exist
            if META_TOKEN and r['phone_number'] == "+917348112368":  # Verified sandbox number
                try:
                    url = f"https://graph.facebook.com/v21.0/{PHONE_NUMBER_ID}/messages"
                    headers = {
                        "Authorization": f"Bearer {META_TOKEN}",
                        "Content-Type": "application/json"
                    }
                    payload = json.dumps({
                        "messaging_product": "whatsapp",
                        "to": r['phone_number'].replace("+", ""),
                        "type": "text",
                        "text": {"preview_url": False, "body": message}
                    }).encode("utf-8")
                    req = urllib.request.Request(url, data=payload, headers=headers)
                    with urllib.request.urlopen(req) as resp:
                        res_data = json.loads(resp.read().decode())
                        msg_id = res_data.get("messages", [{}])[0].get("id", "N/A")
                        print(f"  >>> Meta WhatsApp Dispatched! ID: {msg_id}")
                except Exception as e:
                    print(f"  >>> Meta Dispatch Error: {e}")

    print("\n" + "=" * 65)
    print("SUMMARY METRICS:")
    print(f"  • Total Garments Monitored: {len(records)}")
    print(f"  • Overdue Tickets (Taking Counter Space): {overdue_count}")
    print(f"  • Ready for Immediate Pickup: {ready_count}")
    print(f"  • Total Blocked Capital on Counter: ₹{total_blocked_cash}")
    print("=" * 65)

if __name__ == "__main__":
    records = load_data("data.csv")
    analyze_and_dispatch(records)
