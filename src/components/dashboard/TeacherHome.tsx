"use client";

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, FileText, Star, CheckCircle2, ChevronRight, Activity, Eye, EyeOff, Bell, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import AIOrb from "../ai-orb/AIOrb";
import ActivityFeed from "./ActivityFeed";
import TeacherPostingWizard from "./TeacherPostingWizard";

export default function TeacherHome({ user }: { user: any }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

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
      {/* Posting Modal */}
      <AnimatePresence>
        {isPosting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl relative"
            >
              <button 
                onClick={() => setIsPosting(false)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors z-10"
              >
                <X size={20} />
              </button>
              <TeacherPostingWizard onPostSuccess={() => {
                setTimeout(() => setIsPosting(false), 2000);
              }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="lg:col-span-2 space-y-6">
          <ActivityFeed items={events} loading={eventsLoading} formatRelativeTime={formatRelativeTime} />
          
          {/* Active Students (Forum Tracking) */}
          <div className="glass rounded-[32px] p-8 border border-white/10 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Users className="text-emerald-400" />
                  Active Students (Forum)
               </h3>
               <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Real-time Tracking</span>
            </div>

            <div className="space-y-4">
               {stats?.activeResponders?.length > 0 ? (
                 stats.activeResponders.map((student: any, idx: number) => (
                   <motion.div 
                     key={student.id}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: idx * 0.05 }}
                     className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group/student"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand/20 border border-brand/20 overflow-hidden">
                           {student.avatarUrl ? (
                             <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center font-bold text-brand text-xs">{student.name.charAt(0)}</div>
                           )}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-white group-hover/student:text-brand transition-colors">{student.name}</p>
                           <p className="text-[10px] text-white/40">Responded to: <span className="text-emerald-400">{student.lastThreadTitle}</span></p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-white/20 uppercase">{formatRelativeTime(student.lastRespondedAt)}</p>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 ml-auto mt-1 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <div className="py-12 text-center">
                    <Users size={32} className="mx-auto mb-3 opacity-10" />
                    <p className="text-xs text-white/20 italic">No one has participated in the forum yet today.</p>
                 </div>
               )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-white tracking-tight">Quick Actions</h3>
          </div>

          <button 
            onClick={() => setIsPosting(true)}
            className="w-full text-left group flex items-center gap-4 p-4 rounded-3xl bg-blue-600/10 border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-600/20 transition-all shadow-lg"
          >
            <div className="p-3 rounded-2xl bg-blue-600/20 border border-white/5 group-hover:border-white/20 transition-all">
              <Plus size={20} className="text-blue-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white tracking-tight text-blue-400">Create New Post</h4>
              <p className="text-[11px] text-white/30 font-medium">Notes, Assignments, or Discussions</p>
            </div>
          </button>

          <Link href="/dashboard/teacher/content" className="block">
            {/* ... rest of links ... */}
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
