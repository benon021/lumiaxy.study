"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight } from "lucide-react";

const pillars = [
  "Comprehensive past paper archives",
  "Concise and accurate study notes",
  "Intelligent AI tutoring 24/7",
  "Clean, focus-mode study environment",
  "Open to students from all levels",
  "Constantly updated with new syllabus",
];

export default function About() {
  return (
    <section id="about" className="relative py-32 px-4 sm:px-6 overflow-hidden">
      {/* Decorative orb */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-medium text-accent-violet border border-accent-violet/20 bg-accent-violet/10 mb-6 uppercase tracking-widest">
            About Lumiaxy.study
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-5xl tracking-tight leading-[1.1] mb-6">
            We believe learning{" "}
            <span className="gradient-text">should be empowering</span>
          </h2>
          <p className="text-lg text-white/55 leading-relaxed mb-5">
            Lumiaxy.study was founded on a simple mission: to make high-quality study
            resources and expert guidance accessible to every student, everywhere.
          </p>
          <p className="text-base text-white/40 leading-relaxed mb-10">
            By combining a vast library of past papers and notes with cutting-edge AI,
            we help students overcome blocks, save time, and achieve their full potential.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pillars.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-start gap-2.5 text-sm text-white/60"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                {p}
              </motion.li>
            ))}
          </ul>

          <motion.a
            href="#cta"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-brand-200 transition-colors group"
          >
            Learn more about our platform
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.a>
        </motion.div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative"
        >
          {/* Decorative circles */}
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* Outer ring */}
            <div
              className="absolute inset-0 rounded-full border border-brand-500/10 animate-spin-slow"
              style={{ animationDuration: "20s" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand-400" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-accent-cyan/60" />
            </div>

            {/* Mid ring */}
            <div
              className="absolute inset-12 rounded-full border border-accent-violet/15 animate-spin-slow"
              style={{ animationDuration: "15s", animationDirection: "reverse" }}
            >
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent-violet/70" />
            </div>

            {/* Center orb */}
            <div className="absolute inset-24 rounded-full flex items-center justify-center"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(98,114,241,0.4), rgba(139,92,246,0.3), rgba(0,229,255,0.1))",
                boxShadow: "0 0 60px rgba(98,114,241,0.3)",
              }}
            >
              <div className="text-center">
                <p className="font-display font-bold text-3xl text-white">10x</p>
                <p className="text-xs text-white/50 mt-1">Faster</p>
              </div>
            </div>

            {/* Floating cards */}
            {[
              { label: "Uptime", val: "100%", top: "10%", right: "-5%", color: "#10b981" },
              { label: "Speed", val: "99ms", bottom: "20%", left: "-8%", color: "#6272f1" },
              { label: "Security", val: "A+", top: "45%", right: "-12%", color: "#8b5cf6" },
            ].map((card) => (
              <motion.div
                key={card.label}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
                className="absolute glass rounded-xl px-4 py-2.5 text-center"
                style={{ top: card.top, right: card.right, bottom: card.bottom, left: card.left }}
              >
                <p className="text-xs text-white/40 mb-0.5">{card.label}</p>
                <p className="font-display font-bold text-lg" style={{ color: card.color }}>
                  {card.val}
                </p>
              </motion.div>
            ))}

            {/* Dot grid */}
            <div className="absolute -inset-8 dot-grid opacity-20 -z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
