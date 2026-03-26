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

export type StudentDashboardStats = {
  coursesCompleted: number;
  studyHours: number;
  learningStreakDays: number;
  aiExplanations: number;
  trends: {
    courses: string;
    hours: string;
    streak: string;
    ai: string;
  };
};

type Props = {
  stats: StudentDashboardStats;
  loading?: boolean;
};

export default function StatsCards({ stats, loading }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        {
          label: "Courses Completed",
          value: String(stats.coursesCompleted),
          trend: stats.trends.courses,
          icon: CheckCircle2,
          color: "#10b981",
          bg: "rgba(16, 185, 129, 0.1)",
        },
        {
          label: "Study Hours (est.)",
          value: `${stats.studyHours}h`,
          trend: stats.trends.hours,
          icon: Clock,
          color: "#ff7200",
          bg: "rgba(255, 114, 0, 0.1)",
        },
        {
          label: "Learning Streak",
          value: `${stats.learningStreakDays} Days`,
          trend: stats.trends.streak,
          icon: Flame,
          color: "#f59e0b",
          bg: "rgba(245, 158, 11, 0.1)",
        },
        {
          label: "AI Explanations",
          value: String(stats.aiExplanations),
          trend: stats.trends.ai,
          icon: MessageSquare,
          color: "#00e5ff",
          bg: "rgba(0, 229, 255, 0.1)",
        },
      ].map((stat, i) => (
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
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {loading ? <span className="inline-block w-12 h-6 bg-white/10 rounded animate-pulse" /> : stat.value}
            </h3>
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
