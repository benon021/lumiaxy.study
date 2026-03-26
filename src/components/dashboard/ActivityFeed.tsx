"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  MessageSquare, 
  Trophy, 
  BookOpen,
  ArrowRight
} from "lucide-react";

type ActivityItem = {
  id: string;
  type: string;
  occurredAt: string;
  label: string;
  detail: string;
};

export default function ActivityFeed({
  items,
  loading,
  formatRelativeTime,
}: {
  items: ActivityItem[];
  loading?: boolean;
  formatRelativeTime: (iso: string) => string;
}) {
  return (
    <div className="glass rounded-[32px] p-6 border border-white/10 h-full flex flex-col shadow-xl">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-lg font-bold text-white tracking-tight">Recent Activity</h3>
        <button className="text-[10px] font-bold text-brand uppercase tracking-widest hover:text-white transition-colors">Clear All</button>
      </div>
      
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-18 glass rounded-2xl border border-white/5 animate-pulse" />
          ))
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-white/20">
            No recent activity yet.
          </div>
        ) : (
          items.map((activity, i) => {
            const isAI = activity.label === "Asked AI";
            const IconComponent =
              isAI
                ? MessageSquare
                : activity.type === "grade"
                  ? Trophy
                  : activity.type === "quiz"
                    ? Trophy
                    : activity.type === "comment"
                      ? MessageSquare
                      : FileText;

            const color =
              isAI ? "#00e5ff" : activity.type === "grade" ? "#f59e0b" : activity.type === "quiz" ? "#ff7200" : activity.type === "comment" ? "#10b981" : "#6272f1";

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5"
              >
                <div className="p-2 rounded-xl" style={{ background: `${color}10`, color }}>
                  <IconComponent size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white mb-0.5">{activity.label}</p>
                  <p className="text-xs text-white/40 truncate">{activity.detail}</p>
                </div>
                <span className="text-[10px] font-medium text-white/20 whitespace-nowrap pt-1">
                  {formatRelativeTime(activity.occurredAt)}
                </span>
              </motion.div>
            );
          })
        )}
      </div>
      
      <button className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/5 hover:bg-white/5 text-xs font-bold text-white/40 hover:text-white transition-all group">
         View All Activity
         <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
