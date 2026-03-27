const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDB() {
  try {
    console.log("Attempting to connect to DB...");
    const count = await prisma.user.count();
    console.log("User count:", count);
    
    console.log("Checking Setting model...");
    const settings = await prisma.setting.findMany();
    console.log("Settings found:", settings.length);
    settings.forEach(s => console.log(` - ${s.key}`));

    console.log("DB Check PASSED");
  } catch (error) {
    console.error("DB Check FAILED:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDB();
