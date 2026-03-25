"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
  { value: 52000, suffix: "+", label: "Active Teams", desc: "Building with Lumiaxy" },
  { value: 99.99, suffix: "%", label: "Uptime SLA", desc: "Guaranteed availability" },
  { value: 8.4, suffix: "M", label: "Requests / sec", desc: "At peak load" },
  { value: 300, suffix: "+", label: "Edge Locations", desc: "Globally distributed" },
];

function AnimatedNumber({ value, suffix, once }: { value: number; suffix: string; once: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!once) return;
    const duration = 1800;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * ease);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [once, value]);

  const fmt = value % 1 !== 0
    ? display.toFixed(2)
    : Math.round(display).toLocaleString();

  return (
    <span>
      {fmt}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 px-4 sm:px-6 overflow-hidden">
      {/* Bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(98,114,241,0.06) 50%, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass rounded-2xl p-8 text-center card-hover cursor-default"
            >
              <p className="font-display font-bold text-4xl sm:text-5xl text-white mb-2">
                <AnimatedNumber value={s.value} suffix={s.suffix} once={inView} />
              </p>
              <p className="text-sm font-semibold text-white/70 mb-1">{s.label}</p>
              <p className="text-xs text-white/35">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
