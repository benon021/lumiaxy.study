"use client";

import { motion } from "framer-motion";

const brands = [
  "Stripe", "Vercel", "Notion", "Linear", "Figma", "Supabase",
  "PlanetScale", "Resend", "Clerk", "Neon", "Turso", "Upstash",
];

export default function TrustBar() {
  return (
    <section className="relative py-16 overflow-hidden border-y border-white/[0.05]">
      <div className="absolute inset-0 bg-dark-900/50" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <p className="text-center text-sm font-medium text-white/30 uppercase tracking-widest mb-8 font-mono">
          trusted byt most school in kenya
        </p>

        {/* Marquee */}
        <div className="marquee-container">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...brands, ...brands].map((brand, i) => (
              <div
                key={`${brand}-${i}`}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/40 hover:text-white/60 hover:border-white/[0.1] transition-all duration-300 cursor-default flex-shrink-0"
              >
                <div
                  className="w-5 h-5 rounded-md"
                  style={{
                    background: `hsl(${220 + (i % 10) * 20}, 60%, 50%)`,
                    opacity: 0.7,
                  }}
                />
                <span className="text-sm font-semibold font-body">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
