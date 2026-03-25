"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  ShieldCheck,
  Zap
} from "lucide-react";

const statusItems = [
  { label: "CPU Usage", value: "24%", icon: Cpu, color: "#6272f1" },
  { label: "Database", value: "Healthy", icon: Database, color: "#10b981" },
  { label: "Global CDN", value: "Active", icon: Globe, color: "#00e5ff" },
  { label: "Security", value: "Encrypted", icon: ShieldCheck, color: "gold" },
];

export default function SystemStatus() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      {statusItems.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="glass rounded-2xl p-4 flex items-center gap-4 border border-white/5 hover:border-white/10 transition-all group"
        >
          <div className="p-2 rounded-xl transition-all duration-300 group-hover:scale-110" 
               style={{ background: `${item.color}10`, color: item.color, border: `1px solid ${item.color}20` }}>
            <item.icon size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.label}</p>
            <p className="text-sm font-bold text-white group-hover:text-brand transition-colors">{item.value}</p>
          </div>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </motion.div>
      ))}
      
      {/* Real-time Activity Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="col-span-2 glass rounded-2xl p-5 border border-white/5 mt-2 overflow-hidden relative"
      >
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20">
            <Zap size={14} className="text-brand animate-pulse" />
            <span className="text-[10px] font-bold text-brand uppercase tracking-widest">Fusion Engine Live</span>
          </div>
          <span className="text-[10px] font-bold text-white/20 uppercase">99.9% Uptime</span>
        </div>
        
        <div className="flex items-end gap-1 h-12 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div 
              key={i}
              initial={{ height: 2 }}
              animate={{ height: Math.random() * 40 + 5 }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                repeatType: "reverse", 
                delay: i * 0.05 
              }}
              className="flex-1 bg-brand/30 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
