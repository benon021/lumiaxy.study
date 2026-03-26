"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Target, Shield, Clock, BookOpen, Bot, PenTool } from "lucide-react";

const features = [
  {
    icon: <Bot className="w-6 h-6 text-brand" />,
    title: "Floating Sider.ai Widget",
    description: "An omnipresent, self-aware AI tracks your Prisma study metrics and automatically generates contextual quizzes or summaries on any page instantly."
  },
  {
    icon: <Target className="w-6 h-6 text-purple-400" />,
    title: "Trackable Active Assignments",
    description: "Verified Educators deploy precisely targeted modular assignments with numerical benchmarks straight to their secure student clusters."
  },
  {
    icon: <PenTool className="w-6 h-6 text-emerald-400" />,
    title: "Grading Nexus",
    description: "Professors execute instant performance grades accompanied by deep feedback loops, triggering auto-notifications to students immediately."
  },
  {
    icon: <BookOpen className="w-6 h-6 text-blue-400" />,
    title: "Encrypted Document Hub",
    description: "Upload intricate PDF schematics or past papers locally and preview them via natively embedded secure document viewers without draining data."
  },
  {
    icon: <Shield className="w-6 h-6 text-amber-400" />,
    title: "Admin Dynamic Governance",
    description: "A centralized authority layer manipulating backend JSON pricing infrastructures so global feature accessibility obeys live edge configs."
  },
  {
    icon: <Clock className="w-6 h-6 text-cyan" />,
    title: "Sub-Second Polling",
    description: "Lumiaxy coordinates state utilizing rapid React effects to guarantee that your educator’s uploaded syllabus material hits your desk exactly when published."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 mb-6"
          >
            <Sparkles className="text-brand w-4 h-4" />
            <span className="text-sm font-bold text-brand uppercase tracking-widest">Beyond Traditional Learning</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6"
          >
            Engineered for African Geniuses.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/40"
          >
            A cohesive architecture seamlessly linking educators with active agent assistants to dismantle any academic barrier.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-8 glass rounded-[32px] border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
