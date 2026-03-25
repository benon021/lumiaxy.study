import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { messages, image } = await req.json();

    // 1. Get API Key from DB or .env
    const dbSetting = await (prisma as any).setting.findUnique({
      where: { key: "OPENAI_API_KEY" }
    });
    
    const apiKey = dbSetting?.value || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API Key not configured. Please contact the administrator." },
        { status: 500 }
      );
    }

    // 2. Prepare payload for OpenAI
    // Formulate the dynamic prompt for the vision model if an image is provided
    let apiMessages = [...messages];
    
    // If there's an image, the last user message should include it
    if (image && apiMessages.length > 0) {
      const lastMessage = apiMessages[apiMessages.length - 1];
      if (lastMessage.role === "user") {
        lastMessage.content = [
          { type: "text", text: lastMessage.content },
          {
            type: "image_url",
            image_url: {
              url: image, // base64 string
            },
          },
        ];
      }
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: image ? "gpt-4o" : "gpt-4o-mini", // Use gpt-4o for vision
        messages: apiMessages,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("OpenAI API error:", data);
        return NextResponse.json(
            { error: data.error?.message || "Failed to get response from AI" },
            { status: response.status }
        );
    }

    return NextResponse.json({
      role: "assistant",
      content: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
