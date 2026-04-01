"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, FileText, Globe, Search, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ResourcesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) setIsLoggedIn(true);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const categories = [
    { title: "KCSE Past Papers", count: "12,400+", icon: FileText, color: "text-brand" },
    { title: "Regional Mocks", count: "8,200+", icon: Globe, color: "text-cyan-400" },
    { title: "Revision Guides", count: "5,000+", icon: BookOpen, color: "text-emerald-400" },
  ];

  return (
    <main className="min-h-screen bg-dark-950 pt-32 pb-32 relative overflow-hidden">
       {/* Background glow */}
       <div className="absolute top-1/4 -right-1/4 w-[50%] h-[50%] bg-brand/5 rounded-full blur-[150px] -z-10" />
       
       <Navbar />
       
       <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest mb-6">
                <Search size={12} />
                Open Access Matrix
             </div>
             <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
                Academic <span className="gradient-text">Freedom.</span>
             </h1>
             <p className="text-lg text-white/40 leading-relaxed font-medium">
                Lumiaxy provides a subset of past papers publicly to accelerate your growth. 
                Unlock the full encrypted database with a student profile.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
             {categories.map((cat, i) => (
                <div key={i} className="glass p-8 rounded-[32px] border border-white/10 hover:border-white/20 transition-all group">
                   <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${cat.color}`}>
                      <cat.icon size={24} />
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
                   <div className="flex items-center justify-between">
                      <span className="text-sm text-white/30 font-medium">{cat.count} Files</span>
                      <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
                   </div>
                </div>
             ))}
          </div>
          
          <div className="glass p-12 rounded-[40px] border border-brand/20 bg-brand/[0.02] text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <FileText size={160} className="text-brand" />
             </div>
             
             <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4">Login Required for Premium Shards</h3>
                <p className="text-white/40 text-sm mb-8 max-w-xl mx-auto">
                   Full access to the Kenyan KNEC past papers, marking schemes, and teacher-uploaded 
                   AI-curated guides requires an active Student profile.
                </p>
                
                <Link 
                  href={isLoggedIn ? "/dashboard" : "/login"} 
                  className="inline-flex items-center gap-2 py-4 px-10 rounded-2xl bg-brand font-bold text-white text-sm shadow-xl shadow-brand/20 hover:scale-105 active:scale-95 transition-all"
                >
                   {isLoggedIn ? "Return to Dashboard" : "Access Central Database"}
                   <ChevronRight size={16} />
                </Link>
             </div>
          </div>
       </div>

       <Footer />
    </main>
  );
}
