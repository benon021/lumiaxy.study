import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Missing email" },
        { status: 400 }
      );
    }

    // Check for bypass (mock mode)
    const isBypass = email.endsWith("@test.com") || email.endsWith("@lumiaxy.study") || password === "bypass";

    if (isBypass) {
      // COMPLETE BYPASS: No Database required for mock accounts
      const dummyId = "mock_" + Math.random().toString(36).substring(7);
      const role = email.includes("admin") ? "ADMIN" : "STUDENT";
      const name = email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1);
      
      await setSession(dummyId, role);
      
      return NextResponse.json(
        { 
          success: true, 
          user: { id: dummyId, email, name, role } 
        },
        { status: 200 }
      );
    }

    // Normal logic for non-bypass accounts
    const prisma = (await import("@/lib/db")).default;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Skip password comparison if bypass
    if (!isBypass) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
    }

    // Set JWT session
    await setSession(user.id, user.role);

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login block error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
