import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PaperCard from "@/components/dashboard/PaperCard";
import PaperFilters from "@/components/dashboard/PaperFilters";
import { Sparkles, Library, X, FileText, Download, Share2 } from "lucide-react";

const papers = [
  { id: "1", title: "Biology Paper 1 (Theory)", subject: "Biology", year: 2024, type: "KCSE Prep", difficulty: "Medium" },
  { id: "2", title: "Mathematics Paper 2 (Calculus)", subject: "Math", year: 2023, type: "Mombasa Mock", difficulty: "Hard" },
  { id: "3", title: "History & Government Paper 1", subject: "History", year: 2024, type: "KNEC Final", difficulty: "Easy" },
  { id: "4", title: "Chemistry Paper 3 (Practical)", subject: "Chemistry", year: 2024, type: "Regional", difficulty: "Hard" },
  { id: "5", title: "Business Studies Paper 2", subject: "Economics", year: 2023, type: "KCSE Revision", difficulty: "Medium" },
  { id: "6", title: "English Literature (Set Books)", subject: "English", year: 2024, type: "Study Guide", difficulty: "Easy" },
  { id: "7", title: "Geography Paper 1 (Physical)", subject: "Geography", year: 2022, type: "KCSE Final", difficulty: "Medium" },
  { id: "8", title: "Physics Paper 1 (Mechanics)", subject: "Physics", year: 2024, type: "Nairobi Mock", difficulty: "Hard" },
] as const;

export default function PastPapersPage() {
  const [selectedPaper, setSelectedPaper] = useState<typeof papers[number] | null>(null);

  const handleDownload = (paper: typeof papers[number]) => {
    // Simulated download experience
    const dummyUrl = "#";
    const link = document.createElement("a");
    link.href = dummyUrl;
    link.setAttribute("download", `${paper.title}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert(`Initializing secure download for: ${paper.title}`);
  };

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
            <PaperCard 
              {...paper} 
              onPreview={() => setSelectedPaper(paper)}
              onDownload={() => handleDownload(paper)}
            />
          </motion.div>
        ))}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedPaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedPaper(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-dark-900 w-full max-w-4xl max-h-[90vh] rounded-[32px] border border-white/10 overflow-hidden flex flex-col shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-dark-950/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center text-brand">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedPaper.title}</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">{selectedPaper.year} • {selectedPaper.subject}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPaper(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content - Simulated PDF View */}
              <div className="flex-1 overflow-y-auto p-8 bg-dark-950/30">
                <div className="aspect-[1/1.4] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-inner p-12 flex flex-col gap-6 relative overflow-hidden">
                   {/* Watermark */}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg]">
                      <span className="text-6xl font-black text-black">LUMIAXY.STUDY</span>
                   </div>
                   
                   <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                   <div className="space-y-3">
                      <div className="h-3 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-5/6 bg-gray-100 rounded" />
                   </div>
                   <div className="h-4 w-1/2 bg-gray-200 rounded mt-4" />
                   <div className="grid grid-cols-2 gap-4">
                      <div className="aspect-square bg-gray-50 rounded border border-dashed border-gray-200 flex items-center justify-center text-gray-300 italic text-[10px]">Diagram Loading...</div>
                      <div className="aspect-square bg-gray-50 rounded border border-dashed border-gray-200 flex items-center justify-center text-gray-300 italic text-[10px]">Equation Shard...</div>
                   </div>
                   <div className="space-y-3 mt-4">
                      <div className="h-3 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-4/6 bg-gray-100 rounded" />
                   </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 flex items-center justify-between bg-dark-950/50">
                <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase">Encrypted Shard Access • Kenya Regional Hub</p>
                <div className="flex items-center gap-3">
                  <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
                    <Share2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDownload(selectedPaper)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand text-white font-bold text-sm shadow-lg shadow-brand/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Download size={18} /> Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Help Floating Button */}
      <button className="fixed bottom-32 right-12 w-14 h-14 rounded-full bg-brand text-white shadow-[0_15px_35px_rgba(98,114,241,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-40">
         <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
