"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CheckCircle2, Heart, User, Quote } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

import { stories, testimonials } from "@/data/beneficiaryData";

const ITEMS_PER_PAGE = 3;

export function BeneficiaryStories() {
    const { t } = useLanguage();
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
    const currentTestimonials = testimonials.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    return (
        <section className="py-20 bg-[#f8fafc]" id="testimonials">
            <div className="container max-w-6xl mx-auto px-4">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-widest mb-4">
                        <Heart className="w-3.5 h-3.5 fill-primary-600 animate-pulse" />
                        {t("beneficiaryStories.badge")}
                    </div>
                    <h2 className="font-serif text-3xl md:text-[2.6rem] font-bold text-gray-900 leading-tight mb-4">
                        {t("beneficiaryStories.headingPart1")} <span className="text-primary-600">{t("beneficiaryStories.headingHighlight")}</span>
                    </h2>
                    <div className="w-14 h-1 bg-primary-500 mx-auto rounded-full mb-4" />
                    <p className="text-gray-500 text-sm leading-relaxed">
                        {t("beneficiaryStories.subheading")}
                    </p>
                </motion.div>

                {/* 1. Patient Voices & Written Stories (image-led) — shown first/default */}
                <div className="mb-20">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 border-l-4 border-primary-600 pl-3">
                        {t("beneficiaryStories.writtenSectionTitle")}
                    </h3>

                    <motion.div
                        key={page}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                    >
                        {currentTestimonials.map((item, i) => (
                            <div
                                key={i}
                                className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-primary-200 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Photo-forward header: the patient's face leads the card */}
                                <div className="relative h-52 w-full bg-primary-50 overflow-hidden">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover object-top"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                                            <User className="w-14 h-14 text-primary-300" />
                                        </div>
                                    )}
                                    {/* Name + condition overlay only for no-photo cards — the real photos already have them printed on the image */}
                                    {!item.image && (
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                            <div className="font-bold text-white text-base leading-tight">{item.name}</div>
                                            <div className="text-xs text-primary-100 font-medium mt-0.5">{item.problem}</div>
                                        </div>
                                    )}
                                </div>

                                {/* The patient's own words */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <Quote className="w-7 h-7 text-primary-200 mb-2 flex-shrink-0" />
                                    <p className="font-serif text-[0.98rem] text-gray-700 leading-relaxed italic">
                                        {item.body}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Testimonials Pagination Controls */}
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => setPage(p => (p - 1 + totalPages) % totalPages)}
                            className="w-9 h-9 rounded-full border border-gray-200 hover:border-primary-600 hover:text-primary-600 flex items-center justify-center transition-colors text-gray-400"
                            aria-label="Previous"
                        >
                            ‹
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`w-2 h-2 rounded-full transition-all ${page === i ? "bg-primary-600 w-5" : "bg-gray-200"}`}
                                aria-label={`Page ${i + 1}`}
                            />
                        ))}
                        <button
                            onClick={() => setPage(p => (p + 1) % totalPages)}
                            className="w-9 h-9 rounded-full border border-gray-200 hover:border-primary-600 hover:text-primary-600 flex items-center justify-center transition-colors text-gray-400"
                            aria-label="Next"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* 2. Featured Video Testimonials */}
                <div className="border-t border-gray-200/60 pt-16">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-6 border-l-4 border-primary-600 pl-3">
                        {t("beneficiaryStories.videoSectionTitle")}
                    </h3>
                    <div className="grid lg:grid-cols-2 gap-8">
                        {stories.map((story, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15, duration: 0.55 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_6px_30px_rgba(0,0,0,0.09)] transition-shadow duration-400"
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
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-lg leading-tight">
                                                {story.name}
                                            </h4>
                                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                {story.role} &bull; {story.age}
                                            </div>
                                        </div>
                                        <span className="text-[10px] bg-primary-50 text-primary-700 font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide mt-0.5 whitespace-nowrap">
                                            {t("beneficiaryStories.videoBadge")}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-100 mb-3" />

                                    <p className="text-xs text-gray-500 mb-2.5 leading-relaxed">
                                        <span className="text-gray-800 font-semibold">{t("beneficiaryStories.challengeLabel")} </span>
                                        {story.condition}
                                    </p>

                                    <div className="flex items-start gap-2 bg-primary-50 rounded-lg px-3 py-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-primary-800 font-medium leading-relaxed">
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
