import { NextResponse } from "next/server";
import { DataService } from "@/services/dataService";

/**
 * Internal Scheduled Reminder Processing Endpoint.
 * Can be called by:
 * 1. External Cron Services (e.g. cron-job.org, Vercel Cron, GitHub Actions) with Bearer token.
 * 2. Manual dashboard trigger by authenticated users for testing.
 */
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Verify authorization if CRON_SECRET is configured
  if (cronSecret && cronSecret !== "generate-a-strong-secret-token-for-cron-scheduler") {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ success: false, error: "Unauthorized cron caller." }, { status: 401 });
    }
  }

  try {
    const results = await DataService.claimAndProcessDueReminders();
    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} due reminders.`,
      count: results.length,
      processed: results,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error processing scheduled reminders.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
