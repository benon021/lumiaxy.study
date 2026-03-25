"use client";

import { motion } from "framer-motion";
import ProgressChart from "@/components/dashboard/ProgressChart";
import StreakCalendar from "@/components/dashboard/StreakCalendar";
import { BarChart3, Target, Award, Plus, ArrowRight } from "lucide-react";

const subjects = [
  { name: "Biology", progress: 85, color: "#10b981", icon: Award },
  { name: "Mathematics", progress: 62, color: "#6272f1", icon: Award },
  { name: "Physics", progress: 45, color: "#00e5ff", icon: Award },
  { name: "History", progress: 91, color: "#f59e0b", icon: Award },
];

export default function ProgressPage() {
  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
         <div className="space-y-2">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-2">
              <BarChart3 size={12} />
              Performance Lab
           </div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Your Learning Progress</h1>
           <p className="text-base text-white/40 max-w-lg">
              Analyze your performance trends and track your journey to academic excellence.
           </p>
         </div>
         
         <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand text-white text-sm font-bold hover:scale-105 transition-all shadow-xl">
            <Target size={18} />
            Set New Weekly Goal
         </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         <div className="xl:col-span-2">
            <ProgressChart />
         </div>
         <div className="xl:col-span-1">
            <StreakCalendar />
         </div>
      </div>

      {/* Subject Performance Grid */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-white tracking-tight">Subject Mastery</h3>
            <button className="text-xs font-bold text-brand hover:text-white transition-colors">Manage Subjects</button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((sub, i) => (
              <motion.div
                key={sub.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.6 }}
                className="glass rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all group shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                   <div className="p-3 rounded-2xl bg-white/5 text-white/30 group-hover:bg-white/10 group-hover:text-white transition-all">
                      <sub.icon size={20} />
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Level</p>
                      <p className="text-xs font-bold text-white">Advanced</p>
                   </div>
                </div>
                
                <h4 className="text-lg font-bold text-white mb-4 tracking-tight">{sub.name}</h4>
                
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span className="text-white/40 text-xs">Progress</span>
                      <span style={{ color: sub.color }}>{sub.progress}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sub.progress}%` }}
                        transition={{ duration: 1, delay: i * 0.1 + 1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: sub.color, boxShadow: `0 0 10px ${sub.color}40` }}
                      />
                   </div>
                </div>
              </motion.div>
            ))}
            
            {/* Add Subject Card */}
            <button className="glass rounded-3xl p-6 border border-dashed border-white/10 hover:border-brand/50 hover:bg-brand/5 transition-all flex flex-col items-center justify-center gap-3 group text-white/20 hover:text-brand">
               <div className="w-12 h-12 rounded-full border border-dashed border-white/20 group-hover:border-brand/50 flex items-center justify-center">
                  <Plus size={24} />
               </div>
               <span className="text-xs font-bold uppercase tracking-widest">Add Subject</span>
            </button>
         </div>
      </div>
      
      {/* Footer Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[32px] p-8 border border-white/10 bg-gradient-to-r from-brand/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-8"
      >
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center shadow-[0_10px_30px_rgba(98,114,241,0.4)]">
               <Award size={32} className="text-white" />
            </div>
            <div>
               <h3 className="text-xl font-bold text-white">Top 1% Achievement Unlocked!</h3>
               <p className="text-sm text-white/40">You're statistically performing better than 99% of students this month.</p>
            </div>
         </div>
         <button className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-white text-dark-950 text-sm font-bold hover:scale-105 transition-all">
            Claim Rewards
            <ArrowRight size={18} />
         </button>
      </motion.div>
    </div>
  );
}
