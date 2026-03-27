import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get subjects the student is enrolled in
    const enrollments = await prisma.subjectEnrollment.findMany({
      where: { userId: user.id },
      include: {
        subject: {
          include: {
            topics: {
              include: {
                _count: {
                  select: {
                    materials: true,
                    assignments: true,
                    discussionThreads: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const subjects = enrollments.map(e => e.subject).filter(Boolean);

    return NextResponse.json({
      success: true,
      subjects
    });
  } catch (error) {
    console.error("Student subjects error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
