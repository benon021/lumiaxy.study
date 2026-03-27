import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, subjectId } = await req.json();

    if (!name || !subjectId) {
      return NextResponse.json({ error: "Missing name or subjectId" }, { status: 400 });
    }

    // Verify teacher is enrolled in this subject
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId: user.id },
      include: { subjects: true }
    });

    if (!profile?.subjects.some(s => s.id === subjectId)) {
      return NextResponse.json({ error: "Teacher not assigned to this subject" }, { status: 403 });
    }

    const topic = await prisma.topic.create({
      data: {
        name,
        subjectId,
      }
    });

    return NextResponse.json({ success: true, topic });

  } catch (error) {
    console.error("Topic Create Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
