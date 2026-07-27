"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Building2, Megaphone, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function Collaboration() {
    const { t } = useLanguage();

    const cards = [
        {
            number: "01",
            icon: TrendingUp,
            title: t("collaboration.card1Title"),
            description: t("collaboration.card1Desc"),
            image: "/images/media/augnito-partnership-1.jpg"
        },
        {
            number: "02",
            icon: Building2,
            title: t("collaboration.card2Title"),
            description: t("collaboration.card2Desc"),
            image: "/images/resources/rural-clinic.jpg"
        },
        {
            number: "03",
            icon: Megaphone,
            title: t("collaboration.card3Title"),
            description: t("collaboration.card3Desc"),
            image: "/images/real-campaign.jpg"
        },
    ];

    return (
        <section className="relative py-24 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
            {/* Decorative ambient blobs */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-[26rem] h-[26rem] bg-primary-100/40 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 -left-24 w-80 h-80 bg-secondary-100/40 rounded-full blur-3xl" />

            <div className="container relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary-100 mb-5"
                    >
                        <HeartHandshake className="w-3.5 h-3.5" /> {t("collaboration.badge")}
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-3xl md:text-5xl font-bold text-gray-900 leading-tight"
                    >
                        {t("collaboration.heading")}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-lg text-gray-500 leading-relaxed"
                    >
                        {t("collaboration.subheading")}
                    </motion.p>
                </div>

                {/* Partner cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.number}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12, duration: 0.45 }}
                            >
                                <CollabCard {...card} Icon={Icon} />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Closing CTA banner */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="mt-14 relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 px-8 py-10 md:px-14 md:py-12 shadow-xl shadow-primary-900/20"
                >
                    {/* texture + glow */}
                    <div className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:22px_22px]" />
                    <div className="absolute -top-16 -right-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />

                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-7">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                                {t("collaboration.ctaHeading")}
                            </h3>
                            <p className="text-primary-100 leading-relaxed max-w-xl">
                                {t("collaboration.ctaText")}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                            <Link
                                href="/contact-us#message-form"
                                className="relative inline-flex items-center justify-center gap-2.5 bg-white text-primary-700 hover:bg-primary-50 font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-all hover:gap-3.5 whitespace-nowrap"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                                </span>
                                {t("collaboration.ctaButton")} <ArrowRight className="h-4 w-4 text-primary-600" />
                            </Link>
                            <Link
                                href="/donate"
                                className="inline-flex items-center justify-center gap-2 bg-secondary-500 hover:bg-secondary-600 text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-lg transition-colors whitespace-nowrap"
                            >
                                {t("nav.donate")}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function CollabCard({
    number,
    title,
    description,
    Icon,
    image
}: {
    number: string;
    title: string;
    description: string;
    Icon: React.ComponentType<{ className?: string }>;
    image: string;
}) {
    return (
        <div className="group relative w-full h-full rounded-3xl bg-white border border-slate-100 shadow-[0_2px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_50px_-12px_rgba(15,23,42,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden">
            {/* Visual header: photo */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                {/* watermark number */}
                <span className="absolute top-4 right-5 text-4xl font-serif font-bold text-white/50 group-hover:text-white/80 transition-colors duration-300 select-none leading-none">
                    {number}
                </span>
                {/* Floating icon badge */}
                <div className="absolute -bottom-6 left-5 flex items-center justify-center h-12 w-12 rounded-2xl bg-white text-primary-600 shadow-lg ring-1 ring-black/5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="px-6 pt-9 pb-6 flex flex-col flex-grow">
                <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-primary-700 transition-colors mb-2">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    {description}
                </p>
            </div>

            {/* animated accent line */}
            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-secondary-400 transition-all duration-500 ease-out" />
        </div>
    );
}
