import AboutSection from './components/AboutSection';
import FeaturedVideoSection from './components/FeaturedVideoSection';
import PhilosophySection from './components/PhilosophySection';
import ServicesSection from './components/ServicesSection';
import { CustomVideo } from './components/CustomVideo';
import { AnimatedText } from './components/ui/animated-shiny-text';
import { CinematicFooter } from './components/ui/motion-footer';
import { LandingHero } from './components/LandingHero';
import { SEO } from './components/SEO';

export default function App() {
  return (
    <div className="relative bg-black min-h-screen text-white font-sans selection:bg-white/30 overflow-x-hidden">
      <SEO path="/" />
      <main className="relative z-10 w-full bg-black flex flex-col shadow-2xl rounded-b-3xl border-b border-white/10">
        {/* Hero Section */}
        <LandingHero />

        <div className="relative z-10 bg-black">
          <AboutSection />
        </div>

        <div className="sticky top-0 h-screen flex flex-col justify-center bg-black z-0">
          <FeaturedVideoSection />
        </div>

        <div className="relative z-10 bg-black pb-20">
          <PhilosophySection />
          <ServicesSection />
        </div>
      </main>
      
      <CinematicFooter />
    </div>
  );
}
