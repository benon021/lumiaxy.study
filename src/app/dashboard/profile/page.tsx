"use client";

import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  Award,
  Edit2,
  ExternalLink,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      {/* Profile Header */}
      <div className="relative h-64 md:h-80 rounded-[40px] overflow-hidden group">
         {/* Cover Image Simulation */}
         <div className="absolute inset-0 bg-gradient-to-br from-brand/40 via-violet-600/20 to-cyan-500/20" />
         <div className="absolute inset-0 grid-bg opacity-30" />
         
         <div className="absolute bottom-10 left-10 flex flex-col md:flex-row items-end gap-6 z-10">
            <div className="relative group/avatar">
               <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] bg-dark-900 border-4 border-white/10 flex items-center justify-center text-4xl font-bold text-white shadow-2xl relative overflow-hidden">
                  <span className="relative z-10 transition-transform group-hover/avatar:scale-110">JD</span>
                  <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
               </div>
               <button className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-brand text-white shadow-lg shadow-brand/40 border border-white/20 hover:scale-110 active:scale-95 transition-all">
                  <Camera size={18} />
               </button>
            </div>
            
            <div className="mb-2">
               <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">John Doe</h1>
               <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Premium Plan</span>
                  <span className="flex items-center gap-1.5 text-white/60 text-xs font-medium bg-black/20 px-3 py-1 rounded-lg backdrop-blur-md border border-white/5">
                     <MapPin size={14} className="text-white/20" />
                     Nairobi, Kenya
                  </span>
               </div>
            </div>
         </div>
         
         <button className="absolute top-8 right-8 flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-white text-sm font-bold hover:bg-white/10 transition-all">
            <Edit2 size={16} />
            Edit Cover
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column: Details */}
         <div className="lg:col-span-1 space-y-8">
            <div className="glass rounded-[32px] p-6 border border-white/10 shadow-xl space-y-6">
               <h3 className="text-lg font-bold text-white tracking-tight">Personal Info</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-4 text-white/40">
                     <div className="p-2.5 rounded-xl bg-white/5 border border-white/5"><Mail size={16} /></div>
                     <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Email Address</p>
                        <p className="text-xs font-semibold text-white truncate">johndoe@lumiaxy.study</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 text-white/40">
                     <div className="p-2.5 rounded-xl bg-white/5 border border-white/5"><Phone size={16} /></div>
                     <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Phone Number</p>
                        <p className="text-xs font-semibold text-white">+254 712 345 678</p>
                     </div>
                  </div>
               </div>
               
               <div className="pt-6 border-t border-white/5 flex flex-wrap gap-2">
                  <button className="p-3 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all"><Github size={18} /></button>
                  <button className="p-3 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all"><Twitter size={18} /></button>
                  <button className="p-3 rounded-xl bg-white/5 text-white/20 hover:text-white transition-all"><Linkedin size={18} /></button>
               </div>
            </div>
            
            <div className="glass rounded-[32px] p-6 border border-white/10 shadow-xl bg-gradient-to-b from-brand/5 to-transparent relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-brand/10 rounded-full blur-[30px] -mr-12 -mt-12" />
               <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                  <Award size={22} className="text-brand" />
                  Your Achievements
               </h3>
               <div className="space-y-4">
                  {[
                    { label: "AI Pioneer", desc: "First 100 explanations", color: "cyan" },
                    { label: "Paper Master", desc: "Solved 50+ papers", color: "emerald-400" },
                    { label: "Early Adopter", desc: "Joined beta v2.0", color: "amber-400" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between group/item">
                       <div>
                          <p className="text-xs font-bold text-white group-hover/item:text-brand transition-colors">{item.label}</p>
                          <p className="text-[10px] text-white/30">{item.desc}</p>
                       </div>
                       <ExternalLink size={12} className="text-white/10 group-hover/item:text-white transition-all" />
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Column: Bio & More */}
         <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[32px] p-8 border border-white/10 shadow-xl space-y-6">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white tracking-tight">Biography</h3>
                  <button className="text-xs font-bold text-brand hover:text-white transition-colors">Edit Bio</button>
               </div>
               <p className="text-sm text-white/50 leading-[1.8]">
                  Aspiring computer scientist with a passion for biology and complex systems. I use Lumiaxy to bridge the gap between theoretical concepts and exam performance. Currently focusing on the Intersection of AI and Genetics.
                  <br /><br />
                  "Learning is not just about the destination, but the futuristic journey we take to get there."
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="glass rounded-[32px] p-6 border border-white/10 shadow-xl space-y-4">
                  <h4 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em]">Current Learning</h4>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold text-xs overflow-hidden relative group">
                        <div className="absolute inset-0 bg-brand/30 animate-pulse-slow opacity-0 group-hover:opacity-100 transition-opacity" />
                        BIO
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white">Full Biology Prep</p>
                        <p className="text-xs text-brand">85% Completed</p>
                     </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1 }} className="h-full bg-brand rounded-full" />
                  </div>
               </div>
               
               <div className="glass rounded-[32px] p-6 border border-white/10 shadow-xl space-y-4">
                  <h4 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em]">Security Status</h4>
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <ShieldCheck size={24} />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white">Account Secure</p>
                        <p className="text-xs text-emerald-400">2FA Enabled</p>
                     </div>
                  </div>
                  <button className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white transition-colors">Review Security Settings</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
