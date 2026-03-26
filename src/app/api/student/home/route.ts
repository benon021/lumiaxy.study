import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

type ActivityEventType = "submission" | "grade" | "quiz" | "comment" | "notification";

export type ActivityEvent = {
  id: string;
  type: ActivityEventType;
  occurredAt: string; // ISO string
  label: string;
  detail: string;
};

function toISO(d: Date) {
  return new Date(d).toISOString();
}

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [submissions, quizAttempts, comments, notifications] = await Promise.all([
    prisma.submission.findMany({
      where: { studentId: user.id },
      orderBy: { submittedAt: "desc" },
      take: 25,
      include: {
        assignment: { select: { title: true, maxScore: true } },
      },
    }),
    prisma.quizAttempt.findMany({
      where: { studentId: user.id },
      orderBy: { attemptedAt: "desc" },
      take: 25,
      include: {
        quiz: { select: { title: true } },
      },
    }),
    prisma.comment.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      take: 25,
      include: {
        thread: {
          select: {
            title: true,
            topic: {
              select: {
                name: true,
                subject: { select: { name: true } },
              },
            },
          },
        },
      },
    }),
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  const events: ActivityEvent[] = [
    ...submissions.map((s) => {
      const isGraded = !!s.gradedAt;
      return {
        id: s.id,
        type: (isGraded ? "grade" : "submission") as ActivityEventType,
        occurredAt: toISO(s.submittedAt),
        label: isGraded ? "Graded Submission" : "Submitted Work",
        detail: isGraded
          ? `${s.assignment.title} • Score: ${s.score ?? 0}/${s.assignment.maxScore}`
          : `${s.assignment.title} • Awaiting grade`,
      };
    }),
    ...quizAttempts.map((a) => ({
      id: a.id,
      type: "quiz" as ActivityEventType,
      occurredAt: toISO(a.attemptedAt),
      label: "Quiz Attempt",
      detail: `${a.quiz.title} • Score: ${Math.round(a.score)}%`,
    })),
    ...comments.map((c) => ({
      id: c.id,
      type: "comment" as ActivityEventType,
      occurredAt: toISO(c.createdAt),
      label: "Discussion Comment",
      detail: c.thread
        ? `${c.thread.topic?.subject?.name ?? "Topic"} / ${c.thread.topic?.name ?? "Thread"} • ${c.content}`
        : c.content,
    })),
    ...notifications.map((n) => ({
      id: n.id,
      type: "notification" as ActivityEventType,
      occurredAt: toISO(n.createdAt),
      label: "Notification",
      detail: n.message,
    })),
  ];

  events.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  return NextResponse.json({
    events: events.slice(0, 60),
  });
}

