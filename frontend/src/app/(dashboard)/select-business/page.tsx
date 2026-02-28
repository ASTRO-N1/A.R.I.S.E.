"use client";

import { useBusinessStore } from "@/store/useBusinessStore";
import { useRouter } from "next/navigation";
import { Building2, ShoppingCart, Utensils, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const businessTypes = [
  { id: "retail", name: "Retail Store", icon: ShoppingCart, desc: "Inventory, PoS, and E-commerce" },
  { id: "restaurant", name: "Restaurant", icon: Utensils, desc: "Table management and orders" },
  { id: "agency", name: "Agency", icon: Building2, desc: "Client management and billing" },
  { id: "software", name: "Software / SaaS", icon: Zap, desc: "Subscriptions and metrics" },
];

export default function Home() {
  const router = useRouter();
  const setBusinessType = useBusinessStore((state) => state.setBusinessType);

  const handleSelect = (type: string) => {
    setBusinessType(type);
    router.push("/onboarding");
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-transparent transition-colors duration-300">
      {/* Absolute Header with Theme Toggle */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <ThemeToggle />
      </div>

      <motion.div 
        className="w-full max-w-3xl space-y-12 text-center z-10"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div className="space-y-4" variants={itemVariants}>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-gray-50">
            Arise
          </h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-gray-400 max-w-xl mx-auto font-normal leading-relaxed">
            Select your primary business model to configure your intelligent dashboard environment perfectly.
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={containerVariants}>
          {businessTypes.map((biz) => {
            const Icon = biz.icon;
            return (
              <motion.button
                key={biz.id}
                variants={itemVariants}
                onClick={() => handleSelect(biz.id)}
                className="group relative flex flex-col items-start p-6 bg-white/70 backdrop-blur-md dark:bg-[#0a0a0a]/70 border border-slate-200/60 dark:border-white/5 rounded-2xl hover:bg-white/90 dark:hover:bg-[#111] hover:border-slate-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:hover:shadow-none text-left focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-gray-700"
              >
                <div className="text-slate-700 dark:text-gray-300 mb-4 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-medium text-slate-900 dark:text-gray-100 mb-1 tracking-tight">{biz.name}</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 font-normal">
                  {biz.desc}
                </p>
              </motion.button>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
