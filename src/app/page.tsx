import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Features from "@/components/Features";
import About from "@/components/About";
import FeatureDetails from "@/components/FeatureDetails";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-dark-950 overflow-hidden">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <About />
      <FeatureDetails />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
