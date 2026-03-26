import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StudyToolsPage() {
  return (
    <main className="min-h-screen bg-dark-950 pt-32 pb-32">
       <Navbar />
       <div className="max-w-6xl mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-6">Study Tools Array</h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto">Lumiaxy.study deploys high-end digital weapons for your exams.</p>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="glass p-8 rounded-[24px]">
               <h3 className="font-bold text-white text-xl mb-2">PDF Base64 Encoders</h3>
               <p className="text-white/40 text-sm">Preview secure documents locally to save high-priced mobile data before attempting large downloads.</p>
             </div>
             <div className="glass p-8 rounded-[24px]">
               <h3 className="font-bold text-white text-xl mb-2">Omnipresent AI Tracker</h3>
               <p className="text-white/40 text-sm">An AI that permanently monitors your study vectors securely via Prisma.</p>
             </div>
             <div className="glass p-8 rounded-[24px]">
               <h3 className="font-bold text-white text-xl mb-2">Sub-Second Notification Engine</h3>
               <p className="text-white/40 text-sm">Immediate pings when a crucial score drops or a professor issues a lockdown assignment.</p>
             </div>
          </div>
       </div>
       <Footer />
    </main>
  );
}
