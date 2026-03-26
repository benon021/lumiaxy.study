"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, Check, Eye } from "lucide-react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TeacherContentClient({ user }: { user: any }) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "PDF",
    fileUrl: "" // Actually holds Base64 in this implementation
  });

  const fetchMaterials = async () => {
    const res = await fetch("/api/materials");
    const data = await res.json();
    if (data.success) {
      setMaterials(data.materials.filter((m: any) => m.authorId === user.id));
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("File is too large for runtime Base64 preview! Max 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, fileUrl: reader.result as string, title: formData.title || file.name.split('.')[0] });
    };
    reader.readAsDataURL(file);
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess(true);
        setFormData({ title: "", description: "", type: "PDF", fileUrl: "" });
        fetchMaterials();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-8 pb-32">
       <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
       </Link>

       <div className="flex flex-col md:flex-row gap-8">
          
          {/* Upload Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 glass p-8 rounded-[32px] border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[80px] pointer-events-none" />
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
               <Upload className="text-brand" size={24} /> Post Study Material
             </h2>

             {success && (
               <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center gap-2">
                 <Check size={16} /> Material POSTED successfully to the grid.
               </div>
             )}

             <form onSubmit={handlePost} className="space-y-4 relative z-10">
                <input 
                  type="text" required placeholder="Material Title" 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand/50 transition-colors"
                />
                
                <textarea 
                  placeholder="Optional description or instructions for students" rows={3}
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand/50 transition-colors resize-none"
                />

                <div className="relative group cursor-pointer border-2 border-dashed border-white/20 hover:border-brand/50 rounded-2xl p-8 flex flex-col items-center justify-center transition-colors bg-white/[0.02]">
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <FileText className="text-white/40 group-hover:text-brand transition-colors mb-2" size={32} />
                  <p className="text-sm text-white/60 font-medium">
                    {formData.fileUrl ? "Document Selected (Ready)" : "Drag & Drop PDF or Document"}
                  </p>
                </div>

                <button 
                  type="submit" disabled={isUploading || !formData.fileUrl || !formData.title}
                  className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand/20 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isUploading ? "Uploading Vectors..." : "Publicly Post Document"}
                </button>
             </form>
          </motion.div>

          {/* Existing Materials List */}
          <div className="flex-1 space-y-4">
             <h3 className="text-xl font-bold text-white mb-4">Your Uploaded Archive</h3>
             
             {materials.length === 0 ? (
               <div className="p-8 border border-white/5 bg-white/[0.02] rounded-3xl text-center text-white/30 text-sm">
                 You haven't posted any materials yet.
               </div>
             ) : (
               <div className="space-y-3">
                 {materials.map((m) => (
                   <div key={m.id} className="p-4 rounded-2xl glass border border-white/10 flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{m.title}</p>
                          <p className="text-[10px] text-white/40">{new Date(m.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setPreviewFile(m.fileUrl)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                   </div>
                 ))}
               </div>
             )}
          </div>
       </div>

       {/* Full Screen Document Preview Modal */}
       {previewFile && (
         <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-4xl h-[80vh] bg-dark-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
               <div className="p-4 border-b border-white/10 flex justify-between items-center bg-dark-950">
                 <h3 className="text-white font-bold text-sm">Document Preview</h3>
                 <button onClick={() => setPreviewFile(null)} className="p-1 rounded bg-white/10 hover:bg-white/20 text-white"><X size={16}/></button>
               </div>
               <div className="flex-1 bg-white relative">
                 {/* Provide Base64 to iframe natively for PDF rendering */}
                 <iframe src={previewFile} className="w-full h-full border-none" title="Preview" />
               </div>
            </div>
         </div>
       )}
    </div>
  );
}
