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

  // Mouse parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const id = Date.now();
      setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
    }
    
    if (onClick) onClick();
    
    if (state === "idle" && reactive) {
      startListening();
    }
  };

  const startListening = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        setVolume(average / 128); // Normalize to 0-1
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      
      updateVolume();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  // Map state to CSS classes
  const orbClasses = clsx(
    styles.orb,
    state === "listening" && styles.listening,
    state === "thinking" && styles.thinking,
    state === "speaking" && styles.speaking
  );

  // Dynamic values based on volume and state
  const scale = 1 + (state === "speaking" || state === "listening" ? volume * 0.2 : 0);
  const glowIntensity = 0.3 + (state === "speaking" || state === "listening" ? volume * 0.5 : 0);

  // Hyper-complex neural energy strands crossing inside the glass orb
  const strands = [
    { id: 1, color: "#ff7200", d: "M 10 50 C 30 10, 70 80, 90 50", duration: 3.5 },
    { id: 2, color: "#00e5ff", d: "M 15 30 C 40 90, 60 10, 85 70", duration: 2.8 },
    { id: 3, color: "#eba354", d: "M 0 50 C 50 20, 50 80, 100 50", duration: 4.2 },
    { id: 4, color: "#00bfff", d: "M 20 80 C 40 20, 70 80, 80 20", duration: 3.1 },
    { id: 5, color: "#ff4d00", d: "M 10 20 C 50 90, 80 10, 90 90", duration: 4.8 },
    { id: 6, color: "#4dffff", d: "M 30 10 C 10 70, 90 70, 70 10", duration: 2.5 },
    { id: 7, color: "#fff", d: "M 40 40 C 60 40, 60 60, 40 60", duration: 1.5, strokeWidth: 0.5 }, // core tiny light
  ];

  // Random particles for the stars inside the void
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: 20 + Math.random() * 60,
    y: 20 + Math.random() * 60,
    size: 0.5 + Math.random() * 1.5,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 2
  }));

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
          rotateX: mousePos.y * 30,
          rotateY: mousePos.x * 30,
          scale: scale,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      >
        <div className={styles.orbLayer} />
        <div className={styles.orbLayer2} />
        
        {/* Internal Components */}
        <div className={styles.orbInner}>
           <div className={styles.innerCore} /> {/* Behind strands now */}
           {particles.map((p) => (
              <motion.div
                key={p.id}
                className={styles.particle}
                style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
                animate={{
                  opacity: [0.1, 1, 0.1],
                  scale: [0.8, 1.5, 0.8]
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: "easeInOut"
                }}
              />
           ))}
           <svg className={styles.strandsContainer} viewBox="0 0 100 100" preserveAspectRatio="none">
             {strands.map((strand, i) => (
                <motion.path
                  key={strand.id}
                  d={strand.d}
                  stroke={strand.color}
                  className={styles.strand}
                  animate={{
                    d: [
                      strand.d,
                      `M ${5 + i * 5} ${40 + (i % 2 ? 10 : -10)} C 50 ${i % 2 ? 10 : 90}, ${90 - i * 5} ${i % 2 ? 90 : 10}, 80 50`,
                      strand.d
                    ],
                    strokeWidth: strand.strokeWidth || (1.5 + volume * 4),
                    opacity: 0.6 + volume * 0.4
                  }}
                  transition={{
                    duration: strand.duration / (state === "thinking" ? 2 : 1),
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
             ))}
           </svg>
        </div>

        {/* Optics Layers */}
        <div className={styles.refractionLayer} />
        <div className={styles.surfaceReflection} />
        
        {/* Glow effect */}
        <div 
          className={styles.glow} 
          style={{ opacity: glowIntensity }}
        />
      </motion.div>

      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className={styles.ripple}
            style={{ left: ripple.x, top: ripple.y }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
