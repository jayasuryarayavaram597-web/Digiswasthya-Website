"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HandshakeIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Show only the 4 most visually strong / largest partner logos as highlights
const featuredPartners = [
    { id: "01", image: "/images/partner-1.png", alt: "Partner 1" },
    { id: "02", image: "/images/partner-2.png", alt: "Partner 2" },
    { id: "10", image: "/images/partner-10.png", alt: "Partner 10" },
    { id: "15", image: "/images/partner-15.png", alt: "Partner 15" },
];

export function PartnersStrip() {
    const { language } = useLanguage();
    const isHindi = language === "hi";

    return (
        <section className="pt-6 sm:pt-8 pb-12 sm:pb-14 bg-white border-t border-b border-gray-100">
            <div className="container max-w-6xl mx-auto px-4">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                            <HandshakeIcon className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-primary-600 mb-0.5">
                                {isHindi ? "हमारे सहयोगी" : "Trusted By"}
                            </p>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                {isHindi
                                    ? "हमारे प्रमुख साझेदार"
                                    : "Our Valued Partners"}
                            </h3>
                        </div>
                    </div>

                    {/* View All Link */}
                    <Link
                        href="/about-us#our-partners"
                        className="group inline-flex items-center gap-2 text-base font-semibold text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-500 rounded-full px-5 py-2 transition-all duration-200 hover:bg-primary-50 whitespace-nowrap"
                    >
                        {isHindi ? "सभी साझेदार देखें" : "View all 17 partners"}
                        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {/* 4 Featured Partner Logos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {featuredPartners.map((partner, i) => (
                        <motion.div
                            key={partner.id}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.08 }}
                            className="group relative h-24 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-5 shadow-sm hover:shadow-md hover:border-primary-200 hover:bg-white transition-all duration-300"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={partner.image}
                                    alt={partner.alt}
                                    fill
                                    className="object-contain transition-all duration-300"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center text-xs text-gray-400 mt-6"
                >
                    {isHindi
                        ? "और भी संगठनों के साथ हम मिलकर काम करते हैं।"
                        : "And many more organisations working with us across India."}{" "}
                    <Link
                        href="/about-us#our-partners"
                        className="text-primary-600 hover:underline font-semibold"
                    >
                        {isHindi ? "यहाँ क्लिक करें →" : "Click here →"}
                    </Link>
                </motion.p>

            </div>
        </section>
    );
}
