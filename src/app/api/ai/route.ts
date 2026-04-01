
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { messages, image, conversationId, source = "main" } = await req.json();
    const user = await getUserFromRequest(req);

    // 1. Get API Key based on source
    const keyName = source === "side" ? "GEMINI_SIDE_API_KEY" : "GEMINI_MAIN_API_KEY";

    let apiKey = process.env[keyName];

    // Check DB first if possible, then fallback to .env
    try {
      const dbSetting = await (prisma as any).setting.findUnique({
        where: { key: keyName }
      });
      if (dbSetting?.value) {
        apiKey = dbSetting.value;
      }
    } catch (dbError) {
      console.warn(`Database lookup for ${keyName} failed, falling back to environment variables:`, dbError);
    }

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      return NextResponse.json(
        { error: `Gemini ${source} API Key not configured. Please set ${keyName} in .env or Settings.` },
        { status: 500 }
      );
    }


    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 2. Format history for Gemini
    // Filter out leading non-user messages and ensure alternating roles
    let historyMessages = messages.slice(0, -1);

    // Find first user message index
    const firstUserIndex = historyMessages.findIndex((m: any) => m.role === 'user');
    const cleanHistoryMessages = firstUserIndex !== -1 ? historyMessages.slice(firstUserIndex) : [];

    const history: any[] = [];
    let lastRole: string | null = null;

    for (const msg of cleanHistoryMessages) {
      if (msg.role === 'system') continue; // Skip system messages for history, handled elsewhere if needed

      const role = (msg.role === "assistant" || msg.role === "model") ? "model" : "user";

      if (role === lastRole) {
        // Append to last message parts if same role
        history[history.length - 1].parts[0].text += "\n" + msg.content;
      } else {
        history.push({
          role,
          parts: [{ text: msg.content }],
        });
        lastRole = role;
      }
    }

    const lastMessage = messages[messages.length - 1];

    // 3. Handle image if present
    let result;
    if (image) {
      // For multimodal, we don't use chat history in the same way with the simple SDK
      const imageData = image.split(",")[1];
      result = await model.generateContent([
        lastMessage.content,
        {
          inlineData: {
            data: imageData,
            mimeType: "image/jpeg", // Assuming jpeg for simplicity, should be dynamic
          },
        },
      ]);
    } else {
      const chat = model.startChat({ history });
      result = await chat.sendMessage(lastMessage.content);
    }

    const responseText = result.response.text();

    // 4. Save to DB if conversationId is provided
    if (user && conversationId) {
      // Save user message
      await (prisma as any).aIMessage.create({
        data: {
          content: lastMessage.content,
          role: "user",
          conversationId,
        },
      });

      // Save assistant message
      await (prisma as any).aIMessage.create({
        data: {
          content: responseText,
          role: "assistant",
          conversationId,
        },
      });

      // Update conversation title if it's the first message and still "New Chat"
      const conversation = await (prisma as any).aIConversation.findUnique({
        where: { id: conversationId },
      });

      if (conversation && conversation.title === "New Chat") {
        const title = lastMessage.content.substring(0, 30) + (lastMessage.content.length > 30 ? "..." : "");
        await (prisma as any).aIConversation.update({
          where: { id: conversationId },
          data: { title, updatedAt: new Date() },
        });
      } else {
        await (prisma as any).aIConversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() },
        });
      }
    }

    return NextResponse.json({
      role: "assistant",
      content: responseText,
    });
  } catch (error: any) {
    console.error("AI API Error:", error);

    // Return the actual error message so the user can see what's wrong (e.g. invalid API key)
    const errorMessage = error?.message || "Internal server error";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
