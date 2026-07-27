"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useImpactData } from "@/hooks/useImpactData";
import { BarChart } from "./BarChart";

export function MedicalBreakdown() {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const { data } = useImpactData();

    const deptData = data.consultationByDepartment.map(d => ({
        label: d.department[currentLang],
        value: d.count,
        color: d.color
    }));

    const specialtyData = data.doctorsBySpecialty.map(d => ({
        label: d.specialty[currentLang],
        value: d.count,
        color: d.color
    }));

    return (
        <section className="py-14 md:py-20 bg-[#f3edf7] border-b border-purple-100/80">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 text-violet-700 text-xs font-bold uppercase tracking-widest">
                        <span className="h-px w-6 bg-violet-400" />
                        {currentLang === "en" ? "Medical Analytics" : "चिकित्सा विश्लेषण"}
                        <span className="h-px w-6 bg-violet-400" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                        {currentLang === "en" ? "Clinical Breakdown" : "नैदानिक विश्लेषण"}
                    </h2>
                    <p className="text-slate-600 text-base md:text-lg font-light leading-relaxed">
                        {currentLang === "en"
                            ? "A department-wise view of consultations and the specialist doctors powering DigiSwasthya's telemedicine network."
                            : "परामर्शों का विभाग-वार दृश्य और विशेषज्ञ डॉक्टर जो डिजीस्वास्थ्य के टेलीमेडिसिन नेटवर्क को चला रहे हैं।"
                        }
                    </p>
                </div>

                {/* Two bar charts side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.55 }}
                    >
                        <BarChart
                            data={deptData}
                            title={currentLang === "en" ? "Consultations by Department" : "विभाग अनुसार परामर्श"}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.55, delay: 0.15 }}
                    >
                        <BarChart
                            data={specialtyData}
                            title={currentLang === "en" ? "Doctors by Specialty" : "विशेषता अनुसार डॉक्टर"}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
