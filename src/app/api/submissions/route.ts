import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const assignmentId = searchParams.get("assignmentId");

  const submissions = await prisma.submission.findMany({
    where: {
      ...(assignmentId ? { assignmentId } : {}),
      ...(user.role === "STUDENT" ? { studentId: user.id } : {}),
    },
    include: {
      student: { select: { id: true, name: true, email: true } },
      assignment: { select: { id: true, title: true, maxScore: true } },
    },
    orderBy: { submittedAt: "desc" },
  });
  return NextResponse.json(submissions);
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { assignmentId, content, fileUrl } = await req.json();
  const submission = await prisma.submission.upsert({
    where: { assignmentId_studentId: { assignmentId, studentId: user.id } },
    update: { content, fileUrl, submittedAt: new Date() },
    create: { assignmentId, studentId: user.id, content, fileUrl },
  });
  return NextResponse.json(submission, { status: 201 });
}

export async function PATCH(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "TEACHER") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { submissionId, score, feedback } = await req.json();
  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: { score, feedback, gradedAt: new Date() },
  });

  // Notify student when graded
  await prisma.notification.create({
    data: {
      userId: updated.studentId,
      type: "GRADE_RELEASED",
      message: `Your submission has been graded! Score: ${score}`,
      link: `/dashboard/assignments`,
    },
  });

  return NextResponse.json(updated);
}
