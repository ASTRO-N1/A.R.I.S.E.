import { login, signup } from './actions'
import { Sparkles, ArrowRight } from 'lucide-react'

// Note: Using standard Tailwind classes, matching the aesthetic of ARISE
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden dark:bg-black transition-colors duration-300 items-center justify-center p-4">
      {/* Background glow effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black dark:bg-white mb-6">
               <Sparkles className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-gray-900 dark:text-white mb-2">Welcome to ARISE</h1>
            <p className="text-gray-500 dark:text-gray-400">Sign in to your intelligent business dashboard.</p>
        </div>

        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-sm">
            <form className="space-y-6 flex flex-col w-full">
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="email">Email address</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-shadow text-gray-900 dark:text-white"
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
                    className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 transition-shadow text-gray-900 dark:text-white"
                    placeholder="Enter your password"
                />
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
                <button 
                formAction={login}
                className="w-full bg-black text-white dark:bg-white dark:text-black font-medium text-sm rounded-xl py-3.5 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                Sign In
                <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                formAction={signup}
                className="w-full bg-white text-gray-900 border border-gray-200 dark:bg-[#111] dark:text-white dark:border-gray-800 font-medium text-sm rounded-xl py-3.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                Create Account
                </button>
            </div>
            </form>
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">Secure authentication via Supabase Auth</p>
      </div>
    </div>
  )
}
