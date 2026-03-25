import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function test() {
  console.log("Testing Prisma connection...")
  try {
    const userCount = await prisma.user.count()
    console.log("Database connection successful. User count:", userCount)
    
    const testEmail = "test-" + Date.now() + "@example.com"
    const hashedPassword = await bcrypt.hash("password123", 10)
    
    console.log("Testing User creation...")
    const newUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: testEmail,
        password: hashedPassword,
      }
    })
    console.log("User created successfully:", newUser.id)
    
    console.log("Testing login (compare)...")
    const isMatch = await bcrypt.compare("password123", newUser.password)
    console.log("Password match:", isMatch)
    
    console.log("Cleanup...")
    await prisma.user.delete({ where: { id: newUser.id } })
    console.log("Cleanup successful.")
    
  } catch (err) {
    console.error("Diagnostic failed:")
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

test()
