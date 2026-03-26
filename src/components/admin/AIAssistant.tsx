"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Send, 
  Plus, 
  History,
  BrainCircuit,
  Settings2,
  Cpu
} from "lucide-react";
import Image from "next/image";
import AIOrb from "../ai-orb/AIOrb";

export default function AIAssistant() {
  return (
    <div className="glass rounded-3xl flex flex-col h-[600px] overflow-hidden self-stretch relative">
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      
      {/* Header */}
      <div className="relative z-10 p-6 border-b border-white/[0.06] flex items-center justify-between bg-dark-900/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-all group">
            <Cpu size={16} className="text-brand group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white/80">Gemini 3 Flash</span>
            <Plus size={12} className="text-white/20" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
            <History size={18} />
          </button>
          <button className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
            <Settings2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 overflow-hidden">
        {/* Animated Orb Container */}
        <div className="relative group cursor-pointer mb-12">
          {/* Outer glow rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand/20 rounded-full blur-[60px] animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan/10 rounded-full blur-[80px] animate-pulse-slow delay-700" />
          
          {/* Main Visual Orb */}
          <AIOrb size={128} className="relative z-10" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-2 mb-12"
        >
          <h3 className="text-3xl font-bold text-white tracking-tight">Good to see you, <span className="gradient-text">Demo.</span></h3>
          <p className="text-white/40 text-sm">How can I assist you with your platform today?</p>
        </motion.div>

        {/* Floating suggestion chip */}
        <div className="flex flex-wrap justify-center gap-3">
          {["Analyze revenue", "Generate user report", "Optimize project flow"].map((text, i) => (
            <motion.button
              key={text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/40 hover:text-white hover:bg-white/10 hover:border-brand/30 transition-all"
            >
              {text}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-6 pt-0">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Ask me anything..." 
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-all shadow-xl"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-brand/10 text-brand hover:bg-brand hover:text-white transition-all">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
