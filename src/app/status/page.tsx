"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function StatusPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">Status</h1>
        <p className="text-white/40 mt-3">Service health overview.</p>
      </motion.div>

      <div className="glass rounded-[32px] p-8 border border-white/10 flex items-center gap-3 text-white/60">
        <CheckCircle2 size={18} className="text-emerald-400" />
        All systems operational.
      </div>
    </div>
  );
}

