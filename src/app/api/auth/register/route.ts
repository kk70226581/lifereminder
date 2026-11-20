import { NextResponse } from "next/server";
import { RegisterSchema } from "@/lib/validations";
import { hashPassword, signToken, setSessionCookie } from "@/lib/auth";
import { DataService } from "@/services/dataService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, timezone } = validated.data;

    // Check if user already exists
    const existing = await DataService.findUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await DataService.createUser({
      name,
      email,
      passwordHash,
      timezone: timezone || "Asia/Kolkata",
    });

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    await setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          timezone: user.timezone,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
