"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, UserCheck, BookOpen, Star, Pin } from "lucide-react";
import Link from "next/link";

type TeacherProfileResponse = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  teacherProfile: { credentials: string | null; officeHours: string | null; contactInfo: string | null; status: string } | null;
  followerCount: number;
  materialsCount: number;
  avgRating: number;
  totalRatings: number;
  isFollowing: boolean;
  recentMaterials: Array<{
    id: string;
    title: string;
    type: string;
    isPinned: boolean;
    createdAt: string;
    topicName: string;
    subjectName: string;
  }>;
};

export default function TeacherProfilePage() {
  const params = useParams<{ id: string }>();
  const teacherId = params.id;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TeacherProfileResponse | null>(null);

  useEffect(() => {
    if (!teacherId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/teachers/${teacherId}`);
        if (!res.ok) return;
        const json = (await res.json()) as TeacherProfileResponse;
        if (!cancelled) setData(json);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [teacherId]);

  const toggleFollow = async () => {
    if (!teacherId) return;
    const res = await fetch("/api/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId }),
    });
    const json = await res.json();
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, isFollowing: json?.followed === true };
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-32 px-2">
        <div className="h-24 glass rounded-[32px] border border-white/5 animate-pulse" />
        <div className="h-64 glass rounded-[32px] border border-white/5 animate-pulse" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-20 text-white/20">Teacher not found.</div>;
  }

  const status = data.teacherProfile?.status || "ONLINE";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 px-4 lg:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[48px] border border-white/10 overflow-hidden relative group"
      >
        {/* Cover Image */}
        <div className="h-48 sm:h-64 w-full bg-gradient-to-br from-brand/20 to-purple-600/10 relative">
           {(data as any).coverUrl && (
             <img src={(data as any).coverUrl} alt="Cover" className="w-full h-full object-cover" />
           )}
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-end gap-8 -mt-20 px-8 pb-8">
          <div className="relative group/avatar">
            <div className="w-40 h-40 rounded-[40px] bg-black border-[6px] border-[#0a0a0a] overflow-hidden p-1 shadow-2xl">
              <div className="w-full h-full rounded-[32px] overflow-hidden bg-brand/20 border border-brand/20 flex items-center justify-center text-brand font-black text-5xl">
                {data.avatarUrl ? (
                  <img src={data.avatarUrl} alt={data.name || ""} className="w-full h-full object-cover" />
                ) : (
                  (data.name || "T").slice(0, 1).toUpperCase()
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 pb-2">
            <div className="flex flex-wrap items-center gap-3 mb-2">
               <h1 className="text-4xl font-black text-white tracking-tight truncate">{data.name}</h1>
               <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  status === "ONLINE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-white/40 border-white/10"
               }`}>
                  {status}
               </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-bold text-white/40">
               <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-400" /> {data.avgRating.toFixed(1)} ({data.totalRatings} ratings)</span>
               <span>•</span>
               <span className="flex items-center gap-1.5"><UserPlus size={14} /> {data.followerCount} followers</span>
            </div>
          </div>

          <div className="pb-2">
             <button
               onClick={toggleFollow}
               className={`px-8 py-4 rounded-[24px] text-sm font-black transition-all shadow-2xl border flex items-center gap-2 group/btn ${
                 data.isFollowing
                   ? "bg-brand/20 border-brand/40 text-brand hover:bg-brand/30"
                   : "bg-brand border-brand text-white hover:scale-105 active:scale-95"
               }`}
             >
               {data.isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
               {data.isFollowing ? "FOLLOWING" : "FOLLOW CREATOR"}
             </button>
          </div>
        </div>

        {/* Bio Section */}
        {data.bio && (
           <div className="px-8 pb-8 border-t border-white/5 pt-6">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-1.5 h-4 bg-brand rounded-full" />
                 <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Biography</h3>
              </div>
              <p className="text-base text-white/60 leading-relaxed max-w-3xl italic">
                 "{data.bio}"
              </p>
           </div>
        )}
      </motion.div>

      <div className="glass rounded-[40px] p-8 border border-white/10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen size={18} className="text-brand" />
            Recent Materials
          </h2>
          <Link href="/dashboard/materials" className="text-xs font-bold text-white/40 hover:text-brand transition-colors">
            Browse all
          </Link>
        </div>

        <div className="space-y-3">
          {data.recentMaterials.length === 0 ? (
            <div className="text-white/20 py-8 text-center">No materials yet.</div>
          ) : (
            data.recentMaterials.map((m) => (
              <div
                key={m.id}
                className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{m.title}</p>
                  <p className="text-xs text-white/40 mt-1 truncate">
                    {m.subjectName} • {m.topicName} • {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {m.isPinned && (
                    <div className="p-2 rounded-xl bg-brand/20 border border-brand/30">
                      <Pin size={16} className="text-brand" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

