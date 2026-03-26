"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Calendar, CheckCircle2, Clock, Send } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  maxScore: number;
  teacher: { name: string };
  _count: { submissions: number };
}

interface Submission {
  id: string;
  assignmentId: string;
  content?: string;
  score?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/assignments").then((r) => r.json()),
      fetch("/api/submissions").then((r) => r.json()),
    ]).then(([a, s]) => {
      setAssignments(Array.isArray(a) ? a : []);
      setSubmissions(Array.isArray(s) ? s : []);
      setLoading(false);
    });
  }, []);

  const getSubmission = (id: string) => submissions.find((s) => s.assignmentId === id);

  const handleSubmit = async () => {
    if (!selected || !answer.trim()) return;
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId: selected.id, content: answer }),
    });
    const updated = await fetch("/api/submissions").then((r) => r.json());
    setSubmissions(updated);
    setAnswer("");
    setSelected(null);
  };

  const isOverdue = (dueDate?: string) => dueDate && new Date(dueDate) < new Date();
  const isDueSoon = (dueDate?: string) => {
    if (!dueDate) return false;
    const diff = new Date(dueDate).getTime() - Date.now();
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="space-y-8 pb-32">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1">Assignments</h1>
        <p className="text-white/40 text-sm">Track your homework, submissions, and grades.</p>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="glass rounded-3xl h-24 animate-pulse border border-white/5" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((a, i) => {
            const sub = getSubmission(a.id);
            const overdue = isOverdue(a.dueDate);
            const soon = isDueSoon(a.dueDate);
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-3xl p-6 border border-white/10 hover:border-brand/30 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <ClipboardList size={18} className="text-brand" />
                      <h3 className="font-bold text-white">{a.title}</h3>
                      {sub && sub.score !== null && sub.score !== undefined ? (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                          Graded: {sub.score}/{a.maxScore}
                        </span>
                      ) : sub ? (
                        <span className="px-2 py-0.5 rounded-lg bg-brand/20 border border-brand/30 text-[10px] font-bold text-brand">
                          Submitted
                        </span>
                      ) : overdue ? (
                        <span className="px-2 py-0.5 rounded-lg bg-red-500/20 border border-red-500/30 text-[10px] font-bold text-red-400">
                          Overdue
                        </span>
                      ) : soon ? (
                        <span className="px-2 py-0.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-[10px] font-bold text-yellow-400">
                          Due Soon
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-white/50 mb-3">{a.description}</p>
                    <div className="flex items-center gap-4 text-xs text-white/30">
                      <span>By {a.teacher?.name}</span>
                      {a.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Due: {new Date(a.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span>Max: {a.maxScore} pts</span>
                    </div>
                    {sub?.feedback && (
                      <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                        💬 Teacher feedback: {sub.feedback}
                      </div>
                    )}
                  </div>
                  {!sub && (
                    <button
                      onClick={() => setSelected(a)}
                      className="ml-4 px-4 py-2 rounded-xl bg-brand text-white text-xs font-bold hover:scale-105 transition-all shadow-lg"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Submit Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg glass rounded-3xl p-6 border border-white/10 shadow-3xl"
          >
            <h2 className="text-lg font-bold text-white mb-1">Submit: {selected.title}</h2>
            <p className="text-white/40 text-xs mb-4">{selected.description}</p>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer or notes here..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-brand/40"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setSelected(null)} className="flex-1 py-2 rounded-xl border border-white/10 text-white/40 text-sm hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button onClick={handleSubmit} className="flex-1 py-2 rounded-xl bg-brand text-white text-sm font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <Send size={16} /> Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
