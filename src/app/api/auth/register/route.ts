import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for bypass (mock mode)
    const isBypass = email.endsWith("@test.com") || email.endsWith("@lumiaxy.study");

    if (isBypass) {
      const dummyId = "mock_" + Math.random().toString(36).substring(7);
      const role = email.includes("admin") ? "ADMIN" : "STUDENT";
      
      await setSession(dummyId, role);
      
      return NextResponse.json(
        { success: true, user: { id: dummyId, email, name, role } },
        { status: 201 }
      );
    }

    const prisma = (await import("@/lib/db")).default;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // For bypass/mock mode, we can use a dummy password if none provided
    const hashedPassword = await bcrypt.hash(password || "mocked_password", 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: email.includes("admin") ? "ADMIN" : "STUDENT",
      },
    });

    // Automatically log them in by setting the session
    await setSession(user.id, user.role);

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration block error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
