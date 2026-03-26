"use client";

import { motion } from "framer-motion";
import { Users, FileText, Star, CheckCircle2, ChevronRight, Activity, Eye, EyeOff, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import AIOrb from "../ai-orb/AIOrb";
import ActivityFeed from "./ActivityFeed";

export default function TeacherHome({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teacher/stats").then((r) => r.json()).then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetch("/api/teacher/home")
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data?.events) ? data.events : []))
      .finally(() => setEventsLoading(false));
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    setStats({ ...stats, status: newStatus });
    await fetch("/api/teacher/stats", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
  };

  const formatRelativeTime = (iso: string) => {
    const dt = new Date(iso).getTime();
    const now = Date.now();
    const diffMs = now - dt;
    const s = Math.floor(diffMs / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d === 1) return "Yesterday";
    if (d < 7) return `${d} days ago`;
    const w = Math.floor(d / 7);
    return `${w}w ago`;
  };

  const statusColors: any = {
    ONLINE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    OFFLINE: "bg-white/5 text-white/40 border-white/10",
    PRIVATE: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  };

  if (loading) return <div className="p-8 animate-pulse space-y-4"><div className="h-32 glass rounded-3xl"/><div className="h-64 glass rounded-3xl"/></div>;

  return (
    <div className="space-y-8 p-4 lg:p-8 max-w-6xl mx-auto pb-32">
      {/* Header and Status Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 glass p-8 rounded-[32px] border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] group-hover:bg-brand/10 transition-colors" />
        
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden">
               <AIOrb size={80} state="idle" reactive={false} className="opacity-50" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Instructor Dashboard</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">Welcome, {user.name}</h1>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 glass p-1.5 rounded-2xl border border-white/5 flex gap-1">
           {["ONLINE", "OFFLINE", "PRIVATE"].map((s) => (
             <button
               key={s}
               onClick={() => handleStatusChange(s)}
               className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${stats.status === s ? statusColors[s] + " shadow-xl" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}
             >
               {s === "ONLINE" && <Activity size={14} />}
               {s === "PRIVATE" && <EyeOff size={14} />}
               {s === "OFFLINE" && <Eye size={14} />}
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Followers", value: stats.followers, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { label: "Active Materials", value: stats.materials, icon: FileText, color: "text-brand", bg: "bg-brand/10 border-brand/20" },
          { label: "Ungraded Submissions", value: stats.totalSubmissions, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Average Rating", value: `${stats.avgRating} / 5.0`, sub: `(${stats.totalRatings} user reviews)`, icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-3xl p-6 border border-white/10 hover:bg-white/5 transition-all">
            <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center mb-4 ${stat.bg} ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs font-bold tracking-wide text-white/40">{stat.label}</p>
            {stat.sub && <p className="text-[10px] text-white/20 mt-1">{stat.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed items={events} loading={eventsLoading} formatRelativeTime={formatRelativeTime} />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Quick Actions</h3>
          </div>

          <Link href="/dashboard/teacher/content" className="block">
            <div className="group flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all shadow-lg">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-brand/20 to-purple-600/20 border border-white/5 group-hover:border-white/20 transition-all">
                <FileText size={20} className="text-brand" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white tracking-tight">Manage Content</h4>
                <p className="text-[11px] text-white/30 font-medium">Upload materials and resources</p>
              </div>
              <ChevronRight size={14} className="text-white/10 group-hover:text-white transition-colors group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/dashboard/teacher/grading" className="block">
            <div className="group flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all shadow-lg">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-white/5 group-hover:border-white/20 transition-all">
                <CheckCircle2 size={20} className="text-emerald-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white tracking-tight">Grade Submissions</h4>
                <p className="text-[11px] text-white/30 font-medium">Review and score student work</p>
              </div>
              <ChevronRight size={14} className="text-white/10 group-hover:text-white transition-colors group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/dashboard/teacher/reviews" className="block">
            <div className="group flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all shadow-lg">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-white/5 group-hover:border-white/20 transition-all">
                <Star size={20} className="text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white tracking-tight">Reviews</h4>
                <p className="text-[11px] text-white/30 font-medium">See how students rate you</p>
              </div>
              <ChevronRight size={14} className="text-white/10 group-hover:text-white transition-colors group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link href="/dashboard/notifications" className="block">
            <div className="group flex items-center gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all shadow-lg">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-white/5 group-hover:border-white/20 transition-all">
                <Bell size={20} className="text-cyan-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white tracking-tight">Notifications</h4>
                <p className="text-[11px] text-white/30 font-medium">Followers, grades, updates</p>
              </div>
              <ChevronRight size={14} className="text-white/10 group-hover:text-white transition-colors group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
