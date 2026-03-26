"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, ArrowRight, GraduationCap, BookOpen } from "lucide-react";
import AIOrb from "@/components/ai-orb/AIOrb";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [credentials, setCredentials] = useState("");
  const [officeHours, setOfficeHours] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, credentials, officeHours, contactInfo: email }),
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Server returned an unexpected response.");
      }

      if (!res.ok) throw new Error(data.error || "Failed to register");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors group z-20">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden mb-5 mx-auto">
            <AIOrb size={64} state="idle" reactive={false} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Create Account</h1>
          <p className="text-white/40 text-sm max-w-[280px]">Join Lumiaxy and start your learning journey</p>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-2xl bg-white/5 border border-white/10 p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole("STUDENT")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === "STUDENT" ? "bg-brand text-white shadow-lg" : "text-white/40 hover:text-white"}`}
          >
            <GraduationCap size={16} /> Student
          </button>
          <button
            type="button"
            onClick={() => setRole("TEACHER")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === "TEACHER" ? "bg-brand text-white shadow-lg" : "text-white/40 hover:text-white"}`}
          >
            <BookOpen size={16} /> Teacher
          </button>
        </div>

        {/* Signup Card */}
        <div className="glass rounded-[32px] p-8 border border-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative">
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-brand/50 to-transparent" />

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className="relative group mt-1">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand transition-colors" size={18} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={role === "TEACHER" ? "Ms. Jane Smith" : "John Doe"} required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-all" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group mt-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand transition-colors" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@lumiaxy.study" required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-all" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group mt-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand transition-colors" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-all" />
              </div>
            </div>

            {/* Teacher-only fields */}
            {role === "TEACHER" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Credentials / Subjects</label>
                  <input type="text" value={credentials} onChange={(e) => setCredentials(e.target.value)} placeholder="e.g. BSc Physics, 5 years teaching"
                    className="w-full mt-1 bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-brand/40 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Office Hours</label>
                  <input type="text" value={officeHours} onChange={(e) => setOfficeHours(e.target.value)} placeholder="e.g. Mon-Fri 2PM–4PM"
                    className="w-full mt-1 bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-brand/40 transition-all" />
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400 text-center">
                {error}
              </motion.div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full group relative overflow-hidden rounded-2xl py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
              style={{ background: "linear-gradient(135deg, #ff7200 0%, #ea580c 100%)" }}>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                  <>
                    {role === "TEACHER" ? "Create Teacher Account" : "Create Student Account"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link href="/login" className="text-brand hover:text-white transition-colors font-semibold">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
