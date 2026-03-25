"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Save, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // Fetch current setting (masked)
    const fetchSetting = async () => {
      try {
        const res = await fetch("/api/admin/settings?key=OPENAI_API_KEY");
        const data = await res.json();
        if (data.value) {
          setApiKey(data.value); // This will be masked from backend
        }
      } catch (err) {
        console.error("Failed to fetch settings");
      }
    };
    fetchSetting();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "OPENAI_API_KEY", value: apiKey })
      });

      if (!res.ok) throw new Error("Failed to update setting");

      setMessage({ type: "success", text: "API Key updated successfully! (It is now securely stored in the database)" });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          Admin Settings
          <div className="px-2 py-0.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-tighter">Protected</div>
        </h1>
        <p className="text-sm text-white/40 mt-1">Configure global platform parameters and secure credentials.</p>
      </div>

      <div className="glass rounded-[32px] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[60px] -mr-32 -mt-32" />
        
        <form onSubmit={handleSave} className="space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                <Key size={14} className="text-brand" />
                OpenAI API Key
              </label>
              <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase">
                <ShieldCheck size={12} />
                Encrypted Storage
              </div>
            </div>
            
            <div className="relative">
              <input 
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-svcacct-..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-brand/40 transition-all font-mono"
              />
              <button 
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <p className="text-[10px] text-white/30 leading-relaxed italic">
              Note: Updating this will override the value in your .env file. The key is masked for security after saving.
            </p>
          </div>

          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-medium ${
                message.type === "success" 
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {message.type === "success" ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={isLoading || !apiKey}
            className="w-full py-4 rounded-2xl bg-brand text-white font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-brand/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Save Securely
              </>
            )}
          </button>
        </form>
      </div>

      <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/[0.05] flex items-start gap-4">
         <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
            <AlertCircle size={20} />
         </div>
         <div>
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-widest mb-1">Security Warning</h4>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Anyone with access to this admin panel can update the API key. Ensure that only authorized personnel have the 'ADMIN' role in your database.
            </p>
         </div>
      </div>
    </div>
  );
}
