import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

type TeacherActivityType = "new_follower" | "new_submission" | "new_rating" | "notification";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [followers, submissions, ratings, notifications] = await Promise.all([
    prisma.follow.findMany({
      where: { teacherId: user.id },
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { follower: { select: { id: true, name: true, email: true } } },
    }),
    prisma.submission.findMany({
      where: { assignment: { teacherId: user.id } },
      take: 20,
      orderBy: { submittedAt: "desc" },
      include: {
        student: { select: { id: true, name: true, email: true } },
        assignment: { select: { id: true, title: true, maxScore: true } },
      },
    }),
    prisma.rating.findMany({
      where: { teacherId: user.id },
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { rater: { select: { id: true, name: true, email: true } } },
    }),
    prisma.notification.findMany({
      where: { userId: user.id },
      take: 20,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const events: Array<{
    id: string;
    type: TeacherActivityType;
    occurredAt: string;
    label: string;
    detail: string;
  }> = [
    ...followers.map((f) => ({
      id: f.id,
      type: "new_follower" as const,
      occurredAt: f.createdAt.toISOString(),
      label: "New Follower",
      detail: `${f.follower.name || f.follower.email} started following you`,
    })),
    ...submissions.map((s) => ({
      id: s.id,
      type: "new_submission" as const,
      occurredAt: s.submittedAt.toISOString(),
      label: "New Submission",
      detail: `${s.student.name || s.student.email} • ${s.assignment.title}`,
    })),
    ...ratings.map((r) => ({
      id: r.id,
      type: "new_rating" as const,
      occurredAt: r.createdAt.toISOString(),
      label: "New Rating",
      detail: `${r.rater.name || r.rater.email} rated you ${r.score}/5${r.review ? ` • ${r.review}` : ""}`,
    })),
    ...notifications.map((n) => ({
      id: n.id,
      type: "notification" as const,
      occurredAt: n.createdAt.toISOString(),
      label: "Notification",
      detail: n.message,
    })),
  ];

  events.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  return NextResponse.json({ events: events.slice(0, 40) });
}

