import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorks from "@/components/home/HowItWorks";
import OwnerSection from "@/components/home/OwnerSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171411]">
      <Navbar />
      <HeroSection />
      <StatsSection/>
      <FeaturesSection/>
      <HowItWorks/>
      <OwnerSection/>
      <CTASection/>
      <Footer/>
    </main>
  );
}