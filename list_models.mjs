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

async function listModels() {
  const mainKey = process.env.GEMINI_MAIN_API_KEY;
  if (!mainKey || mainKey.startsWith("YOUR_")) {
    console.log("No valid missing main key.");
    return;
  }

  try {
    console.log("Fetching available models for your API key...");
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${mainKey}`);
    const data = await res.json();
    
    if (data.error) {
      console.error("API Error: ", data.error);
      return;
    }

    const modelNames = data.models.map(m => m.name).filter(name => name.includes("gemini"));
    console.log("Available Gemini Models for this Key:");
    modelNames.forEach(name => console.log(" - " + name));

  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

listModels();
