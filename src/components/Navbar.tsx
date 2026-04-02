"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  Home, Star, Lightbulb, Activity, CreditCard, Layers, LogIn, Menu, X
} from "lucide-react";
import AIOrb from "./ai-orb/AIOrb";

const navLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Features", href: "/features", icon: Star },
  { label: "Study Tools", href: "/study-tools", icon: Lightbulb },
  { label: "How It Works", href: "/how-it-works", icon: Activity },
  { label: "Pricing", href: "/pricing", icon: CreditCard },
  { label: "Resources", href: "/resources", icon: Layers },
];

function DesktopNavIcon({ href, icon: Icon, label, mouseX }: any) {
  const distance = useMotionValue(Infinity);
  // Increased width and hit area from 42/70 to 50/90
  const widthTransform = useTransform(distance, [-120, 0, 120], [50, 90, 50]);
  const heightTransform = useTransform(distance, [-120, 0, 120], [50, 90, 50]);

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 300, damping: 20 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 300, damping: 20 });

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
        className="flex items-center justify-center rounded-2xl border border-transparent bg-transparent text-white/50 hover:text-white group-hover:bg-white/5 backdrop-blur-md group-hover:border-white/10 shadow-none group-hover:shadow-xl transition-all"
      >
        <Icon className="w-1/2 h-1/2 transition-colors" />

        {/* Tooltip */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: -55 }}
            className="absolute left-1/2 -translate-x-1/2 px-3 py-1.5 bg-dark-800 border border-white/10 rounded-lg text-xs font-bold text-white pointer-events-none whitespace-nowrap shadow-xl"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) setIsLoggedIn(true);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  // If in dashboard, do not show the landing page navbar
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <>
      {/* --- DESKTOP NAVBAR --- */}
      <div className="hidden md:flex fixed bottom-8 left-0 right-0 z-50 justify-center px-4">
        <motion.nav
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-end gap-3 px-4 py-3 bg-dark-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl h-[85px]"
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
        >
          {/* Logo / Home */}
          <Link href="/" className="relative group mr-2 h-[50px] w-[50px] flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center bg-transparent group-hover:scale-110 transition-transform">
              <AIOrb size={44} state="idle" reactive={false} className="opacity-80 group-hover:opacity-100" />
            </div>
          </Link>

          <div className="w-[1px] h-8 bg-white/10 mx-1 mb-3" />

          {navLinks.slice(1).map((link) => (
            <DesktopNavIcon key={link.href} {...link} mouseX={mouseX} />
          ))}

          <div className="w-[1px] h-8 bg-white/10 mx-1 mb-3" />

          <Link href={isLoggedIn ? "/dashboard" : "/login"} className="mb-1 ml-2">
            <div className={`h-[50px] px-6 rounded-2xl ${isLoggedIn ? 'bg-emerald-500/80' : 'bg-brand'} text-white text-sm font-bold flex items-center gap-2 hover:scale-[1.03] active:scale-95 transition-all shadow-lg`}>
              {isLoggedIn ? <Layers size={16} /> : <LogIn size={16} />}
              {isLoggedIn ? "Lumiaxy Dashboard" : "Operator Login"}
            </div>
          </Link>
        </motion.nav>
      </div>

      {/* --- MOBILE NAVBAR --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="flex items-center justify-between bg-dark-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
          <Link href="/" className="flex items-center gap-2">
            <AIOrb size={28} state="idle" reactive={false} />
            <span className="font-bold text-white text-sm tracking-widest">LUMIAXY</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -mr-2 text-white/70 hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-20 left-4 right-4 bg-dark-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href} href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-white/70 hover:text-white hover:bg-white/5 p-4 rounded-2xl font-bold text-lg transition-colors"
                >
                  <link.icon size={20} className="text-brand" /> {link.label}
                </Link>
              ))}
              <div className="h-[1px] w-full bg-white/10 my-2" />
              <Link href={isLoggedIn ? "/dashboard" : "/login"} onClick={() => setMobileMenuOpen(false)}>
                <div className={`w-full py-4 rounded-xl ${isLoggedIn ? 'bg-emerald-500' : 'bg-brand'} text-white text-center font-bold text-lg shadow-lg`}>
                  {isLoggedIn ? "Enter Neural Dashboard" : "Sign / Log In"}
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
