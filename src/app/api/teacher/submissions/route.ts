import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized. Teacher access required." }, { status: 403 });
    }

    // Since assignments might not exist, fetch assignments where teacherId = user.id
    const assignments = await prisma.assignment.findMany({
      where: { teacherId: user.id },
      include: {
        submissions: {
          include: { student: { select: { name: true, email: true } } }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, assignments });
  } catch (error) {
    console.error("Teacher Submissions GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}
