"use client";

import { Suspense, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import toast, { Toaster } from 'react-hot-toast';
import { useBusinessStore } from '@/store/useBusinessStore';

// Note: Using standard Tailwind classes, matching the aesthetic of ARISE
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const syncStateToDb = async (userId: string) => {
      const state = useBusinessStore.getState();
      const inventoryDataToSave = state.inventoryData;
      const businessType = state.businessType;
      const onboardingMode = state.onboardingMode;

      if (!inventoryDataToSave || inventoryDataToSave.length === 0) return true; // nothing to sync

      try {
          const { data: businessRes, error: bErr } = await supabase
              .from('businesses')
              .insert({
                  user_id: userId,
                  business_type: businessType || 'retail',
                  onboarding_mode: onboardingMode
              })
              .select('id')
              .single();
          
          if (bErr) throw bErr;
              
          if (businessRes && inventoryDataToSave) {
              const inventoryInserts = inventoryDataToSave.map((item: any) => ({
                  business_id: businessRes.id,
                  user_id: userId,
                  item_name: item.item,
                  stock: item.stock,
                  price: item.price,
                  restock_time_days: item.restock_time_days || 0,
              }));
              const { data: insertedInventory, error: iErr } = await supabase.from('inventory').insert(inventoryInserts).select('*');
              if (iErr) throw iErr;

              if (insertedInventory) {
                 const salesInserts: any[] = [];
                 inventoryDataToSave.forEach((originalItem: any) => {
                     const dbItem = insertedInventory.find(i => i.item_name === originalItem.item);
                     if (dbItem && originalItem.sales_history && Array.isArray(originalItem.sales_history)) {
                         originalItem.sales_history.forEach((day: any) => {
                             if (day.date && day.sold) {
                                  salesInserts.push({
                                      inventory_id: dbItem.id,
                                      user_id: userId,
                                      quantity: day.sold,
                                      total_price: day.sold * dbItem.price,
                                      sale_date: `${day.date}T12:00:00Z` // Mock timestamp
                                  });
                             }
                         });
                     }
                 });
                 if (salesInserts.length > 0) {
                     const { error: sErr } = await supabase.from('sales').insert(salesInserts);
                     if (sErr) console.error("Sales Mock Insert Error:", sErr);
                 }
              }
          }
          
          state.setInventoryData([]); // Clear memory, fetch from DB on dashboard
          return true;
      } catch (e) {
          console.error("DB Sync failed during auth", e);
          return false;
      }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter email and password");
    
    setIsLoading(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      if (authData?.user) {
         await syncStateToDb(authData.user.id);
      }
      setIsLoading(false);
      toast.success("Welcome back!");
      router.push('/dashboard');
      router.refresh(); 
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter email and password");
    
    setIsLoading(true);
    const { data: authData, error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    } else {
      if (authData?.user) {
         await syncStateToDb(authData.user.id);
      }
      setIsLoading(false);
      toast.success("Account loaded! Proceeding to Dashboard...");
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden transition-colors duration-300 items-center justify-center p-4">
      <Toaster position="top-center" toastOptions={{ 
          style: { background: '#333', color: '#fff', borderRadius: '12px' },
          success: { style: { background: '#10B981', color: '#fff' } },
          error: { style: { background: '#EF4444', color: '#fff' } },
      }} />
      
      

      <div className="w-full max-w-md relative z-10">
        <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black dark:bg-white mb-6">
               <Sparkles className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-slate-900 dark:text-white mb-2">Welcome to ARISE</h1>
            <p className="text-slate-500 dark:text-slate-400">Sign in to your intelligent business dashboard.</p>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200/60 dark:border-white/5 p-8 rounded-3xl shadow-sm">
            <form className="space-y-6 flex flex-col w-full">
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="email">Email address</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#050505] border border-slate-200/60 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-shadow text-slate-900 dark:text-white"
                    placeholder="Enter your email"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#f8f9fa] dark:bg-[#050505] border border-slate-200/60 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-shadow text-slate-900 dark:text-white"
                    placeholder="Enter your password"
                />
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
                <button 
                type="button"
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-black text-white dark:bg-white dark:text-black font-medium text-sm rounded-xl py-3.5 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                {isLoading ? "Signing In..." : "Sign In"}
                <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                type="button"
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full bg-white text-slate-900 border border-gray-200 dark:bg-[#111] dark:text-white dark:border-gray-800 font-medium text-sm rounded-xl py-3.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                Create Account
                </button>
            </div>
            </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-8">Secure authentication via Supabase Auth</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
