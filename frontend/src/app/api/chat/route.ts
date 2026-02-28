import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

// Initialize the Google Gen AI SDK
// It defaults to process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { messages, businessType, onboardingMode, audioBase64, mimeType, inputType } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
    }

    const mode = onboardingMode || 'quick';
    const dynamicPrompt = mode === 'quick' 
      ? `Ask them only 3 simple questions, ONE at a time, to understand their top items. Act conversational, professional, and concise. DO NOT ask all questions at once. Once you have asked 3 questions and the user has answered, you MUST output ONLY a valid JSON object in this exact format: {"transcription": "...", "replyText": "...", "status": "COMPLETE", "inventoryData": [{"item": "Name", "stock": 100, "price": 50.00, "restock_time_days": 5, "sales_history": [{"date": "2026-02-20", "sold": 15}, {"date": "2026-02-21", "sold": 12}]}]}. As part of the COMPLETE response, explicitly hallucinate a mathematically sound 30-day \`sales_history\` (late Jan to late Feb 2026) and realistic \`restock_time_days\` for each generated item.`
      : `Act as a rigorous data analyst. Ask them 8-10 detailed questions, ONE at a time. Extract exact stock numbers, past month sales trends, and supplier delays from the user before completing. DO NOT ask all questions at once. Once you have rigorously extracted the data and asked all questions, you MUST output ONLY a valid JSON object in this exact format: {"transcription": "...", "replyText": "...", "status": "COMPLETE", "inventoryData": [{"item": "Name", "stock": 100, "price": 50.00, "restock_time_days": 5, "sales_history": [{"date": "2026-02-20", "sold": 15}, {"date": "2026-02-21", "sold": 12}]}]}. Do not hallucinate; use their exact provided metrics.`;

    const systemInstruction = `You are ARISE. The user is sending an audio message or text. First, analyze their exact language and typing style. If they speak Marathi, reply in Marathi. If they type Marathi using English letters (Hinglish/Minglish style), you MUST reply in Marathi using English letters. Do exactly the same for Hindi or English. Then, transcribe exactly what they said. Finally, formulate your expert business response. You MUST return strictly a JSON object in this format: {"transcription": "exact words the user spoke", "replyText": "your response in the EXACT SAME LANGUAGE AND SCRIPT style the user used"}. Do not use markdown blocks.\n\nYou are an AI onboarding analyst. The selected business type: ${businessType || 'Retail Store'}. ${dynamicPrompt} Do not include markdown tags like \`\`\`json. Just the raw JSON.`;

    const formattedMessages = messages.map((msg: any) => ({
      role: msg.sender === "bot" ? "model" : "user",
      parts: [{ text: msg.text || " " }] as any[],
    }));

    if (audioBase64 && mimeType) {
        console.log("Audio received: ", !!audioBase64, "MimeType:", mimeType);
        // Append the audio data to the last user message
        const lastMsg = formattedMessages[formattedMessages.length - 1];
        if (lastMsg && lastMsg.role === "user") {
            lastMsg.parts.push({
                inlineData: {
                    data: audioBase64,
                    mimeType: mimeType
                }
            });
        }
    } else {
        console.log("No audio received for this request.");
    }

    // Step 1: Generate text response (JSON format)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedMessages,
      config: {
        systemInstruction,
      },
    });
    
    console.log("RAW GEMINI RESPONSE: ", response.text);

    const replyTextRaw = response.text || "{}";
    let parsedReply: any = {};
    try {
        const jsonMatch = replyTextRaw.match(/\{[\s\S]*\}/);
        parsedReply = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(replyTextRaw);
    } catch(e) {
        console.error("Failed to parse Gemini response as JSON", replyTextRaw);
        parsedReply = { replyText: replyTextRaw, transcription: "" }; 
    }

    const replyText = parsedReply.replyText || "";
    const transcription = parsedReply.transcription || "";
    const isComplete = parsedReply.status === "COMPLETE";

    if (isComplete) {
       return NextResponse.json({ 
           reply: replyTextRaw, 
           transcription, 
           parsedFull: parsedReply 
       });
    }

    // Step 2: Generate Audio for the exact text (Skip if user only typed text)
    let outAudioBase64 = null;
    if (inputType !== "text") {
        try {
          if (replyText) {
            const audioResponse = await ai.models.generateContent({
              model: "gemini-2.5-flash-preview-tts",
              contents: replyText,
              config: {
                // @ts-ignore
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: {
                      voiceName: "Kore"
                    }
                  }
                }
              }
            });

            const inlineData = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData;
            if (inlineData) {
              outAudioBase64 = inlineData.data;
            }
          }
        } catch (e) {
          console.error("TTS Generation Error:", e);
        }
    }

    return NextResponse.json({ 
        reply: replyTextRaw, 
        transcription, 
        audioBase64: outAudioBase64,
        parsedFull: parsedReply
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
