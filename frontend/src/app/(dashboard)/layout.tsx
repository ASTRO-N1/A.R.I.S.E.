import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AriseMainDash - Dashboard",
  description: "Next-generation business dashboard management",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-gray-100 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Ambient background glows */}
          <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/25 dark:bg-purple-500/25 rounded-full blur-[120px] pointer-events-none z-0" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 dark:bg-blue-500/25 rounded-full blur-[120px] pointer-events-none z-0" />
          
          {/* Subtle Grid Pattern */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />
          
          <div className="relative z-10 w-full h-full">
             {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
