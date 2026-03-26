import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-dark-950 pt-32 pb-32">
       <Navbar />
       <div className="max-w-4xl mx-auto px-4 lg:px-8">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-8 text-center">How Lumiaxy Works</h1>
          <div className="space-y-8 mt-12">
             <div className="flex gap-6 items-start">
               <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold shrink-0">1</div>
               <div>
                  <h3 className="text-2xl font-bold text-white">Create your secure role</h3>
                  <p className="text-white/40 mt-2">Sign up as a Student or Teacher. Admins monitor everything securely behind Vercel edge networks.</p>
               </div>
             </div>
             <div className="flex gap-6 items-start">
               <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold shrink-0">2</div>
               <div>
                  <h3 className="text-2xl font-bold text-white">Engage the Global Library</h3>
                  <p className="text-white/40 mt-2">Teachers deposit verified exam papers and encrypted PDF guides. Students consume them.</p>
               </div>
             </div>
             <div className="flex gap-6 items-start">
               <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold shrink-0">3</div>
               <div>
                  <h3 className="text-2xl font-bold text-white">Summon the Active Agent</h3>
                  <p className="text-white/40 mt-2">Strike the right boundary widget. The Sider AI expands instantly, absorbing your current assignment context to generate immediate assistance.</p>
               </div>
             </div>
          </div>
       </div>
       <Footer />
    </main>
  );
}
