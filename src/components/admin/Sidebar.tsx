"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  UserCog, 
  LogOut, 
  Sparkles,
  LayoutDashboard,
  ChevronUp
} from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import AIOrb from "../ai-orb/AIOrb";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin", category: "MAIN" },
  { label: "AI Assistant", icon: Sparkles, href: "/admin/ai", category: "MAIN", isAi: true },
  { label: "Users", icon: Users, href: "/admin/users", category: "MAIN" },
  { label: "Projects", icon: Briefcase, href: "/admin/projects", category: "MAIN" },
  { label: "Security", icon: ShieldCheck, href: "/admin/security", category: "ADMIN" },
  { label: "Settings", icon: UserCog, href: "/admin/settings", category: "ADMIN" },
];

function NavIcon({ href, icon: Icon, label, mouseX, isAi, isActive, onClick }: any) {
  const distance = useMotionValue(Infinity);
  const sizeTransform = useTransform(distance, [-150, 0, 150], [48, 64, 48]);
  const size = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  });

  return (
    <div className="relative group">
      <motion.div
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          distance.set(e.pageX - centerX);
        }}
        onMouseLeave={() => distance.set(Infinity)}
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${
          isActive 
            ? "bg-brand/20 border-brand/40 text-brand shadow-[0_0_20px_rgba(98,114,241,0.2)] scale-110" 
            : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20 backdrop-blur-md"
        }`}
        onClick={() => onClick(href)}
      >
        {isAi ? (
          <AIOrb size={32} state={isActive ? "speaking" : "idle"} reactive={false} className="relative z-10" />
        ) : (
          <Icon size={24} className="relative z-10" />
        )}
        
        {isActive && (
          <motion.div 
            layoutId="active-indicator-admin"
            className="absolute bottom-1 w-1 h-1 rounded-full bg-brand shadow-[0_0_8px_#ff7200]"
          />
        )}

        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-dark-950 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-bold text-white pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-2xl z-50">
          {label}
        </div>
      </motion.div>
    </div>
  );
}

interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export default function AdminSidebar({ activeItem, setActiveItem }: SidebarProps) {
  const router = useRouter();
  const mouseAxis = useMotionValue(Infinity);

  const handleNavClick = (href: string) => {
    // For now, since most admin links are #, we'll just set the active item
    const item = navItems.find(i => i.href === href);
    if (item) setActiveItem(item.label);
    if (href !== "#") router.push(href);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full px-6 pointer-events-none">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 p-2 bg-dark-900/40 backdrop-blur-3xl border border-white/10 rounded-[28px] shadow-3xl h-[76px] pointer-events-auto"
        onMouseMove={(e) => mouseAxis.set(e.pageX)}
        onMouseLeave={() => mouseAxis.set(Infinity)}
      >
        {/* Admin Logo */}
        <div className="px-3 flex items-center gap-3 border-r border-white/5 mr-1">
           <div className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center relative overflow-hidden">
              <AIOrb size={32} state="idle" reactive={false} />
           </div>
           <div className="hidden xl:block">
              <p className="text-[10px] font-bold text-white tracking-widest uppercase">Admin</p>
              <p className="text-[10px] text-brand/60 font-mono tracking-tighter">Lumiaxy.study</p>
           </div>
        </div>

        <div className="flex items-center gap-2 px-2">
          {navItems.map((item) => (
            <NavIcon 
              key={item.label} 
              {...item} 
              isActive={activeItem === item.label}
              mouseX={mouseAxis}
              onClick={handleNavClick}
            />
          ))}
        </div>

        <div className="w-[1px] h-8 bg-white/10 mx-1" />
        
        <button 
          onClick={handleLogout}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 group relative ml-1"
        >
          <LogOut size={20} />
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-dark-950 backdrop-blur-md border border-red-500/20 rounded-xl text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-y-2 group-hover:translate-y-0 whitespace-nowrap shadow-xl">
            Logout
          </div>
        </button>
      </motion.nav>
    </div>
  );
}
