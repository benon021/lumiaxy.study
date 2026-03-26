"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, BookOpen, CheckCircle2, Users, Star, Send, X } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  maxScore: number;
  _count: { submissions: number };
}

interface Submission {
  id: string;
  content?: string;
  score?: number;
  feedback?: string;
  submittedAt: string;
  assignment: { title: string; maxScore: number };
  student: { id: string; name: string; email: string };
}

export default function TeacherGradingPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [grading, setGrading] = useState<Submission | null>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/assignments").then((r) => r.json()).then((data) => setAssignments(Array.isArray(data) ? data : []));
    fetch("/api/submissions").then((r) => r.json()).then((data) => { setSubmissions(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const filtered = selectedAssignmentId
    ? submissions.filter((s) => s.assignment?.title && assignments.find((a) => a.id === selectedAssignmentId)?.title === s.assignment.title)
    : submissions;

  const handleGrade = async () => {
    if (!grading) return;
    await fetch("/api/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submissionId: grading.id, score: parseFloat(score), feedback }),
    });
    const updated = await fetch("/api/submissions").then((r) => r.json());
    setSubmissions(updated);
    setGrading(null);
    setScore("");
    setFeedback("");
  };

  return (
    <div className="space-y-8 pb-32">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1">Grading Portal</h1>
        <p className="text-white/40 text-sm">Review student submissions and provide grades and feedback.</p>
      </motion.div>

      {/* Filter by assignment */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedAssignmentId(null)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${!selectedAssignmentId ? "bg-brand border-brand text-white" : "border-white/10 text-white/40 hover:text-white bg-white/5"}`}
        >
          All Submissions ({submissions.length})
        </button>
        {assignments.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelectedAssignmentId(a.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${selectedAssignmentId === a.id ? "bg-brand border-brand text-white" : "border-white/10 text-white/40 hover:text-white bg-white/5"}`}
          >
            {a.title} ({a._count?.submissions || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="glass rounded-2xl h-20 animate-pulse border border-white/5" />)}</div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 text-white/20">No submissions yet.</div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub, i) => (
            <motion.div key={sub.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl p-5 border border-white/10 hover:border-brand/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-white text-sm">{sub.student?.name}</p>
                  <p className="text-[11px] text-white/30">{sub.student?.email}</p>
                  {sub.content && <p className="text-xs text-white/50 mt-2 max-w-lg line-clamp-2">{sub.content}</p>}
                </div>
                <div className="flex items-center gap-3">
                  {sub.score !== null && sub.score !== undefined ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400">
                      {sub.score} pts
                    </span>
                  ) : (
                    <button
                      onClick={() => { setGrading(sub); setScore(""); setFeedback(""); }}
                      className="px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold hover:scale-105 transition-all"
                    >
                      Grade
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Grade Modal */}
      {grading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md glass rounded-3xl p-6 border border-white/10 shadow-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Grade: {grading.student?.name}</h2>
              <button onClick={() => setGrading(null)}><X size={18} className="text-white/40 hover:text-white transition-colors" /></button>
            </div>
            <p className="text-xs text-white/50 mb-4 bg-white/5 p-3 rounded-xl border border-white/10">{grading.content}</p>
            <div className="space-y-3">
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder={`Score out of ${grading.assignment?.maxScore}`}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40"
              />
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Optional feedback for the student..."
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-brand/40"
              />
              <button onClick={handleGrade} className="w-full py-3 rounded-xl bg-brand text-white font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <Send size={16} /> Submit Grade
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
