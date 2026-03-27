import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, title, content, description, subjectId, topicId, dueDate, maxScore, attachments, mcqQuestions } = body;

    // STEP 3 Check: IF post type is NOT General, Teacher MUST select Subject & Topic
    if (type !== "GENERAL" && (!subjectId || !topicId)) {
      return NextResponse.json({ error: "Subject and Topic are required for this post type" }, { status: 400 });
    }

    let result;

    switch (type) {
      case "NOTES":
        result = await prisma.material.create({
          data: {
            title,
            description,
            type: "NOTE",
            topicId,
            authorId: user.id,
            fileUrl: attachments?.[0] // Assuming single file for simple notes
          }
        });
        break;

      case "ASSIGNMENT":
        result = await prisma.assignment.create({
          data: {
            title,
            description,
            // @ts-ignore
            type: body.assignmentType || "TEXT",
            dueDate: dueDate ? new Date(dueDate) : null,
            maxScore: maxScore || 100,
            topicId,
            teacherId: user.id,
            attachments: attachments ? JSON.stringify(attachments) : null,
            questions: body.assignmentType === "MCQ" ? {
              create: mcqQuestions.map((q: any) => ({
                text: q.text,
                options: JSON.stringify(q.options),
                correctIndex: q.correctIndex
              }))
            } : undefined
          }
        });
        break;

      case "DISCUSSION":
        result = await prisma.discussionThread.create({
          data: {
            title,
            // @ts-ignore
            type: "QUESTION",
            // @ts-ignore
            question: title, // Store the question prompt here
            topicId,
          }
        });
        break;

      case "GENERAL":
        // @ts-ignore
        result = await prisma.announcement.create({
          data: {
            title,
            content: content || description || "",
            teacherId: user.id,
            subjectId: subjectId || null
          }
        });
        break;

      default:
        return NextResponse.json({ error: "Invalid post type" }, { status: 400 });
    }

    // TRIGGER NOTIFICATIONS
    // 1. Identify all students who follow teacher AND are enrolled in subject
    if (subjectId) {
      const eligibleStudents = await prisma.user.findMany({
        where: {
          role: "STUDENT",
          followedBy: { some: { teacherId: user.id } },
          // @ts-ignore
          subjectEnrollments: { some: { subjectId } }
        },
        select: { id: true }
      });

      // Create notifications
      if (eligibleStudents.length > 0) {
        await prisma.notification.createMany({
          data: eligibleStudents.map(student => ({
            userId: student.id,
            type: "NEW_CONTENT",
            message: `New ${type.toLowerCase()} posted by ${user.name} in ${subjectId}`,
            link: `/dashboard/subject/${subjectId}/topic/${topicId}`
          }))
        });
      }
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
