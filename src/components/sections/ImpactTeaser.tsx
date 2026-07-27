"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function ImpactTeaser() {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";

    return (
        <section className="py-8 bg-[#f4f7f5]">
            <div className="container px-4">
                <div className="relative bg-gradient-to-r from-gray-900 via-slate-800 to-gray-950 rounded-3xl p-8 md:p-12 shadow-xl border border-slate-800 overflow-hidden">
                    {/* Architectural Mesh grid overlay */}
                    <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:22px_22px] pointer-events-none" />
                    <div className="absolute -bottom-16 -left-10 w-56 h-56 bg-primary-500/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-7 z-10">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2 leading-tight">
                                {currentLang === "hi" 
                                    ? "हमारा मापने योग्य स्वास्थ्य प्रभाव" 
                                    : "Our Measurable Healthcare Impact"}
                            </h3>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl">
                                {currentLang === "hi"
                                    ? "ग्रामीण भारत में डिजीस्वास्थ्य के संचालन के पैमाने, विकास के रुझान और भौगोलिक पहुँच की खोज करें।"
                                    : "Explore DigiSwasthya's scale of operations, growth trends, and geographical footprint in rural India."}
                            </p>
                        </div>
                        <div className="flex-shrink-0 w-full md:w-auto">
                            <Link
                                href="/our-impact"
                                className="relative inline-flex w-full md:w-auto items-center justify-center gap-2.5 bg-secondary-500 hover:bg-secondary-600 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all hover:gap-3.5 whitespace-nowrap"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                                </span>
                                {currentLang === "hi" ? "विकास और पहुँच चार्ट देखें" : "Explore Growth & Reach"}
                                <ArrowRight className="h-4 w-4 text-white" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
