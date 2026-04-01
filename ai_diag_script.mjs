import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

function loadEnv() {
  const envFile = fs.readFileSync('.env', 'utf-8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)="?(.*?)"?$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

loadEnv();

async function testKeys() {
  const mainKey = process.env.GEMINI_MAIN_API_KEY;
  const sideKey = process.env.GEMINI_SIDE_API_KEY;

  console.log("Checking Main Key:", mainKey ? mainKey.substring(0, 10) + "..." : "MISSING");
  console.log("Checking Side Key:", sideKey ? sideKey.substring(0, 10) + "..." : "MISSING");

  async function testModelKey(key, name) {
    if (!key) {
      console.log(`[${name}] Key missing!`);
      return;
    }
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      try {
        const result = await model.generateContent("Hello.");
        console.log(`[${name}] SUCCESS with gemini-1.5-flash!`);
      } catch (e1) {
        console.log(`[${name}] gemini-1.5-flash failed. Trying gemini-pro...`);
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result2 = await model2.generateContent("Hello.");
        console.log(`[${name}] SUCCESS with gemini-pro! Response:`, result2.response.text().trim());
      }
    } catch (e) {
      console.error(`[${name}] ERROR!`, e.message);
    }
  }

  await testModelKey(mainKey, "MAIN CHAT");
  await testModelKey(sideKey, "SIDE CHAT");
}

testKeys();
