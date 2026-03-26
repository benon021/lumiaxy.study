import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");
  const topics = await prisma.topic.findMany({
    where: subjectId ? { subjectId } : undefined,
    include: { subject: true, _count: { select: { materials: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(topics);
}

export async function POST(req: Request) {
  const { name, description, subjectId } = await req.json();
  const topic = await prisma.topic.create({ data: { name, description, subjectId } });
  return NextResponse.json(topic, { status: 201 });
}
