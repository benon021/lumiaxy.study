"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Amara Diallo",
    role: "CTO, NovaTech Africa",
    quote:
      "Lumiaxy cut our infrastructure costs by 40% while tripling our deployment speed. The developer experience is simply unmatched.",
    rating: 5,
    avatar: "AD",
    color: "#6272f1",
  },
  {
    name: "Priya Sharma",
    role: "VP Engineering, Stackr",
    quote:
      "The security controls alone made the switch worth it. SOC 2 compliance was a blocker for us — Lumiaxy had it on day one.",
    rating: 5,
    avatar: "PS",
    color: "#10b981",
  },
  {
    name: "Marcus Chen",
    role: "Founder, Shipfast.io",
    quote:
      "I replaced 5 different services with Lumiaxy. The API is so clean that my team actually enjoys integrating with it.",
    rating: 5,
    avatar: "MC",
    color: "#8b5cf6",
  },
  {
    name: "Leila Osei",
    role: "Head of Product, Lunar Labs",
    quote:
      "The real-time analytics dashboard changed how we make decisions. We went from weekly reviews to real-time course corrections.",
    rating: 5,
    avatar: "LO",
    color: "#00e5ff",
  },
  {
    name: "David Nakamura",
    role: "Senior Dev, Finflow",
    quote:
      "99.99% uptime isn't just a marketing claim — we've been on Lumiaxy for 14 months and haven't had a single outage.",
    rating: 5,
    avatar: "DN",
    color: "#f59e0b",
  },
  {
    name: "Saoirse Murphy",
    role: "Platform Lead, Crisp",
    quote:
      "The scalable architecture means we can focus on building features, not fighting infrastructure fires at 2am.",
    rating: 5,
    avatar: "SM",
    color: "#ec4899",
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-medium text-brand-300 border border-brand-500/20 bg-brand-500/10 mb-6 uppercase tracking-widest">
            Customer Stories
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">
            Loved by builders{" "}
            <span className="gradient-text">worldwide</span>
          </h2>
          <p className="mt-4 text-white/50 max-w-lg mx-auto">
            Join tens of thousands of teams who trust Lumiaxy to power their most important work.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-2xl p-7 flex flex-col gap-5 card-hover cursor-default relative overflow-hidden"
            >
              {/* BG accent */}
              <div
                className="absolute top-0 left-0 w-full h-0.5"
                style={{ background: `linear-gradient(90deg, transparent, ${t.color}60, transparent)` }}
              />

              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-white/65 leading-relaxed flex-1">"{t.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `${t.color}30`, border: `1px solid ${t.color}40` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
