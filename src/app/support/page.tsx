"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-white tracking-tight">Support</h1>
        <p className="text-white/40 mt-3">Need help? We’re here.</p>
      </motion.div>

      <div className="glass rounded-[32px] p-8 border border-white/10 text-white/50 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand/15 border border-brand/25 flex items-center justify-center">
            <Mail size={18} className="text-brand" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Email</p>
            <p className="text-sm text-white/40">support@lumiaxy.study</p>
          </div>
        </div>
        <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-white transition-colors">
          Contact form <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}

