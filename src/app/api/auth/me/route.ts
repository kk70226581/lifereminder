import { NextResponse } from "next/server";
import { clearSessionCookie, getCurrentUser } from "@/lib/auth";
import { DataService } from "@/services/dataService";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ success: true, message: "Logged out successfully." });
}

export async function GET() {
  const session = await getCurrentUser();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const user = await DataService.findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      timezone: user.timezone,
      whatsappNumber: user.whatsappNumber,
      whatsappConsent: user.whatsappConsent,
    },
  });
}
