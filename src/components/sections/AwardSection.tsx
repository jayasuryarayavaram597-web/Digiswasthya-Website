"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Award, CheckCircle2, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function AwardSection() {
    const { t } = useLanguage();

    return (
        <section className="py-6 sm:py-8 bg-gradient-to-b from-[#f8fafc] to-white" id="awards">
            <div className="container max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                        
                        {/* Image Side - Larger, Clearer Frame */}
                        <div className="lg:col-span-6 flex justify-center">
                            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ring-1 ring-slate-900/10 bg-slate-100 group">
                                <Image
                                    src="/images/award-recognition.png"
                                    alt="DigiSwasthya Award Recognition"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                                
                                {/* Floating Category Badge */}
                                <div className="absolute top-3.5 left-3.5">
                                    <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-white/60">
                                        <Award className="w-3.5 h-3.5 text-amber-500" />
                                        National Recognition
                                    </span>
                                </div>

                                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                                    <p className="text-xs font-medium text-slate-100 drop-shadow">
                                        Honoring rural healthcare innovation & technology impact
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content Side - Refined & Balanced */}
                        <div className="lg:col-span-6 space-y-4">
                            <div>
                                <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                    {t("award.badge")}
                                </span>

                                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mt-2.5">
                                    {t("award.titlePart1")}{" "}
                                    <span className="text-emerald-700">
                                        {t("award.titleHighlight")}
                                    </span>
                                </h2>
                            </div>

                            {/* Quote Box */}
                            <div className="bg-slate-50 border-l-4 border-emerald-500 rounded-r-xl p-3.5 my-2">
                                <p className="text-xs sm:text-sm text-slate-700 font-medium italic leading-relaxed">
                                    {t("award.quote")}
                                </p>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {t("award.description")}
                            </p>

                            {/* Trust Badges */}
                            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 border-t border-slate-100">
                                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Institutional Recognition
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Non-Profit Care
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-emerald-700">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> 80G Tax Exempted
                                </span>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
}
