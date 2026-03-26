import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");

  const materials = await prisma.material.findMany({
    where: topicId ? { topicId } : undefined,
    include: { author: { select: { id: true, name: true } } },
    orderBy: [ { isPinned: "desc" }, { createdAt: "desc" } ],
  });
  return NextResponse.json(materials);
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "TEACHER") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { title, description, topicId, type, fileUrl, videoUrl } = await req.json();

    const material = await prisma.material.create({
      data: { title, description, topicId, type, fileUrl, videoUrl, authorId: user.id },
      include: { topic: { select: { subject: { select: { name: true } } } } }
    });

    // Notify all students following this teacher
    const followers = await prisma.follow.findMany({
      where: { teacherId: user.id },
      select: { followerId: true },
    });
    if (followers.length > 0) {
      await prisma.notification.createMany({
        data: followers.map((f) => ({
          userId: f.followerId,
          type: "NEW_MATERIAL",
          message: `${user.name} uploaded a new ${type.toLowerCase()} in ${material.topic.subject.name}: ${title}`,
          link: `/dashboard/materials?topic=${topicId}`
        }))
      });
    }

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "TEACHER") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const material = await prisma.material.findUnique({ where: { id } });
    if (!material || material.authorId !== user.id) return NextResponse.json({ error: "Not found or unauthorized" }, { status: 403 });

    await prisma.material.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
