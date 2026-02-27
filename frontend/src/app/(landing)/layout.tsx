import type { Metadata } from "next";
import "../../styles/landing/index.css";
import "../../styles/landing/App.css";

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
    <html lang="en" data-theme="dark">
      <body className="antialiased bg-void text-primary selection:bg-cyan-500/30">
        {children}
      </body>
    </html>
  );
}
