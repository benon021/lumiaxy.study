import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subjectId } = await req.json();

    if (!subjectId) {
      return NextResponse.json({ error: "Subject ID required" }, { status: 400 });
    }

    const enrollment = await prisma.subjectEnrollment.upsert({
      where: {
        userId_subjectId: {
          userId: user.id,
          subjectId: subjectId,
        },
      },
      update: {},
      create: {
        userId: user.id,
        subjectId: subjectId,
      },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subjectId } = await req.json();

    await prisma.subjectEnrollment.delete({
      where: {
        userId_subjectId: {
          userId: user.id,
          subjectId: subjectId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unenrollment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
