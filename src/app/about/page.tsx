"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">About Lumiaxy</h1>
        <p className="text-white/40 mt-3">
          Lumiaxy is built to help students learn faster with high-quality resources and AI-assisted understanding.
        </p>
      </motion.div>

      <div className="glass rounded-[32px] p-8 border border-white/10 text-white/50 leading-relaxed">
        This page exists so all footer links are real and clickable. You can replace this copy with your official story anytime.
      </div>
    </div>
  );
}

