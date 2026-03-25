"use client";

import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  ChevronRight,
  Search
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

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

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-950/80 backdrop-blur-2xl border-r border-white/5 flex flex-col z-50">
      {/* Branding */}
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:border-brand/50 transition-all duration-500">
             <Image 
                src="/fusion-orb.png" 
                alt="Lumiaxy" 
                width={40} 
                height={40} 
                className="animate-swirl group-hover:scale-110 transition-transform duration-700"
             />
             <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-brand transition-colors">Lumiaxy</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href}>
              <button
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isActive 
                  ? "bg-white/5 text-white shadow-[0_0_20px_rgba(255,255,255,0.02)]" 
                  : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive ? "bg-brand/20 text-brand" : "bg-white/5 text-white/20 group-hover:text-white/40"
                  }`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_10px_#6272f1]"
                  />
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* User Section / Bottom */}
      <div className="p-4 space-y-2 border-t border-white/5">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                  ? "bg-white/5 text-white" 
                  : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                  isActive ? "bg-white/10 text-white" : "text-white/10"
                }`}>
                  <item.icon size={16} />
                </div>
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            </Link>
          );
        })}
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all group mt-2"
        >
          <div className="p-1.5 rounded-lg bg-red-500/10 border border-transparent group-hover:border-red-500/20">
            <LogOut size={16} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
