"use client";

import { motion } from "framer-motion";
import PaperCard from "@/components/dashboard/PaperCard";
import PaperFilters from "@/components/dashboard/PaperFilters";
import { Sparkles, Library } from "lucide-react";

const papers = [
  { id: "1", title: "Core Biology - Metabolic Processes", subject: "Biology", year: 2024, type: "Final Paper", difficulty: "Medium" },
  { id: "2", title: "Advanced Mathematics - Calculus III", subject: "Math", year: 2023, type: "Mock Exam", difficulty: "Hard" },
  { id: "3", title: "Modern World History - Post WWII", subject: "History", year: 2024, type: "Regional", difficulty: "Easy" },
  { id: "4", title: "Physical Chemistry - Quantum Mech", subject: "Chemistry", year: 2024, type: "Practical", difficulty: "Hard" },
  { id: "5", title: "Micro Economics - Supply & Demand", subject: "Economics", year: 2023, type: "Final Paper", difficulty: "Medium" },
  { id: "6", title: "Literature - Shakespeare Studies", subject: "English", year: 2024, type: "Essay Guide", difficulty: "Easy" },
  { id: "7", title: "Human Geography - Urban Shifts", subject: "Geography", year: 2022, type: "Final Paper", difficulty: "Medium" },
  { id: "8", title: "Applied Physics - Electromagnetism", subject: "Physics", year: 2024, type: "Lab Exam", difficulty: "Hard" },
] as const;

export default function PastPapersPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
         <div className="space-y-2">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-2">
              <Library size={12} />
              Academy Resource
           </div>
           <h1 className="text-3xl font-bold text-white tracking-tight">Past Papers Library</h1>
           <p className="text-base text-white/40 max-w-lg">
              Explore over 50,000+ past exam papers curated from global curriculums to aid your study journey.
           </p>
         </div>
         
         <div className="glass px-6 py-4 rounded-[28px] border border-white/10 flex items-center gap-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-brand/5 group-hover:bg-brand/10 transition-colors" />
            <div className="relative z-10">
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Downloads</p>
               <p className="text-xl font-bold text-brand">1,248 <span className="text-xs font-medium text-white/20">this month</span></p>
            </div>
            <div className="w-[1px] h-8 bg-white/10 relative z-10" />
            <div className="relative z-10">
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Success Rate</p>
               <p className="text-xl font-bold text-emerald-400">94.2%</p>
            </div>
         </div>
      </div>

      <PaperFilters />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {papers.map((paper, i) => (
          <motion.div
            key={paper.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 + 0.2 }}
          >
            <PaperCard {...paper} />
          </motion.div>
        ))}
      </div>
      
      {/* Help Floating Button */}
      <button className="fixed bottom-32 right-12 w-14 h-14 rounded-full bg-brand text-white shadow-[0_15px_35px_rgba(98,114,241,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-40">
         <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
