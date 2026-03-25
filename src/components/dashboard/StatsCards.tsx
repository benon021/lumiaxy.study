"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  MessageSquare,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";

const stats = [
  { 
    label: "Courses Completed", 
    value: "12", 
    trend: "+2 this week", 
    icon: CheckCircle2, 
    color: "#10b981",
    bg: "rgba(16, 185, 129, 0.1)"
  },
  { 
    label: "Study Hours", 
    value: "42.5h", 
    trend: "+5.2h from last week", 
    icon: Clock, 
    color: "#6272f1",
    bg: "rgba(98, 114, 241, 0.1)"
  },
  { 
    label: "Learning Streak", 
    value: "8 Days", 
    trend: "New Personal Best!", 
    icon: Flame, 
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.1)"
  },
  { 
    label: "AI Explanations", 
    value: "156", 
    trend: "Top 5% of Students", 
    icon: MessageSquare, 
    color: "#00e5ff",
    bg: "rgba(0, 229, 255, 0.1)"
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 + 0.3 }}
          className="glass rounded-3xl p-6 border border-white/10 hover:border-brand/30 transition-all group relative overflow-hidden shadow-lg"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          
          <div className="flex justify-between items-start mb-6">
            <div 
               className="p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
               style={{ background: stat.bg, color: stat.color, border: `1px solid ${stat.color}30` }}
            >
              <stat.icon size={22} />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-white/30 uppercase tracking-widest">
               Info
               <ArrowUpRight size={10} />
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h3>
            <p className="text-xs font-medium text-white/40">{stat.label}</p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
             <div className="w-4 h-4 rounded-full bg-brand/20 flex items-center justify-center">
                <TrendingUp size={10} className="text-brand" />
             </div>
             <span className="text-[10px] font-bold text-brand uppercase tracking-tighter">{stat.trend}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
