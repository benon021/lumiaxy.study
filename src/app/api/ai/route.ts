import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { messages, image, conversationId } = await req.json();
    const user = await getUserFromRequest(req);

    // 1. Get API Key
    const dbSetting = await (prisma as any).setting.findUnique({
      where: { key: "GEMINI_API_KEY" }
    });
    
    const apiKey = dbSetting?.value || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      return NextResponse.json(
        { error: "Gemini API Key not configured. Please contact the administrator." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. Format history for Gemini
    // Gemini expects an array of { role: "user" | "model", parts: [{ text: string }] }
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

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
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
