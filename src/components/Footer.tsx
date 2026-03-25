"use client";

import Link from "next/link";
import { Twitter, Github, Linkedin, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const footerLinks = {
  Study: ["Past Papers", "Study Notes", "Lumiaxy.ai", "Flashcards", "Practice Tests"],
  Subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "History"],
  Company: ["About Us", "Blog", "Careers", "Support", "Contact"],
  Legal: ["Privacy Policy", "Terms", "Security", "Cookie Policy"],
};

const socials = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-dark-900/50">
      {/* Top shine */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(98,114,241,0.4) 50%, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(98,114,241,0.2)] bg-white/5 border border-white/10 overflow-hidden p-1">
                <Image 
                  src="/fusion-orb.png" 
                  alt="Lumiaxy Logo" 
                  width={40} 
                  height={40} 
                  className="object-cover rounded-full animate-swirl" 
                />
              </div>
              <span className="font-display font-bold text-2xl text-white">Lumiaxy<span className="gradient-text">.study</span></span>
            </Link>

            <p className="text-sm text-white/45 leading-relaxed max-w-sm mb-6">
              The ultimate destination for students. We provide the tools, 
              resources, and AI-powered help you need to master your studies 
              and excel in your exams.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4 font-mono">
                  {category}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-white/40 hover:text-white/80 transition-colors duration-200"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter bar */}
        <div className="glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 mb-14">
          <div className="flex-1">
            <h4 className="font-display font-semibold text-white text-lg mb-1">
              Stay in the loop
            </h4>
            <p className="text-sm text-white/45">
              Get product updates, launch announcements, and engineering insights.
            </p>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              type="email"
              placeholder="Enter your student email"
              className="flex-1 sm:w-64 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-500/40 transition-colors"
            />
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #6272f1, #8b5cf6)" }}
            >
              Get Updates
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} Lumiaxy, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-white/30">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
            <Link
              href="#"
              className="ml-1 inline-flex items-center gap-0.5 hover:text-white/60 transition-colors"
            >
              status.lumiaxy.io <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
