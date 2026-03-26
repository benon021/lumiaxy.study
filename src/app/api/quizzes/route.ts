import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const quizzes = await prisma.quiz.findMany({
    include: {
      teacher: { select: { id: true, name: true, teacherProfile: true } },
      _count: { select: { questions: true, attempts: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json(
    quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      teacherName: q.teacher.name,
      teacherCredentials: q.teacher.teacherProfile?.credentials ?? null,
      questionCount: q._count.questions,
      attemptCount: q._count.attempts,
    }))
  );
}

