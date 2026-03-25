"use client";

import { motion } from "framer-motion";
import AIChat from "@/components/dashboard/AIChat";
import { Sparkles, MessageSquare, History, Bookmark } from "lucide-react";

export default function AIAssistantPage() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
      {/* Left Column: Chat History & Suggestions */}
      <div className="xl:col-span-1 space-y-8 hidden xl:block">
        <div className="glass rounded-[32px] p-6 border border-white/10 space-y-6 shadow-xl">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                 <History size={16} className="text-brand" />
                 Recent Sessions
              </h3>
              <button className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white">See All</button>
           </div>
           
           <div className="space-y-2">
              {[
                "Quantum Physics Intro",
                "Biology Mock Test Prep",
                "Calc Home Assignment",
                "History Summary Prep"
              ].map((item, i) => (
                <button 
                  key={i} 
                  className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/5 text-xs text-white/40 hover:text-white transition-all border border-transparent hover:border-white/5 truncate"
                >
                  {item}
                </button>
              ))}
           </div>
        </div>

        <div className="glass rounded-[32px] p-6 border border-white/10 space-y-6 shadow-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-brand/20 transition-all" />
           <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2 relative z-10">
              <Bookmark size={16} className="text-cyan" />
              Saved Explanations
           </h3>
           <p className="text-[11px] text-white/40 leading-relaxed relative z-10">You haven't saved any explanations yet. Star a message to see it here.</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="xl:col-span-3 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
           <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                 AI Assistant
                 <div className="px-2 py-0.5 rounded-lg bg-brand/10 border border-brand/20 text-[10px] font-bold text-brand uppercase tracking-tighter">Enterprise Mode</div>
              </h1>
              <p className="text-sm text-white/40 font-medium">Your personalized learning companion, active 24/7.</p>
           </div>
           
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:text-white transition-all">
                 <MessageSquare size={14} />
                 New Session
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-[10px] font-bold hover:scale-105 transition-all shadow-lg">
                 <Sparkles size={14} />
                 Go Premium
              </button>
           </div>
        </div>
        
        <AIChat />
      </div>
    </div>
  );
}
