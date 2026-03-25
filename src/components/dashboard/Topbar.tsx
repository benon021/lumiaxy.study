"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  Command, 
  ChevronDown, 
  Moon, 
  Sun,
  Inbox,
  LogOut,
  User,
  Settings,
  CreditCard
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentTopbar() {
  const [showProfile, setShowProfile] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<{name: string, email: string, role: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {}
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const displayName = user?.name || "Student";
  const initials = displayName.substring(0, 2).toUpperCase();
  const displayRole = user?.role === "STUDENT" ? "Student" : (user?.role || "Lumiaxy User");

  return (
    <header className="h-20 border-b border-white/5 bg-dark-950/40 backdrop-blur-md flex items-center justify-between px-4 lg:px-10 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl md:block hidden">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search courses, papers, or find with AI..." 
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-16 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-all shadow-lg"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
            <Command size={12} className="text-white/30" />
            <span className="text-[10px] text-white/30 font-bold font-mono">K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-8">
        {/* Quick Tools */}
        <div className="flex items-center gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-2xl mr-2">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border-2 border-dark-900 shadow-[0_0_10px_rgba(98,114,241,0.5)]" />
          </button>
          <button className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Inbox size={18} />
          </button>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-3 pl-1 pr-3 py-1 rounded-2xl bg-white/[0.03] border transition-all duration-300 group ${
              showProfile ? "border-brand/40 bg-brand/5" : "border-white/10 hover:bg-white/5 hover:border-white/20"
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand/20 to-violet-500/20 border border-brand/30 flex items-center justify-center text-brand font-bold text-sm relative overflow-hidden">
               <div className="absolute inset-0 bg-brand/20 animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity" />
               <span className="relative z-10">{initials}</span>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-white group-hover:text-brand transition-colors">{displayName}</p>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{displayRole}</p>
            </div>
            <ChevronDown size={14} className={`text-white/20 transition-transform duration-300 ${showProfile ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-64 glass rounded-[32px] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.5)] p-2 z-50 overflow-hidden"
              >
                <div className="p-5 border-b border-white/5 mb-2 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold">{initials}</div>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-white truncate">{displayName}</p>
                      <p className="text-xs text-brand truncate font-medium">{user?.email || "student@lumiaxy.study"}</p>
                   </div>
                </div>
                
                <div className="space-y-1">
                  <button className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-white/20 group-hover:text-brand transition-colors" />
                      My Profile
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
                    <div className="flex items-center gap-3">
                      <CreditCard size={16} className="text-white/20 group-hover:text-emerald-400 transition-colors" />
                      Subscription
                    </div>
                  </button>
                  <button className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-2xl transition-all group">
                    <div className="flex items-center gap-3">
                      <Settings size={16} className="text-white/20 group-hover:text-amber-400 transition-colors" />
                      Settings
                    </div>
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-white/5">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-2xl transition-all"
                  >
                    <LogOut size={16} />
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
