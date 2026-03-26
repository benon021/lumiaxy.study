"use client";

import { motion } from "framer-motion";
import { BarChart2, Globe, Shield, Code2, TrendingUp } from "lucide-react";
import AIOrb from "./ai-orb/AIOrb";

const metrics = [
  { label: "Study Hours", value: "248", change: "+12%", color: "#6272f1" },
  { label: "Papers Solved", value: "124", change: "+8%", color: "#10b981" },
  { label: "Grade Up", value: "+1.2", change: "+0.3", color: "#00e5ff" },
  { label: "Flashcards", value: "1.2K", change: "+31%", color: "#8b5cf6" },
];

const barHeights = [35, 55, 45, 70, 60, 80, 65, 90, 75, 85, 70, 95];

export default function DashboardMockup() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_40px_120px_rgba(98,114,241,0.2)]">
      {/* Shimmer top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(98,114,241,0.8) 30%, rgba(139,92,246,0.8) 70%, transparent)",
        }}
      />

      {/* Window chrome */}
      <div className="bg-dark-800/90 backdrop-blur-xl px-5 py-3.5 flex items-center gap-3 border-b border-white/[0.06]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <div className="flex-1 mx-4 bg-dark-700/60 rounded-lg px-4 py-1.5 text-xs text-white/30 font-mono text-center">
          app.lumiaxy.study/dashboard
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-white/40">Live</span>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="bg-dark-900/95 p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Left sidebar */}
        <div className="flex flex-col gap-3">
          {/* Logo/brand area */}
          <div className="glass rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-brand/40 transition-colors">
                <AIOrb size={32} state="idle" reactive={false} />
              </div>
            <div>
              <p className="text-sm font-semibold text-white">Lumiaxy.study</p>
              <p className="text-xs text-white/40">Student Hub v2</p>
            </div>
          </div>

          {/* Metrics */}
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
              className="glass rounded-xl p-3.5 card-hover cursor-default"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/50">{m.label}</span>
                <span className="text-xs font-medium text-emerald-400">{m.change}</span>
              </div>
              <p className="text-xl font-bold font-display" style={{ color: m.color }}>
                {m.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Center chart */}
        <div className="sm:col-span-2 flex flex-col gap-4">
          {/* Chart card */}
          <div className="glass rounded-xl p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-white">Learning Progress</p>
                <p className="text-xs text-white/40 mt-0.5">Focus time per month</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <TrendingUp className="w-3 h-3" />
                +28.4%
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-1.5 h-32">
              {barHeights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.8 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                  className="flex-1 rounded-t-sm origin-bottom"
                  style={{
                    height: `${h}%`,
                    background:
                      i === barHeights.length - 1
                        ? "linear-gradient(180deg, #6272f1, #8b5cf6)"
                        : "rgba(98, 114, 241, 0.25)",
                  }}
                />
              ))}
            </div>

            {/* X labels */}
            <div className="flex justify-between mt-2">
              {["Jan", "Mar", "May", "Jul", "Sep", "Nov"].map((m) => (
                <span key={m} className="text-[10px] text-white/25">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Globe, label: "All Subjects", desc: "Curated resources", color: "#00e5ff" },
              { icon: Shield, label: "AI Assisted", desc: "Smart explanations", color: "#10b981" },
              { icon: Code2, label: "Exam Ready", desc: "Past paper bank", color: "#8b5cf6" },
            ].map(({ icon: Icon, label, desc, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="glass rounded-xl p-3.5 flex flex-col gap-2 card-hover cursor-default"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{label}</p>
                  <p className="text-[10px] text-white/40">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
