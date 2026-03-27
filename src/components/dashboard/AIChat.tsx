"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, Plus, Sparkles, MessageSquare, History, Bookmark, 
  ChevronLeft, ChevronRight, MoreVertical, Paperclip, 
  Image as ImageIcon, FileText, Zap, Cpu, Activity, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIOrb, { AIOrbState } from "@/components/ai-orb/AIOrb";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface UserData {
  name: string;
  email: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [orbState, setOrbState] = useState<AIOrbState>("idle");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => { if (data.user) setUserData(data.user); })
      .catch(() => {});
    
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/ai/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    }
  };

  const loadConversation = async (id: string) => {
    setIsLoading(true);
    if (isMobile) setIsSidebarOpen(false);
    try {
      const res = await fetch(`/api/ai/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentConversationId(id);
        setMessages(data.messages.map((m: any) => ({
          role: m.role,
          content: m.content
        })));
      }
    } catch (err) {
      console.error("Failed to load conversation", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/ai/conversations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (currentConversationId === id) {
          setMessages([]);
          setCurrentConversationId(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
    if (isMobile) setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, orbState]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setOrbState("thinking");

    const userPart = { role: "user" as const, content: userMessage };
    const updatedMessages = [...messages, userPart];
    setMessages(updatedMessages);

    try {
      let conversationId = currentConversationId;
      
      // If no current conversation, create one first in the background
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
          fetchConversations(); // Update list
        }
      }

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: updatedMessages,
          conversationId,
          source: "main"
        }),
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
      
      // Refresh the conversation list to update the title/updatedAt
      fetchConversations();
    } catch (err: any) {
      setMessages(prev => [...prev, { role: "assistant", content: err.message || "Connection failed." }]);
      setOrbState("idle");
    }
  };

  return (
    <div className="flex absolute inset-0 pt-16 lg:pt-0 overflow-hidden bg-dark-950 font-sans selection:bg-brand/30 selection:text-white">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-brand/5 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-cyan/5 rounded-full blur-[70px] md:blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobile && isSidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Futuristic Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0, x: -50 }}
            animate={{ width: isMobile ? "85vw" : 260, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className={`h-full bg-black/60 backdrop-blur-3xl border-r border-white/5 flex flex-col relative z-30 shadow-[10px_0_30px_rgba(0,0,0,0.5)] ${
              isMobile ? "fixed top-0 left-0 bottom-0" : ""
            }`}
          >
            <div className={`p-4 flex flex-col h-full ${isMobile ? "w-[85vw]" : "w-[260px]"}`}>
              
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand/20 border border-brand/40 flex items-center justify-center">
                       <Sparkles size={14} className="text-brand" />
                    </div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                       Lumiaxy<span className="text-brand">.study</span>
                    </h2>
                 </div>
                 {isMobile && (
                   <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 glass rounded-lg text-white/40 hover:text-white transition-all">
                    <ChevronLeft size={16} />
                   </button>
                 )}
              </div>

              <button 
                onClick={startNewChat}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-brand/50 hover:bg-brand/5 text-xs font-bold text-white transition-all transform active:scale-[0.98] mb-6 group"
              >
                <Plus size={16} className="text-brand group-hover:rotate-90 transition-transform" />
                Initialize New Core
              </button>

              <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide pr-1">
                 <div className="space-y-2.5">
                    <h3 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                      <History size={11} className="text-cyan-500" />
                      Neural History
                    </h3>
                    <div className="space-y-1">
                      {conversations.length === 0 ? (
                        <p className="px-4 py-2 text-[10px] text-white/20 italic">No cycles detected yet.</p>
                      ) : (
                        conversations.map((conv) => (
                          <div key={conv.id} className="group relative">
                            <button 
                              onClick={() => loadConversation(conv.id)}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-3 border ${
                                currentConversationId === conv.id 
                                  ? "bg-brand/10 border-brand/30 text-white" 
                                  : "bg-transparent border-transparent text-white/50 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <MessageSquare size={13} className={`shrink-0 ${currentConversationId === conv.id ? "text-brand" : "text-white/20 group-hover:text-brand"}`} />
                              <span className="truncate text-[11px] font-medium flex-1">{conv.title}</span>
                            </button>
                            <button 
                              onClick={(e) => deleteConversation(e, conv.id)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/0 group-hover:text-white/30 hover:text-red-400 transition-all rounded-md"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                 </div>
              </div>

              {/* Profile Bar */}
              <div className="pt-4 mt-4 border-t border-white/5">
                <div className="glass-dark rounded-xl p-2.5 flex items-center gap-2.5 group cursor-pointer hover:border-brand/30 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 flex items-center justify-center text-brand font-bold text-sm">
                    {userData?.name ? userData.name[0].toUpperCase() : "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white truncate group-hover:text-brand">{userData?.name || "Neural Operator"}</p>
                    <p className="text-[9px] text-white/30 truncate font-mono">{userData?.email || "sys.op@lumiaxy"}</p>
                  </div>
                  <MoreVertical size={12} className="text-white/20 group-hover:text-white" />
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
            className="absolute left-3 top-3 w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-brand transition-all z-50 shadow-2xl"
          >
            <ChevronRight size={18} />
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
                className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
              >
                <div className="relative mb-8 sm:mb-12">
                  <div className="absolute inset-0 bg-brand/30 blur-[60px] sm:blur-[100px] rounded-full opacity-60 mix-blend-screen animate-pulse" />
                  <AIOrb state={orbState} size={isMobile ? 140 : 220} className="relative z-10 drop-shadow-[0_0_40px_rgba(98,114,241,0.4)]" />
                </div>
                <div className="space-y-4 max-w-2xl relative z-20">
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white/20">
                     Nexus <span className="text-brand drop-shadow-[0_0_15px_rgba(98,114,241,0.5)]">Activated</span>
                  </h1>
                  <p className="text-xs sm:text-base text-white/40 leading-relaxed font-medium px-4 max-w-lg mx-auto">
                     Harnessing the power of Gemini. Ask questions, analyze structural patterns, or synthesis new insights from your study context.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-10 space-y-6 sm:space-y-8 scrollbar-hide">
                <div className="max-w-3xl mx-auto space-y-8 sm:space-y-10 pb-32 sm:pb-40">
                  {messages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3 sm:gap-5`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="shrink-0 pt-1.5 hidden sm:block">
                          <AIOrb state="idle" size={36} reactive={false} className="shadow-[0_0_15px_rgba(98,114,241,0.2)]" />
                        </div>
                      )}
                      <div className={`relative group max-w-[92%] sm:max-w-[85%] md:max-w-[80%]`}>
                        <div className={`
                          relative z-10 px-4 sm:px-5 py-3 sm:py-4 text-[13px] sm:text-sm leading-[1.6] whitespace-pre-wrap
                          ${msg.role === 'user' 
                            ? "bg-gradient-to-br from-brand to-brand/80 text-white rounded-[20px] rounded-tr-[4px] shadow-lg border border-white/10" 
                            : "bg-white/[0.04] border border-white/5 text-white/90 rounded-[20px] rounded-tl-[4px] backdrop-blur-md"
                          }
                        `}>
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {orbState === "thinking" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-start gap-3 sm:gap-5">
                      <div className="shrink-0 pt-1.5 hidden sm:block"><AIOrb state="thinking" size={36} reactive={false} /></div>
                      <div className="bg-white/[0.03] border border-white/5 rounded-[20px] rounded-tl-[4px] px-4 py-3.5 flex items-center gap-3">
                         <div className="flex gap-1">
                            <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, duration:0.6}} className="w-1.5 h-1.5 rounded-full bg-brand" />
                            <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.2}} className="w-1.5 h-1.5 rounded-full bg-brand" />
                            <motion.div animate={{y:[0,-4,0]}} transition={{repeat:Infinity, duration:0.6, delay:0.4}} className="w-1.5 h-1.5 rounded-full bg-brand" />
                         </div>
                         <span className="text-[10px] font-bold text-brand/60 uppercase tracking-widest font-mono">Synthesizing</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Console */}
        <div className="absolute bottom-4 sm:bottom-10 left-0 right-0 px-4 md:px-8 z-40">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-0 bg-brand/10 blur-[40px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
            
            <div className="relative bg-dark-900/40 backdrop-blur-3xl rounded-[24px] border border-white/10 flex items-center p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all group-focus-within:border-brand/40 group-focus-within:bg-dark-900/60">
              <button 
                className="w-10 h-10 flex items-center justify-center text-white/20 hover:text-white transition-all rounded-xl hover:bg-white/5 active:scale-95 ml-0.5"
                disabled={isLoading}
              >
                <Plus size={18} />
              </button>
              
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isLoading ? "Switching streams..." : "Query the Nexus..."} 
                className="flex-1 bg-transparent border-none outline-none text-sm text-white px-2 sm:px-3 placeholder:text-white/20 font-medium h-10 min-w-0"
                disabled={isLoading}
              />
              
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 mr-0.5
                  ${input.trim() && !isLoading
                    ? "bg-brand text-white shadow-[0_0_15px_rgba(98,114,241,0.4)] hover:scale-105 active:scale-95" 
                    : "bg-white/5 text-white/10"
                  }
                `}
              >
                <Zap size={16} className={input.trim() ? "fill-white" : ""} />
              </button>
            </div>
            
            <p className="text-center text-[8px] text-white/20 font-mono tracking-[0.3em] uppercase mt-3">Fusion Engine • Shard 021 • Gemini Powered</p>
          </div>
        </div>
      </div>
    </div>
  );
}
