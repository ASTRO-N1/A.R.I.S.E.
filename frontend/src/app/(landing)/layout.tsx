import type { Metadata } from "next";
import "../../styles/landing/index.css";
import "../../styles/landing/App.css";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Arise - Intelligent Inventory",
  description: "Next-generation business dashboard management and AI-powered supply chain optimization.",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 dark:bg-void text-slate-900 dark:text-primary selection:bg-cyan-500/30 transition-colors duration-300">
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
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
