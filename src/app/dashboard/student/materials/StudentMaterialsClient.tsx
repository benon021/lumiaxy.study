"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Download, 
  Eye, 
  X, 
  ChevronLeft, 
  Search, 
  BookOpen, 
  Folder, 
  ChevronRight,
  Clock,
  MessageSquare,
  Send
} from "lucide-react";
import Link from "next/link";

interface Topic {
  id: string;
  name: string;
  _count?: {
    materials: number;
    assignments: number;
    discussions: number;
  };
}

interface Subject {
  id: string;
  name: string;
  topics: Topic[];
}

export default function StudentMaterialsClient() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topicContent, setTopicContent] = useState<any[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  useEffect(() => {
    // Fetch enrolled subjects and their topics
    fetch("/api/student/subjects")
      .then(res => res.json())
      .then(data => {
        if (data.success) setSubjects(data.subjects);
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchTopicContent = async (topicId: string) => {
    setSelectedTopic(topicId);
    setContentLoading(true);
    try {
      const res = await fetch(`/api/materials?topicId=${topicId}`);
      const data = await res.json();
      if (data.success) setTopicContent(data.materials);
    } catch (err) {
      console.error(err);
    } finally {
      setContentLoading(false);
    }
  };

  const isNew = (createdAt: string) => {
    const hours = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
    return hours < 48;
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 pb-32 space-y-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
         <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
         Back to Dashboard
      </Link>

      <div className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <BookOpen className="text-brand" size={28} /> My Enrolled Subjects
        </h1>
        <p className="text-white/40 mt-1">Navigate through your subjects and topics to find study materials.</p>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
           {[1,2,3].map(i => <div key={i} className="h-48 glass rounded-[32px]" />)}
        </div>
      ) : (
        <div className="space-y-12">
          {subjects.map((subject, sIdx) => (
            <div key={subject.id} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold">
                  {subject.name[0]}
                </div>
                <h2 className="text-2xl font-bold text-white">{subject.name}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subject.topics.map((topic, tIdx) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (sIdx * 3 + tIdx) * 0.05 }}
                    onClick={() => fetchTopicContent(topic.id)}
                    className={`glass rounded-[32px] p-6 border transition-all cursor-pointer group relative overflow-hidden ${
                      selectedTopic === topic.id ? "border-brand bg-brand/10 shadow-[0_0_30px_rgba(98,114,241,0.1)]" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${selectedTopic === topic.id ? "bg-brand text-white" : "bg-white/5 text-white/40"} group-hover:scale-110 transition-transform`}>
                        <Folder size={20} />
                      </div>
                      <ChevronRight size={16} className={`text-white/20 group-hover:text-white transition-all ${selectedTopic === topic.id ? "rotate-90 text-brand" : ""}`} />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-3">{topic.name}</h3>
                    
                    {/* Topic Stats */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        <FileText size={12} className="text-blue-400" /> {topic._count?.materials || 0}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        <Send size={12} className="text-purple-400" /> {topic._count?.assignments || 0}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        <MessageSquare size={12} className="text-green-400" /> {topic._count?.discussions || 0}
                      </div>
                    </div>

                    <AnimatePresence>
                      {selectedTopic === topic.id && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute bottom-0 left-0 w-full h-1 bg-brand"
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Side-Drawer or List */}
      <AnimatePresence>
        {selectedTopic && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-12 border-t border-white/10"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">
                Content for <span className="text-brand">{subjects.flatMap(s => s.topics).find(t => t.id === selectedTopic)?.name}</span>
              </h3>
              <button 
                onClick={() => setSelectedTopic(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {contentLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1,2,3].map(i => <div key={i} className="h-40 glass rounded-[24px]" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topicContent.map((m, i) => (
                  <motion.div 
                    key={m.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    className="glass rounded-[32px] p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    {isNew(m.createdAt) && (
                      <div className="absolute top-4 right-4 z-20">
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                        </span>
                        <span className="text-[8px] font-black text-brand uppercase ml-3 bg-brand/10 px-1.5 py-0.5 rounded border border-brand/20">NEW</span>
                      </div>
                    )}

                    <div className="relative z-10">
                      <div className="inline-flex mb-3 px-3 py-1 rounded-full bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-widest border border-brand/20">
                        {m.type}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">{m.title}</h3>
                      <p className="text-xs text-white/40 mt-2 line-clamp-2">{m.description || "No description provided."}</p>
                    </div>

                    <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/5 mt-4">
                      <div className="flex items-center gap-2">
                        <Clock size={12} className="text-white/20" />
                        <p className="text-[10px] font-medium text-white/30 tracking-tight">{new Date(m.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setPreviewFile(m.fileUrl)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                        ><Eye size={16} /></button>
                        <a 
                          href={m.fileUrl} download={m.title}
                          className="p-2 rounded-xl bg-brand/20 border border-brand/30 hover:bg-brand hover:text-white text-brand transition-colors"
                        ><Download size={16} /></a>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {topicContent.length === 0 && (
                  <div className="col-span-full py-20 text-center text-white/40 border-2 border-dashed border-white/5 rounded-[32px]">
                    No study materials uploaded for this topic yet.
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      {previewFile && (
         <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-5xl h-[90vh] bg-slate-900 border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden">
               <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-950 px-6">
                 <h3 className="text-white font-bold flex items-center gap-2"><Eye className="text-brand" size={18}/> Document Viewport</h3>
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
