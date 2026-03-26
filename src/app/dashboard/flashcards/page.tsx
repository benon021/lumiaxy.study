"use client";

import { motion } from "framer-motion";
import { Sparkles, Layers } from "lucide-react";

export default function FlashcardsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-32">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <Layers size={28} className="text-brand" />
          Flashcards
        </h1>
        <p className="text-white/40 text-sm">Quick memory drills. (UI ready — content wiring next.)</p>
      </motion.div>

      <div className="glass rounded-[32px] p-10 border border-white/10 text-white/30 space-y-4">
        <p>
          This section is created so no links are empty. Next step is to connect flashcards to Topics/Materials (or a new Prisma model).
        </p>
        <button className="px-6 py-3 rounded-2xl bg-brand text-white text-sm font-bold inline-flex items-center gap-2 hover:scale-[1.01] transition-all">
          <Sparkles size={16} />
          Generate Flashcards (coming soon)
        </button>
      </div>
    </div>
  );
}

