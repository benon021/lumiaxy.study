import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

// GET /api/follow?teacherId=xxx - check if current user follows a teacher
// GET /api/follow?userId=xxx - list all teachers a user follows
export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get("teacherId");

  if (teacherId) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_teacherId: { followerId: user.id, teacherId } },
    });
    return NextResponse.json({ isFollowing: !!follow });
  }

  const following = await prisma.follow.findMany({
    where: { followerId: user.id },
    include: { teacher: { select: { id: true, name: true, avatarUrl: true, teacherProfile: true } } },
  });

  const mapped = Array.isArray(following) ? following.map((f: any) => ({
    id: f.id,
    teacherId: f.teacher.id,
    name: f.teacher.name,
    avatarUrl: f.teacher.avatarUrl,
    subjects: f.teacher.teacherProfile?.subjectIds || ""
  })) : [];
  return NextResponse.json(mapped);
}

// POST /api/follow - toggle follow
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { teacherId } = await req.json();
  const existing = await prisma.follow.findUnique({
    where: { followerId_teacherId: { followerId: user.id, teacherId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return NextResponse.json({ followed: false });
  }

  await prisma.follow.create({ data: { followerId: user.id, teacherId } });

  // Notify teacher of new follower
  await prisma.notification.create({
    data: {
      userId: teacherId,
      type: "NEW_FOLLOWER",
      message: `${user.name} started following you!`,
    },
  });

  return NextResponse.json({ followed: true });
}
