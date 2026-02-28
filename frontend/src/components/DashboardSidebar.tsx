"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, Package, Sparkles } from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[80px] md:w-[240px] h-full bg-white dark:bg-[#0a0a0a] border-r border-slate-200/60 dark:border-white/5 flex flex-col items-center md:items-stretch py-6 relative z-20 shadow-sm transition-colors">
      <div className="flex items-center justify-center md:justify-start gap-3 px-0 md:px-6 mb-10">
        <div className="w-10 h-10 rounded-2xl bg-black dark:bg-white flex items-center justify-center shrink-0 shadow-sm">
          <Sparkles size={18} className="text-white dark:text-black" strokeWidth={2} />
        </div>
        <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white hidden md:block">
          ARISE
        </span>
      </div>

      <nav className="flex-1 w-full mt-2">
        <ul className="space-y-2 px-3">
          <li>
            <Link 
              href="/dashboard"
              className={`flex justify-center md:justify-start items-center gap-3 md:px-4 py-3 rounded-xl font-medium transition-all group ${
                pathname === '/dashboard' 
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="w-6 flex justify-center">
                <TrendingUp size={20} className={pathname === '/dashboard' ? '' : 'group-hover:scale-110 transition-transform'} />
              </div>
              <span className="text-[15px] hidden md:block">Overview</span>
            </Link>
          </li>
          
          <li>
            <Link 
              href="/inventory"
              className={`flex justify-center md:justify-start items-center gap-3 md:px-4 py-3 rounded-xl font-medium transition-all group ${
                pathname === '/inventory' 
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="w-6 flex justify-center">
                <Package size={20} className={pathname === '/inventory' ? '' : 'group-hover:scale-110 transition-transform'} />
              </div>
              <span className="text-[15px] hidden md:block">Inventory</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
