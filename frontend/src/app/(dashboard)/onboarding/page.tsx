"use client";

import { useEffect, useState, useRef } from "react";
import { useBusinessStore } from "@/store/useBusinessStore";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, User, ChevronRight, Mic } from "lucide-react";

function createWavBlob(base64Data: string) {
  const binaryString = window.atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
  const buffer = bytes.buffer;
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  view.setUint32(0, 1380533830, false); // 'RIFF'
  view.setUint32(4, 36 + buffer.byteLength, true);
  view.setUint32(8, 1463899717, false); // 'WAVE'
  view.setUint32(12, 1718449184, false); // 'fmt '
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono channel
  view.setUint32(24, 24000, true); // 24kHz sample rate
  view.setUint32(28, 24000 * 2, true); // Byte rate
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // 16-bit
  view.setUint32(36, 1684108385, false); // 'data'
  view.setUint32(40, buffer.byteLength, true);
  return new Blob([view, buffer], { type: 'audio/wav' });
}

const typeNames: Record<string, string> = {
  retail: "Retail Store",
  restaurant: "Restaurant",
  agency: "Agency",
  software: "Software / SaaS",
};

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

export default function OnboardingChat() {
  const router = useRouter();
  const businessType = useBusinessStore((state) => state.businessType);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const startTimeRef = useRef<number>(0);

  // Initial greeting
  useEffect(() => {
    const defaultType = businessType || "retail"; // fallback if none selected
    const storeName = typeNames[defaultType] || "Business";
    
    const initialMsg = `Welcome to ARISE. Let's set up your ${storeName}. What are your main goals for using the dashboard?`;
    
    const timer = setTimeout(() => {
      setMessages([{ id: Date.now().toString(), sender: "bot", text: initialMsg }]);
      setIsTyping(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [businessType]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const toggleRecording = async () => {
    if (isTyping) return; // Prevent interaction while AI is responding

    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const duration = Date.now() - startTimeRef.current;
        if (duration < 1000) {
            console.warn(`Recording too short (${duration}ms). Discarding.`);
            setMessages((prev) => [
                ...prev,
                { id: Date.now().toString(), sender: "bot", text: "Recording was too short. Please try speaking a bit longer." }
            ]);
            setIsRecording(false);
            return;
        }

        if (chunksRef.current.length === 0) {
            console.warn("No audio chunks recorded.");
            setIsRecording(false);
            return;
        }
        
        const audioBlob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        stream.getTracks().forEach((track) => track.stop());
        
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const base64String = base64data.split(',')[1];
          // Send the audio immediately after stopping recording
          sendMessage("", base64String, audioBlob.type);
        };
      };

      mediaRecorder.start(250); // Request data in 250ms chunks to ensure ondataavailable fires
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone.");
    }
  };

  const sendMessage = async (textInput: string, audioBase64?: string, mimeType?: string) => {
    const tempUserId = Date.now().toString();
    const newMsg: Message = { 
        id: tempUserId, 
        sender: "user", 
        // Show placeholders if sending an audio file
        text: audioBase64 ? "🎤 Processing audio..." : textInput 
    };
    
    const messageForBackend: Message = {
        id: tempUserId,
        sender: "user",
        // Send a blank space if only audio is passed
        text: audioBase64 ? " " : textInput 
    };
    
    const updatedMessages = [...messages, messageForBackend];
    
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          businessType: typeNames[businessType || "retail"] || "Business",
          audioBase64,
          mimeType
        }),
      });

      const data = await res.json();
      
      const replyTextRaw = data.reply || "";
      let transcriptionText = null;
      let aiReplyText = replyTextRaw; // Default to the raw text
      let isComplete = false;
      let inventoryDataToSave = null;

      try {
        const jsonMatch = replyTextRaw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            transcriptionText = parsed.transcription || null;
            // Only override if the JSON actually contains a replyText
            if (parsed.replyText) aiReplyText = parsed.replyText;
            if (parsed.status === "COMPLETE") isComplete = true;
            if (parsed.inventoryData) inventoryDataToSave = parsed.inventoryData;
        }
      } catch (error) {
        console.warn("AI response was not valid JSON, falling back to plain text.");
      }
      
      // Override with user bubble
      if (transcriptionText) {
          setMessages((prev) => prev.map(msg => 
              msg.id === tempUserId ? { ...msg, text: transcriptionText } : msg
          ));
      } else if (audioBase64) {
          setMessages((prev) => prev.map(msg => 
              msg.id === tempUserId ? { ...msg, text: "🎤 [Audio Message]" } : msg
          ));
      }

      // 1. First, ALWAYS update the UI bubble with the response text
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "bot", text: aiReplyText || "..." },
      ]);

      // 2. Play the final audio immediately if it exists
      const responseAudioBase64 = data.audioBase64;
      if (responseAudioBase64) {
        try {
          const blob = createWavBlob(responseAudioBase64);
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.play();
        } catch (e) {
          console.error("Failed to play audio", e);
        }
      }

      // 3. If COMPLETE, schedule the redirect after giving the audio time to play
      if (isComplete) {
          if (inventoryDataToSave) {
            useBusinessStore.getState().setInventoryData(inventoryDataToSave);
          }
          useBusinessStore.getState().setOnboardingComplete(true);
          
          setTimeout(() => {
              router.push("/dashboard");
          }, 5000);
          return;
      }
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: "bot", text: "I'm having trouble connecting right now. Let's try again in a moment." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
  };

  const handleGenerateDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden dark:bg-black transition-colors duration-300">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navigation / Header */}
      <header className="flex items-center justify-between p-6 w-full max-w-5xl mx-auto z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
            <Bot className="w-5 h-5 text-white dark:text-black" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-gray-900 dark:text-white">ARISE Setup</span>
        </div>
        <div className="flex items-center gap-4 border border-gray-200 dark:border-gray-800 p-1 pr-4 pl-1 rounded-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
          <ThemeToggle />
          <button
            onClick={handleGenerateDashboard}
            className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Generate Dashboard
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto flex flex-col relative z-10 p-4 sm:p-6 mb-24">
        <div className="flex-1 overflow-y-auto space-y-6 pb-4 hide-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                  m.sender === "bot" ? "bg-black dark:bg-white" : "bg-gray-200 dark:bg-gray-800"
                }`}>
                  {m.sender === "bot" ? (
                    <Bot className="w-5 h-5 text-white dark:text-black" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] px-5 py-3.5 text-[15px] leading-relaxed ${
                  m.sender === "user"
                    ? "bg-black text-white dark:bg-white dark:text-black rounded-2xl rounded-tr-sm"
                    : "bg-white text-gray-800 dark:bg-[#111] dark:text-gray-200 border border-gray-100 dark:border-gray-800 rounded-2xl rounded-tl-sm shadow-sm"
                }`}>
                  {m.text}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 flex-row"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center mt-1">
                  <Bot className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-[52px]">
                  <motion.div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 w-full p-4 sm:p-6 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent dark:from-black dark:via-black z-20">
        <div className="max-w-3xl mx-auto relative flex items-center">
          <form onSubmit={handleSend} className="relative flex items-center w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message ARISE..."
              disabled={isRecording || isTyping}
              className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 rounded-2xl pl-5 pr-24 py-4 focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-shadow shadow-sm disabled:opacity-50"
              autoFocus
            />
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isTyping}
              className={`absolute right-14 p-2.5 rounded-xl transition-colors ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-black dark:hover:text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Mic className="w-4 h-4" />
            </button>
            {/* Send Button */}
            <button
              type="submit"
              disabled={(!input.trim() && !isRecording) || isTyping}
              className="absolute right-2 p-2.5 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
        <p className="max-w-3xl mx-auto text-center text-xs text-gray-400 mt-3 hidden sm:block">
          ARISE is setting up your tailored experience. Use your microphone or type your answers.
        </p>
      </div>
      
      {/* Global styles to hide scrollbar while allowing scroll */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
