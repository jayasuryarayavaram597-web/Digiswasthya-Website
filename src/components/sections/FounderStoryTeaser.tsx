"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Quote, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function FounderStoryTeaser() {
    const { t } = useLanguage();

    return (
        <section className="pt-24 pb-4 bg-gradient-to-br from-slate-50 via-white to-primary-50/30 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,#16a34a_1px,transparent_0)] [background-size:28px_28px] pointer-events-none" />
            <div className="container px-4 relative z-10">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative mx-auto lg:mx-0 flex flex-col items-center"
                    >
                        <div className="relative">
                            <div className="relative w-52 h-52 lg:w-72 lg:h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-primary-100">
                                <Image
                                    src="/images/sandeep-founder.png"
                                    alt="Sandeep Kumar, Founder, DigiSwasthya Foundation"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white rounded-2xl px-4 py-3 shadow-xl shadow-primary-600/30">
                                <Quote className="h-5 w-5" />
                            </div>
                            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-secondary-400 opacity-80" />
                            <div className="absolute -bottom-6 left-6 w-5 h-5 rounded-full bg-primary-200 opacity-60" />
                        </div>

                        {/* Caption below Founder Image */}
                        <div className="mt-7 text-center">
                            <p className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                                {t("founderTeaser.signature")}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-[0.18em] mb-5">
                            <span className="h-px w-7 bg-primary-600" /> {t("founderTeaser.badge")}
                        </div>
                        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug mb-6">
                            {t("founderTeaser.heading")}
                        </h2>
                        <div className="space-y-3 text-gray-600 leading-relaxed text-base border-l-4 border-primary-100 pl-5">
                            <p>{t("founderTeaser.paragraph1")}</p>
                            <p>{t("founderTeaser.paragraph2")}</p>
                        </div>
                        <Link
                            href="/about-us#sandeeps-story"
                            className="inline-flex items-center gap-2 mt-7 text-primary-600 hover:text-primary-700 font-bold text-sm border-b-2 border-primary-200 hover:border-primary-600 pb-1 transition-all hover:gap-3"
                        >
                            {t("founderTeaser.readMore")} <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
