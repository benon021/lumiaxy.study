"use client";

import { motion } from "framer-motion";

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">Blog</h1>
        <p className="text-white/40 mt-3">Product updates, study tips, and engineering notes.</p>
      </motion.div>

      <div className="glass rounded-[32px] p-8 border border-white/10 text-white/40">
        No posts yet.
      </div>
    </div>
  );
}

