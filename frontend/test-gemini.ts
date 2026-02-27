import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "fs";

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({});

async function test() {
    try {
        const systemInstruction = "Test system instruction";
        const formattedMessages = [
            {
                role: "user",
                parts: [
                    { text: " " },
                    {
                        inlineData: {
                            data: Buffer.from("test").toString("base64"),
                            mimeType: "audio/webm;codecs=opus"
                        }
                    }
                ]
            }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // @ts-ignore
            contents: formattedMessages,
            config: {
                systemInstruction,
            },
        });
        console.log("Success", response.text);
    } catch (e: any) {
        console.error("Gemini API Error:", e.message);
    }
}

test();
