import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, credentials, officeHours, contactInfo } = await req.json();

    if (!email || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Strictly enforce stagnant admin. No admin can be created via signup.
    const userRole = role === "TEACHER" ? "TEACHER" : "STUDENT";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        ...(userRole === "TEACHER" && {
          teacherProfile: {
            create: {
              credentials: credentials || "",
              officeHours: officeHours || "",
              contactInfo: contactInfo || email,
            },
          },
        }),
      },
    });

    await setSession(user.id, user.role);

    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
