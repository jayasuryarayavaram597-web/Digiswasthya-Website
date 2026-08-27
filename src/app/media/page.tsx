"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const projectImages = [
    {
        title: "DigiSwasthya Team at DS1 Center",
        description: "Our dedicated medical team consulting at the DS1 Telemedicine Center, providing quality healthcare to rural communities.",
        image: "/images/resources/telemedicine-team.jpg",
        category: "Field Work"
    },
    {
        title: "Rural Telemedicine Hub",
        description: "Bringing technology-driven healthcare to the doorsteps of rural families in their own village environment.",
        image: "/images/resources/rural-clinic.jpg",
        category: "Centers"
    },
    {
        title: "Impact in Real-time",
        description: "Bridging the gap between specialized doctors and remote patients through digital connectivity.",
        image: "/images/resources/consultation.jpg",
        category: "Consultation"
    }
];

const infographics = [
    {
        title: "Healthcare Transformation Pillars",
        description: "Our core focus areas: Referral Networks, Awareness Campaigns, Cancer Care, and Digital Prescriptions.",
        image: "/images/resources/healthcare-pillars.png"
    },
    {
        title: "Mission & Values",
        description: "Awareness, Accessibility, Affordability, and Aid — the pillars of DigiSwasthya Foundation's impact.",
        image: "/images/resources/foundation-mission.jpg"
    }
];

const mediaCoverage = [
    {
        title: "Ministry of Information and Broadcasting",
        description: "@MIB_India - Stories that Inspire (May 19, 2023). Recognized for the groundbreaking telemedicine mission in rural India.",
        image: "/images/media/mib-india.jpg",
        category: "Government"
    },
    {
        title: "India in Ireland (Embassy of India, Dublin)",
        description: "@IndiainIreland Ambassador @AkhileshIFS meeting with Mr. Sandeep Kumar. Very inspiring work spearheading healthcare in rural India.",
        image: "/images/media/embassy-ireland.jpg",
        category: "International"
    },
    {
        title: "Bridging the Medical Divide",
        description: "A film by Bidit Roy documenting DigiSwasthya Foundation's journey to connect rural patients with urban specialists.",
        image: "/images/media/bridging-divide.jpg",
        category: "Documentary"
    },
    {
        title: "DD Sahyadri News Coverage",
        description: "GNM_भाग७३ — मुंबईच्या संदीप कुमार यांनी सुरू केलं डीजी स्वास्थ्य हे आरोग्य अभियान. Marathi news feature on our mission.",
        image: "/images/media/dd-sahyadri.jpg",
        category: "News"
    },
    {
        title: "Covid Champions On The Ground",
        description: "Sandeep Kumar has been working tirelessly to provide aid during the pandemic, bridging the gap in healthcare infrastructure.",
        image: "/images/media/covid-champions.png",
        category: "Award"
    },
    {
        title: "Cancer survivor’s telemedicine centre links medics with villagers in remote areas",
        description: "How a cancer survivor's telemedicine mission is bridging the healthcare gap in remote villages. Featured in Gaon Connection.",
        image: "/images/media/gaon-connection.jpg",
        category: "Inspiration"
    },
    {
        title: "Augnito partners with DigiSwasthya to provide access to health care in rural India",
        description: "Strategic collaboration to leverage advanced speech-to-text AI for better healthcare documentation in rural settings.",
        image: "/images/media/augnito-partnership-1.jpg",
        category: "Partnership"
    },
    {
        title: "Augnito partners with DigiSwasthya to make healthcare accessible in rural India",
        description: "Working together to streamline medical records and improve doctor-patient interactions in underserved communities.",
        image: "/images/media/augnito-partnership-2.jpg",
        category: "Partnership"
    },
    {
        title: "Support received by DigiSwasthya so far",
        description: "Recognizing the vital CSR support and contributions from partners that fuel our healthcare missions.",
        image: "/images/media/csr-support.jpg",
        category: "Support"
    },
    {
        title: "Augnito Partners With DigiSwasthya",
        description: "A growing partnership focused on bridging the digital divide in India's rural healthcare infrastructure.",
        image: "/images/media/remote-health-mission.png",
        category: "Partnership"
    },
    {
        title: "An achievement for DigiSwasthya",
        description: "Reaching new heights in delivering affordable healthcare services to the last mile of rural India.",
        image: "/images/media/achievement.jpg",
        category: "Achievement"
    },
    {
        title: "10th National Conference On Social Innovation To Be Held In Pune on Nov 17th",
        description: "Selected to present our social innovation model at the prestigious Pune International Centre conference.",
        image: "/images/media/pune-conference.jpg",
        category: "Conference"
    },
    {
        title: "Village development professional, city doctor join hands to offer tele-medicine advice platform NGO",
        description: "Bridging the gap between rural needs and urban expertise through a collaborative NGO-driven platform.",
        image: "/images/media/telemedicine-platform.jpg",
        category: "News"
    }
];

const videos = [
    { id: "A-WMlwtqcX0", title: "DigiSwasthya Foundation Impact", category: "Documentary", duration: "4 min" },
    { id: "F4QX0j6TprI", title: "Healthcare at Doorstep", category: "Rural Health", duration: "3 min" },
    { id: "WxtLBpEzfhM", title: "Rural Telemedicine Mission", category: "Field Camp", duration: "5 min" },
    { id: "3iefGVKirs0", title: "Tele-medicine Advice Platform", category: "Innovation", duration: "3 min" }
];

type MediaTab = "all" | "videos" | "news" | "photos";

function MediaContent() {
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab") as MediaTab | null;

    const [activeTab, setActiveTab] = useState<MediaTab>("all");

    useEffect(() => {
        if (tabParam && ["all", "videos", "news", "photos"].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [tabParam]);

    const tabs: { id: MediaTab; label: string; count: number; icon: string }[] = [
        { id: "all", label: "All", count: mediaCoverage.length + videos.length + projectImages.length, icon: "✨" },
        { id: "news", label: "News & Press Coverage", count: mediaCoverage.length, icon: "📰" },
        { id: "photos", label: "Field Work Photos", count: projectImages.length + infographics.length, icon: "📸" },
        { id: "videos", label: "Videos & Documentaries", count: videos.length, icon: "🎥" }
    ];

    const showNews = activeTab === "all" || activeTab === "news";
    const showPhotos = activeTab === "all" || activeTab === "photos";
    const showVideos = activeTab === "all" || activeTab === "videos";

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative text-white py-20 overflow-hidden">
                {/* High-Resolution Background Photography */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero-bg.png"
                        alt="DigiSwasthya Official Media Center"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                    {/* Light neutral overlay to highlight the background image clearly */}
                    <div className="absolute inset-0 bg-black/35" />
                </div>

                <div className="container relative z-10 text-center px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/15 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm"
                    >
                        Official Media Center
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-5 tracking-tight text-white"
                    >
                        Media & Resources
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl text-white max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Discover our stories, press coverage, patient documentaries, and field work across rural India.
                    </motion.p>
                </div>
            </section>

            {/* Sticky Interactive Filter Tabs Bar */}
            <div className="sticky top-20 z-30 bg-[#edf3fa]/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-4">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-4 md:px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-200 flex items-center gap-2 ${
                                        isActive
                                            ? "bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/30 ring-2 ring-orange-600 ring-offset-2 ring-offset-[#edf3fa]"
                                            : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-sm"
                                    }`}
                                >
                                    <span>{tab.icon}</span>
                                    <span>{tab.label}</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            isActive
                                                ? "bg-white/25 text-white"
                                                : "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-grow">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* 1. NEWS & PRESS COVERAGE SECTION (FIRST) */}
                        {showNews && (
                            <section className="py-16 md:py-20 bg-white">
                                <div className="container max-w-6xl mx-auto px-4">
                                    <div className="flex flex-col items-center mb-12 text-center">
                                        <span className="px-4 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                            📰 News & Press Coverage
                                        </span>
                                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                            DigiSwasthya in the News
                                        </h2>
                                        <p className="text-gray-600 text-sm md:text-base mt-2 max-w-xl">
                                            Recognized across national newspapers, government ministries, and international platforms.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {mediaCoverage.map((item, i) => (
                                            <div
                                                key={i}
                                                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 group transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
                                            >
                                                <div className="relative h-56 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-secondary-700 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-secondary-100">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6 flex-grow flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-900 mb-2.5 leading-snug group-hover:text-secondary-600 transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-gray-600 font-normal text-sm leading-relaxed">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* 2. FIELD WORK PHOTOS & INFOGRAPHICS (SECOND) */}
                        {showPhotos && (
                            <section className="py-16 md:py-20 bg-gray-50 border-t border-gray-200">
                                <div className="container max-w-6xl mx-auto px-4">
                                    <div className="flex flex-col items-center mb-12 text-center">
                                        <span className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                            📸 Field Work & Infographics
                                        </span>
                                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                            Our Work on the Ground
                                        </h2>
                                        <p className="text-gray-600 text-sm md:text-base mt-2 max-w-xl">
                                            Glimpses of daily consultations, doctor visits, and healthcare model frameworks.
                                        </p>
                                    </div>

                                    {/* Field Images */}
                                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                                        {projectImages.map((item, i) => (
                                            <div
                                                key={i}
                                                className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 group transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
                                            >
                                                <div className="relative h-60 overflow-hidden">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                                            {item.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6 flex-grow">
                                                    <h3 className="font-bold text-lg text-gray-900 mb-2 leading-snug group-hover:text-primary-600 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Infographics Sub-Grid */}
                                    <div className="pt-8 border-t border-gray-200">
                                        <h3 className="text-xl font-bold text-gray-900 text-center mb-8">
                                            Healthcare Models & Mission Frameworks
                                        </h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {infographics.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 group hover:shadow-xl transition-all duration-300"
                                                >
                                                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-gray-100 bg-gray-50 flex items-center justify-center p-4">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.title}
                                                            width={800}
                                                            height={500}
                                                            className="object-contain max-h-full transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        <h4 className="font-bold text-xl text-gray-900 mb-2">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-gray-600 text-sm max-w-md mx-auto">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* 3. YOUTUBE VIDEOS & DOCUMENTARIES (THIRD) */}
                        {showVideos && (
                            <section className="py-16 md:py-20 bg-gray-900 text-white border-t border-gray-800">
                                <div className="container max-w-6xl mx-auto px-4">
                                    <div className="flex flex-col items-center mb-12 text-center">
                                        <span className="px-4 py-1.5 bg-primary-600/30 text-primary-300 border border-primary-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                            🎥 Videos & Documentaries
                                        </span>
                                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                                            Watch DigiSwasthya in Action
                                        </h2>
                                        <p className="text-gray-400 text-sm md:text-base mt-2 max-w-xl">
                                            Real patient recoveries, doctor interviews, and on-ground telemedicine camps.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        {videos.map((vid, i) => (
                                            <div
                                                key={i}
                                                className="group bg-gray-800/80 rounded-3xl p-4 border border-white/10 hover:border-primary-500/50 transition-all duration-300 shadow-xl"
                                            >
                                                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                                                    <iframe
                                                        className="absolute inset-0 w-full h-full"
                                                        src={`https://www.youtube.com/embed/${vid.id}?rel=0&modestbranding=1`}
                                                        title={vid.title}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                                <div className="pt-4 pb-2 px-2 flex items-center justify-between gap-3">
                                                    <div>
                                                        <span className="text-[11px] font-bold text-primary-400 uppercase tracking-wider block mb-1">
                                                            {vid.category}
                                                        </span>
                                                        <h3 className="text-base md:text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                                                            {vid.title}
                                                        </h3>
                                                    </div>
                                                    <span className="px-2.5 py-1 bg-white/10 text-gray-300 rounded-full text-xs font-medium shrink-0">
                                                        ⏱️ {vid.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* YouTube Channel Banner CTA */}
                                    <div className="mt-12 text-center">
                                        <a
                                            href="https://www.youtube.com/channel/UC52n8c8U4jAtHsIzq7-wKvQ"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/30 transition-all duration-200 hover:-translate-y-0.5"
                                        >
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                            </svg>
                                            Watch All Stories on YouTube Channel (50+ Videos) →
                                        </a>
                                    </div>
                                </div>
                            </section>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <Footer />
        </main>
    );
}

export default function Media() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-pulse text-gray-400 text-lg">Loading Media...</div>
                </div>
                <Footer />
            </main>
        }>
            <MediaContent />
        </Suspense>
    );
}
