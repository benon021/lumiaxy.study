import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Test student
  await prisma.user.upsert({
    where: { email: 'student@lumiaxy.study' },
    update: {},
    create: {
      email: 'student@lumiaxy.study',
      name: 'Test Student',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: 'STUDENT'
    }
  })

  // Test admin
  await prisma.user.upsert({
    where: { email: 'admin@lumiaxy.study' },
    update: {},
    create: {
      email: 'admin@lumiaxy.study',
      name: 'Admin User',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      role: 'ADMIN'
    }
  })

  console.log('✅ Seeded test users:')
  console.log('Student: student@lumiaxy.study / password')
  console.log('Admin: admin@lumiaxy.study / password')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
