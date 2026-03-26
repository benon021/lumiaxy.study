"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Plus, 
  Sparkles, 
  MessageSquare, 
  History, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  User,
  Settings,
  MoreVertical,
  Paperclip,
  Image as ImageIcon,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIOrb, { AIOrbState } from "@/components/ai-orb/AIOrb";
import Image from "next/image";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UserData {
  name: string;
  email: string;
}

const AI_HISTORY_KEY = "lumiaxy_ai_history_v1";

type AiLocalMessage = {
  id: string;
  createdAt: string; // ISO
  userText: string;
  assistantText: string;
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [orbState, setOrbState] = useState<AIOrbState>("idle");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch user data
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserData(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setOrbState("thinking");

    const userPart = { role: "user" as const, content: userMessage };
    const nextMessages = [...messages, userPart];
    setMessages(nextMessages);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to get AI response");
      }

      const assistantPart = {
        role: "assistant" as const,
        content: data?.content || data?.message || "No response",
      };

      setOrbState("speaking");
      setMessages((prev) => [...prev, assistantPart]);

      const localItem: AiLocalMessage = {
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        createdAt: new Date().toISOString(),
        userText: userMessage,
        assistantText: assistantPart.content,
      };

      try {
        const storedRaw = localStorage.getItem(AI_HISTORY_KEY);
        const stored = storedRaw ? (JSON.parse(storedRaw) as AiLocalMessage[]) : [];
        const next = Array.isArray(stored) ? [...stored, localItem].slice(-300) : [localItem];
        localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(next));
      } catch {
        // Ignore localStorage failures (private mode, etc.)
      }

      setTimeout(() => setOrbState("idle"), 1200);
    } catch (err: any) {
      const assistantPart = {
        role: "assistant" as const,
        content: err?.message || "AI request failed. Please try again.",
      };
      setMessages((prev) => [...prev, assistantPart]);
      setOrbState("idle");
    }
  };

  const recentSessions = [
    "Quantum Physics Intro",
    "Biology Mock Test Prep",
    "Calc Home Assignment",
    "History Summary Prep"
  ];

  return (
    <div className="flex absolute inset-0 pt-20 lg:pt-0 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full bg-dark-950/40 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-30"
          >
            <div className="p-4 flex flex-col h-full w-[280px]">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-8 px-2">
                 <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Lumiaxy<span className="gradient-text">.ai</span>
                 </h2>
                 <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 glass rounded-lg text-white/40 hover:text-white transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>

              {/* New Chat Button */}
              <button className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-white hover:bg-white/10 transition-all mb-8 w-full group">
                <Plus size={18} className="text-brand group-hover:rotate-90 transition-transform" />
                New Session
              </button>

              {/* Recent Sessions */}
              <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2">
                        <History size={12} />
                        Recent Sessions
                      </h3>
                      <button className="text-[10px] font-bold text-white/20 hover:text-white transition-colors">See All</button>
                    </div>
                    <div className="space-y-1">
                      {recentSessions.map((session, i) => (
                        <button key={i} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 text-xs text-white/40 hover:text-white transition-all group flex items-center gap-3">
                          <MessageSquare size={14} className="opacity-0 group-hover:opacity-100 text-brand" />
                          <span className="truncate">{session}</span>
                        </button>
                      ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2 px-2">
                      <Bookmark size={12} />
                      Saved
                    </h3>
                    <p className="px-4 text-[11px] text-white/20 italic">No saved explanations yet.</p>
                 </div>
              </div>

              {/* User Profile / Bottom Actions */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-brand/10 border border-brand/20 text-xs font-bold text-brand hover:bg-brand/20 transition-all">
                  <Sparkles size={16} />
                  Go Premium
                </button>
                
                <div className="flex items-center gap-3 p-2 group cursor-pointer hover:bg-white/5 rounded-2xl transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white/40 group-hover:bg-brand/20 group-hover:text-brand transition-all font-bold">
                    {userData?.name ? userData.name[0].toUpperCase() : "J"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{userData?.name || "John Doe"}</p>
                    <p className="text-[10px] text-white/40 truncate">{userData?.email || "john@lumiaxy.study"}</p>
                  </div>
                  <MoreVertical size={14} className="text-white/20" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative min-w-0 bg-black/20">
        {/* Toggle Button Outside */}
        {!isSidebarOpen && (
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-6 top-6 w-12 h-12 rounded-2xl glass border border-white/20 flex items-center justify-center text-white/40 hover:text-brand hover:border-brand/40 transition-all z-50 shadow-2xl backdrop-blur-3xl"
          >
            <ChevronRight size={24} />
          </motion.button>
        )}

        {/* Messages / Orb Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-radial-gradient from-brand/5 to-transparent"
              >
                <div className="relative mb-12 group">
                  <div className="absolute inset-0 bg-brand/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                  <AIOrb state={orbState} size={280} className="relative z-10" />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white">
                    Lumiaxy<span className="gradient-text">.ai</span>
                  </h1>
                  <p className="text-lg text-white/40 max-w-xl mx-auto leading-relaxed font-medium">
                    Experience the future of study with fluid, morphing AI interfaces and personalized learning modules.
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth scrollbar-hide"
              >
                <div className="max-w-4xl mx-auto space-y-10 pb-40 px-4">
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-4`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="shrink-0 pt-1">
                          <AIOrb state={orbState} size={40} reactive={false} className="shadow-2xl" />
                        </div>
                      )}
                      <div className={clsx(
                        "max-w-[80%] px-6 py-4 rounded-3xl text-[15px] leading-relaxed",
                        msg.role === 'user' 
                          ? "bg-brand text-white shadow-[0_10px_30px_rgba(98,114,241,0.2)] rounded-tr-none marker:bg-white" 
                          : "glass-dark border border-white/10 text-white/90 rounded-tl-none shadow-xl"
                      )}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Bar */}
        <div className="absolute bottom-10 left-0 right-0 px-6 z-40">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-brand/20 blur-[80px] opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
            
            <div className="relative glass-dark rounded-[24px] border border-white/10 flex items-center p-3 shadow-2xl transition-all focus-within:border-brand/40 bg-black/60 backdrop-blur-3xl focus-within:ring-1 ring-white/5">
              <div className="relative group/plus">
                <button className="p-3 text-white/30 hover:text-white transition-all rounded-xl hover:bg-white/5 active:scale-95 bg-white/5 border border-white/5">
                  <Plus size={20} />
                </button>
                
                {/* Plus Menu */}
                <div className="absolute bottom-full left-0 mb-4 opacity-0 scale-95 group-hover/plus:opacity-100 group-hover/plus:scale-100 pointer-events-none group-hover/plus:pointer-events-auto transition-all origin-bottom-left z-50">
                  <div className="glass rounded-2xl p-2 border border-white/10 shadow-3xl space-y-1 w-52 overflow-hidden bg-dark-900/90 backdrop-blur-2xl">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-[12px] text-white/60 hover:text-white transition-all text-left">
                      <div className="w-8 h-8 rounded-lg bg-brand/20 flex items-center justify-center text-brand"><FileText size={16} /></div>
                      <span>Document</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-[12px] text-white/60 hover:text-white transition-all text-left">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-500"><ImageIcon size={16} /></div>
                      <span>Image / Gallery</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 text-[12px] text-white/60 hover:text-white transition-all text-left">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400"><Paperclip size={16} /></div>
                      <span>URL / Link</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Message Lumiaxy Assistant..." 
                className="flex-1 bg-transparent border-none outline-none text-[15px] text-white px-5 placeholder:text-white/20 font-medium"
              />
              
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className={clsx(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90",
                  input.trim() 
                    ? "bg-brand text-white shadow-[0_0_25px_rgba(98,114,241,0.6)] hover:brightness-110" 
                    : "bg-white/5 text-white/10 border border-white/5"
                )}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
