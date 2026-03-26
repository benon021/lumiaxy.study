"use client";

import { motion } from "framer-motion";

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">Security</h1>
        <p className="text-white/40 mt-3">Security overview and reporting.</p>
      </motion.div>

      <div className="glass rounded-[32px] p-8 border border-white/10 text-white/50 leading-relaxed">
        This is a placeholder security page. Add your vulnerability disclosure and security practices here.
      </div>
    </div>
  );
}

