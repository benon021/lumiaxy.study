"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  ChevronDown,
  ArrowUpRight
} from "lucide-react";

export default function RevenueAnalytics() {
  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-4 self-stretch min-h-[300px]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Revenue Analytics</h3>
          <p className="text-xs text-white/40">Revenue breakdown by category</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/60 hover:text-white transition-colors">
          This Quarter
          <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex-1 relative mt-4">
        {/* Simple line/area chart simulation */}
        <div className="absolute inset-0 flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
            <defs>
              <linearGradient id="revenue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6272f1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6272f1" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            <line x1="0" y1="30" x2="100%" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="0" y1="70" x2="100%" y2="70" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <line x1="0" y1="110" x2="100%" y2="110" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            
            {/* Area */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M0,150 Q50,130 100,140 T200,100 T300,120 T400,80 L400,150 L0,150 Z"
              fill="url(#revenue-gradient)"
            />
            
            {/* Path */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M0,150 Q50,130 100,140 T200,100 T300,120 T400,80"
              fill="none"
              stroke="#6272f1"
              strokeWidth="3"
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_rgba(98,114,241,0.5)]"
            />
            
            {/* Data points */}
            <circle cx="200" cy="100" r="4" fill="#6272f1" className="animate-pulse" />
            <circle cx="400" cy="80" r="4" fill="#00e5ff" />
          </svg>
        </div>

        {/* Labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-mono text-white/20 select-none">
          <span>$60k</span>
          <span>$45k</span>
          <span>$30k</span>
          <span>$15k</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-white">$45,280</p>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
            <ArrowUpRight size={14} />
            +24.8%
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/20 uppercase tracking-widest">Growth</span>
            <span className="text-sm font-bold text-white">Stable</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-white/20 uppercase tracking-widest">Target</span>
            <span className="text-sm font-bold text-brand">Reach</span>
          </div>
        </div>
      </div>
    </div>
  );
}
