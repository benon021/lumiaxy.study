import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const topicId = params.id;

    // Fetch counts for materials (Notes), assignments, and discussions
    const [notesCount, assignmentsCount, discussionsCount] = await Promise.all([
      prisma.material.count({
        where: { 
          topicId,
          type: "NOTES"
        }
      }),
      prisma.assignment.count({
        where: { topicId }
      }),
      prisma.discussionThread.count({
        where: { topicId }
      })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        notes: notesCount,
        assignments: assignmentsCount,
        discussions: discussionsCount
      }
    });
  } catch (error) {
    console.error("Topic stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
