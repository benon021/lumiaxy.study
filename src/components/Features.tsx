"use client";

import { motion } from "framer-motion";
import {
  Zap, Shield, Globe, Code2, BarChart2, Layers,
  ArrowRight, Cpu, Lock, Sparkles
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "24/7 Lumiaxy.ai Helper",
    desc: "Stuck on a problem? Lumiaxy.ai explains complex concepts simply, solves equations, and helps you brainstorm essay ideas instantly.",
    color: "#6272f1",
    span: "sm:col-span-2",
    big: true,
  },
  {
    icon: Layers,
    title: "Curated Past Papers",
    desc: "Huge library of exam papers from previous years, organized by subject and level, ready for download.",
    color: "#10b981",
    span: "",
  },
  {
    icon: Code2,
    title: "Detailed Study Notes",
    desc: "Expertly condensed notes that focus on what actually comes in the exam. Skip the fluff, master the core.",
    color: "#00e5ff",
    span: "",
  },
  {
    icon: Globe,
    title: "Offline Access",
    desc: "Download your notes and papers to study anywhere, even without an internet connection.",
    color: "#8b5cf6",
    span: "",
  },
  {
    icon: BarChart2,
    title: "Progress Tracking",
    desc: "Visualize your study sessions, track topics you've mastered, and identifies areas that need more focus.",
    color: "#f59e0b",
    span: "sm:col-span-2",
    big: true,
  },
  {
    icon: Zap,
    title: "Flashcard Generator",
    desc: "Convert your notes into interactive flashcards automatically using our AI engine.",
    color: "#ec4899",
    span: "",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    desc: "Your study data and AI chats are private. We never share your data with third parties.",
    color: "#06b6d4",
    span: "",
  },
  {
    icon: Lock,
    title: "Zero Distractions",
    desc: "A clean, focus-oriented interface designed to keep you in the zone for longer.",
    color: "#84cc16",
    span: "",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Features() {
  return (
    <section id="features" className="relative py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-medium text-brand-300 border border-brand-500/20 bg-brand-500/10 mb-6 uppercase tracking-widest">
            Study Resources
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Study better,{" "}
            <span className="gradient-text">achieve more</span>
          </h2>
          <p className="mt-5 text-lg text-white/50 max-w-2xl mx-auto">
            Lumiaxy.study brings all your learning materials together with powerful AI assistance.
            Designed for students who want to excel without the stress.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={itemVariants}
                className={`${f.span || ""} group glass rounded-2xl p-7 card-hover cursor-default relative overflow-hidden`}
              >
                {/* BG glow */}
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${f.color}20 0%, transparent 70%)`,
                    filter: "blur(20px)",
                  }}
                />

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: `${f.color}15`,
                    border: `1px solid ${f.color}30`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>

                <h3 className="font-display font-semibold text-lg text-white mb-2.5">
                  {f.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>

                {f.big && (
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-medium group-hover:gap-2.5 transition-all duration-200" style={{ color: f.color }}>
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
