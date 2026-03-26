import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-dark-950 pt-32 pb-32">
       <Navbar />
       <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-5xl font-black text-white tracking-tighter mb-6">Open Matrix Resources</h1>
          <p className="text-white/40 mb-12">Lumiaxy provides a subset of past papers publicly to accelerate your growth.</p>
          
          <div className="p-12 glass border border-white/10 rounded-[32px]">
             <h3 className="text-xl font-bold text-white mb-2">Login Required for Encrypted Files</h3>
             <p className="text-white/40 text-sm mb-6 max-w-lg mx-auto">Full access to the Kenyan KNEC past papers and teacher-uploaded guides requires an active Student profile.</p>
             <a href="/login" className="inline-flex py-3 px-8 rounded-xl bg-brand font-bold text-white text-sm">
                Access Central Database
             </a>
          </div>
       </div>
       <Footer />
    </main>
  );
}
