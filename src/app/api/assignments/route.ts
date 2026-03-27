import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "TEACHER") {
       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, maxScore, dueDate, type, topicId, attachments } = body;

    if (!topicId) {
      return NextResponse.json({ error: "Topic ID required" }, { status: 400 });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        type: type || "TEXT",
        maxScore: parseFloat(maxScore) || 100,
        dueDate: dueDate ? new Date(dueDate) : null,
        topicId,
        teacherId: user.id,
        attachments: attachments ? JSON.stringify(attachments) : null
      }
    });

    return NextResponse.json({ success: true, assignment }, { status: 201 });
  } catch (err) {
    console.error("Assignment Create Error:", err);
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user) {
       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let whereClause: any = {};

    if (user.role === "STUDENT") {
      const enrollments = await prisma.subjectEnrollment.findMany({
        where: { userId: user.id },
        select: { subjectId: true }
      });
      const enrolledSubjectIds = enrollments.map(e => e.subjectId);

      const follows = await prisma.follow.findMany({
        where: { followerId: user.id },
        select: { teacherId: true }
      });
      const followedTeacherIds = follows.map(f => f.teacherId);

      whereClause = {
        teacherId: { in: followedTeacherIds },
        topic: {
          subjectId: { in: enrolledSubjectIds }
        }
      };
    } else if (user.role === "TEACHER") {
      whereClause = { teacherId: user.id };
    }

    const assignments = await prisma.assignment.findMany({
      where: whereClause,
      include: { 
        teacher: { select: { name: true, avatarUrl: true } },
        topic: { include: { subject: true } },
        _count: { select: { submissions: true } } 
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, assignments });
  } catch (err) {
    console.error("Fetch Assignments Error:", err);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}
