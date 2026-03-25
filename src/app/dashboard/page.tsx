"use client";

import { motion } from "framer-motion";
import WelcomePanel from "@/components/dashboard/WelcomePanel";
import StatsCards from "@/components/dashboard/StatsCards";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import QuickActions from "@/components/dashboard/QuickActions";

export default function StudentDashboard() {
  return (
    <div className="space-y-10 pb-10">
      {/* Top Section */}
      <WelcomePanel />
      
      {/* Stats Section */}
      <StatsCards />
      
      {/* Grid Section: Activity & Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <ActivityFeed />
        </div>
        <div className="xl:col-span-1">
          <QuickActions />
        </div>
      </div>
      
      {/* Visual Accent */}
      <div className="relative h-64 rounded-[32px] overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-r from-brand/20 to-violet-600/20 mix-blend-overlay" />
         <div className="absolute inset-0 bg-dark-900/40 backdrop-blur-sm border border-white/10 rounded-[32px]" />
         <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Ready for your next challenge?</h2>
            <p className="text-white/40 max-w-md mx-auto mb-6">Explore the latest past papers or start a deep-dive session with Lumiaxy.ai to master your subjects.</p>
            <button className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-brand hover:border-brand transition-all">
               Explore Study Library
            </button>
         </div>
         {/* Animated Background Pulse */}
         <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand rounded-full blur-[100px]"
         />
      </div>
    </div>
  );
}
