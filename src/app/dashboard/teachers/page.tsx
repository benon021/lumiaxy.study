"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, Users, BookOpen, UserCheck, UserPlus } from "lucide-react";
import Link from "next/link";

interface Teacher {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  avgRating: number;
  totalRatings: number;
  teacherProfile?: { credentials?: string; officeHours?: string; contactInfo?: string };
  _count: { followedBy: number; materials: number };
}

export default function TeacherDirectoryPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(() => fetchTeachers(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchTeachers = async (q: string) => {
    setLoading(true);
    const res = await fetch(`/api/teachers?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setTeachers(data);
    setLoading(false);
  };

  const toggleFollow = async (teacherId: string) => {
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId }),
    });
    const data = await res.json();
    setFollowing((prev) => ({ ...prev, [teacherId]: data.followed }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-white/20"}
      />
    ));
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1">Teacher Directory</h1>
        <p className="text-white/40 text-sm">Find and follow teachers to access their study materials and topics.</p>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, subject, or credential..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40 transition-all"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-3xl p-6 border border-white/5 animate-pulse h-48" />
          ))}
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-24 text-white/30">No teachers found matching "{query}"</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {teachers.map((teacher, i) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-3xl p-6 border border-white/10 hover:border-brand/30 transition-all group relative overflow-hidden"
            >
              {/* Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand/10 transition-all" />
              
              <div className="relative z-10">
                {/* Avatar & Name */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold text-lg">
                      {teacher.name?.[0]?.toUpperCase() || "T"}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{teacher.name}</h3>
                      <p className="text-white/40 text-[11px]">{teacher.teacherProfile?.credentials || "Educator"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFollow(teacher.id)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                      following[teacher.id]
                        ? "bg-brand/20 border-brand/40 text-brand"
                        : "bg-white/5 border-white/10 text-white/40 hover:border-brand/40 hover:text-brand"
                    }`}
                  >
                    {following[teacher.id] ? <UserCheck size={16} /> : <UserPlus size={16} />}
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {renderStars(teacher.avgRating)}
                    <span className="text-[11px] text-white/40 ml-1">{teacher.avgRating} ({teacher.totalRatings})</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-white/40">
                  <span className="flex items-center gap-1"><Users size={12} /> {teacher._count.followedBy} followers</span>
                  <span className="flex items-center gap-1"><BookOpen size={12} /> {teacher._count.materials} materials</span>
                </div>

                {teacher.teacherProfile?.officeHours && (
                  <p className="text-[11px] text-white/30 mt-3 truncate">🕐 {teacher.teacherProfile.officeHours}</p>
                )}

                <Link href={`/dashboard/teacher/${teacher.id}`} className="mt-4 block text-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/60 hover:bg-brand hover:text-white hover:border-brand transition-all">
                  View Profile & Materials
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
