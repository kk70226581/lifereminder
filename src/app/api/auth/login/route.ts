import { NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations";
import { comparePassword, signToken, setSessionCookie } from "@/lib/auth";
import { DataService } from "@/services/dataService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = LoginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;
    const user = await DataService.findUserByEmail(email);

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        timezone: user.timezone,
        whatsappNumber: user.whatsappNumber,
        whatsappConsent: user.whatsappConsent,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
