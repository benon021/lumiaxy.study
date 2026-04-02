import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Star, Zap, Shield, Bot } from "lucide-react";

export default function FeaturesPage() {
   return (
      <main className="min-h-screen bg-dark-950 pt-32 pb-32">
         <Navbar />
         <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto">
               <div className="inline-flex px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold tracking-widest uppercase mb-6">
                  Unmatched Capability
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-6">
                  The First Intelligent Kenyan Study Ecosystem.
               </h1>
               <p className="text-lg text-white/50 leading-relaxed font-medium">
                  Lumiaxy.study is not just a repository of past papers. It is a living, breathing AI agent designed specifically for the rigorous demands of Kenyan academics.
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-16">
               <div className="glass p-8 rounded-[32px] border border-white/10">
                  <Bot className="text-brand mb-4" size={32} />
                  <h3 className="text-2xl font-bold text-white mb-2">Active AI Agents</h3>
                  <p className="text-white/40 leading-relaxed">Our globally persistent Sider AI physically tracks your progress and intuitively understands when you need help, generating quizzes and summarizing long PDFs on command.</p>
               </div>
               <div className="glass p-8 rounded-[32px] border border-white/10">
                  <Zap className="text-amber-400 mb-4" size={32} />
                  <h3 className="text-2xl font-bold text-white mb-2">Real-Time Educator Matrix</h3>
                  <p className="text-white/40 leading-relaxed">Teachers monitor student progress live. Educators can deploy trackable assignments natively via the platform and instantly dispatch numerical grades through Lumiaxy Grading.</p>
               </div>
            </div>
         </div>
         <Footer />
      </main>
   );
}
