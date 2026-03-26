"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Plus, Trash2, FileText, Video, Send } from "lucide-react";

export default function TeacherContentManager() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("NOTE"); // NOTE, PDF, VIDEO_LINK
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/materials").then(r => r.json()),
      fetch("/api/subjects").then(r => r.json())
    ]).then(([mats, subs]) => {
      setMaterials(Array.isArray(mats) ? mats : []);
      setSubjects(Array.isArray(subs) ? subs : []);
      setLoading(false);
    });
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !title) return;
    setIsSubmitting(true);
    
    const res = await fetch("/api/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, 
        description, 
        topicId: selectedTopic, 
        type, 
        fileUrl: type === "PDF" ? linkUrl : undefined,
        videoUrl: type === "VIDEO_LINK" ? linkUrl : undefined
      })
    });
    
    if (res.ok) {
      const mat = await res.json();
      setMaterials([mat, ...materials]);
      setTitle(""); setDescription(""); setLinkUrl("");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/materials?id=${id}`, { method: "DELETE" });
    setMaterials(materials.filter(m => m.id !== id));
  };

  const allTopics = subjects.flatMap(s => s.topics);

  return (
    <div className="space-y-8 pb-32 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1">Content Manager</h1>
        <p className="text-white/40 text-sm">Upload and manage materials for your enrolled students.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1 glass rounded-3xl p-6 border border-white/10 h-max">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <Plus size={18} className="text-brand" /> New Material
          </h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand/40 outline-none"
            >
              <option value="" className="bg-dark-900">Select Topic...</option>
              {subjects.map(subject => (
                <optgroup key={subject.id} label={subject.name} className="bg-dark-950 font-bold">
                  {subject.topics.map((t: any) => (
                    <option key={t.id} value={t.id} className="bg-dark-900 font-normal">{t.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white resize-none" />
            
            <div className="flex gap-2">
              {["NOTE", "PDF", "VIDEO_LINK"].map((t) => (
                <button type="button" key={t} onClick={() => setType(t)} className={`flex-1 py-2 rounded-xl text-[10px] font-bold border transition-all ${type === t ? "bg-brand/20 border-brand/40 text-brand scale-105" : "bg-white/5 text-white/40 border-white/10"}`}>
                  {t.replace("_", " ")}
                </button>
              ))}
            </div>

            {type !== "NOTE" && (
              <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder={`${type} URL`} required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white" />
            )}

            <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl bg-brand text-white font-bold hover:scale-[1.02] flex items-center justify-center gap-2 transition-transform">
              {isSubmitting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><Send size={16} /> Upload to Class</>}
            </button>
          </form>
        </div>

        {/* Uploaded List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? [1,2,3].map(i => <div key={i} className="h-20 glass rounded-2xl animate-pulse"/>) : materials.length === 0 ? (
            <div className="text-center py-16 text-white/20">No materials uploaded yet.</div>
          ) : materials.map((m: any, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="glass p-4 rounded-2xl border border-white/10 flex items-center justify-between group">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {m.type === "VIDEO_LINK" ? <Video size={14} className="text-cyan-400" /> : <FileText size={14} className="text-brand" />}
                  <h3 className="font-bold text-sm text-white">{m.title}</h3>
                </div>
                <p className="text-[10px] text-white/30">{allTopics.find(t => t.id === m.topicId)?.name || 'Unknown Topic'} • {new Date(m.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => handleDelete(m.id)} className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white">
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
