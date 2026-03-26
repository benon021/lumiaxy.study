"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, Plus, Sparkles, MessageSquare, History, Bookmark, 
  ChevronLeft, ChevronRight, MoreVertical, Paperclip, 
  Image as ImageIcon, FileText, Zap, Cpu, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIOrb, { AIOrbState } from "@/components/ai-orb/AIOrb";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UserData {
  name: string;
  email: string;
}

const AI_HISTORY_KEY = "lumiaxy_ai_history_v2";

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [orbState, setOrbState] = useState<AIOrbState>("idle");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => { if (data.user) setUserData(data.user); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, orbState]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setOrbState("thinking");

    const userPart = { role: "user" as const, content: userMessage };
    setMessages(prev => [...prev, userPart]);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userPart] }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed...");

      const assistantPart = {
        role: "assistant" as const,
        content: data?.content || data?.message || "No response",
      };

      setOrbState("speaking");
      setMessages(prev => [...prev, assistantPart]);

      setTimeout(() => setOrbState("idle"), 1200);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: err.message || "Connection to Shard failed." }]);
      setOrbState("idle");
    }
  };

  return (
    <div className="flex absolute inset-0 pt-20 lg:pt-0 overflow-hidden bg-dark-950 font-sans selection:bg-brand/30 selection:text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan/5 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
      </div>

      {/* Futuristic Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0, x: -50 }}
            animate={{ width: 300, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="h-full bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
          >
            <div className="p-5 flex flex-col h-full w-[300px]">
              
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand/20 border border-brand/40 flex items-center justify-center">
                       <Sparkles size={16} className="text-brand" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                       Lumiaxy<span className="text-brand">.ai</span>
                    </h2>
                 </div>
                 <button onClick={() => setIsSidebarOpen(false)} className="p-2 glass rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <ChevronLeft size={18} />
                 </button>
              </div>

              <button className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-brand/80 to-brand hover:from-brand hover:to-brand/80 shadow-[0_0_20px_rgba(98,114,241,0.3)] text-sm font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] mb-8 group">
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                Initialize New Core
              </button>

              <div className="flex-1 overflow-y-auto space-y-8 scrollbar-hide pr-2">
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Activity size={12} className="text-cyan-500" />
                        Active Matrices
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {["Advanced Vector Calculus", "Quantum Entanglement", "Roman Empire Synthesis"].map((s, i) => (
                        <button key={i} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-xs text-white/60 hover:text-white transition-all group flex items-start gap-3 border border-transparent hover:border-white/5">
                          <MessageSquare size={14} className="mt-0.5 text-white/20 group-hover:text-brand transition-colors" />
                          <span className="truncate leading-relaxed">{s}</span>
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Bookmark size={12} className="text-purple-500" />
                      Archived Nodes
                    </h3>
                    <p className="px-4 text-[11px] text-white/20 italic font-mono">Archive Empty []</p>
                 </div>
              </div>

              {/* Profile Bar */}
              <div className="pt-5 mt-5 border-t border-white/10">
                <div className="glass rounded-2xl p-3 flex items-center gap-3 group cursor-pointer hover:border-brand/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 flex items-center justify-center text-brand font-bold text-lg shadow-[inset_0_0_12px_rgba(98,114,241,0.2)]">
                    {userData?.name ? userData.name[0].toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate group-hover:text-brand transition-colors">{userData?.name || "Neural Operator"}</p>
                    <p className="text-[10px] text-white/40 truncate font-mono">{userData?.email || "sys.op@lumiaxy"}</p>
                  </div>
                  <MoreVertical size={14} className="text-white/20 group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interface */}
      <div className="flex-1 flex flex-col relative min-w-0 z-10">
        {!isSidebarOpen && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-6 top-6 w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-brand hover:border-brand/40 transition-all z-50 shadow-2xl backdrop-blur-3xl hover:shadow-[0_0_20px_rgba(98,114,241,0.2)]"
          >
            <ChevronRight size={24} />
          </motion.button>
        )}

        <div className="flex-1 relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="relative mb-16">
                  <div className="absolute inset-0 bg-brand/30 blur-[120px] rounded-full opacity-60 mix-blend-screen animate-pulse" />
                  <AIOrb state={orbState} size={320} className="relative z-10 drop-shadow-[0_0_50px_rgba(98,114,241,0.5)]" />
                </div>
                <div className="space-y-6 max-w-2xl relative z-20">
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white/20">
                     Nexus <span className="text-brand drop-shadow-[0_0_15px_rgba(98,114,241,0.5)]">Awakened</span>
                  </h1>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">
                     I am Fusion AI. Provide structural data, upload schematics, or query the collective intelligence to begin synthesis.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth scrollbar-hide">
                <div className="max-w-4xl mx-auto space-y-12 pb-40">
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-4 md:gap-6`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="shrink-0 pt-2 hidden md:block">
                          <AIOrb state="idle" size={48} reactive={false} className="shadow-[0_0_20px_rgba(98,114,241,0.3)] border border-brand/20 rounded-full" />
                        </div>
                      )}
                      <div className={`relative group max-w-[85%] md:max-w-[75%]`}>
                        <div className={`
                          relative z-10 px-6 py-4 md:py-5 text-[15px] leading-[1.7] whitespace-pre-wrap
                          ${msg.role === 'user' 
                            ? "bg-gradient-to-br from-brand to-brand/80 text-white rounded-[24px] rounded-tr-sm shadow-[0_10px_40px_rgba(98,114,241,0.3)] border border-white/10" 
                            : "glass-dark border border-white/10 text-white/90 rounded-[24px] rounded-tl-sm shadow-xl bg-black/40 backdrop-blur-md"
                          }
                        `}>
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {orbState === "thinking" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-start gap-6">
                      <div className="shrink-0 pt-2 hidden md:block"><AIOrb state="thinking" size={48} reactive={false} /></div>
                      <div className="glass-dark border border-white/10 rounded-[24px] rounded-tl-sm px-6 py-5 flex items-center gap-3 opacity-70">
                         <div className="flex gap-1.5">
                            <motion.div animate={{y:[0,-5,0]}} transition={{repeat:Infinity, duration:0.6}} className="w-2 h-2 rounded-full bg-brand" />
                            <motion.div animate={{y:[0,-5,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.2}} className="w-2 h-2 rounded-full bg-brand" />
                            <motion.div animate={{y:[0,-5,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.4}} className="w-2 h-2 rounded-full bg-brand" />
                         </div>
                         <span className="text-xs font-mono text-brand uppercase tracking-widest px-2">Processing Vectors</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Console */}
        <div className="absolute bottom-8 left-0 right-0 px-4 md:px-8 z-40 block">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-brand/10 blur-[60px] opacity-0 focus-within:opacity-100 transition-opacity duration-700" />
            
            <div className="relative glass rounded-[32px] border border-white/10 flex items-center p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all bg-dark-900/80 backdrop-blur-3xl focus-within:border-brand/50 focus-within:ring-2 focus-within:ring-brand/20">
              <div className="relative group/plus shrink-0">
                <button className="w-12 h-12 flex items-center justify-center text-white/30 hover:text-white transition-all rounded-2xl hover:bg-white/5 active:scale-95 ml-1">
                  <Plus size={22} />
                </button>
              </div>
              
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Initialize prompt sequence..." 
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-white px-4 placeholder:text-white/30 font-medium font-sans h-12"
              />
              
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 mr-1
                  ${input.trim() 
                    ? "bg-brand text-white shadow-[0_0_20px_rgba(98,114,241,0.5)] hover:bg-brand/90 hover:scale-105 active:scale-95" 
                    : "bg-white/5 text-white/10 border border-white/5"
                  }
                `}
              >
                <Cpu size={20} className={input.trim() ? "animate-pulse" : ""} />
              </button>
            </div>
            
            <div className="text-center mt-3">
               <p className="text-[10px] text-white/30 font-mono tracking-widest uppercase">Fusion Engine v2.0 • Data is encrypted via Shard Protocol</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
