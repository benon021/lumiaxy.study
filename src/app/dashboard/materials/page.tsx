"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, FileText, Video, Pin, Search, Filter } from "lucide-react";
import Link from "next/link";

interface Subject {
  id: string;
  name: string;
  description?: string;
  topics: Topic[];
}

interface Topic {
  id: string;
  name: string;
  description?: string;
  _count?: { materials: number };
}

interface Material {
  id: string;
  title: string;
  description?: string;
  type: string;
  videoUrl?: string;
  fileUrl?: string;
  isPinned: boolean;
  createdAt: string;
  author: { name: string };
}

export default function StudyMaterialsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [matLoading, setMatLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/subjects").then((r) => r.json()).then((data) => {
      setSubjects(data);
      if (data.length > 0) setSelectedSubject(data[0].id);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedTopic) { setMaterials([]); return; }
    setMatLoading(true);
    fetch(`/api/materials?topicId=${selectedTopic}`).then((r) => r.json()).then((data) => {
      setMaterials(data);
      setMatLoading(false);
    });
  }, [selectedTopic]);

  const activeSubject = subjects.find((s) => s.id === selectedSubject);
  const filteredMaterials = search
    ? materials.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    : materials;

  const typeIcon = (type: string) => {
    if (type === "VIDEO_LINK") return <Video size={14} className="text-cyan-400" />;
    if (type === "PDF") return <FileText size={14} className="text-orange-400" />;
    return <BookOpen size={14} className="text-brand" />;
  };

  return (
    <div className="flex gap-6 h-[80vh] pb-32">
      {/* Subjects Sidebar */}
      <div className="w-48 flex-shrink-0 space-y-2 overflow-y-auto scrollbar-hide">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2 mb-3">Subjects</p>
        {loading
          ? [1, 2, 3].map((i) => <div key={i} className="h-12 glass rounded-2xl border border-white/5 animate-pulse" />)
          : subjects.map((s) => (
            <button key={s.id} onClick={() => { setSelectedSubject(s.id); setSelectedTopic(null); }}
              className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${selectedSubject === s.id ? "bg-brand/20 border-brand/40 text-brand shadow-[0_0_20px_rgba(255,114,0,0.1)]" : "border-white/5 text-white/40 hover:text-white hover:bg-white/5 bg-transparent"}`}>
              {s.name}
            </button>
          ))
        }
      </div>

      {/* Topics List */}
      <div className="w-56 flex-shrink-0 space-y-2 overflow-y-auto scrollbar-hide">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-2 mb-3">Topics</p>
        {!activeSubject ? null : activeSubject.topics.map((t) => (
          <button key={t.id} onClick={() => setSelectedTopic(t.id)}
            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${selectedTopic === t.id ? "bg-white/10 border-white/20 text-white" : "border-white/5 text-white/40 hover:text-white hover:bg-white/5 bg-transparent"}`}>
            <span className="block truncate">{t.name}</span>
            {t.description && <span className="block text-[10px] font-normal text-white/30 truncate mt-0.5">{t.description}</span>}
          </button>
        ))}
      </div>

      {/* Materials */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {!selectedTopic ? (
          <div className="flex flex-col items-center justify-center h-full text-white/20 text-center">
            <BookOpen size={48} className="mb-4 opacity-30" />
            <p>Select a topic to explore study materials</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative mb-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search materials..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40" />
            </div>
            {matLoading ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="glass rounded-2xl h-20 animate-pulse border border-white/5" />)}</div>
            ) : filteredMaterials.length === 0 ? (
              <div className="text-center py-16 text-white/20">No materials available yet.</div>
            ) : filteredMaterials.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass rounded-2xl p-5 border border-white/10 hover:border-brand/30 transition-all group">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {typeIcon(m.type)}
                      {m.isPinned && <Pin size={10} className="text-yellow-400 fill-yellow-400" />}
                      <h3 className="text-sm font-bold text-white">{m.title}</h3>
                    </div>
                    {m.description && <p className="text-xs text-white/40 mb-3">{m.description}</p>}
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/20">By {m.author?.name}</span>
                      <span className="text-[10px] text-white/20">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {m.videoUrl && (
                      <a href={m.videoUrl} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all flex items-center gap-1">
                        <Video size={10} /> Watch
                      </a>
                    )}
                    {m.fileUrl && (
                      <div className="flex gap-2">
                        <a href={m.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold text-orange-400 hover:bg-orange-500 hover:text-white transition-all flex items-center gap-1 cursor-pointer">
                          <BookOpen size={10} /> Preview
                        </a>
                        <a href={m.fileUrl} download
                          className="px-3 py-1.5 rounded-xl bg-brand/10 border border-brand/20 text-[10px] font-bold text-brand hover:bg-brand hover:text-white transition-all flex items-center gap-1 cursor-pointer">
                          <FileText size={10} /> Download
                        </a>
                      </div>
                    )}
                    {!m.fileUrl && !m.videoUrl && (
                      <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 flex items-center gap-1">
                        <BookOpen size={10} /> Note
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
