const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding dummy accounts...');

  const password = await bcrypt.hash('dummy123', 10);

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@lumiaxy.study' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@lumiaxy.study',
      password,
      role: 'ADMIN',
      preferences: '{"platform_status": "active"}'
    }
  });

  // Teacher
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@lumiaxy.study' },
    update: {},
    create: {
      name: 'Professor Lumis',
      email: 'teacher@lumiaxy.study',
      password,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          credentials: 'Ph.D. in Computer Science',
          officeHours: 'VISIBLE'
        }
      }
    }
  });

  // Students
  await prisma.user.upsert({
    where: { email: 'student1@lumiaxy.study' },
    update: {},
    create: {
      name: 'Alice Student',
      email: 'student1@lumiaxy.study',
      password,
      role: 'STUDENT'
    }
  });

  await prisma.user.upsert({
    where: { email: 'student2@lumiaxy.study' },
    update: {},
    create: {
      name: 'Bob Student',
      email: 'student2@lumiaxy.study',
      password,
      role: 'STUDENT'
    }
  });

  console.log('✅ Dummy accounts created successfully:');
  console.log('- Admin: admin@lumiaxy.study / dummy123');
  console.log('- Teacher: teacher@lumiaxy.study / dummy123');
  console.log('- Students: student1@lumiaxy.study, student2@lumiaxy.study / dummy123');
}

seed()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
