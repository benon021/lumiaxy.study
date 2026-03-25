"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  FileSearch, 
  Library, 
  GraduationCap,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const actions = [
  { 
    title: "Ask Lumiaxy.ai", 
    desc: "Instant explanations for your doubts", 
    icon: Sparkles, 
    href: "/dashboard/ai", 
    color: "from-brand/20 to-purple-600/20",
    iconColor: "#6272f1"
  },
  { 
    title: "Find Past Papers", 
    desc: "Access thousands of exam patterns", 
    icon: FileSearch, 
    href: "/dashboard/papers", 
    color: "from-cyan-500/20 to-blue-600/20",
    iconColor: "#00e5ff"
  },
  { 
    title: "Study Library", 
    desc: "Browse curated notes and guides", 
    icon: Library, 
    href: "#", 
    color: "from-emerald-500/20 to-teal-600/20",
    iconColor: "#10b981"
  },
  { 
    title: "Practice Quiz", 
    desc: "Test your knowledge with AI", 
    icon: GraduationCap, 
    href: "#", 
    color: "from-amber-500/20 to-orange-600/20",
    iconColor: "#f59e0b"
  },
];

export default function QuickActions() {
  return (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-white tracking-tight">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {actions.map((action, i) => (
          <Link key={action.title} href={action.href}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 + 0.6 }}
              whileHover={{ x: 8 }}
              className="group flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer shadow-lg"
            >
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${action.color} border border-white/5 group-hover:border-white/20 transition-all`}>
                 <action.icon size={20} style={{ color: action.iconColor }} />
              </div>
              <div className="flex-1">
                 <h4 className="text-sm font-bold text-white tracking-tight">{action.title}</h4>
                 <p className="text-[11px] text-white/30 font-medium">{action.desc}</p>
              </div>
              <ArrowRight size={14} className="text-white/10 group-hover:text-white transition-colors group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
