"use client";

import { motion } from "framer-motion";
import { 
  Settings, 
  Bell, 
  Shield, 
  Eye, 
  Globe, 
  Lock, 
  UserCircle2,
  Moon,
  ChevronRight,
  Database,
  Cloud,
  Zap
} from "lucide-react";
import { useState } from "react";

const settingCategories = [
  { 
    id: "account", 
    label: "Account Settings", 
    icon: UserCircle2, 
    color: "#6272f1",
    options: ["Personal Information", "Email Preferences", "Account Role", "Language Settings"]
  },
  { 
    id: "notifications", 
    label: "Notifications", 
    icon: Bell, 
    color: "#f59e0b",
    options: ["Push Notifications", "Email Alerts", "In-App Mentions", "AI Updates"]
  },
  { 
    id: "privacy", 
    label: "Privacy & Security", 
    icon: Shield, 
    color: "#10b981",
    options: ["Two-Factor Auth", "Password Reset", "Active Sessions", "Privacy Mode"]
  },
  { 
    id: "premium", 
    label: "Subscription Plan", 
    icon: Zap, 
    color: "#00e5ff",
    options: ["Payment Methods", "Billing History", "Upgrade Plan", "Manage Invoices"]
  },
];

export default function SettingsPage() {
  const [selected, setSelected] = useState("account");

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      <div className="px-2">
         <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Settings size={28} className="text-brand" />
            Platform Settings
         </h1>
         <p className="text-sm text-white/40 mt-2 font-medium">Customize your Lumiaxy experience to match your learning style.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar / Navigation */}
         <div className="lg:col-span-1 space-y-3">
            {settingCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${
                  selected === cat.id 
                  ? "bg-white/5 border-brand/50 text-white shadow-lg" 
                  : "bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                   <div 
                      className={`p-2 rounded-xl transition-all ${
                        selected === cat.id ? "bg-brand text-white" : "bg-white/5 text-white/20 group-hover:text-white/40"
                      }`}
                      style={selected === cat.id ? {} : { color: cat.color }}
                   >
                      <cat.icon size={18} />
                   </div>
                   <span className="text-xs font-bold tracking-wide">{cat.label}</span>
                </div>
                <ChevronRight size={14} className={selected === cat.id ? "opacity-100" : "opacity-0"} />
              </button>
            ))}
            
            <div className="pt-6">
               <div className="glass rounded-[24px] p-5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Storage</span>
                     <span className="text-[10px] font-bold text-brand uppercase">72%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className="w-[72%] h-full bg-brand" />
                  </div>
                  <p className="text-[9px] text-white/20 leading-relaxed">System is performing optimally. Database sync active.</p>
               </div>
            </div>
         </div>

         {/* Content Area */}
         <div className="lg:col-span-3">
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-[40px] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden"
            >
               <div className="relative z-10">
                  <div className="flex items-center justify-between mb-10">
                     <h2 className="text-2xl font-bold text-white tracking-tight">
                        {settingCategories.find(c => c.id === selected)?.label}
                     </h2>
                     <button className="px-6 py-2.5 rounded-xl bg-brand text-white text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-lg">Save Changes</button>
                  </div>
                  
                  <div className="space-y-8">
                     {settingCategories.find(c => c.id === selected)?.options.map((opt, i) => (
                       <div key={i} className="flex items-center justify-between group/opt">
                          <div>
                             <h4 className="text-sm font-bold text-white group-hover/opt:text-brand transition-colors">{opt}</h4>
                             <p className="text-xs text-white/30 mt-1">Configure your preferences and platform access rules.</p>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-6 rounded-full bg-white/5 border border-white/10 p-1 relative cursor-pointer group/toggle">
                                <div className="w-4 h-4 bg-white/20 rounded-full group-hover/toggle:bg-brand transition-all" />
                             </div>
                             <ChevronRight size={16} className="text-white/10" />
                          </div>
                       </div>
                     ))}
                  </div>

                  {/* Section Divider */}
                  <div className="h-[1px] w-full bg-white/5 my-10" />
                  
                  <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5 space-y-6">
                     <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-brand/20 border border-brand/30 text-brand">
                           <Zap size={20} />
                        </div>
                        <div>
                           <h4 className="font-bold text-white">System Diagnostics</h4>
                           <p className="text-xs text-white/40">Real-time platform synchronization and performance.</p>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { l: "Uptime", v: "99.9%", i: Globe },
                          { l: "Security", v: "v2.0L", i: Lock },
                          { l: "Latency", v: "14ms", i: Cloud },
                          { l: "DB Sync", v: "Live", i: Database }
                        ].map((stat, i) => (
                          <div key={i} className="p-3 rounded-2xl bg-black/20 border border-white/5">
                             <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{stat.l}</p>
                             <div className="flex items-center gap-2">
                                <stat.i size={12} className="text-brand" />
                                <span className="text-xs font-bold text-white">{stat.v}</span>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
               
               {/* Background Accent */}
               <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
            </motion.div>
         </div>
      </div>
    </div>
  );
}
