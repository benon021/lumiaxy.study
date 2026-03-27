const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testDualCommunication() {
  const mainKey = process.env.GEMINI_MAIN_API_KEY;
  const sideKey = process.env.GEMINI_SIDE_API_KEY;

  if (!mainKey || !sideKey) {
    console.error("Missing one or both keys in .env");
    process.exit(1);
  }

  async function testOne(name, key) {
    try {
      console.log(`Testing ${name} key...`);
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(`Identify yourself as the ${name} AI.`);
      console.log(`${name} Response:`, result.response.text());
      return true;
    } catch (err) {
      console.error(`${name} failed:`, err.message);
      return false;
    }
  }

  const mainOk = await testOne("Main", mainKey);
  const sideOk = await testOne("Side", sideKey);

  if (mainOk && sideOk) {
    console.log("\n✅ BOTH AIs ARE COMMUNICATING SUCCESSFULLY!");
  } else {
    console.log("\n❌ Communication gap detected.");
    process.exit(1);
  }
}

testDualCommunication();
