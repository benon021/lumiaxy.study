import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized. Must be a Teacher." }, { status: 403 });
    }

    const { title, description, type, fileUrl, topicId } = await req.json();

    if (!title || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Since topics might be empty, if topicId isn't provided or doesn't exist, we will create a default 'General' topic.
    let targetTopicId = topicId;
    if (!targetTopicId) {
      // Find or create a default Subject and Topic
      let defaultSubject = await prisma.subject.findFirst();
      if (!defaultSubject) {
         defaultSubject = await prisma.subject.create({
           data: { name: "General Studies", description: "Default subject" }
         });
      }
      
      let defaultTopic = await prisma.topic.findFirst({ where: { subjectId: defaultSubject.id }});
      if (!defaultTopic) {
         defaultTopic = await prisma.topic.create({
           data: { name: "General Concepts", subjectId: defaultSubject.id }
         });
      }
      targetTopicId = defaultTopic.id;
    }

    const material = await prisma.material.create({
      data: {
        title,
        description,
        type, 
        fileUrl, // Will hold Base64 for the mockup, or a strict URL.
        topicId: targetTopicId,
        authorId: user.id
      }
    });

    return NextResponse.json({ success: true, material }, { status: 201 });
  } catch (error) {
    console.error("Material Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload material" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const materials = await prisma.material.findMany({
      include: { author: { select: { name: true, avatarUrl: true }} },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, materials });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}
