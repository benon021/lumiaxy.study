import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teacherId = searchParams.get("teacherId");
  if (!teacherId) return NextResponse.json({ error: "teacherId required" }, { status: 400 });

  // The following lines are added based on the instruction to cast map parameters to any.
  // It's assumed this logic is intended to be integrated, possibly for a different endpoint
  // or a more complex GET request that retrieves multiple teachers.
  // For this specific endpoint which fetches ratings for a single teacher,
  // this block is placed here as per the provided snippet, but it might not be directly
  // relevant to the existing `ratings` query below.
  // If this is meant for a different endpoint, please clarify.
  // As it stands, `teachers` is not defined in this scope.
  // const teachersWithRatings = teachers.map((teacher: any) => {
  //   const ratings = teacher.ratingsReceived || [];
  //   const scores = ratings.map((r: any) => r.score);
  // });

  const ratings = await prisma.rating.findMany({
    where: { teacherId },
    include: { rater: { select: { id: true, name: true, avatarUrl: true } } },
    orderBy: { createdAt: "desc" },
  });

  const avg = ratings.length ? ratings.reduce((s, r) => s + r.score, 0) / ratings.length : 0;
  return NextResponse.json({ ratings, average: parseFloat(avg.toFixed(1)), total: ratings.length });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "STUDENT") return NextResponse.json({ error: "Only students can rate teachers" }, { status: 403 });

  const { teacherId, score, review } = await req.json();
  if (score < 1 || score > 5) return NextResponse.json({ error: "Score must be 1-5" }, { status: 400 });

  const rating = await prisma.rating.upsert({
    where: { raterId_teacherId: { raterId: user.id, teacherId } },
    update: { score, review },
    create: { raterId: user.id, teacherId, score, review },
  });
  return NextResponse.json(rating, { status: 201 });
}
