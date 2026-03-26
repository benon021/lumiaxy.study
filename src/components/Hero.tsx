"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Bot } from "lucide-react";
import Link from "next/link";
import AIOrb from "./ai-orb/AIOrb";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 text-center flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1, type: "spring" }}
          className="mb-8 relative"
        >
           <div className="absolute -inset-4 bg-brand/20 blur-2xl rounded-full" />
           <AIOrb size={120} state="idle" reactive={true} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors"
        >
          <Sparkles className="text-brand w-4 h-4" />
          <span className="text-sm font-medium text-white/80">The First Kenyan Study AI Coordinator</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[1.1] mb-8"
        >
          Intelligence <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-purple-400 to-cyan">
            Meets Ambition.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Lumiaxy.study fuses high-end Sider Active Agents with top-tier Educators. 
          Upload assignments, deploy live grading, and let the AI instantly explain 
          any complexities holding your potential back.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/signup">
            <button className="group relative px-8 py-4 bg-brand text-white font-bold rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(var(--brand),0.3)] hover:shadow-[0_0_60px_rgba(var(--brand),0.5)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
              <span className="relative z-10">Access Agent Protocol</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
            </button>
          </Link>
          <Link href="/pricing">
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white hover:bg-white/5 font-bold rounded-2xl transition-all hover:border-white/40 shadow-lg flex items-center gap-2">
              <Shield className="text-white/40 w-5 h-5" /> Verified Pricing
            </button>
          </Link>
        </motion.div>

        {/* Feature Triggers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl opacity-60 hover:opacity-100 transition-opacity"
        >
           <div className="flex flex-col items-center gap-2 p-4">
             <Bot size={24} className="text-brand" />
             <p className="text-xs font-bold text-white uppercase tracking-widest">Sider AI Context</p>
           </div>
           <div className="flex flex-col items-center gap-2 p-4">
             <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-500 flex items-center justify-center font-bold text-[10px]">A+</div>
             <p className="text-xs font-bold text-white uppercase tracking-widest">Educator Grades</p>
           </div>
           <div className="flex flex-col items-center gap-2 p-4">
             <div className="w-6 h-6 rounded-md bg-purple-500/20 border border-purple-500 flex items-center justify-center text-purple-500 font-black text-[10px]">P</div>
             <p className="text-xs font-bold text-white uppercase tracking-widest">Post Documents</p>
           </div>
           <div className="flex flex-col items-center gap-2 p-4 cursor-pointer hover:scale-110 transition-transform">
             <div className="w-6 h-6 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center" />
             <p className="text-xs font-bold text-white uppercase tracking-widest">Lumiaxy Network</p>
           </div>
        </motion.div>

      </div>
    </section>
  );
}
