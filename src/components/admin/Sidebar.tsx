"use client";

import { motion } from "framer-motion";
import { 
  LayerDashboard, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  UserCog, 
  LogOut, 
  Sparkles,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "#", category: "MAIN" },
  { label: "AI Assistant", icon: Sparkles, href: "#", category: "MAIN" },
  { label: "Users", icon: Users, href: "#", category: "MAIN", subItems: ["All", "Deleted"] },
  { label: "Projects", icon: Briefcase, href: "#", category: "MAIN", hasSub: true },
  { label: "Admin Management", icon: ShieldCheck, href: "#", category: "ADMIN" },
  { label: "Admin Roles", icon: UserCog, href: "#", category: "ADMIN" },
];

interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export default function Sidebar({ activeItem, setActiveItem }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Users"]);
  const router = useRouter();

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  const handleLogout = () => {
    // Simulate logout and redirect to home
    router.push("/");
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-900/90 backdrop-blur-xl border-r border-white/[0.06] flex flex-col z-50">
      {/* Logo */}
      <Link href="/" className="p-6 flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 overflow-hidden relative group-hover:border-brand/40 transition-colors">
          <Image 
            src="/fusion-orb.png" 
            alt="Logo" 
            width={40} 
            height={40} 
            className="animate-swirl group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold gradient-text">Lumiaxy.study</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Administration</p>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        {["MAIN", "ADMIN"].map((category) => (
          <div key={category} className="mb-6">
            <h2 className="px-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-3">
              {category}
            </h2>
            <div className="space-y-1">
              {navItems.filter(item => item.category === category).map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => {
                      setActiveItem(item.label);
                      if (item.subItems || item.hasSub) toggleExpand(item.label);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                      activeItem === item.label || (item.subItems?.includes(activeItem))
                        ? "bg-white/5 text-white" 
                        : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        activeItem === item.label || (item.subItems?.includes(activeItem)) 
                          ? "bg-brand/20 text-brand" 
                          : "bg-white/5 text-white/40 group-hover:text-white/60"
                      }`}>
                        <item.icon size={18} />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {(item.subItems || item.hasSub) && (
                      <ChevronRight 
                        size={14} 
                        className={`transition-transform duration-300 ${expandedItems.includes(item.label) ? "rotate-90" : ""}`} 
                      />
                    )}
                  </button>
                  
                  {/* Sub-items */}
                  {item.subItems && expandedItems.includes(item.label) && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="ml-9 mt-1 space-y-1 overflow-hidden"
                    >
                      {item.subItems.map(sub => (
                        <button
                          key={sub}
                          onClick={() => setActiveItem(sub)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors relative ${
                            activeItem === sub ? "text-white" : "text-white/40 hover:text-white"
                          }`}
                        >
                          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
                            activeItem === sub ? "bg-brand shadow-[0_0_8px_#6272f1]" : "bg-white/10"
                          }`} />
                          {sub}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-white/[0.06]">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.03] transition-all group"
        >
          <div className="p-2 rounded-lg bg-white/5 text-white/40 group-hover:text-red-400 group-hover:bg-red-500/10 border border-transparent group-hover:border-red-500/20 transition-all">
            <LogOut size={18} />
          </div>
          <span className="text-sm font-medium tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
}
