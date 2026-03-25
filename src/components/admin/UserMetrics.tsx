"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";

const metrics = [
  { 
    label: "Total Projects", 
    value: "48", 
    change: "+12.5%", 
    isPositive: true,
    icon: Briefcase,
    color: "#6272f1",
    sparkline: [20, 40, 30, 50, 45, 60, 55]
  },
  { 
    label: "Active Users", 
    value: "1,248", 
    change: "+18.2%", 
    isPositive: true,
    icon: Users,
    color: "#10b981",
    sparkline: [40, 30, 45, 50, 60, 70, 85]
  },
  { 
    label: "Task Completion", 
    value: "92%", 
    change: "-2.4%", 
    isPositive: false,
    icon: CheckCircle2,
    color: "#8b5cf6",
    sparkline: [80, 85, 90, 88, 92, 90, 89]
  },
  { 
    label: "Avg. Response", 
    value: "1.2h", 
    change: "-15.0%", 
    isPositive: true, // Improvement in response time is positive
    icon: Clock,
    color: "#00e5ff",
    sparkline: [2.1, 1.9, 1.8, 1.6, 1.4, 1.3, 1.2]
  },
];

export default function UserMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="glass rounded-2xl p-5 card-hover group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110`} 
                 style={{ background: `${m.color}15`, color: m.color, border: `1px solid ${m.color}25` }}>
              <m.icon size={20} />
            </div>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
              m.isPositive 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
              {m.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {m.change}
            </div>
          </div>
          
          <div>
            <p className="text-xs font-medium text-white/40 mb-1">{m.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold font-display text-white">{m.value}</h3>
              {/* Sparkline simulation */}
              <div className="flex items-end gap-0.5 h-6 mb-1 ml-auto">
                {m.sparkline.map((val, idx) => (
                  <div 
                    key={idx}
                    className="w-1 rounded-full bg-current opacity-20 group-hover:opacity-60 transition-all duration-500"
                    style={{ 
                      height: `${(val / Math.max(...m.sparkline)) * 100}%`,
                      color: m.color,
                      transitionDelay: `${idx * 50}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
