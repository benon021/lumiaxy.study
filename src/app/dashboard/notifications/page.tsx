"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, BookOpen, Star, UserPlus, Award } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

const iconMap: Record<string, any> = {
  NEW_MATERIAL: BookOpen,
  GRADE_RELEASED: CheckCircle,
  NEW_FOLLOWER: UserPlus,
  DEADLINE_REMINDER: Bell,
};

const colorMap: Record<string, string> = {
  NEW_MATERIAL: "text-brand bg-brand/10 border-brand/20",
  GRADE_RELEASED: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  NEW_FOLLOWER: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  DEADLINE_REMINDER: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((data) => { setNotifications(data); setLoading(false); });
  }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8 pb-32 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
            <Bell className="text-brand" size={28} />
            Notifications
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-lg bg-brand text-white text-xs font-bold">{unreadCount}</span>
            )}
          </h1>
          <p className="text-white/40 text-sm">Stay updated on grades, new content, and platform events.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/40 hover:text-white transition-all">
            Mark all read
          </button>
        )}
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="glass rounded-2xl h-16 animate-pulse border border-white/5" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-24 text-white/20">
          <Bell size={48} className="mx-auto mb-4 opacity-30" />
          <p>You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, i) => {
            const Icon = iconMap[n.type] || Bell;
            const colorCls = colorMap[n.type] || "text-white/40 bg-white/5 border-white/10";
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  n.isRead ? "glass border-white/5 opacity-60" : "glass border-white/10 shadow-md"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorCls}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.isRead ? "text-white/40" : "text-white"}`}>{n.message}</p>
                  <p className="text-[10px] text-white/20 mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
