import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subjectIds, bio } = await req.json();

    // Update bio in User model
    if (bio !== undefined) {
      await prisma.user.update({
        where: { id: user.id },
        data: { bio }
      });
    }

    // Update subjects in TeacherProfile
    if (subjectIds !== undefined) {
      await prisma.teacherProfile.update({
        where: { userId: user.id },
        data: {
          subjects: {
            set: subjectIds.map((id: string) => ({ id }))
          }
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Teacher profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: user.id },
      include: { subjects: true }
    });

    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
