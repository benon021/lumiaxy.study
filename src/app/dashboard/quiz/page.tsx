"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";

type QuizListItem = {
  id: string;
  title: string;
  description?: string | null;
  teacherName: string;
  teacherCredentials: string | null;
  questionCount: number;
  attemptCount: number;
};

export default function QuizLandingPage() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/quizzes");
        if (!res.ok) return;
        const data = (await res.json()) as QuizListItem[];
        if (!cancelled) setQuizzes(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8 pb-32 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <GraduationCap size={28} className="text-brand" />
          Practice Quiz
        </h1>
        <p className="text-white/40 text-sm">Test your knowledge with instant scoring.</p>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass rounded-3xl h-28 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-20 text-white/20">
          No quizzes available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-[32px] p-6 border border-white/10 hover:border-brand/30 transition-all"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-white truncate">{q.title}</h2>
                  {q.description && <p className="text-sm text-white/40 mt-1 line-clamp-2">{q.description}</p>}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/30 mt-4">
                    <span className="inline-flex items-center gap-1">
                      <BookOpen size={14} />
                      {q.questionCount} questions
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {/* intentionally using same icon style */}
                      Taught by {q.teacherName}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/dashboard/quiz/${q.id}`}
                  className="shrink-0 px-5 py-3 rounded-2xl bg-brand text-white text-sm font-bold hover:scale-[1.02] transition-all shadow-lg"
                >
                  Start
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

