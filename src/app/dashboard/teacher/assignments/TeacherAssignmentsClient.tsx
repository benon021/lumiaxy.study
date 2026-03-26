"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Target, Check, Users, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TeacherAssignmentsClient() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    maxScore: "100",
    dueDate: ""
  });

  const fetchAssignments = async () => {
    const res = await fetch("/api/assignments");
    const data = await res.json();
    if (data.success) setAssignments(data.assignments);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ title: "", description: "", maxScore: "100", dueDate: "" });
        fetchAssignments();
        setTimeout(() => setSuccess(false), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-8 pb-32">
       <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
       </Link>

       <div className="flex flex-col md:flex-row gap-8">
          
          {/* Create Assignment Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 glass p-8 rounded-[32px] border border-white/10 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 relative z-10">
               <Target className="text-purple-400" size={24} /> Dispatch Assignment
             </h2>

             {success && (
               <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2 relative z-10">
                 <Check size={16} /> Assignment deployed to students!
               </div>
             )}

             <form onSubmit={handlePost} className="space-y-4 relative z-10">
                <input 
                  type="text" required placeholder="Assignment Title (e.g. Calculus Chapter 4)" 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 transition-colors"
                />
                
                <textarea 
                  required placeholder="Provide instructions, questions, or contexts here..." rows={4}
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 transition-colors resize-none"
                />

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-white/40 font-bold uppercase tracking-widest ml-1 mb-1 block">Max Score</label>
                    <input 
                      type="number" required min="1"
                      value={formData.maxScore} onChange={e => setFormData({...formData, maxScore: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-white/40 font-bold uppercase tracking-widest ml-1 mb-1 block">Due Date (Optional)</label>
                    <input 
                      type="datetime-local"
                      value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 transition-colors [color-scheme:dark]"
                    />
                  </div>
                </div>

                <button 
                  type="submit" disabled={isSubmitting || !formData.title || !formData.description}
                  className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-purple-600/20 mt-4"
                >
                  {isSubmitting ? "Deploying..." : "Assign to Classroom"}
                </button>
             </form>
          </motion.div>

          {/* Existing Assignments List */}
          <div className="flex-1 space-y-4">
             <h3 className="text-xl font-bold text-white mb-4">Your Active Assignments</h3>
             
             {assignments.length === 0 ? (
               <div className="p-8 border border-white/5 bg-white/[0.02] rounded-3xl text-center text-white/30 text-sm">
                 You have no active assignments.
               </div>
             ) : (
               <div className="space-y-4">
                 {assignments.map((a) => (
                   <div key={a.id} className="p-5 rounded-[24px] glass border border-white/10 flex justify-between items-center group">
                      <div>
                        <h4 className="font-bold text-white text-md">{a.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-[11px] font-bold tracking-widest uppercase">
                           <span className="text-purple-400">{a.maxScore} PTS</span>
                           <span className="text-white/20">•</span>
                           <span className="text-emerald-400 flex items-center gap-1"><Users size={12}/> {a._count?.submissions || 0} Submissions</span>
                        </div>
                      </div>
                      <Link href="/dashboard/teacher/grading" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors border border-white/10">
                        Grade
                      </Link>
                   </div>
                 ))}
               </div>
             )}
          </div>
       </div>

    </div>
  );
}
