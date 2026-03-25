"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Target, Zap } from "lucide-react";

export default function ProgressChart() {
  // Simple bar chart simulation with Framer Motion
  const data = [45, 78, 56, 92, 64, 85, 70];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="glass rounded-[32px] p-8 border border-white/10 shadow-xl h-full relative overflow-hidden group">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-brand/10 transition-all" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-brand" />
              <h3 className="text-lg font-bold text-white tracking-tight">Weekly Performance</h3>
           </div>
           <p className="text-xs text-white/40 font-medium tracking-wide">Based on your activity across all subjects</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-brand" />
              <span className="text-[10px] font-bold text-white/60">Study Hours</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-cyan" />
              <span className="text-[10px] font-bold text-white/60">AI usage</span>
           </div>
        </div>
      </div>
      
      {/* Bars */}
      <div className="flex items-end justify-between h-56 gap-2 md:gap-4 relative px-2">
         {data.map((val, i) => (
           <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
              <div className="relative w-full flex flex-col items-center justify-end h-full">
                 {/* Tooltip */}
                 <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    whileHover={{ opacity: 1, y: -10 }}
                    className="absolute -top-10 px-2 py-1 rounded-lg bg-white text-dark-950 text-[10px] font-bold pointer-events-none z-20"
                 >
                    {val}%
                 </motion.div>
                 
                 {/* Bar Shadow */}
                 <div className="absolute inset-x-0 bottom-0 top-0 bg-white/[0.02] rounded-full group-hover/bar:bg-white/[0.05] transition-all" />
                 
                 {/* Main Bar */}
                 <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: i * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
                    className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-full relative z-10 shadow-[0_0_20px_rgba(98,114,241,0.2)]"
                 >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/40 rounded-full" />
                 </motion.div>
              </div>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{days[i]}</span>
           </div>
         ))}
      </div>
      
      {/* Stats row below chart */}
      <div className="mt-10 grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
         <div>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1">Average</p>
            <p className="text-lg font-bold text-white">72% <span className="text-[10px] text-emerald-400">+5%</span></p>
         </div>
         <div>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1">Peak Day</p>
            <p className="text-lg font-bold text-white">Thursday</p>
         </div>
         <div>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-1">Status</p>
            <p className="text-lg font-bold text-brand">EXCELLENT</p>
         </div>
      </div>
    </div>
  );
}
