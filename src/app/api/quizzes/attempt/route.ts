import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "STUDENT") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { quizId, answers } = await req.json();
  if (!quizId || !Array.isArray(answers)) {
    return NextResponse.json({ error: "Missing quizId or answers" }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true },
  });

  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  const questions = quiz.questions.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const total = questions.length;
  const normalizedAnswers: number[] = answers.map((x: any) => Number(x)).filter((n: number) => Number.isFinite(n));

  let correct = 0;
  for (let i = 0; i < Math.min(total, normalizedAnswers.length); i++) {
    if (normalizedAnswers[i] === questions[i].correctOption) correct++;
  }

  const score = total > 0 ? (correct / total) * 100 : 0;

  const attempt = await prisma.quizAttempt.upsert({
    where: { quizId_studentId: { quizId, studentId: user.id } },
    update: {
      score,
      attemptedAt: new Date(),
    },
    create: {
      quizId,
      studentId: user.id,
      score,
      attemptedAt: new Date(),
    },
  });

  return NextResponse.json({
    attemptId: attempt.id,
    score,
    attemptedAt: attempt.attemptedAt,
  });
}

