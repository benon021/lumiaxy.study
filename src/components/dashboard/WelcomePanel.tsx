"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import Image from "next/image";

export default function WelcomePanel() {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden glass rounded-[32px] p-8 border border-white/10 group shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-[80px] -mr-32 -mt-32 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-600/10 rounded-full blur-[60px] -ml-16 -mb-16" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles size={12} />
            Study Mode Active
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {greeting}, <span className="gradient-text">John!</span> 👋
          </h1>
          <p className="text-white/50 text-base max-w-lg mb-6 leading-relaxed">
            You've completed **85%** of your weekly study goals. Keep up the momentum and reach your targets with Lumiaxy.ai!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="group relative flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden whitespace-nowrap">
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <Play size={16} fill="white" />
               Continue Biology Prep
               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-6 py-3 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-sm font-bold transition-all whitespace-nowrap">
               View All Courses
            </button>
          </div>
        </div>
        
        <div className="relative">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 2, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-48 h-48 md:w-56 md:h-56 relative group"
          >
            <Image 
               src="/fusion-orb.png" 
               alt="AI Assistant" 
               width={240} 
               height={240} 
               className="animate-swirl drop-shadow-[0_0_30px_rgba(98,114,241,0.3)] transition-all duration-700 group-hover:scale-110"
            />
            {/* Floating badges */}
            <motion.div 
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-2 -right-4 glass px-3 py-2 rounded-xl border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                 <span className="text-[10px] font-bold text-white/80">AI Ready</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
