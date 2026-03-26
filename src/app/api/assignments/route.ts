import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "TEACHER") {
       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { title, description, maxScore, dueDate } = await req.json();

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        maxScore: parseFloat(maxScore) || 100,
        dueDate: dueDate ? new Date(dueDate) : null,
        teacherId: user.id
      }
    });

    return NextResponse.json({ success: true, assignment }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "TEACHER") {
       return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const assignments = await prisma.assignment.findMany({
      where: { teacherId: user.id },
      include: { _count: { select: { submissions: true } } },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, assignments });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}
