import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where = user.role === "TEACHER" ? { teacherId: user.id } : {};
  const assignments = await prisma.assignment.findMany({
    where,
    include: {
      teacher: { select: { id: true, name: true } },
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(assignments);
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "TEACHER") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { title, description, dueDate, maxScore } = await req.json();
  const assignment = await prisma.assignment.create({
    data: { title, description, dueDate: dueDate ? new Date(dueDate) : null, maxScore: maxScore || 100, teacherId: user.id },
  });

  // Notify followers
  const followers = await prisma.follow.findMany({
    where: { teacherId: user.id },
    select: { followerId: true },
  });
  if (followers.length > 0) {
    await prisma.notification.createMany({
      data: followers.map((f: any) => ({
        userId: f.followerId,
        type: "NEW_ASSIGNMENT",
        message: `${user.name} assigned a new task: ${title}`,
        link: `/dashboard/assignments`
      }))
    });
  }

  return NextResponse.json(assignment, { status: 201 });
}
