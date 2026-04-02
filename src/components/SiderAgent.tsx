"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Send, Plus, Sparkles, MessageSquare, History, 
  ChevronRight, Mic, Keyboard as KeyboardIcon, Trash2, 
  Settings, LayoutGrid, Volume2, StopCircle, Globe, Cpu, Zap, Activity
} from "lucide-react";
import AIOrb, { AIOrbState } from "@/components/ai-orb/AIOrb";
import { clsx } from "clsx";

export default function SiderAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState("");
  const [orbState, setOrbState] = useState<AIOrbState>("idle");
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, orbState]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input;
    setInput("");
    setOrbState("thinking");
    setMessages(prev => [...prev, { role: "user", content: msg }]);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: msg }], source: "sider" })
      });
      const data = await res.json();
      setOrbState("speaking");
      setMessages(prev => [...prev, { role: "assistant", content: data.content || "lumiaxy.ai Node Unresponsive." }]);
      setTimeout(() => setOrbState("idle"), 2000);
    } catch {
      setOrbState("idle");
    }
  };

  return (
    <>
      {/* Floating Activator */}
      <motion.div 
        className="fixed bottom-32 right-12 z-[100]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-1 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(139,92,246,0.3)] hover:scale-110 active:scale-95 transition-all"
        >
          <div className="absolute inset-0 bg-brand/20 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <AIOrb state={isOpen ? "listening" : orbState} size={64} className="relative z-10" />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="fixed bottom-48 right-12 w-[380px] h-[550px] bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[100] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-brand/20 border border-brand/40 flex items-center justify-center">
                    <Zap size={14} className="text-brand fill-brand/20" />
                 </div>
                 <div>
                    <h3 className="font-black text-white text-[11px] tracking-[0.2em] uppercase">Lumiaxy AI</h3>
                    <p className="text-[8px] text-brand font-black uppercase flex items-center gap-1">
                       <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1 h-1 rounded-full bg-brand" />
                       Link Active
                    </p>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all"><X size={18}/></button>
            </div>

            {/* Neural Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none pb-10">
               {messages.length === 0 ? (
                 <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                    <Cpu size={32} className="text-white animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Lumiaxy Sync Required</p>
                 </div>
               ) : (
                 messages.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={clsx("flex flex-col", m.role === 'user' ? 'items-end' : 'items-start')}>
                       <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">{m.role === 'user' ? 'Uplink' : 'Lumiaxy'}</p>
                       <div className={clsx("px-5 py-3 rounded-[20px] text-xs leading-relaxed", m.role === 'user' ? 'bg-brand text-white rounded-tr-none' : 'bg-white/5 text-white/80 rounded-tl-none')}>
                          {m.content}
                       </div>
                    </motion.div>
                 ))
               )}
               {orbState === "thinking" && (
                 <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand" />
                    <span className="text-[10px] font-black text-brand/40 uppercase tracking-[0.2em]">Processing...</span>
                 </div>
               )}
            </div>

            {/* Input Node */}
            <div className="p-6 pt-2 bg-gradient-to-t from-black/20 to-transparent">
               <div className="relative group">
                  <div className="absolute inset-0 bg-brand/5 blur-xl group-focus-within:opacity-100 opacity-0 transition-opacity" />
                  <div className="relative bg-white/5 border border-white/10 rounded-2xl flex items-center p-1.5 focus-within:border-brand/40 transition-all">
                     <input 
                       value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
                       className="flex-1 bg-transparent border-none outline-none text-[11px] px-3 placeholder:text-white/10 text-white" 
                       placeholder="Message lumiaxy.ai..."
                     />
                     <button onClick={handleSend} className={clsx("p-2.5 rounded-xl transition-all", input.trim() ? 'bg-brand text-white shadow-lg shadow-brand/40' : 'bg-white/5 text-white/10')}>
                        <Send size={14}/>
                     </button>
                  </div>
                  <p className="text-[7px] text-white/10 font-black text-center mt-3 tracking-[0.3em] uppercase">Lumiaxy AI v1.0 • Alpha Link 021</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
