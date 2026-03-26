import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { assignmentId, content, fileUrl } = await req.json();
    if (!assignmentId || (!content && !fileUrl)) {
      return NextResponse.json({ error: "Missing submission data." }, { status: 400 });
    }

    // Upsert Submission
    const submission = await prisma.submission.upsert({
      where: { assignmentId_studentId: { assignmentId, studentId: user.id } },
      update: { content, fileUrl, submittedAt: new Date() },
      create: { assignmentId, studentId: user.id, content, fileUrl }
    });

    // Notify Teacher
    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId }});
    if (assignment) {
      await prisma.notification.create({
        data: {
          userId: assignment.teacherId,
          type: "NEW_SUBMISSION",
          message: `${user.name} submitted an answer for "${assignment.title}".`,
          link: `/dashboard/teacher/grading`
        }
      });
    }

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized. Must be Teacher." }, { status: 403 });
    }

    const { submissionId, score, feedback } = await req.json();

    const submission = await prisma.submission.update({
      where: { id: submissionId },
      data: { score, feedback, gradedAt: new Date() },
      include: { assignment: true }
    });

    // Notify Student
    await prisma.notification.create({
      data: {
        userId: submission.studentId,
        type: "GRADE_RELEASED",
        message: `Your assignemnt "${submission.assignment.title}" was graded. Score: ${score}/${submission.assignment.maxScore}`,
        link: `/dashboard/student/assignments`
      }
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    return NextResponse.json({ error: "Failed to grade" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    if (user.role === "STUDENT") {
      // Return student's submissions and assignments
      const assignments = await prisma.assignment.findMany({
        include: { submissions: { where: { studentId: user.id } }, teacher: { select: { name: true }} },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ success: true, assignments });
    } 

    if (user.role === "TEACHER") {
      // Return ungraded submissions for this teacher
      const submissions = await prisma.submission.findMany({
        where: { assignment: { teacherId: user.id }, score: null },
        include: { assignment: true, student: { select: { name: true, avatarUrl: true }} },
        orderBy: { submittedAt: "asc" }
      });
      return NextResponse.json({ success: true, submissions });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}
