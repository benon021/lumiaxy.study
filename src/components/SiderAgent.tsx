"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, Layers, PenTool, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SiderAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [contextData, setContextData] = useState<any>(null);
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const pathname = usePathname();

  // Load Active Tracking Context when opened
  useEffect(() => {
    if (isOpen && !contextData) {
      // Simulate fetching active tracking data from DB (in reality: fetch('/api/student/tracking'))
      setContextData({
        lastSubject: "Physics Chapter 4",
        struggles: true
      });
      
      setTimeout(() => {
        setMessages([{
          role: "assistant", 
          content: "Active Agent online. I see you recently interacted with Physics Chapter 4. Do you need me to summarize your previous notes or generate a rapid practice quiz?"
        }]);
      }, 600);
    }
  }, [isOpen, contextData]);

  // Don't render inside the full AI dashboard
  if (pathname === "/dashboard/ai") return null;

  return (
    <>
      {/* Floating Toggle Button anchored to right side */}
      <motion.button
        initial={{ x: 100 }}
        animate={{ x: isOpen ? 100 : 0 }} // Hide when open
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 -right-2 -translate-y-1/2 z-[90] bg-dark-800 border py-3 px-2 border-r-0 border-white/20 rounded-l-2xl shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center hover:bg-dark-700 transition-colors group cursor-pointer"
      >
         <div className="pointer-events-none p-2 rounded-xl bg-gradient-to-br from-brand/20 to-purple-600/20 border border-white/10 group-hover:border-brand/40 transition-colors relative overflow-hidden">
            <Sparkles size={20} className="text-brand group-hover:animate-pulse" />
            <div className="absolute inset-0 bg-brand/10 translate-y-full group-hover:translate-y-0 transition-transform" />
         </div>
      </motion.button>

      {/* Expanded Sidebar Pane */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[95] bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-2 bottom-2 right-2 w-[400px] z-[100] bg-dark-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
               {/* Header */}
               <div className="p-5 border-b border-white/10 flex items-center justify-between bg-dark-950">
                  <div className="flex items-center gap-3">
                     <div className="p-2 rounded-xl bg-brand/20 border border-brand/30">
                        <Bot size={18} className="text-brand" />
                     </div>
                     <div>
                       <h3 className="font-bold text-white text-sm tracking-widest">ACTIVE AGENT</h3>
                       <p className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/> Listening to Context</p>
                     </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                     <X size={18} />
                  </button>
               </div>

               {/* Quick Automations */}
               <div className="p-4 border-b border-white/5 bg-white/[0.01] grid grid-cols-2 gap-2">
                  <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-brand/10 hover:border-brand/30 transition-colors text-left group">
                    <Layers size={14} className="text-white/40 mb-1 group-hover:text-brand" />
                    <p className="text-xs font-bold text-white">Explain Page</p>
                  </button>
                  <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-colors text-left group">
                    <PenTool size={14} className="text-white/40 mb-1 group-hover:text-emerald-400" />
                    <p className="text-xs font-bold text-white">Generate Quiz</p>
                  </button>
                  <button className="col-span-2 p-3 rounded-xl bg-brand font-bold text-white text-xs hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand/20">
                     <LayoutDashboard size={14} /> Send Context to Studio
                  </button>
               </div>

               {/* Chat Context */}
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                       <div className={`p-4 rounded-2xl max-w-[85%] text-sm ${m.role === 'user' ? 'bg-white/10 text-white rounded-tr-sm' : 'bg-brand/10 border border-brand/20 text-brand-100 rounded-tl-sm'}`}>
                         {m.content}
                       </div>
                    </div>
                  ))}
               </div>

               {/* Input Terminal */}
               <div className="p-4 bg-dark-950 border-t border-white/10">
                  <div className="relative">
                     <input 
                       type="text" 
                       placeholder="Ask agent to track or execute..."
                       className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-brand/50 transition-colors"
                     />
                     <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-brand text-white hover:scale-105 active:scale-95 transition-transform shadow-md">
                        <Send size={14} />
                     </button>
                  </div>
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
