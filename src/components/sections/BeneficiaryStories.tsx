"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CheckCircle2, Heart, User, Quote } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

import { stories, testimonials } from "@/data/beneficiaryData";

const ITEMS_PER_PAGE = 3;

const carouselVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 35 : direction < 0 ? -35 : 0,
        opacity: 0,
        scale: 0.985,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1.0] as const,
        },
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction > 0 ? -35 : 35,
        opacity: 0,
        scale: 0.985,
        transition: {
            duration: 0.45,
            ease: [0.25, 0.1, 0.25, 1.0] as const,
        },
    }),
};

export function BeneficiaryStories() {
    const { t } = useLanguage();
    const [[page, direction], setPageWithDir] = useState<[number, number]>([0, 0]);
    const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
    const currentTestimonials = testimonials.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    const paginate = (newDirection: number) => {
        setPageWithDir(([prevPage]) => {
            const nextPage = (prevPage + newDirection + totalPages) % totalPages;
            return [nextPage, newDirection];
        });
    };

    const goToPage = (targetPage: number) => {
        setPageWithDir(([prevPage]) => {
            const dir = targetPage > prevPage ? 1 : -1;
            return [targetPage, dir];
        });
    };

    return (
        <section className="pt-6 sm:pt-10 pb-6 sm:pb-8 bg-[#f8fafc]" id="testimonials">
            <div className="container max-w-6xl mx-auto px-4">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="text-center max-w-2xl mx-auto mb-8 sm:mb-10"
                >
                    <div className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-widest mb-3">
                        <Heart className="w-3.5 h-3.5 fill-primary-600 animate-pulse" />
                        {t("beneficiaryStories.badge")}
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-3">
                        {t("beneficiaryStories.headingPart1")} <span className="text-primary-600">{t("beneficiaryStories.headingHighlight")}</span>
                    </h2>
                    <div className="w-12 h-1 bg-primary-500 mx-auto rounded-full mb-3" />
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                        {t("beneficiaryStories.subheading")}
                    </p>
                </motion.div>

                {/* 1. Patient Voices & Written Stories (image-led) — shown first/default */}
                <div className="mb-10 sm:mb-12">
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900 mb-5 border-l-4 border-primary-600 pl-3">
                        {t("beneficiaryStories.writtenSectionTitle")}
                    </h3>

                    <div className="relative overflow-hidden mb-6">
                        <AnimatePresence mode="wait" custom={direction} initial={false}>
                            <motion.div
                                key={page}
                                custom={direction}
                                variants={carouselVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="grid grid-cols-1 md:grid-cols-3 gap-5"
                            >
                                {currentTestimonials.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-primary-300 hover:shadow-md transition-all duration-300"
                                    >
                                        {/* Photo-forward header */}
                                        <div className="relative h-44 sm:h-48 w-full bg-primary-50 overflow-hidden">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover object-top"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                                                    <User className="w-12 h-12 text-primary-300" />
                                                </div>
                                            )}
                                            {!item.image && (
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3.5">
                                                    <div className="font-bold text-white text-sm leading-tight">{item.name}</div>
                                                    <div className="text-[11px] text-primary-100 font-medium mt-0.5">{item.problem}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* The patient's own words */}
                                        <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between">
                                            <div>
                                                <Quote className="w-5 h-5 text-primary-200 mb-1.5 flex-shrink-0" />
                                                <p className="font-serif text-xs sm:text-[13.5px] text-gray-700 leading-relaxed italic">
                                                    {item.body}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Testimonials Pagination Controls */}
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => paginate(-1)}
                            className="w-8 h-8 rounded-full border border-gray-200 hover:border-primary-600 hover:text-primary-600 flex items-center justify-center transition-colors text-gray-500 hover:bg-primary-50 text-sm font-bold active:scale-95"
                            aria-label="Previous"
                        >
                            ‹
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${page === i ? "bg-primary-600 w-5" : "bg-gray-200 w-1.5 hover:bg-primary-300"}`}
                                aria-label={`Page ${i + 1}`}
                            />
                        ))}
                        <button
                            onClick={() => paginate(1)}
                            className="w-8 h-8 rounded-full border border-gray-200 hover:border-primary-600 hover:text-primary-600 flex items-center justify-center transition-colors text-gray-500 hover:bg-primary-50 text-sm font-bold active:scale-95"
                            aria-label="Next"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* 2. Featured Video Testimonials */}
                <div className="border-t border-gray-200/70 pt-8 sm:pt-10">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900 border-l-4 border-primary-600 pl-3">
                            {t("beneficiaryStories.videoSectionTitle")}
                        </h3>
                        <a
                            href="/media?tab=videos"
                            className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-orange-700 hover:text-orange-800 transition-colors group"
                        >
                            More Lives Changed
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </a>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-6">
                        {stories.map((story, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.4 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow duration-300"
                            >
                                {/* Video Player */}
                                <div className="bg-gray-900 w-full aspect-video flex items-center justify-center">
                                    <video
                                        controls
                                        preload="metadata"
                                        className="w-full h-full block"
                                    >
                                        <source src={story.video} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>

                                {/* Story Info */}
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-start justify-between mb-2.5">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-base leading-tight">
                                                {story.name}
                                            </h4>
                                            <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                                                <MapPin className="w-3 h-3 flex-shrink-0 text-slate-400" />
                                                {story.role} &bull; {story.age}
                                            </div>
                                        </div>
                                        <span className="text-[10px] bg-primary-50 text-primary-700 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                                            {t("beneficiaryStories.videoBadge")}
                                        </span>
                                    </div>

                                    <div className="border-t border-slate-100 mb-2.5" />

                                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                                        <span className="text-gray-900 font-semibold">{t("beneficiaryStories.challengeLabel")} </span>
                                        {story.condition}
                                    </p>

                                    <div className="flex items-start gap-2 bg-primary-50/80 border border-primary-100/60 rounded-lg p-2.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-primary-900 font-medium leading-relaxed">
                                            {story.result}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
