"use client";

import { motion } from "framer-motion";
import StudentSidebar from "@/components/dashboard/Sidebar";
import StudentTopbar from "@/components/dashboard/Topbar";
import { ThemeProvider } from "@/context/ThemeContext";
import LiquidBackground from "@/components/dashboard/LiquidBackground";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex font-sans selection:bg-brand/30 selection:text-white relative overflow-hidden transition-colors duration-1000 dark:text-white light:text-slate-900">
        <LiquidBackground />

        {/* Sidebar (Responsive Floating Dock) */}
        <StudentSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen relative z-10">
          <StudentTopbar />
          
          <main className="flex-1 w-full relative z-0">
            {children}
          </main>
        </div>

        {/* Global Noise Texture Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-50 mix-blend-overlay">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
      </div>
    </ThemeProvider>
  );
}
