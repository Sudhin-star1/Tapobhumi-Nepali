import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Experiences } from "@/components/Experiences";
import { Packages } from "@/components/Packages";
import { Vehicles } from "@/components/Vehicles";
import { Gallery } from "@/components/Gallery";
import { TreksSection } from "@/components/TreksSection";
import { ToursSection } from "@/components/ToursSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyUs } from "@/components/WhyUs";
import { Testimonials } from "@/components/Testimonials";
import { PlanJourney } from "@/components/PlanJourney";
import { ContactWithExpert } from "@/components/ContactWithExpert";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    document.title = "Tapobhumi Nepali Darshan · Nepal Treks, Spiritual Tours & Himalayan Journeys";
    const desc = "Discover Nepal beyond travel — spiritual paths, Pokhara retreats, Muktinath pilgrimages and Himalayan adventures crafted by local guides.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.origin + "/");
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Experiences />
      <Packages />
      <TreksSection />
      <ToursSection />
      <ServicesSection />
      <Vehicles />
      <Gallery />
      <WhyUs />
      <Testimonials />
      <ContactWithExpert />
      <PlanJourney />
      <Footer />
      <FloatingActions />
    </main>
  );
};

export default Index;
