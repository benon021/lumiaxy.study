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
    const user = await getUserFromRequest(req as any);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let whereClause: any = {};

    if (user.role === "STUDENT") {
      // 1. Get enrolled subject IDs
      const enrollments = await prisma.subjectEnrollment.findMany({
        where: { userId: user.id },
        select: { subjectId: true }
      });
      const enrolledSubjectIds = enrollments.map(e => e.subjectId);

      // 2. Get followed teacher IDs
      const follows = await prisma.follow.findMany({
        where: { followerId: user.id },
        select: { teacherId: true }
      });
      const followedTeacherIds = follows.map(f => f.teacherId);

      whereClause = {
        authorId: { in: followedTeacherIds },
        topic: {
          subjectId: { in: enrolledSubjectIds }
        }
      };
    } else if (user.role === "TEACHER") {
      // Teachers see their own materials by default in many views, but here we can show all or just theirs.
      // Let's show all for now or specific ones if needed.
      whereClause = { authorId: user.id };
    }

    const materials = await prisma.material.findMany({
      where: whereClause,
      include: { 
        author: { select: { name: true, avatarUrl: true } },
        topic: { include: { subject: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ success: true, materials });
  } catch (error) {
    console.error("Fetch Materials Error:", error);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}
