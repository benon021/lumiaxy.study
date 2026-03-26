"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function SocialTwitterPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">Twitter</h1>
        <p className="text-white/40 mt-3">Connect your official social link here.</p>
      </motion.div>
      <div className="glass rounded-[32px] p-8 border border-white/10 text-white/50">
        Replace this page with a redirect to your real Twitter/X profile when ready.
        <div className="mt-4">
          <Link href="/" className="inline-flex items-center gap-2 text-brand font-bold hover:text-white transition-colors">
            Back home <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

