"use client";

import { motion } from "framer-motion";
import { 
  Heart,
  Github,
  Twitter,
  Globe
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto px-8 py-6 border-t border-white/[0.06] bg-dark-900/40 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <p className="text-xs text-white/30 font-medium">
          © 2026 <span className="text-white/60">Aniq-ui</span>. All rights reserved.
        </p>
        <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">v1.4.0</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-white/5 pr-6 mr-2">
          <a href="#" className="text-white/20 hover:text-white transition-colors"><Github size={16} /></a>
          <a href="#" className="text-white/20 hover:text-white transition-colors"><Twitter size={16} /></a>
          <a href="#" className="text-white/20 hover:text-white transition-colors"><Globe size={16} /></a>
        </div>
        
        <p className="text-[10px] text-white/20 flex items-center gap-1.5 font-bold uppercase tracking-[0.2em]">
          Handcrafted with <Heart size={10} className="text-red-500/60 fill-red-500/20" /> by <span className="text-white/40">Aniq Team</span>
        </p>
      </div>
    </footer>
  );
}
