"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, X, ChevronLeft, Search } from "lucide-react";
import Link from "next/link";

export default function StudentMaterialsClient() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/materials")
      .then(res => res.json())
      .then(data => {
        if (data.success) setMaterials(data.materials);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = materials.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.author?.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 pb-32 space-y-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
         <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
         Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row items-end justify-between gap-6 pb-6 border-b border-white/10">
         <div>
           <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <FileText className="text-brand" size={28} /> Global Study Archive
           </h1>
           <p className="text-white/40 mt-1">Preview and download resources posted by verified educators.</p>
         </div>
         <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input 
              type="text" placeholder="Search topics or authors..." 
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-black/40 border border-white/10 py-3 pl-12 pr-4 rounded-xl text-white outline-none focus:border-brand/50 transition-colors"
            />
         </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
           {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 glass rounded-[24px]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filtered.map((m, i) => (
             <motion.div 
               key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
               className="glass rounded-[32px] p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group h-56 relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform pointer-events-none">
                  <FileText size={80} />
                </div>
                
                <div className="relative z-10">
                  <div className="inline-flex mb-3 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest border border-brand/20">
                    {m.type}
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{m.title}</h3>
                  <p className="text-xs text-white/40 mt-2 line-clamp-2">{m.description || "No description provided."}</p>
                </div>

                <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/5 mt-4">
                  <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand text-[10px] font-bold overflow-hidden">
                        {m.author?.avatarUrl ? <img src={m.author.avatarUrl} className="w-full h-full object-cover" /> : m.author?.name[0]}
                     </div>
                     <p className="text-xs font-medium text-white/50">{m.author?.name}</p>
                  </div>
                  
                  <div className="flex gap-2">
                     <button 
                       onClick={() => setPreviewFile(m.fileUrl)}
                       className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                       title="Preview Document"
                     ><Eye size={16} /></button>
                     
                     <a 
                       href={m.fileUrl} download={m.title}
                       className="p-2 rounded-xl bg-brand/20 border border-brand/30 hover:bg-brand hover:text-white text-brand transition-colors"
                       title="Download Local Copy"
                     ><Download size={16} /></a>
                  </div>
                </div>
             </motion.div>
           ))}
           {filtered.length === 0 && (
             <div className="col-span-full py-20 text-center text-white/40">No materials matched your search vector.</div>
           )}
        </div>
      )}

      {/* Full Screen Document Preview Modal */}
      {previewFile && (
         <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-5xl h-[90vh] bg-dark-900 border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
               <div className="p-4 border-b border-white/10 flex justify-between items-center bg-dark-950 px-6">
                 <h3 className="text-white font-bold flex items-center gap-2"><Eye className="text-brand" size={18}/> Global Preview Matrix</h3>
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
