import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/teachers - list all teachers with profile, follower count, avg rating
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const teachers = await prisma.user.findMany({
    where: {
      role: "TEACHER",
      OR: q
        ? [
            { name: { contains: q } },
            { email: { contains: q } },
            { teacherProfile: { credentials: { contains: q } } },
          ]
        : undefined,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      teacherProfile: true,
      _count: { select: { followedBy: true, materials: true } },
      ratingsReceived: { select: { score: true } },
    },
  });

  const result = teachers.map((t) => ({
    ...t,
    avgRating:
      t.ratingsReceived.length > 0
        ? parseFloat(
            (t.ratingsReceived.reduce((s, r) => s + r.score, 0) / t.ratingsReceived.length).toFixed(1)
          )
        : 0,
    totalRatings: t.ratingsReceived.length,
    ratingsReceived: undefined,
  }));

  return NextResponse.json(result);
}
