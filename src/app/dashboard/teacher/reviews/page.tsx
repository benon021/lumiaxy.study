"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Users, TrendingUp } from "lucide-react";

interface Review {
  id: string;
  score: number;
  review?: string;
  createdAt: string;
  rater: { name: string; avatarUrl?: string };
}

export default function TeacherReviewsPage() {
  const [data, setData] = useState<{ ratings: Review[]; average: number; total: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [teacherId, setTeacherId] = useState("");

  useEffect(() => {
    // Fetch current teacher's ID from auth
    fetch("/api/auth/me").then((r) => r.json()).then(async (u) => {
      if (!u.user?.id) return;
      setTeacherId(u.user.id);
      const res = await fetch(`/api/ratings?teacherId=${u.user.id}`);
      const d = await res.json();
      setData(d);
      setLoading(false);
    });
  }, []);

  const renderStars = (score: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < score ? "text-yellow-400 fill-yellow-400" : "text-white/20"} />
    ));

  const distribution = [5, 4, 3, 2, 1].map((s) => ({
    score: s,
    count: data?.ratings.filter((r) => r.score === s).length || 0,
  }));

  if (loading) {
    return (
      <div className="space-y-4 pb-32">
        <div className="glass rounded-3xl h-40 animate-pulse border border-white/5" />
        <div className="glass rounded-3xl h-64 animate-pulse border border-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1">Student Reviews</h1>
        <p className="text-white/40 text-sm">Feedback submitted by your students after assignments and courses.</p>
      </motion.div>

      {/* Summary Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="text-center">
            <p className="text-7xl font-bold text-white">{data?.average || "—"}</p>
            <div className="flex justify-center gap-1 my-2">{renderStars(Math.round(data?.average || 0))}</div>
            <p className="text-white/40 text-sm">{data?.total || 0} reviews</p>
          </div>
          <div className="flex-1 space-y-2 w-full">
            {distribution.map(({ score, count }) => (
              <div key={score} className="flex items-center gap-3">
                <span className="text-xs text-white/40 w-4">{score}</span>
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                    style={{ width: data?.total ? `${(count / data.total) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-xs text-white/30 w-4">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {!data?.ratings.length ? (
          <div className="text-center py-16 text-white/20">
            <MessageSquare size={40} className="mx-auto mb-4 opacity-30" />
            <p>No reviews yet. Students can rate you after completing assignments.</p>
          </div>
        ) : (
          data.ratings.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold text-sm">
                  {r.rater.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{r.rater.name}</p>
                  <div className="flex gap-1">{renderStars(r.score)}</div>
                </div>
                <p className="ml-auto text-[10px] text-white/20">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              {r.review && <p className="text-sm text-white/60 italic">"{r.review}"</p>}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
