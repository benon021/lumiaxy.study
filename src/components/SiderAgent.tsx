"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, Layers, PenTool, LayoutDashboard, Zap, BrainCircuit } from "lucide-react";
import { usePathname } from "next/navigation";
import AIOrb from "./ai-orb/AIOrb";

export default function SiderAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contextData, setContextData] = useState<any>(null);
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check login status
  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) setIsLoggedIn(true);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  // Load Active Tracking Context when opened
  useEffect(() => {
    if (isOpen && !contextData) {
      setContextData({
        lastSubject: "Physics Chapter 4",
        struggles: true
      });
      
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{
          role: "assistant", 
          content: "Active Agent online. I see you recently interacted with Physics Chapter 4. Do you need me to summarize your previous notes or generate a rapid practice quiz?"
        }]);
        setIsTyping(false);
      }, 1200);
    }
  }, [isOpen, contextData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userPart = { role: "user", content: input };
    setMessages(prev => [...prev, userPart]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userPart],
          source: "side" 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Neural link failed.");

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.content 
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Agent Error: ${err.message}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };


  // Don't render if not logged in or inside the full AI dashboard
  if (!isLoggedIn || pathname === "/dashboard/ai") return null;

  return (
    <>
      {/* Floating Toggle Button - futuristic with glow and floating animation */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-28 sm:bottom-32 right-4 sm:right-6 z-[90] group cursor-pointer"
          >
            {/* Pulsing glow ring */}
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.1, 0.4],
              }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-brand/30 blur-lg"
            />
            {/* Outer orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -inset-2 rounded-full border border-brand/20 border-dashed"
            />
            {/* Main button */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-dark-800 to-dark-900 border border-brand/40 shadow-[0_0_30px_rgba(98,114,241,0.3),inset_0_0_20px_rgba(98,114,241,0.1)] flex items-center justify-center overflow-hidden group-hover:shadow-[0_0_40px_rgba(98,114,241,0.5)] transition-shadow duration-500"
            >
              {/* Inner shimmer */}
              <motion.div
                animate={{ x: [-100, 100] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
              <AIOrb size={32} state="idle" reactive={false} className="relative z-10" />
            </motion.div>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-dark-950/90 backdrop-blur-md border border-white/10 rounded-lg text-[9px] font-bold text-brand whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
            >
              AI Agent
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Floating Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[95] bg-black/50 backdrop-blur-[3px]"
            />
            
            {/* Floating Panel with futuristic design */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 sm:w-[420px] max-h-[80vh] z-[100] flex flex-col overflow-hidden rounded-3xl"
            >
              {/* Glow border effect */}
              <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-brand/40 via-white/10 to-brand/20 -z-10" />
              
              <div className="bg-dark-900 rounded-3xl flex flex-col overflow-hidden max-h-[80vh] relative">
                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute top-10 right-10 w-32 h-32 bg-brand/5 rounded-full blur-[60px]"
                  />
                  <motion.div
                    animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                    transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                    className="absolute bottom-20 left-5 w-24 h-24 bg-purple-500/5 rounded-full blur-[50px]"
                  />
                </div>

                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-dark-950/80 backdrop-blur-xl relative">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="relative"
                    >
                      <div className="p-2 rounded-xl bg-gradient-to-br from-brand/30 to-purple-600/20 border border-brand/40 shadow-[0_0_15px_rgba(98,114,241,0.2)]">
                        <BrainCircuit size={18} className="text-brand" />
                      </div>
                      {/* Status dot */}
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-dark-950"
                      />
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-white text-sm tracking-wide">NEXUS AGENT</h3>
                      <p className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                        <motion.span
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"
                        />
                        Context-Aware • Active
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors border border-white/5 hover:border-white/10">
                    <X size={18} />
                  </button>
                </div>

                {/* Quick Automations */}
                <div className="p-3 sm:p-4 border-b border-white/5 bg-white/[0.02] grid grid-cols-2 gap-2 relative">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-brand/10 hover:border-brand/30 transition-all text-left group relative overflow-hidden"
                  >
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Layers size={14} className="text-white/40 mb-1.5 group-hover:text-brand transition-colors relative z-10" />
                    <p className="text-xs font-bold text-white relative z-10">Explain Page</p>
                    <p className="text-[9px] text-white/30 mt-0.5 relative z-10">AI summary</p>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-left group relative overflow-hidden"
                  >
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <PenTool size={14} className="text-white/40 mb-1.5 group-hover:text-emerald-400 transition-colors relative z-10" />
                    <p className="text-xs font-bold text-white relative z-10">Generate Quiz</p>
                    <p className="text-[9px] text-white/30 mt-0.5 relative z-10">From context</p>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="col-span-2 p-3 rounded-xl bg-gradient-to-r from-brand to-brand/80 font-bold text-white text-xs hover:from-brand/90 hover:to-brand/70 transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(98,114,241,0.3)] border border-white/10"
                  >
                    <Zap size={14} className="animate-pulse" />
                    Send Context to Fusion Studio
                  </motion.button>
                </div>

                {/* Chat Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-[200px] max-h-[40vh] relative">
                  {messages.map((m, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`p-3 sm:p-4 rounded-2xl max-w-[85%] text-[13px] leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-brand/20 border border-brand/20 text-white rounded-tr-sm' 
                          : 'bg-white/5 border border-white/10 text-white/80 rounded-tl-sm'
                      }`}>
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 flex items-center gap-2">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.15 }} className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.3 }} className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <span className="text-[9px] text-brand/60 font-mono ml-1">SYNTHESIZING</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Terminal */}
                <div className="p-3 sm:p-4 bg-dark-950/80 backdrop-blur-xl border-t border-white/10">
                  <div className="relative flex items-center gap-2">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Ask the agent..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl py-2.5 sm:py-3 pl-4 pr-4 text-sm text-white outline-none focus:border-brand/50 transition-colors placeholder:text-white/25 min-w-0"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className={`p-2.5 sm:p-3 rounded-xl transition-all shrink-0 ${
                        input.trim()
                          ? "bg-brand text-white shadow-[0_0_15px_rgba(98,114,241,0.4)]"
                          : "bg-white/5 text-white/20 border border-white/5"
                      }`}
                    >
                      <Send size={14} />
                    </motion.button>
                  </div>
                  <p className="text-[8px] text-white/20 font-mono text-center mt-2 tracking-widest uppercase">Nexus Agent v1.0 • Context-Linked</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
