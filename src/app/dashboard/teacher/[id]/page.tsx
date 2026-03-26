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
    <div className="max-w-4xl mx-auto space-y-8 pb-32 px-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[40px] p-8 border border-white/10 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5 min-w-0">
            <div className="w-16 h-16 rounded-[32px] bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold text-2xl shrink-0">
              {(data.name || "T").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-white tracking-tight truncate">{data.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/40 font-bold">
                <span className="inline-flex items-center gap-2">
                  <Star size={14} className="text-yellow-400" />
                  {data.avgRating.toFixed(1)} ({data.totalRatings})
                </span>
                <span>{status}</span>
              </div>
              {data.teacherProfile?.credentials && (
                <p className="text-sm text-white/40 mt-2">{data.teacherProfile.credentials}</p>
              )}
              {data.bio && <p className="text-sm text-white/50 mt-3 leading-relaxed">{data.bio}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <button
              onClick={toggleFollow}
              className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg border ${
                data.isFollowing
                  ? "bg-brand/20 border-brand/40 text-brand hover:bg-brand/30"
                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              {data.isFollowing ? (
                <span className="inline-flex items-center gap-2">
                  <UserCheck size={16} />
                  Following
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <UserPlus size={16} />
                  Follow
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 text-xs text-white/30 font-bold">
              <span>{data.followerCount} followers</span>
              <span>•</span>
              <span>{data.materialsCount} materials</span>
            </div>
          </div>
        </div>
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

