"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar
} from "lucide-react";

export default function UserManagement() {
  const stats = [
    { label: "Total Users", value: 46, icon: Users, color: "#6272f1" },
    { label: "Deleted Users", value: 13, icon: Trash2, color: "#ef4444" },
    { label: "Unverified Users", value: 34, icon: ShieldAlert, color: "#f59e0b" },
    { label: "Verified Users", value: 12, icon: ShieldCheck, color: "#10b981" },
  ];

  return (
    <div className="flex flex-col gap-6 self-stretch">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white">Deleted Users</h2>
        <p className="text-white/40 text-sm">Manage deleted users and restore accounts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5 group flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all text-white/40 group-hover:text-white">
                <s.icon size={20} />
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{s.label}</span>
                <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-current opacity-20" style={{ width: "60%", color: s.color }} />
                </div>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white font-display tracking-tight group-hover:translate-x-1 transition-transform">{s.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-3xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Filter by username" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Filter by email" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Phone</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Filter by phone" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">First Name</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Filter by first name" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">Last Name</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Filter by last name" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40 transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/60 uppercase tracking-widest ml-1">From Date</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                <Calendar size={18} />
              </div>
              <input 
                type="text" 
                placeholder="YYYY-MM-DD" 
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
