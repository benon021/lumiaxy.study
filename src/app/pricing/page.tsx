import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingClient from "./PricingClient";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-dark-950 pt-32 pb-32 relative">
       {/* Background glow */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-brand/10 blur-[120px] pointer-events-none rounded-full" />
       
       <Navbar />
       <div className="max-w-5xl mx-auto px-4 lg:px-8 relative z-10 text-center">
          <div className="inline-flex px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold tracking-widest uppercase mb-6">
             Transparent Control
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">
            Elite Studies. <br/> Accessible Pricing.
          </h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto mb-16">
            Lumiaxy.study adjusts perfectly to the Kenyan academic standard.
            These live prices are dictated directly from the Administrator Dashboard.
          </p>
          
          <PricingClient />
       </div>
       <Footer />
    </main>
  );
}
