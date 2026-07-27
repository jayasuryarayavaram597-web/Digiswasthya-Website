"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useImpactData } from "@/hooks/useImpactData";
import { DonutChart } from "./DonutChart";
import { BarChart } from "./BarChart";

export function ImpactDistribution() {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const { data } = useImpactData();

    // Titles translation
    const titleTranslations = {
        en: "Healthcare Reach & Distribution",
        hi: "स्वास्थ्य सेवा की पहुँच और वितरण"
    };

    const subtitleTranslations = {
        en: "Analyzing the type of ailments treated and regional distribution of patients helps DigiSwasthya optimize resources and expand healthcare networks effectively.",
        hi: "उपचार की जाने वाली बीमारियों के प्रकार और रोगियों के क्षेत्रीय वितरण का विश्लेषण करने से डिजीस्वास्थ्य को संसाधनों को अनुकूलित करने और स्वास्थ्य नेटवर्क का विस्तार करने में मदद मिलती है।"
    };

    const donutTitle = {
        en: "Disease Distribution",
        hi: "रोगों का वितरण"
    };

    const barTitle = {
        en: "Patients by District/Region",
        hi: "जिलों/क्षेत्रों के अनुसार मरीज"
    };

    // Prepare data
    const donutData = data.diseaseDistribution.map(d => ({
        label: d.name[currentLang],
        value: d.value,
        color: d.color
    }));

    const barData = data.regionalReach.map(r => ({
        label: r.district[currentLang],
        value: r.count
    }));

    return (
        <section className="py-16 md:py-24 bg-[#f8faf9] border-b border-gray-100">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 text-secondary-500 text-xs font-bold uppercase tracking-widest">
                        <span className="h-px w-6 bg-secondary-400" />
                        {currentLang === "en" ? "Analytics Insights" : "विश्लेषणात्मक अंतर्दृष्टि"}
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                        {titleTranslations[currentLang]}
                    </h2>
                    
                    <p className="text-slate-600 text-base md:text-lg font-light leading-relaxed">
                        {subtitleTranslations[currentLang]}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                        className="flex"
                    >
                        <DonutChart 
                            data={donutData} 
                            title={donutTitle[currentLang]} 
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                        className="flex"
                    >
                        <BarChart 
                            data={barData} 
                            title={barTitle[currentLang]} 
                            barColor="#d97706" 
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
