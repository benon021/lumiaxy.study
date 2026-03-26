"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, CheckCircle2, ChevronLeft, Eye, X, Check } from "lucide-react";
import Link from "next/link";

export default function TeacherGradingClient() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState<string | null>(null);
  
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [forms, setForms] = useState<Record<string, { score: string, feedback: string }>>({});

  const fetchUngraded = async () => {
    try {
      const res = await fetch("/api/submissions");
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUngraded();
  }, []);

  const handleGrade = async (submissionId: string) => {
    const data = forms[submissionId];
    if (!data || !data.score) return;

    setGradingId(submissionId);
    try {
      const res = await fetch("/api/submissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          submissionId, 
          score: parseFloat(data.score), 
          feedback: data.feedback || "" 
        })
      });
      if (res.ok) {
        fetchUngraded(); // Remove graded items
      }
    } finally {
      setGradingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-white/50 animate-pulse">Scanning ungraded matrix...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8 pb-32">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
         <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
         Back to Dashboard
      </Link>

      <div>
         <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 mb-2">
           <CheckCircle2 className="text-emerald-400" size={28} /> Grading Nexus
         </h1>
         <p className="text-white/40">Review recent student submissions and dispatch scores.</p>
      </div>

      <div className="space-y-6 mt-8">
         {submissions.length === 0 ? (
           <div className="p-12 text-center border border-white/5 rounded-[32px] glass text-white/40 text-sm">
             Inbox Zero! All submissions have been graded.
           </div>
         ) : submissions.map(s => (
           <motion.div key={s.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-[32px] p-6 border border-white/10 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center overflow-hidden">
                       {s.student.avatarUrl ? <img src={s.student.avatarUrl} className="w-full h-full object-cover"/> : <span className="text-brand font-bold text-xs">{s.student.name?.[0]}</span>}
                    </div>
                    <div>
                      <h4 className="font-bold text-white leading-tight">{s.student.name}</h4>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-white/30">{new Date(s.submittedAt).toLocaleString()}</p>
                    </div>
                 </div>
                 
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/50 mb-2">Assignment Reference</p>
                    <p className="text-sm font-bold text-white">{s.assignment.title}</p>
                    <p className="text-xs text-white/40 mt-1 line-clamp-1">{s.assignment.description}</p>
                 </div>

                 {(s.content || s.fileUrl) && (
                   <div className="pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Student's Response</p>
                      {s.content && (
                        <div className="p-4 bg-black/40 border border-white/10 rounded-2xl text-sm text-white/80 whitespace-pre-wrap font-serif leading-relaxed mb-3">
                           {s.content}
                        </div>
                      )}
                      {s.fileUrl && (
                        <button 
                          onClick={() => setPreviewFile(s.fileUrl)}
                          className="px-4 py-3 rounded-xl bg-brand/10 border border-brand/20 text-brand text-xs font-bold flex items-center gap-2 hover:bg-brand hover:text-white transition-colors"
                        >
                          <Eye size={16} /> Open Attached Document
                        </button>
                      )}
                   </div>
                 )}
              </div>
              
              <div className="w-full md:w-80 shrink-0 bg-black/20 p-6 rounded-[24px] border border-white/5 text-sm space-y-4">
                 <h4 className="font-bold text-white mb-4">Input Grade</h4>
                 
                 <div>
                   <div className="flex justify-between items-end mb-2">
                     <label className="text-[10px] font-bold tracking-widest uppercase text-white/40">Score</label>
                     <span className="text-xs text-emerald-400 font-bold">Max {s.assignment.maxScore}</span>
                   </div>
                   <input 
                     type="number" max={s.assignment.maxScore} min={0}
                     value={forms[s.id]?.score || ""} onChange={e => setForms(p => ({...p, [s.id]: { ...p[s.id], score: e.target.value}}))}
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors font-bold text-lg"
                     placeholder="__"
                   />
                 </div>

                 <div>
                   <label className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-2 block">Feedback (Optional)</label>
                   <textarea 
                     rows={3}
                     value={forms[s.id]?.feedback || ""} onChange={e => setForms(p => ({...p, [s.id]: { ...p[s.id], feedback: e.target.value}}))}
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 transition-colors resize-none"
                     placeholder="Great job on..."
                   />
                 </div>

                 <button 
                    onClick={() => handleGrade(s.id)}
                    disabled={gradingId === s.id || !forms[s.id]?.score}
                    className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 active:scale-95 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 text-sm disabled:active:scale-100 mt-2 flex justify-center items-center gap-2"
                 >
                    {gradingId === s.id ? "Processing..." : <><Check size={16}/> Dispatch Final Grade</>}
                 </button>
              </div>
           </motion.div>
         ))}
      </div>
      
      {/* Document Modal */}
      {previewFile && (
         <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-5xl h-[90vh] bg-dark-900 border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
               <div className="p-4 border-b border-white/10 flex justify-between items-center bg-dark-950 px-6">
                 <h3 className="text-white font-bold flex items-center gap-2"><Eye className="text-emerald-400" size={18}/> Submission Viewer</h3>
                 <button onClick={() => setPreviewFile(null)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"><X size={18}/></button>
               </div>
               <div className="flex-1 bg-white relative">
                 <iframe src={previewFile} className="w-full h-full border-none" title="Preview" />
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
