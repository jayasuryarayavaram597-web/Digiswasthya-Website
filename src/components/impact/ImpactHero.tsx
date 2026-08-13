"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useImpactData } from "@/hooks/useImpactData";

export function ImpactHero() {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const { data, lastUpdated } = useImpactData();
    const heroContent = data.hero;

    return (
        <section className="relative bg-gradient-to-b from-white via-slate-50/60 to-slate-50/30 border-b border-slate-200/60 py-8 lg:py-10 overflow-hidden">
            {/* Subtle background ambient glows */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-emerald-50/80 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute top-1/3 right-10 w-[300px] h-[200px] bg-amber-50/60 blur-3xl pointer-events-none rounded-full" />

            <div className="container max-w-4xl relative z-10 text-center space-y-6 px-4 mx-auto">
                {/* Decorative Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-primary-800 text-[10px] font-extrabold uppercase tracking-widest shadow-sm border border-slate-200"
                >
                    <span className="h-2 w-2 rounded-full bg-secondary-500 animate-pulse" />
                    {heroContent.badge[currentLang]}
                </motion.div>

                {/* Editorial Typography Header */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.1 }}
                    className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-tight"
                >
                    {currentLang === "en" ? (
                        <>
                            Our Measurable <span className="text-primary-700">Healthcare Impact</span>
                        </>
                    ) : (
                        <>
                            हमारा मापने योग्य <span className="text-primary-700">स्वास्थ्य प्रभाव</span>
                        </>
                    )}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
                    className="max-w-2xl mx-auto text-slate-600 text-base md:text-lg font-light leading-relaxed tracking-wide font-sans"
                >
                    {heroContent.subtitle[currentLang]}
                </motion.p>
            </div>
        </section>
    );
}
