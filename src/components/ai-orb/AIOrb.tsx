"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AIOrb.module.css";
import { clsx } from "clsx";

export type AIOrbState = "idle" | "listening" | "thinking" | "speaking";

interface AIOrbProps {
  state?: AIOrbState;
  size?: number;
  className?: string;
  onClick?: () => void;
  reactive?: boolean;
}

export default function AIOrb({
  state = "idle",
  size = 120,
  className,
  onClick,
  reactive = true
}: AIOrbProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [volume, setVolume] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  // Parallax logic for 3D glass feel
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const id = Date.now();
      setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
    }
    if (onClick) onClick();
  };

  // Lumiaxy Palette (Reference image)
  const colors = {
    primary: "#6272f1", // Deep Purple
    accent: "#00e5ff",  // Electric Blue
    glow: "#ec4899",    // Soft Pink
    core: "#1e1b4b"     // Deep Indigo
  };

  // Neural Energy Strands (Alive Energy)
  const strands = [
    { id: 1, color: colors.primary, d: "M 10 50 C 30 10, 70 80, 90 50", duration: 3.5 },
    { id: 2, color: colors.accent, d: "M 15 30 C 40 90, 60 10, 85 70", duration: 2.8 },
    { id: 3, color: colors.glow, d: "M 0 50 C 50 20, 50 80, 100 50", duration: 4.2 },
    { id: 4, color: "#fff", d: "M 20 80 C 40 20, 70 80, 80 20", duration: 3.1, opacity: 0.3 },
    { id: 5, color: colors.primary, d: "M 30 10 C 10 70, 90 70, 70 10", duration: 2.5 },
  ];

  const orbClasses = clsx(
    styles.orb,
    styles[state],
    className
  );

  return (
    <div
      ref={containerRef}
      className={clsx(styles.orbContainer, className)}
      style={{ width: size, height: size }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className={orbClasses}
        animate={{
          rotateX: mousePos.y * 25,
          rotateY: mousePos.x * 25,
          scale: state === "listening" || state === "speaking" ? [1, 1.05, 1] : 1,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <div className={styles.orbLayer} />
        <div className={styles.orbLayer2} />

        {/* Dynamic Inner core with star particles */}
        <div className={styles.orbInner}>
          <div className={styles.innerCore} />
          
          <svg className={styles.strandsContainer} viewBox="0 0 100 100" preserveAspectRatio="none">
            {strands.map((s, i) => (
              <motion.path
                key={s.id}
                d={s.d}
                stroke={s.color}
                strokeWidth={1.5}
                className={styles.strand}
                animate={{
                  d: [
                    s.d,
                    `M ${5 + i * 8} ${30 + (i % 2 ? 20 : -10)} C 50 ${i % 2 ? 0 : 100}, ${90 - i * 8} ${i % 2 ? 100 : 0}, 85 50`,
                    s.d
                  ],
                  opacity: s.opacity || (state === "idle" ? 0.6 : 1),
                  strokeWidth: state === "thinking" ? 2.5 : 1.5
                }}
                transition={{
                  duration: s.duration / (state === "thinking" ? 2 : 1),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </svg>
        </div>

        {/* Cinematic Optics (Glass and Shines) */}
        <div className={styles.refractionLayer} />
        <div className={styles.surfaceReflection} />
      </motion.div>

      {/* Touch/Click Feedback */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.span
            key={r.id}
            className={styles.ripple}
            style={{ left: r.x, top: r.y }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
