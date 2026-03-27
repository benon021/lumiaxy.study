import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const { assignmentId, content, fileUrl, answers } = await req.json();
    if (!assignmentId) {
      return NextResponse.json({ error: "Missing assignment ID." }, { status: 400 });
    }

    const assignment = await prisma.assignment.findUnique({ 
      where: { id: assignmentId },
      include: { questions: true }
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    }

    let score = null;
    let status = "SUBMITTED";

    // Auto-grade MCQs
    if (assignment.type === "MCQ" && answers) {
      let correct = 0;
      const submittedAnswers = typeof answers === 'string' ? JSON.parse(answers) : answers;
      
      assignment.questions.forEach((q: any) => {
        if (submittedAnswers[q.id] === q.correctAnswer) {
          correct++;
        }
      });
      
      score = (correct / assignment.questions.length) * assignment.maxScore;
    }

    // Check if late
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      status = "LATE";
    }

    // Upsert Submission
    const submission = await prisma.submission.upsert({
      where: { assignmentId_studentId: { assignmentId, studentId: user.id } },
      update: { 
        content, 
        fileUrl, 
        answers: answers ? JSON.stringify(answers) : null,
        score,
        status: status as any,
        submittedAt: new Date(),
        gradedAt: assignment.type === "MCQ" ? new Date() : null
      },
      create: { 
        assignmentId, 
        studentId: user.id, 
        content, 
        fileUrl,
        answers: answers ? JSON.stringify(answers) : null,
        score,
        status: status as any,
        gradedAt: assignment.type === "MCQ" ? new Date() : null
      }
    });

    // Notify Teacher
    await prisma.notification.create({
      data: {
        userId: assignment.teacherId,
        type: "NEW_SUBMISSION",
        message: `${user.name} submitted ${assignment.type === "MCQ" ? "quiz" : "answer"} for "${assignment.title}".`,
        link: `/dashboard/teacher/grading`
      }
    });

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req as any);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    if (user.role === "STUDENT") {
      // Filter by enrollment and follows
      const enrollments = await prisma.subjectEnrollment.findMany({
        where: { userId: user.id },
        select: { subjectId: true }
      });
      const enrolledSubjectIds = enrollments.map(e => e.subjectId);

      const follows = await prisma.follow.findMany({
        where: { followerId: user.id },
        select: { teacherId: true }
      });
      const followedTeacherIds = follows.map(f => f.teacherId);

      const assignments = await prisma.assignment.findMany({
        where: {
          teacherId: { in: followedTeacherIds },
          topic: {
            subjectId: { in: enrolledSubjectIds }
          }
        },
        include: { 
          submissions: { where: { studentId: user.id } }, 
          teacher: { select: { name: true, avatarUrl: true }},
          questions: true,
          topic: { include: { subject: true } }
        },
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json({ success: true, assignments });
    } 

    if (user.role === "TEACHER") {
      const submissions = await prisma.submission.findMany({
        where: { assignment: { teacherId: user.id }, score: null },
        include: { assignment: true, student: { select: { name: true, avatarUrl: true }} },
        orderBy: { submittedAt: "asc" }
      });
      return NextResponse.json({ success: true, submissions });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    console.error("Fetch submissions/assignments error:", error);
    return NextResponse.json({ error: "Fetch error" }, { status: 500 });
  }
}
