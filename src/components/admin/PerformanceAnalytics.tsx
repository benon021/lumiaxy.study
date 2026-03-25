"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Settings, 
  MoreHorizontal,
  ChevronDown
} from "lucide-react";

export default function PerformanceAnalytics() {
  const categories = [
    { label: "User Engagement", value: 84, color: "#10b981" },
    { label: "Response Time", value: 78, color: "#6272f1" },
  ];

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-6 self-stretch">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Insights</h3>
          <p className="text-xs text-white/40">Performance analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
            <Settings size={16} />
          </button>
          <button className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/[0.05] rounded-xl self-start">
        <button className="px-4 py-1.5 rounded-lg bg-white/5 text-xs font-semibold text-white/40 hover:text-white transition-all">
          Perfor...
        </button>
        <button className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white/40 hover:text-white transition-all flex items-center gap-2">
          <TrendingUp size={14} />
          Trends
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-8 py-4">
        {/* Large Circular Progress */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              initial={{ strokeDasharray: "0, 283" }}
              animate={{ strokeDasharray: "241, 283" }} // 85%
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#performance-gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_rgba(98,114,241,0.5)]"
            />
            <defs>
              <linearGradient id="performance-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6272f1" />
                <stop offset="100%" stopColor="#00e5ff" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold font-display text-white">85%</span>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">Average</span>
          </div>
        </div>

        {/* Small Progress Bars */}
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.label} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-medium text-white/60">{cat.label}</span>
                <span className="text-xs font-bold text-white">{cat.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.value}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
