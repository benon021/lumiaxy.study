"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">Contact</h1>
        <p className="text-white/40 mt-3">Send feedback or report an issue.</p>
      </motion.div>

      <div className="glass rounded-[32px] p-8 border border-white/10 space-y-4">
        <div className="flex items-center gap-3 text-white/50">
          <Mail size={18} className="text-brand" />
          support@lumiaxy.study
        </div>
        <div className="grid grid-cols-1 gap-3">
          <input
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40"
            placeholder="Your email"
          />
          <textarea
            className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-brand/40"
            placeholder="Message"
          />
          <button className="px-6 py-3 rounded-2xl bg-brand text-white text-sm font-bold inline-flex items-center justify-center gap-2 hover:scale-[1.01] transition-all">
            <Send size={16} />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

