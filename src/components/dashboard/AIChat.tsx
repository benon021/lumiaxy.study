"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send, Plus, Sparkles, MessageSquare, History, Bookmark,
  ChevronLeft, ChevronRight, MoreVertical, Paperclip,
  Image as ImageIcon, FileText, Zap, Cpu, Activity, Trash2, Globe, HistoryIcon, Settings, X, Mic
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIOrb, { AIOrbState } from "@/components/ai-orb/AIOrb";
import { clsx } from "clsx";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [orbState, setOrbState] = useState<AIOrbState>("idle");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, orbState]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/ai/conversations");
      if (res.ok) setConversations(await res.json());
    } catch {}
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    setInput("");
    setOrbState("thinking");
    const updated = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(updated);

    try {
      let conversationId = currentConversationId;
      if (!conversationId) {
        const createRes = await fetch("/api/ai/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: userMessage.substring(0, 30) }),
        });
        if (createRes.ok) {
          const newConv = await createRes.json();
          conversationId = newConv.id;
          setCurrentConversationId(conversationId);
          fetchConversations();
        }
      }
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, conversationId, source: "main" }),
      });
      const data = await res.json();
      setOrbState("speaking");
      setMessages(prev => [...prev, { role: "assistant" as const, content: data?.content || "lumiaxy.ai error." }]);
      setTimeout(() => setOrbState("idle"), 1200);
      fetchConversations();
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: "lumiaxy.ai Link Failure. Retry..." }]);
      setOrbState("idle");
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#050005] font-sans selection:bg-brand/30 selection:text-white">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] mix-blend-screen opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[120px] mix-blend-screen opacity-40" />
      </div>

      {/* Sidebar - Lumiaxy Command Hub */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0, x: -50 }}
            animate={{ width: isMobile ? "100%" : 300, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -50 }}
            className={clsx(
              "h-full bg-black/40 backdrop-blur-2xl border-r border-white/5 flex flex-col relative z-50 shadow-2xl transition-all",
              isMobile ? "fixed inset-0" : "relative shrink-0"
            )}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand/20 border border-brand/40 flex items-center justify-center">
                       <Zap size={16} className="text-brand fill-brand/20" />
                    </div>
                    <h2 className="text-sm font-black text-white tracking-[0.2em] uppercase">Lumiaxy AI</h2>
                 </div>
                 {isMobile && <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-white/40 hover:text-white transition-all"><X size={20}/></button>}
              </div>

              <button
                onClick={() => { setMessages([]); setCurrentConversationId(null); if (isMobile) setIsSidebarOpen(false); }}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white transition-all mb-8 group"
              >
                <Plus size={18} className="text-brand group-hover:rotate-90 transition-transform" />
                Initialize New Core
              </button>

              {/* Neural Log History */}
              <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide pr-1">
                 <div className="space-y-3">
                   <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] flex items-center gap-2 ml-2">
                     <History size={12} /> Temporal Streams
                   </h3>
                   <div className="space-y-1">
                      {conversations.map((conv) => (
                        <div key={conv.id} className="group relative">
                           <button
                             onClick={() => { setCurrentConversationId(conv.id); if(isMobile) setIsSidebarOpen(false); }}
                             className={clsx(
                               "w-full text-left px-4 py-3.5 rounded-2xl transition-all flex items-center gap-3 border text-[11px] font-bold group",
                               currentConversationId === conv.id
                                 ? "bg-brand/10 border-brand/30 text-white"
                                 : "bg-transparent border-transparent text-white/40 hover:bg-white/5 hover:text-white"
                             )}
                           >
                             <MessageSquare size={14} className={currentConversationId === conv.id ? "text-brand" : "text-white/10"} />
                             <span className="truncate flex-1">{conv.title}</span>
                           </button>
                           <button
                             onClick={(e) => { e.stopPropagation(); }} // Logic for delete if needed
                             className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400"
                           >
                             <Trash2 size={12} />
                           </button>
                        </div>
                      ))}
                   </div>
                 </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex gap-2">
                <button className="flex-1 py-3 rounded-xl bg-white/5 text-white/20 hover:text-white flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-widest"><Settings size={14}/> Node Prefs</button>
                {!isMobile && <button onClick={() => setIsSidebarOpen(false)} className="p-3 rounded-xl bg-white/5 text-white/20 hover:text-white"><ChevronLeft size={16}/></button>}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Experience Space - Fixed Command Center */}
      <main className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
        
        {/* Fixed Header */}
        <div className="h-16 flex items-center justify-between px-6 md:px-10 border-b border-white/[0.03] bg-black/20 backdrop-blur-md shrink-0">
           <div className="flex items-center gap-4">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all shadow-xl"
                >
                  <ChevronRight size={18} />
                </button>
              )}
           </div>
           <div className="flex items-center gap-5">
              <Activity size={16} className="text-brand animate-pulse" />
              <div className="h-4 w-[1px] bg-white/10" />
              <Globe size={16} className="text-white/20 hover:text-white cursor-pointer" />
           </div>
        </div>

        {/* Dynamic Experience Center (Scrollable Message Feed) */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 md:px-12 py-10 scrollbar-none scroll-smooth"
        >
           <div className="max-w-4xl mx-auto min-h-full flex flex-col">
              <AnimatePresence mode="wait">
                {messages.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                    className="flex-1 flex flex-col items-center justify-center py-20 text-center"
                  >
                     <div className="relative mb-12">
                        <div className="absolute inset-0 bg-brand/30 blur-[100px] rounded-full animate-pulse opacity-40 mix-blend-screen" />
                        <AIOrb state={orbState} size={isMobile ? 180 : 320} className="relative z-10 drop-shadow-[0_0_50px_rgba(139,92,246,0.3)]" />
                     </div>
                     <div className="space-y-4 max-w-lg">
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                           Lumiaxy AI <span className="text-brand drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]">Activated</span>
                        </h2>
                        <p className="text-sm text-white/30 font-medium tracking-wide">
                           Lumiaxy AI is ready to process your academic queries. Initialize the stream to analyze structural patterns or synthesize new insights.
                        </p>
                        <div className="pt-8 flex items-center justify-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                           <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Listening for handshake</span>
                        </div>
                     </div>
                  </motion.div>
                ) : (
                  <div className="space-y-12 pb-20">
                     {messages.map((msg, i) => (
                       <motion.div
                         key={i}
                         initial={{ opacity: 0, y: 30 }}
                         animate={{ opacity: 1, y: 0 }}
                         className={clsx("flex flex-col group", msg.role === 'user' ? 'items-end' : 'items-start')}
                       >
                          <div className={clsx("flex items-center gap-3 mb-4 transition-opacity duration-500", i === messages.length - 1 ? 'opacity-100' : 'opacity-40 hover:opacity-100')}>
                             {msg.role === 'assistant' && <div className="w-6 h-6 rounded bg-brand/20 border border-brand/40 flex items-center justify-center"><Cpu size={12} className="text-brand"/></div>}
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                                {msg.role === 'user' ? 'Uplink Node' : 'Lumiaxy AI'}
                             </p>
                          </div>
                          <div className={clsx(
                            "max-w-[85%] px-7 py-5 rounded-[28px] text-[15px] leading-relaxed shadow-3xl transition-all",
                            msg.role === 'user' 
                              ? "bg-brand text-white font-medium rounded-tr-lg border border-white/10" 
                              : "bg-white/[0.03] backdrop-blur-xl border border-white/5 text-white/90 rounded-tl-lg"
                          )}>
                             {msg.content}
                          </div>
                       </motion.div>
                     ))}
                     
                     {orbState === "thinking" && (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start gap-4">
                          <div className="flex items-center gap-3">
                             <div className="w-6 h-6 rounded bg-brand/10 border border-brand/20 flex items-center justify-center animate-spin"><Sparkles size={12} className="text-brand"/></div>
                             <p className="text-[10px] font-black text-brand/40 uppercase tracking-[0.2em]">Neural Synthesis</p>
                          </div>
                          <div className="px-7 py-5 rounded-[28px] bg-white/[0.01] border border-brand/20 border-dashed text-brand/60 text-sm font-mono flex items-center gap-3">
                             <div className="flex gap-1">
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-brand" />
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-brand" />
                                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-brand" />
                             </div>
                             Resolving multidimensional context...
                          </div>
                       </motion.div>
                     )}
                  </div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Fixed Input Console - (Standard & Clean) */}
        <div className="p-6 md:p-10 shrink-0 bg-transparent relative z-20">
           <div className="max-w-3xl mx-auto relative group">
              
              {/* Intelligent Docked Orb (Prevents Overlap) */}
              {messages.length > 0 && (
                <motion.div
                  className="absolute z-30 transition-all cursor-pointer backdrop-blur-xl p-1 bg-black/40 border border-white/10 rounded-full"
                  animate={{
                    bottom: isMobile ? "auto" : "100%",
                    top: isMobile ? "-60px" : "auto",
                    left: isMobile ? "50%" : "-150px",
                    x: isMobile ? "-50%" : 0,
                    scale: orbState === "idle" ? 0.35 : 1,
                    y: orbState === "idle" ? -20 : -100
                  }}
                  whileHover={{ scale: 1, y: -120 }}
                >
                   <AIOrb state={orbState} size={150} />
                </motion.div>
              )}

              <div className={clsx(
                "bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[32px] p-2 flex items-center shadow-4xl focus-within:border-brand/40 transition-all ring-offset-black",
                isLoading && "opacity-50 pointer-events-none"
              )}>
                 <button className="p-3.5 text-white/20 hover:text-brand transition-all"><Paperclip size={20}/></button>
                 <input
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === "Enter" && handleSend()}
                   placeholder="Query the Lumiaxy Engine Alpha..."
                   className="flex-1 bg-transparent border-none outline-none text-sm px-4 placeholder:text-white/10 text-white font-medium h-12"
                 />
                 <button 
                   onClick={handleSend}
                   disabled={!input.trim()}
                   className={clsx(
                     "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group",
                     input.trim() ? "bg-brand text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]" : "bg-white/5 text-white/5"
                   )}
                 >
                   <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-8">
                 <div className="flex items-center gap-2 opacity-20 hover:opacity-60 cursor-pointer transition-all">
                    <ImageIcon size={14}/> <span className="text-[9px] font-black uppercase tracking-widest">Image Node</span>
                 </div>
                 <div className="flex items-center gap-2 opacity-20 hover:opacity-60 cursor-pointer transition-all">
                    <FileText size={14}/> <span className="text-[9px] font-black uppercase tracking-widest">Document Mesh</span>
                 </div>
                 <div className="flex items-center gap-2 opacity-20 hover:opacity-60 cursor-pointer transition-all text-brand">
                    <Mic size={14}/> <span className="text-[9px] font-black uppercase tracking-widest">Lumiaxy Pulse (Voice)</span>
                 </div>
              </div>

              <p className="text-[8px] text-white/10 font-bold text-center mt-5 tracking-[0.5em] uppercase pointer-events-none">
                 Fused Alpha Node • Gemini Structural Synthesis • Shard 021-X
              </p>
           </div>
        </div>
      </main>
    </div>
  );
}
