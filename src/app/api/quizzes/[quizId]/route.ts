import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

function safeParseOptions(options: string) {
  try {
    const parsed = JSON.parse(options);
    if (Array.isArray(parsed)) return parsed.map((x) => String(x));
    return [];
  } catch {
    return [];
  }
}

export async function GET(req: Request, { params }: { params: { quizId: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const quiz = await prisma.quiz.findUnique({
    where: { id: params.quizId },
    include: {
      teacher: { select: { id: true, name: true, teacherProfile: true } },
      questions: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  return NextResponse.json({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    teacherName: quiz.teacher.name,
    teacherCredentials: quiz.teacher.teacherProfile?.credentials ?? null,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      text: q.text,
      options: safeParseOptions(q.options),
      correctOption: q.correctOption,
    })),
  });
}

