"use client";

import { motion } from "framer-motion";
import { 
  Users, UserCheck, Shield, GraduationCap,
  Trash2, ShieldAlert, ShieldCheck, Search, Filter,
  MoreVertical, Mail, Calendar, Activity, Loader2
} from "lucide-react";
import { useState, useEffect } from "react";

export default function UserManagement() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/users?action=stats");
      const data = await res.json();
      if (data.success) {
        setStats([
          { label: "Total Users", value: data.stats.totalUsers, icon: Users, color: "#6272f1" },
          { label: "Students", value: data.stats.students, icon: GraduationCap, color: "#10b981" },
          { label: "Teachers", value: data.stats.teachers, icon: UserCheck, color: "#f59e0b" },
          { label: "Admins", value: data.stats.admins, icon: Shield, color: "#ef4444" },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Users List
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole })
      });
      if (res.ok) {
        fetchStats();
        fetchUsers();
      }
    } catch (err) {
      console.error("Role update failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center gap-4">
        <Loader2 size={32} className="animate-spin text-brand" />
        <p className="text-white/40">Loading Shard Directory...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 self-stretch">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-white tracking-tight">Platform Matrix</h2>
        <p className="text-white/40 text-sm">Real-time surveillance and structural manipulation.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s: any, i: number) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-[24px] p-6 group flex flex-col gap-4 border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <s.icon size={80} style={{ color: s.color }} />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all text-white/40 group-hover:text-white backdrop-blur-md">
                  <s.icon size={22} style={{ color: s.color }} />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{s.label}</span>
                </div>
              </div>
              <h3 className="text-4xl font-bold text-white tracking-tighter group-hover:translate-x-1 transition-transform relative z-10">{s.value}</h3>
            </motion.div>
          ))}
        </div>
      )}

      {/* Directory Table */}
      <div className="glass rounded-[32px] p-8 space-y-6 border border-white/10 mt-4 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-bold text-white flex items-center gap-3">
             <Activity size={20} className="text-brand"/> User Directory Log
           </h3>
           <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
             <input type="text" placeholder="Search matrices..." className="bg-black/40 border border-white/10 rounded-xl py-2 pl-12 pr-4 text-sm text-white focus:border-brand/50 outline-none w-64 transition-all" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="pb-4 text-[10px] font-bold text-white/30 uppercase tracking-widest px-4">Entity</th>
                <th className="pb-4 text-[10px] font-bold text-white/30 uppercase tracking-widest px-4">Contact</th>
                <th className="pb-4 text-[10px] font-bold text-white/30 uppercase tracking-widest px-4">Clearance</th>
                <th className="pb-4 text-[10px] font-bold text-white/30 uppercase tracking-widest px-4">Created</th>
                <th className="pb-4 text-[10px] font-bold text-white/30 uppercase tracking-widest px-4 text-right">Overrides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center font-bold text-brand text-xs">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-brand transition-colors">{u.name}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-white/40">{u.email}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-widest border ${
                      u.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      u.role === 'TEACHER' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs text-white/30">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-right">
                    <select 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-black/40 border border-white/10 text-xs font-bold text-white/70 rounded-lg px-2 py-1 outline-none hover:border-brand/30 transition-all cursor-pointer"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-10 text-sm text-white/30">No entities found in standard execution.</div>
          )}
        </div>
      </div>
    </div>
  );
}
