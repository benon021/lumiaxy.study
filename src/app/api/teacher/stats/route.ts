import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parallel fetch for performance
    const [followers, materials, assignments, profile, ratings] = await Promise.all([
      prisma.follow.count({ where: { teacherId: user.id } }),
      prisma.material.count({ where: { authorId: user.id } }),
      prisma.assignment.findMany({
        where: { teacherId: user.id },
        include: { _count: { select: { submissions: true } } }
      }),
      prisma.teacherProfile.findUnique({ where: { userId: user.id } }),
      prisma.rating.findMany({ where: { teacherId: user.id }, select: { score: true } })
    ]);

    const totalSubmissions = assignments.reduce((sum, a) => sum + a._count.submissions, 0);
    const avgRating = ratings.length > 0 
      ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length).toFixed(1)
      : "0.0";

    return NextResponse.json({
      followers,
      materials,
      totalSubmissions,
      assignmentsCount: assignments.length,
      avgRating,
      totalRatings: ratings.length,
      status: (profile as any)?.status || "ONLINE"
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { status } = await req.json();
    
    // @ts-ignore - status exists in schema but Prisma might be locked
    const profile = await prisma.teacherProfile.update({
      where: { userId: user.id },
      data: { status }
    });

    return NextResponse.json({ status: profile.status });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
