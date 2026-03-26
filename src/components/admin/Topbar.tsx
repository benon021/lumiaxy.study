"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  Sun, 
  Globe, 
  ChevronDown, 
  Command,
  LogOut,
  User,
  Settings,
  Shield
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <header className="h-16 border-b border-white/[0.06] bg-dark-900/40 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search dashboard, users, or reports..." 
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-2 pl-10 pr-16 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/50 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
            <Command size={10} className="text-white/30" />
            <span className="text-[10px] text-white/30 font-mono">K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Language */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors group">
          <Image src="https://flagcdn.com/us.svg" alt="EN" width={16} height={12} className="rounded-sm opacity-80" />
          <span className="text-xs font-medium text-white/60">EN</span>
          <ChevronDown size={14} className="text-white/20 group-hover:text-white/40" />
        </button>

        {/* Theme Toggle */}
        <button className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors text-white/40 hover:text-white">
          <Sun size={18} />
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors text-white/40 hover:text-white relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full border-2 border-dark-900 shadow-[0_0_10px_rgba(98,114,241,0.5)]" />
        </button>

        {/* User Profile */}
        <div className="h-8 w-[1px] bg-white/[0.06] mx-2" />
        
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-3 pl-1 pr-3 py-1 rounded-xl bg-white/[0.03] border transition-all group ${
              showProfile ? "border-brand/40 bg-brand/5 shadow-[0_0_20px_rgba(98,114,241,0.1)]" : "border-white/[0.06] hover:bg-white/[0.06]"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold text-xs relative overflow-hidden group">
               <div className="absolute inset-0 bg-brand/20 animate-pulse-slow opacity-0 group-hover:opacity-100" />
               <span className="relative">DT</span>
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white group-hover:text-brand transition-colors">Demo</p>
            </div>
            <ChevronDown size={14} className={`text-white/20 transition-transform duration-300 ${showProfile ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 glass rounded-[24px] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-2 z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-white/[0.06] mb-2 text-center">
                   <p className="text-xs font-bold text-white">Administrator</p>
                   <p className="text-[10px] text-white/40 truncate">admin@lumiaxy.study</p>
                </div>
                
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <User size={14} className="text-white/20" />
                    My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Shield size={14} className="text-white/20" />
                    Security
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    <Settings size={14} className="text-white/20" />
                    Preferences
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-white/[0.06]">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-all"
                  >
                    <LogOut size={14} />
                    Logout Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
