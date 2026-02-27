"use client";

import { useBusinessStore } from "@/store/useBusinessStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function Dashboard() {
  const { businessType, isOnboardingComplete, clearBusinessType } = useBusinessStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello. I'm your AI assistant. How can I help you analyze your dashboard today?",
    },
  ]);

  useEffect(() => {
    setMounted(true);
    // Only redirect to landing page if there is an explicit lack of business profile or onboarding completion
    if (!businessType || !isOnboardingComplete) {
      router.push("/");
    }
  }, [businessType, isOnboardingComplete, router]);

  if (!mounted || !businessType || !isOnboardingComplete) return null;

  const handleReturn = () => {
    clearBusinessType();
    router.push("/");
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: chatInput },
    ]);
    const input = chatInput;
    setChatInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: `Simulated response for: "${input}". Let me know if you need to fetch new data or run an analysis.`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="flex relative h-screen overflow-hidden bg-gray-50/50 dark:bg-black font-sans text-gray-900 dark:text-gray-100">
      {/* 
        ======================================================== 
        LEFT SIDE (70%): Inventory Metrics & Dashboard Content
        ======================================================== 
      */}
      <div className="w-[70%] h-full flex flex-col p-8 md:p-12 overflow-y-auto">
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={handleReturn}
              className="p-1.5 -ml-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              title="Change Business Type"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <div>
              <h1 className="text-xl font-medium tracking-tight capitalize text-gray-900 dark:text-white">
                {businessType} System
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                Performance overview and active metrics
              </p>
            </div>
          </div>
          <ThemeToggle />
        </motion.header>

        {/* Main Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric Cards */}
            {["Total Revenue", "Active Users", "Inventory Value"].map((item, i) => (
              <div key={i} className="sleek-card p-6">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                  {item}
                </h3>
                <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                  {i === 2 ? "$45,231" : i === 1 ? "1,452" : "$124,500"}
                </p>
                <div className="mt-3 flex items-center text-xs font-medium">
                  <span className="text-gray-900 dark:text-gray-200">+12.5%</span>
                  <span className="text-gray-400 dark:text-gray-500 font-normal ml-1.5">vs last month</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sleek-card p-0 mt-8 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-medium tracking-tight text-gray-900 dark:text-gray-100">
                Recent Activity
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                    <th className="py-3 px-6 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Identifier</th>
                    <th className="py-3 px-6 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Description</th>
                    <th className="py-3 px-6 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-6 text-gray-500 dark:text-gray-400 font-mono text-xs">#{1000 + row}</td>
                      <td className="py-3 px-6 text-gray-900 dark:text-gray-200">System initialization routing</td>
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                          Complete
                        </span>
                      </td>
                      <td className="py-3 px-6 text-gray-400 dark:text-gray-500 text-xs text-right sm:text-left">2m ago</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 
        ======================================================== 
        RIGHT SIDE (30%): Floating Glassmorphic AI Chat Panel
        ======================================================== 
      */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-[30%] h-full border-l border-gray-200 dark:border-gray-800 glass-panel flex flex-col relative z-20"
      >
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-transparent sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-gray-900 dark:text-gray-100" strokeWidth={1.5} />
            <div>
              <h2 className="text-sm font-medium tracking-tight text-gray-900 dark:text-gray-100">Arise Copilot</h2>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-0.5">Online</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] px-4 py-2.5 text-sm rounded-2xl ${
                  msg.role === "user"
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-black rounded-tr-sm shadow-sm"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm"
                }`}
              >
                <p className="leading-relaxed font-normal">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-transparent sticky bottom-0 border-t border-gray-200 dark:border-gray-800 z-10 backdrop-blur-md">
          <form
            onSubmit={handleChatSubmit}
            className="flex items-center gap-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-1 pr-1.5 focus-within:border-gray-300 dark:focus-within:border-gray-700 focus-within:ring-1 focus-within:ring-gray-300 dark:focus-within:ring-gray-700 shadow-sm transition-all"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-600 font-normal"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-1.5 rounded-md bg-gray-900 text-white dark:bg-white dark:text-black disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              <Send size={14} strokeWidth={2} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
