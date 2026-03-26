"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FileText, 
  BookOpen, 
  Sparkles, 
  CreditCard, 
  Mail, 
  Home,
  Search,
  User,
  Info
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import AIOrb from "./ai-orb/AIOrb";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Papers", href: "#papers", icon: FileText },
  { label: "Notes", href: "#notes", icon: BookOpen },
  { label: "Lumiaxy.ai", href: "#ai", icon: Sparkles, isAi: true },
  { label: "About", href: "#about", icon: Info },
  { label: "Pricing", href: "#pricing", icon: CreditCard },
  { label: "Contact", href: "#contact", icon: Mail },
];

function NavIcon({ href, icon: Icon, label, mouseX, isAi }: any) {
  const ref = (isAi: boolean) => {}; // Placeholder for ref if needed
  
  const distance = useMotionValue(Infinity);
  const widthTransform = useTransform(distance, [-100, 0, 100], [42, 70, 42]);
  const heightTransform = useTransform(distance, [-100, 0, 100], [42, 70, 42]);
  
  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  });

  return (
    <Link href={href} className="relative group">
      <motion.div
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          distance.set(e.pageX - centerX);
        }}
        onMouseLeave={() => distance.set(Infinity)}
        style={{ width, height }}
        className={`flex items-center justify-center rounded-2xl border border-white/10 shadow-lg group-hover:shadow-brand-500/40 relative overflow-hidden ${
          isAi 
            ? "bg-gradient-to-br from-brand-500/20 to-purple-600/20" 
            : "bg-white/5 backdrop-blur-md"
        }`}
      >
        {isAi ? (
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-brand/50 transition-all duration-500">
             <AIOrb size={40} state="idle" reactive={false} />
          </div>
        ) : (
          <Icon className="w-1/2 h-1/2 text-white/70 group-hover:text-white transition-colors" />
        )}
        
        {/* Tooltip */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: -45 }}
            className="absolute left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-800 border border-white/10 rounded-lg text-[10px] font-medium text-white pointer-events-none whitespace-nowrap shadow-xl"
          >
            {label}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

export default function Navbar() {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex items-end gap-3 px-4 py-3 bg-dark-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl h-[70px]"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {navLinks.map((link) => (
          <NavIcon 
            key={link.href} 
            {...link} 
            mouseX={mouseX} 
          />
        ))}
        
        <div className="w-[1px] h-8 bg-white/10 mx-1 mb-2" />
        
        <NavIcon 
          href="#search" 
          icon={Search} 
          label="Search" 
          mouseX={mouseX} 
        />
        <NavIcon 
          href="/login" 
          icon={User} 
          label="Account" 
          mouseX={mouseX} 
        />
      </motion.nav>
    </div>
  );
}
