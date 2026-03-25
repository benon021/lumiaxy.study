"use client";

import { motion } from "framer-motion";
import StudentSidebar from "@/components/dashboard/Sidebar";
import StudentTopbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-dark-950 flex text-white font-sans selection:bg-brand/30 selection:text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/5 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] right-[-5%] w-[30%] h-[30%] bg-cyan/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
        <StudentTopbar />
        
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    </div>
  );
}
