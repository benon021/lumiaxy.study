"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
};

type QuizDetail = {
  id: string;
  title: string;
  description?: string | null;
  teacherName: string;
  teacherCredentials: string | null;
  questions: QuizQuestion[];
};

export default function QuizAttemptPage() {
  const params = useParams<{ quizId: string }>();
  const quizId = params.quizId;

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!quizId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (!res.ok) return;
        const data = (await res.json()) as QuizDetail;
        if (!cancelled) setQuiz(data);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [quizId]);

  const canSubmit = useMemo(() => {
    if (!quiz) return false;
    return quiz.questions.length > 0;
  }, [quiz]);

  const handleSubmit = async () => {
    if (!quizId || !quiz) return;
    setSubmitting(true);
    setScore(null);
    try {
      const answers = quiz.questions.map((_, idx) => selected[idx] ?? -1);
      const res = await fetch("/api/quizzes/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, answers }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to submit quiz");
      setScore(Number(data.score));
    } catch (e) {
      setScore(0);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-32 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard/quiz"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-bold"
        >
          <ArrowLeft size={16} />
          Back to quizzes
        </Link>
        {score !== null && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white/80">
            {score >= 70 ? <CheckCircle2 size={16} className="text-emerald-400" /> : <XCircle size={16} className="text-amber-400" />}
            Score: {Math.round(score)}%
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass rounded-[32px] h-28 border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : !quiz ? (
        <div className="text-center py-20 text-white/20">Quiz not found.</div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
              <GraduationCap size={28} className="text-brand" />
              {quiz.title}
            </h1>
            {quiz.description && <p className="text-white/40 text-sm">{quiz.description}</p>}
            <p className="text-white/30 text-xs font-bold mt-2">
              Taught by {quiz.teacherName}
              {quiz.teacherCredentials ? ` • ${quiz.teacherCredentials}` : ""}
            </p>
          </motion.div>

          <div className="space-y-6">
            {quiz.questions.map((q, idx) => {
              const selectedOption = selected[idx];
              const showCorrect = score !== null;
              const correctOption = q.correctOption;
              return (
                <div key={q.id} className="glass rounded-[32px] p-6 border border-white/10">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-bold text-white/90">
                      Q{idx + 1}. {q.text}
                    </p>
                    {showCorrect && (
                      <div className="text-xs font-bold px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-white/50">
                        {selectedOption === correctOption ? "Correct" : "Review"}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOption === optIdx;
                      const isCorrect = optIdx === correctOption;
                      const bg =
                        showCorrect && isCorrect
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                          : showCorrect && isSelected && !isCorrect
                            ? "bg-amber-500/15 border-amber-500/30 text-amber-200"
                            : isSelected
                              ? "bg-brand/15 border-brand/30 text-brand"
                              : "bg-white/[0.02] border-white/10 text-white/80";

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={showCorrect || submitting}
                          onClick={() => setSelected((prev) => ({ ...prev, [idx]: optIdx }))}
                          className={`w-full text-left px-4 py-3 rounded-2xl border transition-all hover:brightness-110 ${bg}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="flex-1 py-3 rounded-2xl bg-brand text-white text-sm font-bold hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg disabled:opacity-60 disabled:hover:scale-100"
            >
              {submitting ? "Scoring..." : score === null ? "Submit Quiz" : "Retake Quiz"}
            </button>
            <button
              onClick={() => {
                setSelected({});
                setScore(null);
                setSubmitting(false);
              }}
              className="px-5 py-3 rounded-2xl border border-white/10 text-white/50 text-sm font-bold hover:text-white hover:bg-white/5 transition-all"
            >
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
}

