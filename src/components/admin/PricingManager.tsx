"use client";

import { useState, useEffect } from "react";
import { CreditCard, Save, Plus, Trash2 } from "lucide-react";

export default function PricingManager() {
  const [tiers, setTiers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings/pricing").then(r=>r.json()).then(data => {
      if (data.success && data.pricing) {
        try { setTiers(JSON.parse(data.pricing)); } catch (e) {}
      } else {
        setTiers([
           { title: "Standard Student", price: "Free", popular: false, features: ["Access to General DB"] },
           { title: "Lumiaxy Premium", price: "KSH 500/mo", popular: true, features: ["Sider Agent Automations"] }
        ]);
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pricingJSON: JSON.stringify(tiers) })
    });
    setSaving(false);
  };

  const updateTier = (idx: number, field: string, val: any) => {
    const copy = [...tiers];
    copy[idx][field] = val;
    setTiers(copy);
  };

  const addTier = () => setTiers([...tiers, { title: "New Tier", price: "KSH XXX", popular: false, features: ["A Feature"] }]);
  const removeTier = (idx: number) => setTiers(tiers.filter((_, i) => i !== idx));

  return (
    <div className="glass p-6 md:p-8 rounded-[32px] border border-white/10 mt-8">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
         <div>
            <h2 className="text-xl font-bold flex items-center gap-3 text-white"><CreditCard className="text-brand"/> Dynamic Pricing Engine</h2>
            <p className="text-white/40 text-sm mt-1">Changes made here echo globally across the entire Lumiaxy platform.</p>
         </div>
         <button onClick={handleSave} disabled={saving} className="px-6 py-3 rounded-xl bg-brand font-bold text-white text-sm flex items-center gap-2 hover:bg-brand-600 transition-colors shadow-lg">
           <Save size={16}/> {saving ? "Syncing..." : "Sync Global Pricing"}
         </button>
      </div>

      <div className="space-y-6">
         {tiers.map((tier, i) => (
           <div key={i} className="p-6 rounded-2xl bg-black/40 border border-white/10 relative">
              <button onClick={() => removeTier(i)} className="absolute top-4 right-4 p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 size={16}/></button>
              
              <div className="grid md:grid-cols-2 gap-4">
                 <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Config Name</label>
                    <input type="text" value={tier.title} onChange={e=>updateTier(i, 'title', e.target.value)} className="w-full bg-dark-900 border border-white/10 py-2 px-3 rounded-lg text-white text-sm outline-none focus:border-brand/50" />
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Display Price</label>
                    <input type="text" value={tier.price} onChange={e=>updateTier(i, 'price', e.target.value)} className="w-full bg-dark-900 border border-white/10 py-2 px-3 rounded-lg text-white text-sm outline-none focus:border-brand/50" />
                 </div>
              </div>

              <div className="mt-4">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={tier.popular} onChange={e=>updateTier(i, 'popular', e.target.checked)} className="accent-brand" />
                    <span className="text-xs text-white/50 font-bold">Highlight as "Most Popular" Tier</span>
                 </label>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                 <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Feature Set (Comma Separated)</label>
                 <textarea 
                   rows={2} value={tier.features.join(", ")} 
                   onChange={e=>updateTier(i, 'features', e.target.value.split(',').map(s=>s.trim()))} 
                   className="w-full bg-dark-900 border border-white/10 py-2 px-3 rounded-lg text-white text-sm outline-none focus:border-brand/50 resize-none font-mono"
                 />
              </div>
           </div>
         ))}
      </div>

      <button onClick={addTier} className="mt-6 w-full py-4 rounded-xl border border-dashed border-white/20 hover:border-brand/50 hover:bg-brand/5 text-white/50 hover:text-brand transition-colors text-sm font-bold flex items-center justify-center gap-2">
         <Plus size={16}/> Add New Tier Configuration
      </button>
    </div>
  );
}
