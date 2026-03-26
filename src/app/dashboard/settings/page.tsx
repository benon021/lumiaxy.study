"use client";

import { motion } from "framer-motion";
import { 
  Settings, Bell, Shield, Eye, Globe, Lock, 
  UserCircle2, Moon, ChevronRight, Database, 
  Cloud, Zap, Check, AlertTriangle, BookOpen, GraduationCap 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Base categories that all users get
const baseCategories = [
  { 
    id: "account", label: "Account Settings", icon: UserCircle2, color: "#6272f1",
    desc: "Manage personal information and identity"
  },
  { 
    id: "notifications", label: "Notifications", icon: Bell, color: "#f59e0b",
    desc: "Control alerts, emails, and platform pings"
  },
  { 
    id: "privacy", label: "Privacy & Security", icon: Shield, color: "#10b981",
    desc: "Passwords, activity tracking, and privacy mode"
  },
  { 
    id: "premium", label: "Subscription Plan", icon: Zap, color: "#00e5ff",
    desc: "Current plan status, limits, and billing"
  },
];

const roleSpecificCategories = {
  TEACHER: {
    id: "teacher_tools", label: "Educator Controls", icon: BookOpen, color: "#ec4899",
    desc: "Grading workflows, office hours, class visibility"
  },
  ADMIN: {
    id: "admin_tools", label: "Platform Oversight", icon: Globe, color: "#ef4444",
    desc: "System alerts, audit trails, and global overrides"
  }
};

export default function SettingsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("account");
  const [user, setUser] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.data);
          // Load robust defaults if missing
          setPreferences(data.data.preferences || {
            push_notifications: true,
            email_alerts: true,
            in_app_mentions: true,
            ai_updates: false,
            two_factor_auth: false,
            privacy_mode: true,
            teacher_grading_alerts: true,
            teacher_office_status: "VISIBLE",
            admin_global_alerts: true,
            admin_audit_logs: true,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          preferences,
          avatarUrl: user?.avatarUrl,
          credentials: user?.credentials,
          officeHours: preferences?.teacher_office_status
        })
      });
      if (res.ok) setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev: any) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePref = (key: string) => {
    setPreferences((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-40">
        <div className="w-10 h-10 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        <p className="mt-4 text-white/40 text-sm">Loading comprehensive settings...</p>
      </div>
    );
  }

  // Inject role specific
  let categories = [...baseCategories];
  if (user?.role === "TEACHER") categories.push(roleSpecificCategories.TEACHER);
  if (user?.role === "ADMIN") categories.push(roleSpecificCategories.ADMIN);

  const renderOptions = () => {
    const listItem = (key: string, label: string, desc: string, isToggle: boolean) => (
      <div key={key} className="flex items-center justify-between group/opt py-2">
        <div>
          <h4 className="text-sm font-bold text-white group-hover/opt:text-brand transition-colors">{label}</h4>
          <p className="text-xs text-white/40 mt-1 max-w-[280px] md:max-w-md">{desc}</p>
        </div>
        {isToggle && (
          <div 
            onClick={() => togglePref(key)}
            className={`w-10 h-6 rounded-full border p-1 relative cursor-pointer transition-all ${
              preferences[key] ? "bg-brand/20 border-brand/50" : "bg-white/5 border-white/10"
            }`}
          >
            <div className={`w-4 h-4 rounded-full transition-all ${
              preferences[key] ? "bg-brand translate-x-4" : "bg-white/20 translate-x-0"
            }`} />
          </div>
        )}
      </div>
    );

    switch (selected) {
      case "account":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
               <div className="relative group cursor-pointer">
                 <div className="w-16 h-16 rounded-full bg-brand/20 border border-brand p-1 overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-brand/30 flex items-center justify-center font-bold text-brand">{user?.name?.charAt(0)}</div>
                    )}
                 </div>
                 <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] uppercase font-bold text-white text-center px-1">Upload DP</span>
                 </div>
                 <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                 <p className="text-sm text-white/50">{user?.role} • {user?.email}</p>
               </div>
            </div>
            {listItem("update_profile", "Update Identity Identity", "Modify your display name, biography, and avatar photo.", false)}
            {listItem("email_prefs", "Email Frequency Cap", "Control how often Lumiaxy sends you summary emails.", false)}
            {listItem("lang_settings", "Language & Region", "Currently set to English (US).", false)}
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6">
            {listItem("push_notifications", "Push Notifications", "Receive live desktop/web push notifications.", true)}
            {listItem("email_alerts", "Email Alerts", "Critical alert emails for password resets and security.", true)}
            {listItem("in_app_mentions", "In-App Mentions", "Ping me when someone @mentions me in a discussion wire.", true)}
            {listItem("ai_updates", "AI Insights & Suggestions", "Allow Fusion AI to notify me with personalized study paths.", true)}
          </div>
        );
      case "privacy":
        return (
          <div className="space-y-6">
            {listItem("two_factor_auth", "Two-Factor Authentication (2FA)", "Require a secondary device code on sign-in.", true)}
            {listItem("privacy_mode", "Ghost Mode (Privacy)", "Hide my online status and last-viewed materials from peers.", true)}
            <div className="mt-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
               <h4 className="text-sm font-bold text-red-400 flex items-center gap-2"><AlertTriangle size={16}/> Terminate Account</h4>
               <p className="text-xs text-red-400/70 mt-1 mb-4">Permanently delete your account and flush all data from our active shards.</p>
               <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-all">Request Deletion</button>
            </div>
          </div>
        );
      case "premium":
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-brand/20 to-cyan/10 border border-brand/30 relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-4 -mt-4 text-brand/20">
                  <Zap size={100} />
               </div>
               <h3 className="text-xl font-bold text-white relative z-10 flex items-center gap-2">Nexus Pro Tier <span className="bg-brand text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Active</span></h3>
               <p className="text-sm text-white/60 mb-6 relative z-10">You have access to unlimited AI queries, massive cloud storage, and priority servers.</p>
               <button className="px-6 py-2 bg-white text-black font-bold text-xs rounded-xl relative z-10">Manage Billing via Stripe</button>
            </div>
          </div>
        );
      case "teacher_tools":
        return (
          <div className="space-y-6 border-brand/30 border p-6 rounded-3xl bg-brand/5">
            <h3 className="text-lg font-bold text-white mb-4">Educator Overrides</h3>
            
            <div className="mb-6 space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Verification Credentials</label>
              <p className="text-[11px] text-white/40 mb-2">Provide brief details on your expertise to legitimize your profile to students.</p>
              <textarea 
                value={user?.credentials || ""}
                onChange={(e) => setUser((p: any) => ({ ...p, credentials: e.target.value }))}
                placeholder="e.g. PhD in Physics, 5 years teaching AP Chemistry."
                className="w-full bg-black/40 border border-brand/20 text-white rounded-xl px-4 py-3 outline-none text-sm resize-none h-20 placeholder:text-white/20"
              />
            </div>

            {listItem("teacher_grading_alerts", "Submission Alerts", "Notify immediately when a student turns in an assignment.", true)}
            {listItem("teacher_auto_grade", "AI Pre-Grading", "Allow Fusion AI to generate preliminary scores on essays.", true)}
            <div className="pt-4 mt-4 border-t border-brand/20">
               <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Office Hours Visibility</label>
               <select 
                 className="w-full mt-2 bg-black/40 border border-brand/20 text-white rounded-xl px-4 py-3 outline-none text-sm"
                 value={preferences.teacher_office_status || "VISIBLE"}
                 onChange={(e) => setPreferences((p: any) => ({ ...p, teacher_office_status: e.target.value }))}
               >
                 <option value="VISIBLE">Visible (Accepting Meetings)</option>
                 <option value="BUSY">Busy (Do Not Disturb)</option>
                 <option value="OFFLINE">Offline</option>
               </select>
            </div>
          </div>
        );
      case "admin_tools":
        return (
          <div className="space-y-6 border-red-500/30 border p-6 rounded-3xl bg-red-500/5">
            <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2"><Globe size={20}/> Platform Administration</h3>
            {listItem("admin_global_alerts", "Critical Infrastructure Alerts", "Ping me if server load exceeds 90% or DB sync fails.", true)}
            {listItem("admin_audit_logs", "Immutable Audit Logging", "Record every role change and ban execution into the blackbox.", true)}
            {listItem("admin_new_user_ping", "New Account Pings", "Notify me on every new user registration across the platform.", true)}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      <div className="px-2">
         <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Settings size={28} className="text-brand" />
            Platform Architecture
         </h1>
         <p className="text-sm text-white/40 mt-2 font-medium">Fine-tune your environment parameters and role permissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Navigation */}
         <div className="lg:col-span-1 space-y-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${
                  selected === cat.id 
                  ? "bg-white/5 border-brand/50 text-white shadow-lg" 
                  : "bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-3">
                     <div className={`p-1.5 rounded-lg transition-all ${selected === cat.id ? "bg-brand text-white" : "bg-white/5"}`} style={selected === cat.id ? {} : { color: cat.color }}>
                        <cat.icon size={16} />
                     </div>
                     <span className="text-sm font-bold tracking-wide">{cat.label}</span>
                  </div>
                </div>
              </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="lg:col-span-3">
            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-[40px] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden min-h-[500px]"
            >
               <div className="relative z-10 flex flex-col h-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                     <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        {categories.find(c => c.id === selected)?.label}
                     </h2>
                     <button 
                       onClick={handleSave}
                       disabled={saving}
                       className="px-6 py-3 rounded-xl bg-brand text-white text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2 max-w-max"
                     >
                       {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : saveSuccess ? <Check size={16}/> : null}
                       {saving ? "Executing..." : saveSuccess ? "Saved to Shard" : "Commit Preferences"}
                     </button>
                  </div>
                  
                  <div className="flex-1">
                    {renderOptions()}
                  </div>
               </div>
               
               {/* Ambient Background Accent */}
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] -mr-60 -mt-60 pointer-events-none" />
            </motion.div>
         </div>
      </div>
    </div>
  );
}
