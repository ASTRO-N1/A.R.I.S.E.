"use client";

import { useBusinessStore } from "@/store/useBusinessStore";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Send, Sparkles, TrendingUp, Package, DollarSign } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
}

export default function Dashboard() {
  const { clearBusinessType } = useBusinessStore();
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

  const [dbData, setDbData] = useState<{ business: any, inventory: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    async function fetchData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: business } = await supabase
          .from("businesses")
          .select("*")
          .eq("user_id", user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (business) {
            const { data: inventory } = await supabase
              .from("inventory")
              .select("*")
              .eq("business_id", business.id);
              
            setDbData({ business, inventory: inventory || [] });
        } else {
            // No business found, they probably need to onboard
            router.push("/onboarding");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [router]);

  // Aggregate the sales history across all inventory items for the chart
  const chartData = useMemo(() => {
    if (!dbData?.inventory || dbData.inventory.length === 0) return [];
    
    const aggregated: Record<string, number> = {};
    
    dbData.inventory.forEach(item => {
       if (item.sales_history && Array.isArray(item.sales_history)) {
           item.sales_history.forEach((day: any) => {
               if (day.date && typeof day.sold === 'number') {
                   // Calculate rough revenue for that day (sold * price)
                   const dailyRev = day.sold * (item.price || 0);
                   aggregated[day.date] = (aggregated[day.date] || 0) + dailyRev;
               }
           });
       }
    });

    return Object.entries(aggregated)
      .map(([date, revenue]) => ({ date, revenue: Math.round(revenue) }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [dbData]);

  if (!mounted || isLoading) return null;
  if (!dbData) return null;

  const { business, inventory } = dbData;
  const totalValue = inventory.reduce((acc, item) => acc + (item.stock * item.price), 0);
  const totalItems = inventory.length;
  const lowStock = inventory.filter(item => item.stock < 20).length;

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
          content: `Simulated AI response for: "${input}".`,
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
      <div className="w-full md:w-[70%] h-full flex flex-col p-8 md:p-12 overflow-y-auto">
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
              title="Return Home"
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <div>
              <h1 className="text-xl font-medium tracking-tight capitalize text-gray-900 dark:text-white">
                {business.business_type} Dashboard
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                Mode: {business.onboarding_mode === 'quick' ? 'Generated Demo' : 'Live Data'}
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
            <div className="sleek-card p-6 border border-gray-100 dark:border-gray-800 hover:border-blue-500/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Inventory Value</h3>
                <DollarSign className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="sleek-card p-6 border border-gray-100 dark:border-gray-800 hover:border-purple-500/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tracked Items</h3>
                <Package className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                {totalItems}
              </p>
            </div>
            
            <div className="sleek-card p-6 border border-gray-100 dark:border-gray-800 hover:border-red-500/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Low Stock Alerts</h3>
                <TrendingUp className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                {lowStock} 
              </p>
            </div>
          </div>

          {/* Graphical Chart */}
          {chartData.length > 0 && (
            <div className="sleek-card p-6 mt-8 overflow-hidden h-[300px] border border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-medium tracking-tight text-gray-900 dark:text-gray-100 mb-6">
                30-Day Extrapolated Revenue History
              </h2>
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                    <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#888'}}
                        tickMargin={10}
                        minTickGap={30}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#888'}}
                        tickFormatter={(val) => `$${val}`}
                        width={40}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: any) => [`$${value}`, 'Revenue']}
                        labelStyle={{ color: '#888', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Inventory Table */}
          <div className="sleek-card p-0 mt-8 overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-sm font-medium tracking-tight text-gray-900 dark:text-gray-100">
                Inventory Breakdown
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                    <th className="py-3 px-6 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Item Name</th>
                    <th className="py-3 px-6 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Current Stock</th>
                    <th className="py-3 px-6 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Price unit</th>
                    <th className="py-3 px-6 font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">Supplier Delay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {inventory.map((item, id) => (
                    <tr key={item.id || id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-6 text-gray-900 dark:text-gray-200 font-medium">{item.item_name}</td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ${item.stock < 20 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'} border border-transparent`}>
                          {item.stock} Units
                        </span>
                      </td>
                      <td className="py-3 px-6 text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-6 text-gray-500 dark:text-gray-400 text-right">{item.restock_time_days ? `${item.restock_time_days} days` : 'N/A'}</td>
                    </tr>
                  ))}
                  {inventory.length === 0 && (
                      <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-500">No inventory data found. Please run the AI Onboarding setup.</td>
                      </tr>
                  )}
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
        className="hidden md:flex w-[30%] h-full border-l border-gray-200 dark:border-gray-800 glass-panel flex-col relative z-20 shadow-xl"
      >
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 sticky top-0 z-10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center">
              <Sparkles size={14} className="text-white dark:text-black" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100">Arise Data Copilot</h2>
              <p className="text-[10px] text-green-600 dark:text-green-400 uppercase tracking-widest mt-0.5 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Connected to DB
              </p>
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
                className={`max-w-[85%] px-4 py-3 text-[13px] rounded-2xl ${
                  msg.role === "user"
                    ? "bg-black text-white dark:bg-white dark:text-black rounded-tr-sm shadow-sm"
                    : "bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm shadow-sm"
                }`}
              >
                <p className="leading-relaxed font-normal">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white/50 dark:bg-black/50 sticky bottom-0 border-t border-gray-200 dark:border-gray-800 z-10 backdrop-blur-xl">
          <form
            onSubmit={handleChatSubmit}
            className="flex items-center gap-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-1.5 pr-1.5 focus-within:border-gray-300 dark:focus-within:border-gray-700 shadow-sm transition-all"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 font-normal"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="p-2 rounded-lg bg-black text-white dark:bg-white dark:text-black disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              <Send size={16} strokeWidth={2} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
