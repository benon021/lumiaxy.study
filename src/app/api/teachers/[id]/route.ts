import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const currentUser = await getUserFromRequest(req);

  const teacherId = params.id;
  const teacher = await prisma.user.findUnique({
    where: { id: teacherId },
    include: {
      teacherProfile: true,
      ratingsReceived: { select: { score: true } },
      _count: { select: { followedBy: true, materials: true } },
      materials: {
        take: 10,
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        include: { topic: { select: { subject: { select: { name: true } }, name: true } } },
      },
    },
  });

  if (!teacher || teacher.role !== "TEACHER") {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }

  const avgRating =
    teacher.ratingsReceived.length > 0
      ? parseFloat((teacher.ratingsReceived.reduce((s, r) => s + r.score, 0) / teacher.ratingsReceived.length).toFixed(1))
      : 0;

  const isFollowing =
    currentUser && currentUser.role === "STUDENT"
      ? !!(await prisma.follow.findUnique({
          where: { followerId_teacherId: { followerId: currentUser.id, teacherId } },
        }))
      : false;

  return NextResponse.json({
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
    avatarUrl: teacher.avatarUrl,
    bio: teacher.bio,
    teacherProfile: teacher.teacherProfile,
    followerCount: teacher._count.followedBy,
    materialsCount: teacher._count.materials,
    avgRating,
    totalRatings: teacher.ratingsReceived.length,
    isFollowing,
    recentMaterials: teacher.materials.map((m) => ({
      id: m.id,
      title: m.title,
      type: m.type,
      isPinned: m.isPinned,
      createdAt: m.createdAt,
      topicName: m.topic.name,
      subjectName: m.topic.subject.name,
    })),
  });
}

