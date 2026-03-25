"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  BarChart3, 
  User, 
  Settings, 
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Past Papers", icon: FileText, href: "/dashboard/papers" },
  { label: "AI Assistant", icon: Sparkles, href: "/dashboard/ai", isAi: true },
  { label: "Progress", icon: BarChart3, href: "/dashboard/progress" },
];

const bottomItems = [
  { label: "Profile", icon: User, href: "/dashboard/profile" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

function NavIcon({ href, icon: Icon, label, mouseX, isAi, isActive, onClick }: any) {
  const distance = useMotionValue(Infinity);
  // Magnification effect: size ranges from 48px (normal) to 72px (magnified)
  const sizeTransform = useTransform(distance, [-150, 0, 150], [48, 72, 48]);
  const size = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 300,
    damping: 20,
  });

  return (
    <Link href={href} className="relative group">
      <motion.div
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          // Vertical distance for sidebar, Horizontal for bottom bar
          // We'll use a simplified version that works for both but prioritizes the dominant axis
          const isMobile = window.innerWidth < 1024;
          if (isMobile) {
            const centerX = rect.left + rect.width / 2;
            distance.set(e.pageX - centerX);
          } else {
            const centerY = rect.top + rect.height / 2;
            distance.set(e.pageY - centerY);
          }
        }}
        onMouseLeave={() => distance.set(Infinity)}
        style={{ width: size, height: size }}
        className={`flex items-center justify-center rounded-2xl border transition-colors duration-300 relative overflow-hidden ${
          isActive 
            ? "bg-brand/20 border-brand/40 text-brand shadow-[0_0_20px_rgba(98,114,241,0.2)]" 
            : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20 backdrop-blur-md"
        } ${isAi ? "shadow-[0_0_15px_rgba(98,114,241,0.3)]" : ""}`}
        onClick={onClick}
      >
        {isAi && (
           <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-purple-600/20 animate-pulse" />
        )}
        
        <Icon size={24} className="relative z-10" />
        
        {/* Active Indicator Dot */}
        {isActive && (
          <motion.div 
            layoutId="active-indicator"
            className="absolute right-1 w-1 h-1 rounded-full bg-brand shadow-[0_0_8px_#6272f1] lg:block hidden"
          />
        )}
        {isActive && (
          <motion.div 
            layoutId="active-indicator-mobile"
            className="absolute bottom-1 w-1 h-1 rounded-full bg-brand shadow-[0_0_8px_#6272f1] lg:hidden block"
          />
        )}

        {/* Tooltip / Context Label */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: 10 }}
            className="absolute left-full ml-4 px-3 py-1.5 bg-dark-800/90 backdrop-blur-md border border-white/10 rounded-xl text-xs font-bold text-white pointer-events-none whitespace-nowrap shadow-2xl lg:block hidden z-50"
          >
            {label}
            {isAi && <span className="ml-2 text-[10px] text-brand uppercase tracking-tighter italic">Fusion AI</span>}
          </motion.div>
        </AnimatePresence>
        
        {/* Mobile Label (always visible or on small hover) */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-800 border border-white/10 rounded-lg text-[10px] font-medium text-white pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity lg:hidden">
          {label}
        </div>
      </motion.div>
    </Link>
  );
}

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const mouseAxis = useMotionValue(Infinity);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <>
      {/* Desktop Sidebar (Left Dock) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex">
        <motion.nav
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex flex-col items-center gap-4 p-3 bg-dark-900/40 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl"
          onMouseMove={(e) => mouseAxis.set(e.pageY)}
          onMouseLeave={() => mouseAxis.set(Infinity)}
        >
          {/* Logo Area */}
          <Link href="/" className="mb-4 p-2 group">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-brand/50 transition-all duration-500">
                <Image 
                   src="/fusion-orb.png" 
                   alt="Lumiaxy" 
                   width={40} 
                   height={40} 
                   className="animate-swirl group-hover:scale-110 transition-transform duration-700"
                />
             </div>
          </Link>

          <div className="w-8 h-[1px] bg-white/10 mb-2" />

          {navItems.map((item) => (
            <NavIcon 
              key={item.href} 
              {...item} 
              isActive={pathname === item.href}
              mouseX={mouseAxis}
            />
          ))}
          
          <div className="w-8 h-[1px] bg-white/10 my-2" />
          
          {bottomItems.map((item) => (
            <NavIcon 
              key={item.href} 
              {...item} 
              isActive={pathname === item.href}
              mouseX={mouseAxis}
            />
          ))}

          <div className="flex-1 min-h-[20px]" />

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 group relative"
          >
            <LogOut size={20} />
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-red-900/90 backdrop-blur-md border border-red-500/20 rounded-xl text-xs font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
              Sign Out
            </div>
          </button>
        </motion.nav>
      </div>

      {/* Mobile Submenu / Bottom Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden flex justify-center w-full px-6">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 px-4 py-3 bg-dark-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl h-[72px] max-w-full overflow-x-auto no-scrollbar"
          onMouseMove={(e) => mouseAxis.set(e.pageX)}
          onMouseLeave={() => mouseAxis.set(Infinity)}
        >
          {navItems.map((item) => (
            <NavIcon 
              key={item.href} 
              {...item} 
              isActive={pathname === item.href}
              mouseX={mouseAxis}
            />
          ))}
          <div className="w-[1px] h-8 bg-white/10 mx-1" />
          {bottomItems.map((item) => (
            <NavIcon 
              key={item.href} 
              {...item} 
              isActive={pathname === item.href}
              mouseX={mouseAxis}
            />
          ))}
          <button 
            onClick={handleLogout}
            className="w-12 h-12 min-w-[48px] flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400"
          >
            <LogOut size={18} />
          </button>
        </motion.nav>
      </div>
    </>
  );
}
