"use client";

import { useImpactData } from "@/hooks/useImpactData";
import { StatsCounter } from "@/components/features/StatsCounter";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function StatsSection() {
    const { data } = useImpactData();
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";

    // Extract values from kpis array with fallbacks
    const getVal = (id: string, fallback: number) => {
        const item = data.kpis.find((k) => k.id === id);
        return item ? item.value : fallback;
    };

    const patientsServed = getVal("patients-served", 150000);
    const totalConsultations = getVal("total-consultations", 97104);
    const healthCamps = getVal("health-camps", 2146);
    const campsCHCPHC = getVal("chc-phc-camps", 133);
    const expertDoctors = getVal("expert-doctors", 213);
    const livesImpacted = getVal("lives-impacted", 2850000);

    return (
        <section className="py-16 bg-primary-900 text-white">
            <div className="container">
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 xl:gap-6">
                    <div className="xl:col-span-6 mb-2">
                        <div className="inline-flex items-center gap-2 text-secondary-400 text-sm font-semibold uppercase tracking-widest mb-1">
                            <span className="h-px w-6 bg-secondary-400" /> Our Impact
                        </div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">
                            Strength in Numbers
                        </h2>
                    </div>
                    <StatsCounter value={patientsServed} label="Patients Served" suffix="+" />
                    <StatsCounter value={totalConsultations} label="Total Consultations" />
                    <StatsCounter value={healthCamps} label="Health & Awareness Camps" />
                    <StatsCounter value={campsCHCPHC} label="Health Camps at CHCs/PHCs" />
                    <StatsCounter value={expertDoctors} label="Expert Doctors Onboard" />
                    <StatsCounter value={livesImpacted} label="Lives Impacted" suffix="+" />

                    {/* Bridge CTA link to Our Impact page */}
                    <div className="xl:col-span-6 flex justify-center mt-10">
                        <Button asChild variant="secondary" className="gap-2 group">
                            <Link href="/our-impact">
                                {currentLang === "hi" 
                                    ? "विस्तृत विकास और पहुँच रिपोर्ट देखें" 
                                    : "Explore Growth & Reach Reports"}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

