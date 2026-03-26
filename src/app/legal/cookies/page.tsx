"use client";

import { motion } from "framer-motion";

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">Cookie Policy</h1>
        <p className="text-white/40 mt-3">How cookies are used.</p>
      </motion.div>

      <div className="glass rounded-[32px] p-8 border border-white/10 text-white/50 leading-relaxed">
        This is a placeholder cookie policy page so no footer links are empty. Replace with your legal text.
      </div>
    </div>
  );
}

