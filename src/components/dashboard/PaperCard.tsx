"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  Eye, 
  Bookmark, 
  Share2,
  Calendar,
  Layers
} from "lucide-react";

interface PaperProps {
  id: string;
  title: string;
  subject: string;
  year: number;
  type: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function PaperCard({ title, subject, year, type, difficulty }: PaperProps) {
  const difficultyColors = {
    Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Hard: "bg-red-500/10 text-red-400 border-red-500/20"
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass rounded-[28px] p-5 border border-white/10 hover:border-brand/40 transition-all group shadow-lg flex flex-col h-full relative overflow-hidden"
    >
      {/* Subject Badge */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex flex-col gap-1">
           <div className="px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-[10px] font-bold text-brand uppercase tracking-widest inline-flex w-fit">
              {subject}
           </div>
           <h3 className="text-base font-bold text-white group-hover:text-brand transition-colors mt-2 leading-snug">
              {title}
           </h3>
        </div>
        <button className="p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
           <Bookmark size={18} />
        </button>
      </div>
      
      {/* Details */}
      <div className="space-y-3 flex-1 relative z-10">
         <div className="flex items-center gap-3 text-white/40">
            <Calendar size={14} className="text-white/20" />
            <span className="text-[11px] font-semibold">{year} Edition</span>
         </div>
         <div className="flex items-center gap-3 text-white/40">
            <Layers size={14} className="text-white/20" />
            <span className="text-[11px] font-semibold">{type}</span>
         </div>
         <div className={`px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-widest inline-block ${difficultyColors[difficulty]}`}>
            {difficulty}
         </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2 mt-6 relative z-10">
         <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand text-white text-[11px] font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg overflow-hidden group/btn relative">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            <Eye size={14} />
            Preview
         </button>
         <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all group/dl">
            <Download size={16} className="group-hover/dl:translate-y-0.5 transition-transform" />
         </button>
         <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
            <Share2 size={16} />
         </button>
      </div>
      
      {/* Decorative Gradient Accent */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-brand/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
