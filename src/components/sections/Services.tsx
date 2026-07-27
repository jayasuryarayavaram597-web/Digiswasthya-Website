"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
    Stethoscope,
    Video,
    Megaphone,
    Activity,
    HeartPulse,
    Ambulance,
    Coins,
    ShieldCheck,
    Sparkles
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// --- ILLUSTRATED SVG ICONS ---

const PrimaryCheckupIcon = () => (
    <svg className="w-14 h-14" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="#ffedd5" stroke="#fdba74" strokeWidth="2.5" />
        <rect x="42" y="32" width="36" height="48" rx="4" fill="#ffffff" stroke="#16a34a" strokeWidth="2" />
        <rect x="52" y="26" width="16" height="8" rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <line x1="48" y1="44" x2="64" y2="44" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" />
        <line x1="48" y1="52" x2="72" y2="52" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" />
        <line x1="48" y1="60" x2="68" y2="60" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" />
        <line x1="48" y1="68" x2="60" y2="68" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" />
        <path d="M68 44l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M68 60l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34 50c-2 8 2 18 10 22s18 4 22-2c3-4 5-10 3-16" stroke="#1a6636" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M34 50V44M44 50V44" stroke="#154f2a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="68" cy="54" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="68" cy="54" r="2" fill="#ffffff" />
    </svg>
);

const TeleconsultationIcon = () => (
    <svg className="w-14 h-14" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="#ffedd5" stroke="#fdba74" strokeWidth="2.5" />
        <rect x="34" y="32" width="52" height="36" rx="3" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
        <path d="M28 68h64l3 6H25l3-6z" fill="#cbd5e1" stroke="#1e40af" strokeWidth="2" />
        <line x1="54" y1="71" x2="66" y2="71" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="46" r="8" fill="#f87171" />
        <path d="M50 58c0-5 4-7 10-7s10 2 10 7H50z" fill="#3b82f6" />
        <path d="M58 51l2 3 2-3" stroke="#ffffff" strokeWidth="1" />
        <circle cx="60" cy="35" r="1" fill="#22c55e" />
        <path d="M90 32c4 4 4 10 0 14M94 28c6 6 6 18 0 24" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const AwarenessCampsIcon = () => (
    <svg className="w-14 h-14" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="#ffedd5" stroke="#fdba74" strokeWidth="2.5" />
        <path d="M35 56h10l16 12V36L45 48H35a3 3 0 00-3 3v2a3 3 0 003 3z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" strokeLinejoin="round" />
        <path d="M61 42c4-2 8-2 10 2s2 8-2 10" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
        <rect x="52" y="58" width="36" height="26" rx="4" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
        <path d="M64 58v-4a2 2 0 012-2h8a2 2 0 012 2v4" stroke="#991b1b" strokeWidth="2" />
        <path d="M70 65v12M64 71h12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

const DiagnosticsEMRIcon = () => (
    <svg className="w-14 h-14" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="#ffedd5" stroke="#fdba74" strokeWidth="2.5" />
        <rect x="36" y="28" width="48" height="40" rx="3" fill="#ffffff" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M60 52c-2.5-4.5-8-6-12-3s-4.5 8 0 12l12 11 12-11c4.5-4 4-9 0-12s-9.5-1.5-12 3z" fill="#ec4899" stroke="#db2777" strokeWidth="2" />
        <path d="M52 56h3l2-4 3 8 2-6 2 2h3" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 82c15 0 20-8 32-8h16a4 4 0 014 4v2a4 4 0 01-4 4H62l-8 4H30V82z" fill="#ffedd5" stroke="#ea580c" strokeWidth="2" strokeLinejoin="round" />
        <path d="M88 38v8M84 42h8" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const ReferralsIcon = () => (
    <svg className="w-14 h-14" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="#ffedd5" stroke="#fdba74" strokeWidth="2.5" />
        <rect x="42" y="26" width="36" height="68" rx="6" fill="#ffffff" stroke="#8b5cf6" strokeWidth="2" />
        <rect x="46" y="32" width="28" height="50" rx="2" fill="#f3e8ff" />
        <line x1="54" y1="29" x2="66" y2="29" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="60" cy="88" r="2.5" fill="#a78bfa" />
        <path d="M50 70c4-4 8 2 12-2s4-10 8-12" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />
        <circle cx="50" cy="70" r="3.5" fill="#a78bfa" stroke="#6d28d9" strokeWidth="1" />
        <path d="M70 56c0-2-2-4-4-4s-4 2-4 4c0 3 4 6 4 6s4-3 4-6z" fill="#ef4444" />
        <circle cx="66" cy="56" r="1" fill="#ffffff" />
        <rect x="52" y="38" width="16" height="12" rx="1.5" fill="#ffffff" stroke="#8b5cf6" strokeWidth="1" />
        <path d="M60 41v6M57 44h6" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
    </svg>
);

const ConvenienceSupportIcon = () => (
    <svg className="w-14 h-14" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="#ffedd5" stroke="#fdba74" strokeWidth="2.5" />
        <path d="M30 46h38l12 10v16H30V46z" fill="#ffffff" stroke="#ea580c" strokeWidth="2" />
        <path d="M68 46h6l8 10v6h-14v-16z" fill="#d1fae5" stroke="#ea580c" strokeWidth="2" />
        <circle cx="44" cy="74" r="8" fill="#374151" stroke="#ea580c" strokeWidth="2" />
        <circle cx="44" cy="74" r="3" fill="#ffffff" />
        <circle cx="68" cy="74" r="8" fill="#374151" stroke="#ea580c" strokeWidth="2" />
        <circle cx="68" cy="74" r="3" fill="#ffffff" />
        <path d="M48 52v12M42 58h12" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M72 42h4v4h-4z" fill="#3b82f6" />
        <path d="M74 38l2 4M70 40l2 2" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="50" x2="26" y2="50" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="58" x2="24" y2="58" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="66" x2="26" y2="66" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const FinancialSupportIcon = () => (
    <svg className="w-14 h-14" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="50" fill="#ffedd5" stroke="#fdba74" strokeWidth="2.5" />
        <rect x="34" y="42" width="46" height="26" rx="2" fill="#ffffff" stroke="#16a34a" strokeWidth="2" transform="rotate(-6 57 55)" />
        <circle cx="56" cy="54" r="5" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" />
        <path d="M42 48h4M68 58h4" stroke="#86efac" strokeWidth="2" strokeLinecap="round" />
        <circle cx="74" cy="66" r="9" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="74" cy="66" r="6" fill="#fef3c7" />
        <path d="M72 63h4M72 65.5h4M74 63c1 0 2 .5 2 1.5s-1 1.5-2 1.5h-2M74 66l2 2.5" stroke="#d97706" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="62" cy="72" r="9" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="62" cy="72" r="6" fill="#fef3c7" />
        <path d="M60 69h4M60 71.5h4M62 69c1 0 2 .5 2 1.5s-1 1.5-2 1.5h-2M62 72l2 2.5" stroke="#d97706" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// --- INDIVIDUAL SERVICE CARD COMPONENT ---

function ServiceCard({
    service
}: {
    service: any;
}) {
    return (
        <div className="group relative w-full h-full rounded-3xl bg-white border border-slate-100 shadow-[0_2px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_50px_-12px_rgba(15,23,42,0.18)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden">
            {/* Visual header: real photo where available, otherwise an illustrated icon on a branded gradient */}
            <div className="relative h-44 w-full overflow-hidden">
                {service.image ? (
                    <>
                        <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                    </>
                ) : (
                    <div className="relative h-full w-full flex items-center justify-center bg-gradient-to-br from-primary-50 via-[#fffbeb] to-secondary-50">
                        {/* subtle dotted texture so the illustrated cards feel intentional, not empty */}
                        <div className="absolute inset-0 opacity-[0.5] [background-image:radial-gradient(circle_at_1px_1px,#cbd5e1_1px,transparent_0)] [background-size:16px_16px]" />
                        <div className="relative transition-transform duration-500 group-hover:scale-110 drop-shadow-sm">
                            {service.icon}
                        </div>
                    </div>
                )}
                {/* Floating icon badge — consistent identity across photo and illustrated cards */}
                <div className="absolute -bottom-6 left-5 flex items-center justify-center h-12 w-12 rounded-2xl bg-white text-primary-600 shadow-lg ring-1 ring-black/5 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                    {service.smallIcon}
                </div>
            </div>

            <div className="px-6 pt-9 pb-6 flex flex-col flex-grow">
                <h3 className="text-base font-bold text-slate-900 tracking-tight leading-snug group-hover:text-primary-700 transition-colors mb-2">
                    {service.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    {service.description}
                </p>
            </div>

            {/* Animated accent line on hover */}
            <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-secondary-400 transition-all duration-500 ease-out" />
        </div>
    );
}

// --- MAIN SERVICES SECTION COMPONENT ---

export function Services() {
    const { t } = useLanguage();

    const services = [
        {
            title: t("services.items.primaryCheckup.title"),
            description: t("services.items.primaryCheckup.description"),
            icon: <PrimaryCheckupIcon />,
            smallIcon: <Stethoscope className="w-5 h-5" />,
            image: "/images/resources/rural-clinic.jpg",
            delay: 0.05
        },
        {
            title: t("services.items.teleconsultation.title"),
            description: t("services.items.teleconsultation.description"),
            icon: <TeleconsultationIcon />,
            smallIcon: <Video className="w-5 h-5" />,
            image: "/images/resources/consultation.jpg",
            delay: 0.1
        },
        {
            title: t("services.items.awarenessCamps.title"),
            description: t("services.items.awarenessCamps.description"),
            icon: <AwarenessCampsIcon />,
            smallIcon: <Megaphone className="w-5 h-5" />,
            image: "/images/impact-community.jpg",
            delay: 0.15
        },
        {
            title: t("services.items.diagnosticsEMR.title"),
            description: t("services.items.diagnosticsEMR.description"),
            icon: <DiagnosticsEMRIcon />,
            smallIcon: <Activity className="w-5 h-5" />,
            image: "/images/resources/telemedicine-team.jpg",
            delay: 0.2
        },
        {
            title: t("services.items.referrals.title"),
            description: t("services.items.referrals.description"),
            icon: <ReferralsIcon />,
            smallIcon: <HeartPulse className="w-5 h-5" />,
            image: "/images/resources/referrals.png",
            delay: 0.25
        },
        {
            title: t("services.items.convenienceSupport.title"),
            description: t("services.items.convenienceSupport.description"),
            icon: <ConvenienceSupportIcon />,
            smallIcon: <Ambulance className="w-5 h-5" />,
            image: "/images/ds-community-outreach.jpg",
            delay: 0.3
        },
        {
            title: t("services.items.financialSupport.title"),
            description: t("services.items.financialSupport.description"),
            icon: <FinancialSupportIcon />,
            smallIcon: <Coins className="w-5 h-5" />,
            image: "/images/resources/financial-support.png",
            delay: 0.35
        }
    ];

    const row1 = services.slice(0, 4);
    const row2 = services.slice(4, 7);

    return (
        <section className="relative py-24 bg-gradient-to-b from-white via-slate-50/70 to-white overflow-hidden" id="services">
            {/* Decorative ambient blobs for depth */}
            <div className="pointer-events-none absolute -top-32 -right-32 w-[28rem] h-[28rem] bg-primary-100/40 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 -left-40 w-96 h-96 bg-secondary-100/30 rounded-full blur-3xl" />

            <div className="container max-w-7xl relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-primary-100"
                    >
                        <Sparkles className="w-3.5 h-3.5" /> {t("services.badge")}
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                    >
                        {t("services.titlePart1")}{" "}
                        <span className="text-primary-600">
                            {t("services.titleHighlight")}
                        </span>{" "}
                        {t("services.titlePart2")}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500"
                    >
                        {t("services.description")}
                    </motion.p>
                </div>

                {/* Service Cards: Row 1 (4 items) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 items-stretch">
                    {row1.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: service.delay, duration: 0.4 }}
                            className="h-full"
                        >
                            <ServiceCard
                                service={service}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Service Cards: Row 2 (3 items centered on desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 lg:w-3/4 mx-auto items-stretch">
                    {row2.map((service, idx) => {
                        return (
                            <motion.div
                                key={idx + 4}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: service.delay, duration: 0.4 }}
                                className={idx === 2 ? "h-full sm:col-span-2 sm:max-w-md sm:mx-auto sm:w-full lg:col-span-1" : "h-full"}
                            >
                                <ServiceCard
                                    service={service}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Impact Band */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#f0f7ff] via-[#f8fafc] to-[#e0f2fe] border border-blue-100/80 shadow-xl shadow-primary-900/5">
                    <div className="grid lg:grid-cols-2 gap-0 items-stretch">
                        {/* Photo side */}
                        <div className="relative min-h-[340px] overflow-hidden group">
                            <Image
                                src="/images/ds-medical-camp.jpg"
                                alt="DigiSwasthya Community Impact"
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f8fafc]/20" />
                        </div>
                        {/* Content side */}
                        <div className="p-10 md:p-14 flex flex-col justify-center space-y-6">
                            <h3 className="font-serif text-3xl md:text-4xl font-bold text-slate-950 leading-snug">
                                {t("impact.title")}{" "}
                                <span className="text-primary-600">{t("impact.highlight")}</span>
                            </h3>
                            <p className="text-slate-600 text-base leading-relaxed">
                                {t("impact.description")}
                            </p>
                            
                            {/* Campaign Details List */}
                            <ul className="space-y-4 pt-4 border-t border-slate-200 text-sm text-slate-700">
                                <li className="flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                    <span>{t("impact.campaignDetail1")}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                    <span>{t("impact.campaignDetail2")}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ShieldCheck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                    <span>{t("impact.campaignDetail3")}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
