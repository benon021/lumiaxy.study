"use client";

import { motion } from "framer-motion";
import { CreditCard, Sparkles, Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    badge: "Starter",
    features: ["AI chat (basic)", "Study materials access", "Assignments & grades", "Teacher directory"],
  },
  {
    name: "Pro",
    price: "$6/mo",
    badge: "Most Popular",
    features: ["Higher AI limits", "Quiz practice", "Priority explanations", "Advanced progress insights"],
  },
  {
    name: "Team",
    price: "$19/mo",
    badge: "Schools",
    features: ["Classroom management", "Teacher analytics", "Admin controls", "Shared libraries"],
  },
];

export default function SubscriptionPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <CreditCard size={28} className="text-brand" />
          Subscription
        </h1>
        <p className="text-white/40 text-sm">Choose a plan that fits your learning style.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-[40px] p-7 border border-white/10 hover:border-brand/30 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand/5 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-white">{p.name}</h2>
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">
                  {p.badge}
                </span>
              </div>
              <p className="text-3xl font-bold text-white tracking-tight">{p.price}</p>
              <div className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-white/50">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
                      <Check size={12} className="text-emerald-400" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <button className="mt-8 w-full py-3 rounded-2xl bg-brand text-white text-sm font-bold hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2">
                <Sparkles size={16} />
                Choose {p.name}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

