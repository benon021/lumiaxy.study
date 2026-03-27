const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function testAI() {
  const apiKey = process.env.GEMINI_MAIN_API_KEY;
  console.log("API Key found:", apiKey ? "Yes (length: " + apiKey.length + ")" : "No");

  if (!apiKey) {
    console.error("Missing GEMINI_MAIN_API_KEY in .env");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Hello, are you working?";
    console.log("Sending prompt:", prompt);
    
    // Test simple generation
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("AI Response:", text);
    console.log("Test PASSED");
  } catch (error) {
    console.error("AI Test FAILED:");
    console.error(error);
  }
}

testAI();
