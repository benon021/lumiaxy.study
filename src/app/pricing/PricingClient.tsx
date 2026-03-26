"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function PricingClient() {
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings/pricing")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.pricing) {
          try {
            setTiers(JSON.parse(data.pricing));
          } catch(e) { /* default below */ }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse text-white/50 py-20">Fetching Live Regional Rates from Server Matrix...</div>;

  const displayTiers = tiers.length > 0 ? tiers : [
    { title: "Standard Student", price: "Free", features: ["Access to General DB", "Basic AI Chat", "Submit Assignments"], popular: false },
    { title: "Lumiaxy Premium", price: "KSH 500/mo", features: ["Sider Agent Automations", "Active Tracking Insights", "Priority Exam Downloads"], popular: true }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
       {displayTiers.map((tier, i) => (
         <motion.div 
           key={i} 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
           className={`p-8 rounded-[32px] text-left relative overflow-hidden flex flex-col ${tier.popular ? 'bg-gradient-to-b from-brand/20 to-black/40 border-2 border-brand/50 shadow-[0_0_50px_rgba(var(--brand),0.3)]' : 'glass border border-white/10'}`}
         >
            {tier.popular && (
              <div className="absolute top-0 right-0 py-1.5 px-6 bg-brand text-white text-[10px] uppercase font-black tracking-widest rounded-bl-2xl">
                 Most Popular
              </div>
            )}
            
            <h3 className="text-xl font-bold text-white">{tier.title}</h3>
            <div className="mt-4 mb-8 flex items-end gap-2">
               <span className="text-4xl font-black text-white">{tier.price}</span>
            </div>
            
            <div className="space-y-4 mb-8 flex-1">
               {tier.features.map((f: string, j: number) => (
                 <div key={j} className="flex items-center gap-3 text-white/70 text-sm">
                    <Check size={16} className="text-brand shrink-0" />
                    <span>{f}</span>
                 </div>
               ))}
            </div>

            <button className={`w-full py-4 rounded-xl font-bold text-sm transition-transform active:scale-95 ${tier.popular ? 'bg-brand text-white hover:bg-brand-600 shadow-xl' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>
               {tier.price === 'Free' ? "Begin Now" : "Unlock Premium"}
            </button>
         </motion.div>
       ))}
    </div>
  );
}
