import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "stats") {
      const [totalUsers, teachers, students, admins] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "TEACHER" } }),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.user.count({ where: { role: "ADMIN" } })
      ]);

      return NextResponse.json({
        success: true,
        stats: {
          totalUsers,
          teachers,
          students,
          admins,
          activeNow: Math.floor(totalUsers * 0.4) // Simulated online metric
        }
      });
    }

    // Default: fetch users list
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        avatarUrl: true
      },
      orderBy: { createdAt: "desc" },
      take: 50
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Admin Users GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = await getUserFromRequest(req as any);
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const { userId, newRole } = await req.json();
    if (!userId || !newRole) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Admin Users PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
