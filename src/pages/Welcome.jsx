import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrustedBy from '../components/TrustedBy';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Comparison from '../components/Comparison';
import AIMentor from '../components/AIMentor';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function Welcome() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 overflow-x-hidden font-sans">
      {/* Background layer structure: Grid, Noise, Glows */}
      <div className="absolute inset-0 bg-grid-pattern z-0 pointer-events-none opacity-40"></div>
      <div className="absolute inset-0 bg-noise z-0 pointer-events-none opacity-[0.15]"></div>
      
      {/* Dynamic blurred backdrop glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-blue/5 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-[40%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-brand-violet/5 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-15%] w-[55vw] h-[55vw] rounded-full bg-indigo-500/5 blur-[160px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky Navbar */}
        <Navbar />

        {/* Page Sections */}
        <main className="flex-grow">
          {/* Hero Section */}
          <Hero />

          {/* Trusted By Section */}
          {/* <TrustedBy /> */}

          {/* Core Features & Placement Section */}
          <Features />

          {/* How It Works Section */}
          <HowItWorks />

          {/* Why CodeArena Section */}
          {/* <Comparison /> */}

          {/* AI Mentor Section */}
          {/* <AIMentor /> */}

          {/* Statistics Section
          <Stats /> */}

          {/* Testimonials Section */}
          {/* <Testimonials /> */}

          {/* FAQ Accordion Section */}
          <FAQ />

          {/* Final Call To Action */}
          <CTA />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
