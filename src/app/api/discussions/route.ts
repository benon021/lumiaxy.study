import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");
  const materialId = searchParams.get("materialId");

  const threads = await prisma.discussionThread.findMany({
    where: topicId ? { topicId } : undefined,
    include: {
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (materialId) {
    const comments = await prisma.comment.findMany({
      where: { materialId },
      include: { author: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ comments });
  }

  return NextResponse.json({ threads });
}

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, topicId, threadId, materialId, title } = await req.json();

  // Creating a new thread
  if (topicId && title && !threadId && !materialId) {
    const thread = await prisma.discussionThread.create({ data: { title, topicId } });
    return NextResponse.json(thread, { status: 201 });
  }

  // Adding a comment
  const comment = await prisma.comment.create({
    data: { content, authorId: user.id, threadId, materialId },
    include: { author: { select: { id: true, name: true, avatarUrl: true } } },
  });
  return NextResponse.json(comment, { status: 201 });
}
