import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const subjects = await prisma.subject.findMany({
    include: { topics: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(subjects);
}

export async function POST(req: Request) {
  const { name, description } = await req.json();
  const subject = await prisma.subject.create({ data: { name, description } });
  return NextResponse.json(subject, { status: 201 });
}
