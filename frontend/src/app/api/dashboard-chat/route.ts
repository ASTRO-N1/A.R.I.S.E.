import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { messages, businessType, inventoryData } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const systemInstruction = `You are ARISE, an AI operational copilot. The user runs a ${businessType || 'business'}. Current date: February 27, 2026. Location: Pune, India. Act as an expert supply chain and business growth advisor. Keep responses concise, professional, and highly actionable.
    
    CRITICAL CONTEXT - HERE IS THEIR EXACT INVENTORY AND SALES HISTORY DATA:
    ${JSON.stringify(inventoryData)}
    
    Use the provided inventory and sales data as your foundation, but you MUST ALSO use your vast external knowledge of real-world seasonal trends, local demographics, market demands, and competitor strategies to offer powerful, predictive advice. If a user asks what new items they should stock for an upcoming festival in their city, you should absolutely synthesize your geographic and cultural knowledge to give them a brilliant list of trending items to procure. You MUST reply in the EXACT same language and script style the user uses. Do not use markdown blocks unless formatting code.`;

    const formattedMessages = messages.map((msg: any) => ({
      role: msg.sender === "bot" || msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.content || msg.text || " " }] as any[],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedMessages,
      config: {
        systemInstruction,
      },
    });

    return NextResponse.json({ 
        reply: response.text || "I was unable to process that request."
    });
  } catch (error: any) {
    console.error("Dashboard Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
