"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function LiquidBackground() {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkOnline = () => setIsOffline(!navigator.onLine);

    checkMobile();
    checkOnline();

    window.addEventListener("resize", checkMobile);
    window.addEventListener("online", () => setIsOffline(false));
    window.addEventListener("offline", () => setIsOffline(true));

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("online", () => setIsOffline(false));
      window.removeEventListener("offline", () => setIsOffline(true));
    };
  }, []);

  const themeColors = {
    deep: {
      wave1: "rgba(98, 114, 241, 0.08)", // Deep Purple
      wave2: "rgba(236, 72, 153, 0.05)", // Soft Pink/Magenta
      wave3: "rgba(0, 229, 255, 0.03)",  // Electric Blue
      glow: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)"
    },
    daylight: {
      wave1: "rgba(0, 150, 255, 0.08)",
      wave2: "rgba(0, 200, 200, 0.05)",
      wave3: "rgba(255, 255, 255, 0.4)",
      glow: "radial-gradient(circle at 50% 50%, rgba(0, 150, 255, 0.15) 0%, transparent 80%)"
    }
  };

  const colors = themeColors[theme];

  // Number of waves is reduced on mobile or offline for performance
  const waveCount = isOffline ? 1 : (isMobile ? 2 : 4);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* Base Background */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${theme === "daylight" ? "bg-slate-50" : "bg-dark-950"
        }`} />

      {/* Ambient Glow */}
      <motion.div
        className="absolute inset-0"
        style={{ background: colors.glow }}
        animate={{
          opacity: isOffline ? 0.3 : [0.5, 0.8, 0.5],
          scale: isOffline ? 1 : [1, 1.1, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* SVG Waves */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 800">
        <defs>
          <filter id="liquid-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={isOffline ? "5" : "20"} result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          </filter>
        </defs>

        <g filter={isMobile ? "" : "url(#liquid-blur)"}>
          {Array.from({ length: waveCount }).map((_, i) => (
            <motion.path
              key={i}
              fill={i % 2 === 0 ? colors.wave1 : colors.wave2}
              initial={{ d: "M0 400 Q360 300 720 400 T1440 400 V800 H0 Z" }}
              animate={isOffline ? {} : {
                d: [
                  `M0 ${400 + i * 20} Q${360 + (i * 100)} ${300 - (i * 50)} 720 ${400 + i * 20} T1440 ${400 + i * 20} V800 H0 Z`,
                  `M0 ${420 + i * 20} Q${360 - (i * 100)} ${350 + (i * 50)} 720 ${420 + i * 20} T1440 ${420 + i * 20} V800 H0 Z`,
                  `M0 ${400 + i * 20} Q${360 + (i * 100)} ${300 - (i * 50)} 720 ${400 + i * 20} T1440 ${400 + i * 20} V800 H0 Z`,
                ]
              }}
              transition={{
                duration: 15 + i * 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </g>
      </svg>

      {/* Overlay Grain/Crystalline Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />
    </div>
  );
}
