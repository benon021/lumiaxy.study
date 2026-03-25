"use client";

import { motion } from "framer-motion";
import { Flame, Star, Trophy, Target } from "lucide-react";

export default function StreakCalendar() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const streakDays = [1, 2, 4, 5, 6, 7, 8, 12, 13, 14, 20, 21, 22, 23, 24, 25];

  return (
    <div className="glass rounded-[32px] p-8 border border-white/10 shadow-xl relative overflow-hidden h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Flame size={20} className="fill-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">8 Day Streak</h3>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Keep it up, John!</p>
          </div>
        </div>
        
        <div className="flex -space-x-3">
           {[...Array(3)].map((_, i) => (
             <div key={i} className="w-8 h-8 rounded-full border-2 border-dark-900 bg-white/5 flex items-center justify-center text-[10px] font-bold text-white" style={{ background: `hsl(${220 + i * 40}, 60%, 40%)` }}>
                {i + 1}
             </div>
           ))}
           <div className="w-8 h-8 rounded-full border-2 border-dark-900 bg-brand flex items-center justify-center text-[10px] font-bold text-white">+5</div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3 mb-8">
        {["M", "T", "W", "T", "F", "S", "S"].map(d => (
          <div key={d} className="text-center text-[9px] font-bold text-white/10 uppercase mb-2">{d}</div>
        ))}
        {days.map(day => {
          const isStreak = streakDays.includes(day);
          const isToday = day === 25;
          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.1 }}
              className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-bold transition-all relative ${
                isStreak 
                ? "bg-brand text-white shadow-[0_0_15px_rgba(98,114,241,0.4)] border border-brand-400/30" 
                : "bg-white/[0.02] text-white/20 border border-white/[0.04]"
              } ${isToday ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-dark-950" : ""}`}
            >
              {day}
              {isToday && <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full border-2 border-dark-950" />}
            </motion.div>
          );
        })}
      </div>

      <div className="space-y-4 pt-6 border-t border-white/5">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Trophy size={16} className="text-amber-400" />
               <span className="text-xs font-bold text-white/80">Monthly Goal</span>
            </div>
            <span className="text-xs font-bold text-brand">75%</span>
         </div>
         <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "75%" }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="h-full bg-brand rounded-full shadow-[0_0_10px_rgba(98,114,241,0.5)]" 
            />
         </div>
      </div>
    </div>
  );
}
