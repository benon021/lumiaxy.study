"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, AlertCircle, FileText, ChevronLeft, Upload, Sparkles } from "lucide-react";
import Link from "next/link";

export default function StudentAssignmentsClient() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submissionForms, setSubmissionForms] = useState<Record<string, { content: string, fileUrl: string }>>({});

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      if (data.success) {
        setAssignments(data.assignments);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (assignmentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Attachment too large! Max 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSubmissionForms(prev => ({
        ...prev,
        [assignmentId]: { ...prev[assignmentId], fileUrl: reader.result as string }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (assignmentId: string) => {
    const data = submissionForms[assignmentId];
    if (!data || (!data.content && !data.fileUrl)) return;

    setSubmittingId(assignmentId);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId, content: data.content, fileUrl: data.fileUrl })
      });
      if (res.ok) {
        fetchAssignments();
      }
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8 pb-32">
      <div className="h-8 w-48 bg-white/5 animate-pulse rounded-lg mb-8" />
      <div className="space-y-6">
        {[1,2,3].map(i => <div key={i} className="h-48 glass rounded-[32px] animate-pulse" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8 pb-32">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
         <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
         Back to Dashboard
      </Link>

      <div>
         <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 mb-2">
           <Target className="text-purple-400" size={28} /> Active Assignments
         </h1>
         <p className="text-white/40">Complete your modules and track your grades effortlessly.</p>
      </div>

      <div className="space-y-6 mt-8">
         {assignments.length === 0 ? (
           <div className="p-12 text-center border border-white/5 rounded-[32px] glass text-white/40 text-sm">
             You have no active assignments. Enjoy the extra free time!
           </div>
         ) : assignments.map(a => {
           const sub = a.submissions?.[0];
           const isGraded = sub?.score !== null && sub?.score !== undefined;
           const type = a.type || "TEXT";
           
           return (
             <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[32px] p-6 border border-white/10 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                <div className="flex-1 space-y-4 relative z-10 w-full">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold tracking-widest uppercase border border-purple-500/20">
                       {a.maxScore} PTS
                    </div>
                    <div className="inline-flex px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-bold tracking-widest uppercase border border-white/10">
                       {type}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{a.title}</h3>
                    <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{a.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold text-white/30 uppercase tracking-widest pt-4">
                     <span className="text-white/50">{a.teacher?.name}</span>
                     {a.dueDate && (
                       <>
                         <span>•</span>
                         <span className={new Date(a.dueDate) < new Date() ? "text-red-400" : ""}>
                           Due: {new Date(a.dueDate).toLocaleDateString()}
                         </span>
                       </>
                     )}
                     {a.topic?.subject && (
                       <>
                         <span>•</span>
                         <span className="text-brand/60">{a.topic.subject.name}</span>
                       </>
                     )}
                  </div>
                </div>

                <div className="w-full md:w-96 shrink-0 relative z-10">
                   {isGraded ? (
                     <div className="glass p-6 rounded-[24px] border border-emerald-500/30 bg-emerald-500/5">
                        <div className="flex items-center gap-3 text-emerald-400 mb-4">
                           <CheckCircle2 size={24} />
                           <h4 className="font-bold text-lg">Graded</h4>
                        </div>
                        <div className="text-4xl font-black text-white mb-2">{sub.score} <span className="text-lg text-white/30 font-medium">/ {a.maxScore}</span></div>
                        {sub.feedback && (
                          <div className="mt-4 pt-4 border-t border-emerald-500/20">
                             <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/50 mb-1">Educator Feedback</p>
                             <p className="text-sm text-white/70">{sub.feedback}</p>
                          </div>
                        )}
                     </div>
                   ) : sub ? (
                     <div className="glass p-6 rounded-[24px] border border-amber-500/30 bg-amber-500/5">
                        <div className="flex items-center gap-3 text-amber-400 mb-4">
                           <AlertCircle size={24} />
                           <h4 className="font-bold text-lg">In Review</h4>
                        </div>
                        <p className="text-sm text-white/60 mb-4">Submitted on {new Date(sub.submittedAt).toLocaleDateString()}. Educator review pending.</p>
                        
                        <div className="p-3 bg-black/20 rounded-xl border border-white/5 line-clamp-2 text-xs text-white/40 font-mono">
                           {sub.fileUrl ? "Document Attachment Provided" : (sub.content || "Submission details in review")}
                        </div>
                     </div>
                   ) : (
                     <div className="glass p-6 rounded-[24px] border border-white/10 bg-black/40">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                          {type === "MCQ" ? <Sparkles size={18} className="text-brand"/> : <Upload size={18} className="text-brand"/>} 
                          {type === "MCQ" ? "Begin Quiz" : "Your Submission"}
                        </h4>
                        
                        <div className="space-y-4">
                           {type === "MCQ" ? (
                             <div className="space-y-4">
                               <p className="text-xs text-white/40">Take this automated quiz to receive an instant grade.</p>
                               <button 
                                 className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-600 active:scale-95 transition-all shadow-xl"
                               >
                                 Start Exercise
                               </button>
                             </div>
                           ) : (
                              <>
                                 {(type === "TEXT" || type === "HYBRID") && (
                                   <textarea
                                     placeholder="Type your response..."
                                     rows={3}
                                     value={submissionForms[a.id]?.content || ""}
                                     onChange={e => setSubmissionForms(p => ({ ...p, [a.id]: { ...p[a.id], content: e.target.value }}))}
                                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand/50 transition-colors resize-none"
                                   />
                                 )}
                                 
                                 {(type === "FILE" || type === "HYBRID") && (
                                   <div className="relative group cursor-pointer border border-dashed border-white/20 hover:border-brand/50 rounded-xl p-4 flex flex-col items-center justify-center transition-colors bg-white/[0.02]">
                                     <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(a.id, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                     <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors truncate w-full text-center">
                                       {submissionForms[a.id]?.fileUrl ? "Document Attached" : "Attach File"}
                                     </p>
                                   </div>
                                 )}

                                 <button 
                                   onClick={() => handleSubmit(a.id)}
                                   disabled={submittingId === a.id || (!submissionForms[a.id]?.content && !submissionForms[a.id]?.fileUrl)}
                                   className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-600 active:scale-95 transition-all shadow-xl shadow-brand/20 disabled:opacity-50 text-sm"
                                 >
                                   {submittingId === a.id ? "Submitting..." : "Submit Answer"}
                                 </button>
                              </>
                           )}
                        </div>
                     </div>
                   )}
                </div>
             </motion.div>
           );
         })}
      </div>
    </div>
  );
}
