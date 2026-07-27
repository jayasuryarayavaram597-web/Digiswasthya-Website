"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { FounderStoryTeaser } from "@/components/sections/FounderStoryTeaser";
import { BeneficiaryStories } from "@/components/sections/BeneficiaryStories";
import { Collaboration } from "@/components/sections/Collaboration";
import { AwardSection } from "@/components/sections/AwardSection";
import { VideoHighlight } from "@/components/sections/VideoHighlight";
import { ImpactTeaser } from "@/components/sections/ImpactTeaser";
import { PartnersStrip } from "@/components/sections/PartnersStrip";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#f4f7f5]">
      <Navbar />
      <Hero />
      <FounderStoryTeaser />
      <Services />
      <BeneficiaryStories />
      <ImpactTeaser />
      <AwardSection />
      <VideoHighlight />
      <Collaboration />
      <PartnersStrip />

      {/* Social Media Follow Section */}
      <section className="py-16 bg-slate-900 border-t border-slate-800">
        <div className="container text-center">
          <h3 className="text-xl font-bold text-white mb-8 tracking-tight">{t("social.followTitle")}</h3>
          <div className="flex justify-center gap-5 flex-wrap">
            <a href="https://www.facebook.com/DigiSwasthya/" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5">Facebook</a>
            <a href="https://x.com/DigiSwasthya" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5">Twitter</a>
            <a href="https://www.instagram.com/digiswasthya/" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5">Instagram</a>
            <a href="https://www.linkedin.com/company/digiswasthya" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5">LinkedIn</a>
            <a href="https://www.youtube.com/channel/UC52n8c8U4jAtHsIzq7-wKvQ" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 rounded-full bg-secondary-500 hover:bg-secondary-400 text-white font-bold text-sm border border-secondary-400 transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-secondary-500/20">YouTube</a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
