"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-24 px-4 sm:px-6 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full opacity-30 animate-pulse-glow"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(98,114,241,0.4) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute top-10 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,229,255,0.4) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse at center, rgba(139,92,246,0.5) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Deep space nebula */}
        <div
          className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle at center, rgba(236,72,153,0.3) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium text-brand-300 border border-brand-500/20 bg-brand-500/10 backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Introducing Lumiaxy Platform v2.0
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[1.05] max-w-5xl"
        >
          Master Your Exams{" "}
          <span className="relative">
            <span className="gradient-text">Smarter</span>
          </span>
          <br />
          with Lumiaxy
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mt-6 text-lg sm:text-xl text-white/55 max-w-2xl leading-relaxed font-body"
        >
          Access thousands of past papers, curated study notes, and get instant
          explanations from Lumiaxy.ai — all in one futuristic study environment.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/signup"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #ff7200 0%, #ea580c 100%)" }}
          >
            <span className="relative z-10">Get Started Free</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(135deg, #ff7200, #ea580c)",
                filter: "blur(12px)",
                zIndex: -1,
              }}
            />
          </Link>

          <Link
            href="#features"
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-base font-semibold text-white/70 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center">
              <Play className="w-3 h-3 fill-brand-400 text-brand-400 ml-0.5" />
            </div>
            See how it works
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="mt-8 flex items-center gap-3 text-sm text-white/40"
        >
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-dark-950 flex items-center justify-center text-xs font-bold text-white"
                style={{
                  background: `hsl(${220 + i * 20}, 70%, 45%)`,
                }}
              >
                {["A", "B", "C", "D", "E"][i]}
              </div>
            ))}
          </div>
          <span>
            Trusted by{" "}
            <strong className="text-white/70">50,000+</strong> teams worldwide
          </span>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="mt-16 w-full max-w-5xl"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
