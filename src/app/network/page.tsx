"use client";

import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TelemedicineCentres } from "@/components/sections/TelemedicineCentres";
import { ContactActions } from "@/components/features/ContactActions";
import { useLanguage } from "@/context/LanguageContext";

export default function NetworkPage() {
    const { t } = useLanguage();

    return (
        <main className="min-h-screen bg-[#f4f7f5]">
            <Navbar />

            {/* Page header */}
            <section className="relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/images/ds-medical-camp.jpg"
                        alt="DigiSwasthya health centre"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                </div>
                <div className="relative z-10 container px-4 py-20 md:py-28">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-secondary-400 text-sm font-semibold uppercase tracking-widest mb-4">
                            <span className="h-px w-8 bg-secondary-400" /> {t("centres.badge")}
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
                            {t("network.heroTitle")}
                        </h1>
                        <p className="text-base md:text-lg text-gray-200 leading-relaxed mb-8">
                            {t("network.heroSubtitle")}
                        </p>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 max-w-md">
                            <p className="text-white font-semibold mb-3 text-sm">{t("network.heroHelpNote")}</p>
                            <ContactActions />
                        </div>
                    </div>
                </div>
            </section>

            <TelemedicineCentres />

            <Footer />
        </main>
    );
}
