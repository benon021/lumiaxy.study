import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  
  // Create Teacher 2
  const teacher2 = await prisma.user.upsert({
    where: { email: 'sarah@lumiaxy.study' },
    update: {},
    create: {
      email: 'sarah@lumiaxy.study',
      name: 'Sarah Connor',
      password,
      role: 'TEACHER',
      bio: 'Expert in Cybernetics and Future History.',
      teacherProfile: {
        create: {
          credentials: 'Ph.D. in AI Resistance',
          officeHours: 'Mon-Wed 2PM-4PM',
          status: 'ONLINE'
        }
      }
    }
  });

  console.log('Created teacher:', teacher2.name);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
