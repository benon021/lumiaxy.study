"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Shield, Globe, Code2, BarChart2, CheckCircle2
} from "lucide-react";

const tabs = [
  {
    id: "performance",
    icon: Zap,
    label: "Performance",
    headline: "Speed that scales with you",
    description:
      "Lumiaxy's edge-first architecture means your application is always fast, no matter the load. We handle auto-scaling, caching, and CDN delivery automatically.",
    points: [
      "Sub-100ms global response times",
      "Automatic horizontal scaling",
      "Smart caching at every layer",
      "Zero cold-start latency",
    ],
    color: "#6272f1",
    visual: "performance",
  },
  {
    id: "security",
    icon: Shield,
    label: "Security",
    headline: "Zero-compromise security",
    description:
      "Enterprise-grade security with SOC 2 Type II certification. Every piece of data is encrypted, every access is authenticated, every endpoint is monitored.",
    points: [
      "256-bit AES encryption",
      "SOC 2 Type II certified",
      "Real-time threat detection",
      "Fine-grained RBAC controls",
    ],
    color: "#10b981",
    visual: "security",
  },
  {
    id: "scalability",
    icon: Globe,
    label: "Scalability",
    headline: "Built for any scale",
    description:
      "From a solo developer to a 50,000-seat enterprise, Lumiaxy scales with your ambition. Our infrastructure handles traffic spikes automatically.",
    points: [
      "300+ global edge locations",
      "Microservices architecture",
      "99.99% SLA guarantee",
      "Multi-region redundancy",
    ],
    color: "#00e5ff",
    visual: "scalability",
  },
  {
    id: "developer",
    icon: Code2,
    label: "Developer API",
    headline: "APIs developers love",
    description:
      "Clean, well-documented REST and GraphQL APIs with official SDKs for Node, Python, Go, and more. Integrate Lumiaxy into any stack in minutes.",
    points: [
      "REST & GraphQL endpoints",
      "Webhooks & real-time events",
      "Comprehensive SDK library",
      "Interactive API playground",
    ],
    color: "#8b5cf6",
    visual: "developer",
  },
  {
    id: "analytics",
    icon: BarChart2,
    label: "Analytics",
    headline: "Insights at your fingertips",
    description:
      "Real-time dashboards, custom reports, and AI-driven insights give you a complete picture of your platform's health and user behavior.",
    points: [
      "Real-time event streaming",
      "Custom dashboard builder",
      "Anomaly detection & alerts",
      "Export to any data warehouse",
    ],
    color: "#f59e0b",
    visual: "analytics",
  },
];

function Visual({ type, color }: { type: string; color: string }) {
  const bars = [40, 65, 55, 80, 70, 90, 75, 95];

  return (
    <div className="relative w-full h-full min-h-[280px] flex items-center justify-center p-8">
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${color}12 0%, transparent 70%)`,
        }}
      />

      {type === "analytics" ? (
        <div className="w-full flex items-end gap-2 h-40">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
              className="flex-1 rounded-t-sm origin-bottom"
              style={{
                height: `${h}%`,
                background:
                  i === bars.length - 1
                    ? `linear-gradient(180deg, ${color}, ${color}80)`
                    : `${color}25`,
              }}
            />
          ))}
        </div>
      ) : type === "security" ? (
        <div className="relative flex items-center justify-center">
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute rounded-full border"
              style={{
                width: `${ring * 100}px`,
                height: `${ring * 100}px`,
                borderColor: `${color}${ring === 3 ? "20" : ring === 2 ? "30" : "50"}`,
                animation: `spin ${8 + ring * 4}s linear infinite ${ring % 2 ? "" : "reverse"}`,
              }}
            />
          ))}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: `${color}20`, border: `1px solid ${color}40` }}
          >
            <Shield className="w-8 h-8" style={{ color }} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="aspect-square rounded-xl"
              style={{
                background: i === 4 ? `${color}30` : `${color}${10 + (i % 3) * 5}`,
                border: i === 4 ? `1px solid ${color}60` : "1px solid transparent",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FeatureDetails() {
  const [activeTab, setActiveTab] = useState("performance");
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section id="platform" className="relative py-32 px-4 sm:px-6">
      {/* BG */}
      <div className="absolute inset-0 bg-dark-900/30" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-mono font-medium text-accent-cyan border border-accent-cyan/20 bg-accent-cyan/10 mb-6 uppercase tracking-widest">
            Deep Dive
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">
            Built for modern teams
          </h2>
          <p className="mt-4 text-white/50 max-w-xl mx-auto">
            Explore each pillar of the Lumiaxy platform in detail.
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-white/40 hover:text-white/70 glass hover:border-white/10"
                }`}
                style={
                  isActive
                    ? {
                        background: `${t.color}20`,
                        border: `1px solid ${t.color}40`,
                        color: t.color,
                      }
                    : {}
                }
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-3xl overflow-hidden grid lg:grid-cols-2"
          >
            {/* Left: text */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: `${active.color}15`,
                  border: `1px solid ${active.color}30`,
                }}
              >
                <active.icon className="w-6 h-6" style={{ color: active.color }} />
              </div>
              <h3 className="font-display font-bold text-3xl text-white mb-4">
                {active.headline}
              </h3>
              <p className="text-white/55 leading-relaxed mb-8">{active.description}</p>
              <ul className="flex flex-col gap-3">
                {active.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-white/70">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: active.color }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: visual */}
            <div
              className="relative lg:border-l border-white/[0.06]"
              style={{
                background: `linear-gradient(135deg, ${active.color}06, transparent)`,
              }}
            >
              <Visual type={active.visual} color={active.color} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
