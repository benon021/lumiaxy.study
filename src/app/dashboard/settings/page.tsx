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

  const [subjects, setSubjects] = useState<any[]>([]);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [selectingSubjectId, setSelectingSubjectId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser(data.data);
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

    fetch("/api/subjects")
      .then(res => res.json())
      .then(data => {
        if (data.success) setSubjects(data.subjects);
      });
  }, []);

  const handleSave = async (customData?: any) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const payload = {
        preferences,
        bio: user?.bio,
        avatarUrl: user?.avatarUrl,
        coverUrl: user?.coverUrl,
        credentials: user?.credentials,
        officeHours: preferences?.teacher_office_status,
        subjects: user?.subjects?.map((s: any) => s.id),
        ...customData
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (field: "avatarUrl" | "coverUrl", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUser((prev: any) => ({ ...prev, [field]: result }));
        handleSave({ [field]: result }); // Auto-save on upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTopic = async (subjectId: string) => {
    if (!newTopicName) return;
    try {
      const res = await fetch("/api/teacher/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTopicName, subjectId })
      });
      if (res.ok) {
        setNewTopicName("");
        const sRes = await fetch("/api/subjects");
        const sData = await sRes.json();
        if (sData.success) setSubjects(sData.subjects);
      }
    } catch (e) {
      console.error(e);
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
            className={`w-10 h-6 rounded-full border p-1 relative cursor-pointer transition-all ${preferences[key] ? "bg-brand/20 border-brand/50" : "bg-white/5 border-white/10"
              }`}
          >
            <div className={`w-4 h-4 rounded-full transition-all ${preferences[key] ? "bg-brand translate-x-4" : "bg-white/20 translate-x-0"
              }`} />
          </div>
        )}
      </div>
    );

    switch (selected) {
      case "account":
        return (
          <div className="space-y-12">
            {/* Premium Header Layout */}
            <div className="relative">
              {/* Cover Image Area */}
              <div className="h-48 w-full rounded-[32px] overflow-hidden bg-white/5 border border-white/10 relative group bg-gradient-to-br from-brand/20 to-brand-600/10">
                {user?.coverUrl ? (
                  <img src={user.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <Database size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all border border-white/10">
                    <Settings size={14} /> Edit Cover
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload("coverUrl", e)} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Profile Header Info */}
              <div className="flex flex-col md:flex-row items-end gap-6 -mt-12 px-8 relative z-10">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[32px] bg-black border-[6px] border-[#0a0a0a] overflow-hidden p-1">
                    <div className="w-full h-full rounded-[24px] overflow-hidden bg-brand/20 border border-brand/20 flex items-center justify-center relative">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-4xl font-bold text-brand">{user?.name?.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  <label className="absolute bottom-2 right-2 w-10 h-10 bg-brand rounded-2xl flex items-center justify-center text-white shadow-xl cursor-pointer hover:scale-110 active:scale-95 transition-all border-4 border-[#0a0a0a]">
                    <UserCircle2 size={18} />
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload("avatarUrl", e)} className="hidden" />
                  </label>
                </div>

                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-black text-white tracking-tighter">{user?.name}</h1>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                      {user?.role} Profile
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-white/40 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><Globe size={14} /> {user?.email}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 hover:text-brand cursor-pointer transition-colors">Personalize Identity <ChevronRight size={14} /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-brand rounded-full " />
                    Professional Biography
                  </h3>
                  <button
                    onClick={() => setIsEditingBio(!isEditingBio)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                  >
                    {isEditingBio ? "Done Editing" : "Edit Bio"}
                  </button>
                </div>

                <div className="glass p-8 rounded-[32px] border border-white/5 relative bg-white/[0.01]">
                  {isEditingBio ? (
                    <textarea
                      value={user?.bio || ""}
                      onChange={(e) => setUser({ ...user, bio: e.target.value })}
                      autoFocus
                      onBlur={() => {
                        setIsEditingBio(false);
                        handleSave();
                      }}
                      className="w-full bg-transparent text-white/80 text-sm leading-relaxed outline-none resize-none min-h-[120px]"
                      placeholder="Tell students about your journey..."
                    />
                  ) : (
                    <p className="text-white/60 text-sm leading-relaxed italic">
                      "{user?.bio || "No biography provided. Click edit to introduce yourself."}"
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-cyan-400 rounded-full " />
                  Identity Stats
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Role Tier", val: user?.role, color: "text-brand" },
                    { label: "Joined", val: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A", color: "text-white/40" },
                    { label: "Portfolio", val: `${user?.subjects?.length || 0} Specializations`, color: "text-white/40" }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{s.label}</span>
                      <span className={`text-xs font-bold ${s.color}`}>{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
              <h4 className="text-sm font-bold text-red-400 flex items-center gap-2"><AlertTriangle size={16} /> Terminate Account</h4>
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
              <h3 className="text-xl font-bold text-white relative z-10 flex items-center gap-2">Lumiaxy Pro Tier <span className="bg-brand text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Active</span></h3>
              <p className="text-sm text-white/60 mb-6 relative z-10">You have access to unlimited AI queries, massive cloud storage, and priority servers.</p>
              <button className="px-6 py-2 bg-white text-black font-bold text-xs rounded-xl relative z-10">Manage Billing via Stripe</button>
            </div>
          </div>
        );
      case "teacher_tools":
        return (
          <div className="space-y-12">
            <div className="border-brand/30 border p-8 rounded-[40px] bg-brand/5 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <GraduationCap className="text-brand" />
                  Subject Portfolio
                </h3>

                <div className="space-y-6">
                  {/* Subject Selection (Animated) */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Disciplines You Teach</label>
                    <p className="text-xs text-white/40 mb-4">Select the areas you want to manage content for.</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {subjects?.map((subject: any, idx: number) => {
                        const isSelected = user?.subjects?.some((s: any) => s.id === subject.id);
                        return (
                          <motion.button
                            key={subject.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => {
                              const newSubjects = isSelected
                                ? user.subjects.filter((s: any) => s.id !== subject.id)
                                : [...(user.subjects || []), subject];
                              const customPayload = { subjects: newSubjects.map((s: any) => s.id) };
                              setUser({ ...user, subjects: newSubjects });
                              handleSave(customPayload);
                            }}
                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isSelected
                                ? "bg-brand/20 border-brand/50 text-white shadow-[0_0_20px_rgba(98,114,241,0.2)]"
                                : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20"
                              }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? "bg-brand text-white" : "bg-white/5"}`}>
                              {isSelected ? <Check size={16} /> : <BookOpen size={16} />}
                            </div>
                            <span className="text-xs font-bold">{subject.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Topic Management */}
                  <div className="space-y-6 pt-8 border-t border-white/5">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Cloud size={18} className="text-cyan-400" />
                      Subject & Topic Architecture
                    </h4>
                    <div className="space-y-4">
                      {user?.subjects?.length === 0 ? (
                        <div className="p-8 text-center border-white/5 border rounded-2xl text-white/30 text-xs italic">
                          Select subjects above to manage their academic topics.
                        </div>
                      ) : user.subjects.map((sub: any) => (
                        <div key={sub.id} className="glass p-6 rounded-3xl border border-white/5 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{sub.name}</span>
                            <button
                              onClick={() => setSelectingSubjectId(selectingSubjectId === sub.id ? null : sub.id)}
                              className="text-[10px] font-black uppercase tracking-widest text-brand"
                            >
                              + Add New Topic
                            </button>
                          </div>

                          {selectingSubjectId === sub.id && (
                            <div className="flex gap-2">
                              <input
                                value={newTopicName}
                                onChange={e => setNewTopicName(e.target.value)}
                                placeholder="E.g. Cell Biology Essentials"
                                className="flex-1 bg-black/40 border border-brand/30 rounded-xl px-4 py-2 text-white text-xs outline-none"
                              />
                              <button
                                onClick={() => handleCreateTopic(sub.id)}
                                className="px-4 py-2 bg-brand text-white text-[10px] font-black uppercase rounded-xl"
                              >
                                Deploy
                              </button>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {sub.topics?.map((t: any) => (
                              <span key={t.id} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/60">
                                {t.name}
                              </span>
                            ))}
                            {(!sub.topics || sub.topics.length === 0) && (
                              <span className="text-[10px] text-white/20 italic">No topics mapped yet.</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-6">
                    {listItem("teacher_grading_alerts", "Submission Real-Time Alerts", "Notify immediately when a student turns in an assignment.", true)}
                    {listItem("teacher_auto_grade", "AI Core Pre-Grading", "Allow Fusion AI to generate preliminary scores on essays.", true)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        ;
      case "admin_tools":
        return (
          <div className="space-y-6 border-red-500/30 border p-6 rounded-3xl bg-red-500/5">
            <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2"><Globe size={20} /> Platform Administration</h3>
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
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${selected === cat.id
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
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saveSuccess ? <Check size={16} /> : null}
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
