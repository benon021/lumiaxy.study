import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = (pw: string) => bcrypt.hashSync(pw, 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@lumiaxy.study" },
    update: {},
    create: {
      email: "admin@lumiaxy.study",
      name: "Admin",
      password: hashed("password"),
      role: "ADMIN",
    },
  });

  // Teacher
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@lumiaxy.study" },
    update: {},
    create: {
      email: "teacher@lumiaxy.study",
      name: "Ms. Johnson",
      password: hashed("password"),
      role: "TEACHER",
    },
  });

  // Create teacher profile
  await prisma.teacherProfile.upsert({
    where: { userId: teacher.id },
    update: {},
    create: {
      userId: teacher.id,
      credentials: "MSc Mathematics, 10 years experience",
      officeHours: "Mon-Fri, 2PM - 4PM",
      contactInfo: "teacher@lumiaxy.study",
    },
  });

  // Student
  const student = await prisma.user.upsert({
    where: { email: "student@lumiaxy.study" },
    update: {},
    create: {
      email: "student@lumiaxy.study",
      name: "John Doe",
      password: hashed("password"),
      role: "STUDENT",
    },
  });

  // Subjects
  const math = await prisma.subject.create({
    data: { name: "Mathematics", description: "Core mathematics curriculum" },
  });
  const science = await prisma.subject.create({
    data: { name: "Science", description: "Biology, Chemistry & Physics" },
  });

  // Topics
  const calculus = await prisma.topic.create({
    data: { name: "Calculus", description: "Integral & Differential Calculus", subjectId: math.id },
  });
  const quantumPhysics = await prisma.topic.create({
    data: { name: "Quantum Physics", description: "Introduction to Quantum Mechanics", subjectId: science.id },
  });

  // Materials
  await prisma.material.create({
    data: {
      title: "Introduction to Derivatives",
      description: "Learn the fundamentals of differential calculus",
      type: "NOTE",
      videoUrl: "https://www.youtube.com/watch?v=WsQQvHm4lSw",
      topicId: calculus.id,
      authorId: teacher.id,
      isPinned: true,
    },
  });

  await prisma.material.create({
    data: {
      title: "Quantum Mechanics - Wave Functions",
      description: "Comprehensive notes on wave functions and probability",
      type: "PDF",
      topicId: quantumPhysics.id,
      authorId: teacher.id,
    },
  });

  // Assignment
  const assignment = await prisma.assignment.create({
    data: {
      title: "Calculus Problem Set 1",
      description: "Solve 10 derivative problems from the textbook. Show all working.",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      teacherId: teacher.id,
      topicId: calculus.id,
    },
  });

  // Quiz
  const quiz = await prisma.quiz.create({
    data: {
      title: "Calculus Basics Quiz",
      description: "Test your knowledge of basic calculus concepts",
      teacherId: teacher.id,
      questions: {
        create: [
          {
            text: "What is the derivative of x²?",
            options: JSON.stringify(["x", "2x", "2", "x²"]),
            correctOption: 1,
          },
          {
            text: "What does integration represent geometrically?",
            options: JSON.stringify(["Slope of a line", "Area under a curve", "Rate of change", "Volume of a shape"]),
            correctOption: 1,
          },
        ],
      },
    },
  });

  // Follow relationship
  await prisma.follow.create({
    data: { followerId: student.id, teacherId: teacher.id },
  });

  // Discussion thread
  const thread = await prisma.discussionThread.create({
    data: {
      title: "Questions about Wave Functions",
      topicId: quantumPhysics.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Can someone explain what a wave function collapse is?",
      authorId: student.id,
      threadId: thread.id,
    },
  });

  // Badges
  await prisma.badge.upsert({
    where: { name: "Top Contributor" },
    update: {},
    create: { name: "Top Contributor", description: "Awarded for being an active community participant" },
  });
  await prisma.badge.upsert({
    where: { name: "Highly Rated Educator" },
    update: {},
    create: { name: "Highly Rated Educator", description: "Awarded to teachers with ratings above 4.5" },
  });
  await prisma.badge.upsert({
    where: { name: "Fast Learner" },
    update: {},
    create: { name: "Fast Learner", description: "Completed 5 assignments ahead of schedule" },
  });

  // Notification
  await prisma.notification.create({
    data: {
      userId: student.id,
      type: "NEW_MATERIAL",
      message: "Ms. Johnson uploaded new notes in Calculus!",
      link: "/dashboard/topic/" + calculus.id,
    },
  });

  console.log("✅ Platform seeded with demo data!");
  console.log("📧 Admin:   admin@lumiaxy.study / password");
  console.log("🧑‍🏫 Teacher: teacher@lumiaxy.study / password");
  console.log("🎓 Student: student@lumiaxy.study / password");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
