"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useImpactData } from "@/hooks/useImpactData";
import { DonutChart } from "./DonutChart";

interface AgeGroupItem {
    ageGroup: string;
    count: number;
    color: string;
    totalPatients: number;
}

function AgeGroupRow({ item, max, index }: { item: AgeGroupItem; max: number; index: number }) {
    const pctOfMax = Math.round((item.count / max) * 100);
    const pctOfTotal = ((item.count / item.totalPatients) * 100).toFixed(1);

    return (
        <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
            className="p-2.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-200/60 transition-all duration-200"
        >
            <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
                <div className="flex items-center gap-2.5">
                    <span
                        className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-900 font-extrabold tracking-wide font-sans text-xs">
                        {item.ageGroup}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-slate-950 font-extrabold font-mono text-xs">
                        {item.count.toLocaleString("en-IN")} patients
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 font-mono">
                        {pctOfTotal}%
                    </span>
                </div>
            </div>

            <div className="h-2 w-full bg-slate-200/70 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: "0%" }}
                    whileInView={{ width: `${pctOfMax}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: index * 0.06 + 0.05 }}
                    className="h-full rounded-full"
                    style={{
                        background: `linear-gradient(90deg, ${item.color}ee, ${item.color})`,
                        boxShadow: `0 0 6px ${item.color}40`
                    }}
                />
            </div>
        </motion.div>
    );
}

export function PatientAnalytics() {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const { data } = useImpactData();
    const sectionRef = useRef<HTMLDivElement>(null);

    // Convert gender distribution → donut format
    const genderDonutData = data.genderDistribution.map(g => ({
        label: g.gender[currentLang],
        value: g.percentage,
        color: g.color
    }));

    // Convert patient type → donut format
    const patientTypeDonutData = data.patientTypeDistribution.map(p => ({
        label: p.type[currentLang],
        value: p.percentage,
        color: p.color
    }));

    // Age distribution Palette (Professional green/emerald gradient family)
    const ageMax = Math.max(...data.ageDistribution.map(a => a.count), 1);
    const totalPatients = data.ageDistribution.reduce((acc, curr) => acc + curr.count, 0) || 150000;
    const ageColors = ["#15803d", "#16a34a", "#0d9488", "#0f766e", "#047857"];

    // Dynamic calculations for summary stats cards
    const topAgeBracket = [...data.ageDistribution].sort((a, b) => b.count - a.count)[0];
    const topBracketPct = topAgeBracket ? ((topAgeBracket.count / totalPatients) * 100).toFixed(1) : "32.8";

    const youthCount = data.ageDistribution
        .filter(a => a.ageGroup.includes("0") || a.ageGroup.includes("15"))
        .reduce((sum, a) => sum + a.count, 0);
    const youthPct = ((youthCount / totalPatients) * 100).toFixed(1);

    const seniorCount = data.ageDistribution
        .filter(a => a.ageGroup.includes("65"))
        .reduce((sum, a) => sum + a.count, 0);
    const seniorPct = ((seniorCount / totalPatients) * 100).toFixed(1);

    return (
        <section
            ref={sectionRef}
            className="py-10 md:py-16 bg-[#f8faf9] border-b border-gray-100"
        >
            <div className="container max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                    <div className="inline-flex items-center gap-2 text-secondary-600 text-xs font-bold uppercase tracking-widest">
                        <span className="h-px w-6 bg-secondary-400" />
                        {currentLang === "en" ? "Patient Insights" : "रोगी अंतर्दृष्टि"}
                        <span className="h-px w-6 bg-secondary-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                        {currentLang === "en" ? "Who We Serve" : "हम किनकी सेवा करते हैं"}
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg font-light leading-relaxed">
                        {currentLang === "en"
                            ? "Understanding the demographics, visit patterns, and age groups we serve helps us design better, more inclusive healthcare solutions."
                            : "हम जिन जनसांख्यिकी, यात्रा पैटर्न और आयु समूहों की सेवा करते हैं, उन्हें समझने से हमें बेहतर, अधिक समावेशी स्वास्थ्य सेवा समाधान तैयार करने में मदद मिलती है।"
                        }
                    </p>
                </div>

                {/* Row 1: Two Donut Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.55 }}
                    >
                        <DonutChart
                            data={patientTypeDonutData}
                            title={currentLang === "en" ? "New vs. Follow-up Patients" : "नए बनाम अनुवर्ती मरीज"}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.55, delay: 0.1 }}
                    >
                        <DonutChart
                            data={genderDonutData}
                            title={currentLang === "en" ? "Gender Distribution" : "लिंग वितरण"}
                        />
                    </motion.div>
                </div>

                {/* Row 2: Age Distribution full-width section */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 md:p-6"
                >
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
                        <div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                                {currentLang === "en" ? "Age Distribution of Patients" : "रोगियों की आयु वितरण"}
                            </h4>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                            5 Age Brackets
                        </span>
                    </div>

                    <div className="space-y-2">
                        {data.ageDistribution.map((item, index) => (
                            <AgeGroupRow
                                key={item.ageGroup}
                                item={{
                                    ageGroup: item.ageGroup,
                                    count: item.count,
                                    color: ageColors[index % ageColors.length],
                                    totalPatients
                                }}
                                max={ageMax}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Summary stats cards (100% dynamically calculated) */}
                    <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            {
                                label: currentLang === "en" ? "Primary Age Demographic" : "प्राथमिक आयु वर्ग",
                                value: topAgeBracket ? topAgeBracket.ageGroup : "45 – 64 yrs",
                                subText: `${topBracketPct}% of patients`
                            },
                            {
                                label: currentLang === "en" ? "Youth & Children (0–24)" : "युवा और बच्चे (0-24)",
                                value: `${youthPct}%`,
                                subText: `${youthCount.toLocaleString("en-IN")} patients`
                            },
                            {
                                label: currentLang === "en" ? "Senior Care (65+ yrs)" : "वरिष्ठ नागरिक (65+ वर्ष)",
                                value: `${seniorPct}%`,
                                subText: `${seniorCount.toLocaleString("en-IN")} patients`
                            }
                        ].map((stat, i) => (
                            <div key={i} className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-center items-center text-center">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</p>
                                <p className="text-base font-black text-slate-900 mt-0.5">{stat.value}</p>
                                <p className="text-[10px] font-semibold text-emerald-700">{stat.subText}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
