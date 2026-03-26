"use client";

import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-32">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <Inbox size={28} className="text-brand" />
          Inbox
        </h1>
        <p className="text-white/40 text-sm">Direct messages and announcements will appear here.</p>
      </motion.div>

      <div className="glass rounded-[32px] p-10 border border-white/10 text-center text-white/30">
        No messages yet.
      </div>
    </div>
  );
}

