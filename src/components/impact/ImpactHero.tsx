"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useImpactData } from "@/hooks/useImpactData";

export function ImpactHero() {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const { data } = useImpactData();
    const heroContent = data.hero;

    return (
        <section className="relative bg-gradient-to-b from-[#f4f9f6] via-[#eaf5ef] to-[#f8fcf9] border-b border-emerald-100/80 py-7 sm:py-9 lg:py-11 overflow-hidden">
            {/* Subtle background ambient mesh & glows */}
            <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#059669_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-emerald-200/35 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute top-1/4 right-8 w-[280px] h-[160px] bg-teal-200/25 blur-3xl pointer-events-none rounded-full" />

            <div className="container max-w-4xl relative z-10 text-center space-y-3 sm:space-y-4 px-4 mx-auto">
                {/* Decorative Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider shadow-xs border border-emerald-200/80 backdrop-blur-sm"
                >
                    <span className="h-2 w-2 rounded-full bg-secondary-500 animate-pulse" />
                    {heroContent.badge[currentLang]}
                </motion.div>

                {/* Editorial Typography Header (Subtle size boost) */}
                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.08 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-serif font-black text-slate-900 tracking-tight leading-tight"
                >
                    {currentLang === "en" ? (
                        <>
                            Our Measurable <span className="bg-gradient-to-r from-emerald-700 via-primary-700 to-teal-700 bg-clip-text text-transparent">Healthcare Impact</span>
                        </>
                    ) : (
                        <>
                            हमारा मापने योग्य <span className="bg-gradient-to-r from-emerald-700 via-primary-700 to-teal-700 bg-clip-text text-transparent">स्वास्थ्य प्रभाव</span>
                        </>
                    )}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="max-w-2xl mx-auto text-slate-600 text-sm sm:text-base leading-relaxed font-normal"
                >
                    {heroContent.subtitle[currentLang]}
                </motion.p>
            </div>
        </section>
    );
}
