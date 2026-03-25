"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  MessageSquare, 
  Trophy, 
  BookOpen,
  ArrowRight
} from "lucide-react";

const activities = [
  { 
    type: "paper", 
    label: "Viewed Past Paper", 
    detail: "Biology 2023 - Paper 1", 
    time: "2 hours ago", 
    icon: FileText, 
    color: "#6272f1"
  },
  { 
    type: "ai", 
    label: "Asked AI", 
    detail: "Explain photosynthesis process...", 
    time: "4 hours ago", 
    icon: MessageSquare, 
    color: "#00e5ff"
  },
  { 
    type: "achievement", 
    label: "New Achievement", 
    detail: "7-Day Streak Master!", 
    time: "Yesterday", 
    icon: Trophy, 
    color: "#f59e0b"
  },
  { 
    type: "note", 
    label: "Completed Note", 
    detail: "Introduction to Calculus", 
    time: "Daily Goal", 
    icon: BookOpen, 
    color: "#10b981"
  },
];

export default function ActivityFeed() {
  return (
    <div className="glass rounded-[32px] p-6 border border-white/10 h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-lg font-bold text-white tracking-tight">Recent Activity</h3>
        <button className="text-[10px] font-bold text-brand uppercase tracking-widest hover:text-white transition-colors">Clear All</button>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activities.map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.5 }}
            className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5"
          >
            <div className="p-2 rounded-xl" style={{ background: `${activity.color}10`, color: activity.color }}>
               <activity.icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-white mb-0.5">{activity.label}</p>
               <p className="text-xs text-white/40 truncate">{activity.detail}</p>
            </div>
            <span className="text-[10px] font-medium text-white/20 whitespace-nowrap pt-1">{activity.time}</span>
          </motion.div>
        ))}
      </div>
      
      <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/5 hover:bg-white/5 text-xs font-bold text-white/40 hover:text-white transition-all group">
         View All Activity
         <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
