"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function CTA() {
  return (
    <section id="cta" className="relative py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(98,114,241,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-3xl p-12 sm:p-16 relative overflow-hidden"
        >
          {/* Top shine */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(98,114,241,0.8) 30%, rgba(139,92,246,0.8) 70%, transparent)",
            }}
          />

          {/* Orb */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(98,114,241,0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 mx-auto overflow-hidden bg-white/5 border border-white/10 shadow-2xl p-1">
              <Image 
                src="/fusion-orb.png" 
                alt="Lumiaxy.ai Orb" 
                width={80} 
                height={80} 
                className="object-cover rounded-full animate-swirl" 
              />
            </div>

            <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6">
              Ready to ace your{" "}
              <span className="gradient-text">exams?</span>
            </h2>

            <p className="text-lg text-white/55 max-w-xl mx-auto mb-10 leading-relaxed">
              Join 52,000+ students already mastering their subjects with Lumiaxy.study. 
              Get your first past paper solved by AI for free.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group relative inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-bold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center"
                style={{ background: "linear-gradient(135deg, #6272f1 0%, #8b5cf6 100%)" }}
              >
                <span className="relative z-10">Start Studying Free</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </Link>

              <Link
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white/60 hover:text-white border border-white/10 hover:border-white/20 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300 w-full sm:w-auto justify-center"
              >
                Talk to Sales
              </Link>
            </div>

            <p className="mt-8 text-sm text-white/30">
              Free plan available · No credit card needed · Cancel anytime
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
