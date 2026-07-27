"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info, ArrowRight, Shield, Stethoscope, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { indiaStates } from "@/data/indiaStatesPaths";

type District = {
    name: { en: string; hi: string };
    centres: number;
    names: string[];
};

type StateData = {
    id: string;
    name: { en: string; hi: string };
    totalCentres: number;
    districts: District[];
    color: string;
    accentColor: string;
    pinCoords: { x: number; y: number; label: string }[];
};

const REACH_DATA: Record<string, StateData> = {
    "up": {
        id: "up",
        name: { en: "Uttar Pradesh", hi: "उत्तर प्रदेश" },
        totalCentres: 3,
        color: "fill-emerald-500 hover:fill-emerald-600 stroke-emerald-600 stroke-[1.5]",
        accentColor: "emerald",
        pinCoords: [
            { x: 278, y: 245, label: "Itaunja (Lucknow)" },
            { x: 325, y: 247, label: "Kathaicha (Sant Kabir Nagar)" },
            { x: 331, y: 252, label: "Asharafpur (Sant Kabir Nagar)" }
        ],
        districts: [
            {
                name: { en: "Sant Kabir Nagar", hi: "संत कबीर नगर" },
                centres: 2,
                names: ["Kathaicha (DS-TMC-001)", "Asharafpur (DS-TMC-003)"]
            },
            {
                name: { en: "Lucknow", hi: "लखनऊ" },
                centres: 1,
                names: ["Itaunja (DS-TMC-004)"]
            }
        ]
    },
    "br": {
        id: "br",
        name: { en: "Bihar", hi: "बिहार" },
        totalCentres: 1,
        color: "fill-amber-500 hover:fill-amber-600 stroke-amber-600 stroke-[1.5]",
        accentColor: "amber",
        pinCoords: [
            { x: 375, y: 258, label: "Sahebganj (Muzaffarpur)" }
        ],
        districts: [
            {
                name: { en: "Muzaffarpur", hi: "मुजफ्फरपुर" },
                centres: 1,
                names: ["Sahebganj (DS-TMC-002)"]
            }
        ]
    },
    "mh": {
        id: "mh",
        name: { en: "Maharashtra", hi: "महाराष्ट्र" },
        totalCentres: 14,
        color: "fill-sky-500 hover:fill-sky-600 stroke-sky-600 stroke-[1.5]",
        accentColor: "sky",
        pinCoords: [
            { x: 228, y: 371, label: "Gorewada (Nagpur)" },
            { x: 235, y: 371, label: "Jagnath Budhwari (Nagpur)" },
            { x: 242, y: 371, label: "IGR (Nagpur)" },
            { x: 227, y: 378, label: "Narsala (Nagpur)" },
            { x: 235, y: 378, label: "Hasanbagh (Nagpur)" },
            { x: 243, y: 378, label: "Chinchbhavan (Nagpur)" },
            { x: 228, y: 385, label: "Chakole (Nagpur)" },
            { x: 235, y: 385, label: "Bharatwada (Nagpur)" },
            { x: 112, y: 427, label: "Peth (Pune)" },
            { x: 113, y: 433, label: "Rajgurunagar (Pune)" },
            { x: 118, y: 441, label: "Karanjawane (Pune)" },
            { x: 100, y: 403, label: "Khodala Mokhada (Palghar)" },
            { x: 113, y: 400, label: "Borgaon (Nashik)" },
            { x: 98, y: 435, label: "Khalapur (Raigad)" }
        ],
        districts: [
            {
                name: { en: "Nagpur", hi: "नागपुर" },
                centres: 8,
                names: [
                    "Gorewada (DS-TMC-005)",
                    "Jagnath Budhwari (DS-TMC-006)",
                    "Indira Gandhi Rugnalaya (DS-TMC-007)",
                    "Chinchbhavan (DS-TMC-008)",
                    "Narsala (DS-TMC-009)",
                    "Hasanbagh (DS-TMC-010)",
                    "Chakole (DS-TMC-011)",
                    "Bharatwada, Vijay Nagar (DS-TMC-012)"
                ]
            },
            {
                name: { en: "Pune", hi: "पुणे" },
                centres: 3,
                names: ["Peth (DS-TMC-013)", "Rajgurunagar (DS-TMC-014)", "Karanjawane (DS-TMC-015)"]
            },
            {
                name: { en: "Palghar", hi: "पालघर" },
                centres: 1,
                names: ["Khodala, Mokhada (TMC-DSF0018)"]
            },
            {
                name: { en: "Nashik", hi: "नाशिक" },
                centres: 1,
                names: ["Borgaon (TMC-00-DS19)"]
            },
            {
                name: { en: "Raigad", hi: "रायगढ़" },
                centres: 1,
                names: ["Khalapur (TMC-0020)"]
            }
        ]
    }
};

export function InteractiveReachMap() {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const [selectedStateId, setSelectedStateId] = useState<string>("mh");
    const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);

    const reachData = REACH_DATA;

    const selectedState = reachData[selectedStateId] || null;

    return (
        <section className="py-20 bg-white border-b border-gray-100">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-widest bg-primary-50 px-3.5 py-1.5 rounded-full border border-primary-100">
                        <MapPin className="w-3.5 h-3.5 text-primary-600 animate-bounce" />
                        {currentLang === "en" ? "Geographical Footprint" : "भौगोलिक उपस्थिति"}
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                        {currentLang === "en" ? "Interactive Reach Map" : "इंटरएक्टिव रीच मैप"}
                    </h2>
                    
                    <p className="text-slate-600 text-base md:text-lg font-light leading-relaxed">
                        {currentLang === "en" 
                            ? "Explore active telemedicine centers across India. Select any highlighted state to see center and district details."
                            : "भारत भर में सक्रिय टेलीमेडिसिन केंद्रों का अन्वेषण करें। केंद्र और जिले के विवरण देखने के लिए किसी भी हाइलाइट किए गए राज्य का चयन करें।"}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-slate-50/50 rounded-3xl p-6 md:p-12 border border-slate-100 shadow-sm">
                    {/* Left side: Interactive Map */}
                    <div className="lg:col-span-7 flex justify-center items-center relative min-h-[500px]">
                        <svg 
                            viewBox="0 0 612 696" 
                            className="w-full max-w-[380px] h-auto drop-shadow-md select-none"
                        >
                            {/* India States Paths */}
                            {indiaStates.map((state) => {
                                const isActive = !!reachData[state.id];
                                const isSelected = selectedStateId === state.id;
                                const isHovered = hoveredStateId === state.id;
                                
                                return (
                                    <path
                                        key={state.id}
                                        d={state.d}
                                        className={`transition-all duration-300 ${
                                            isActive 
                                                ? `${reachData[state.id].color} cursor-pointer opacity-90 hover:opacity-100` 
                                                : "fill-slate-100 hover:fill-slate-200/80 stroke-slate-300 stroke-[1]"
                                        }`}
                                        strokeWidth={isSelected || isHovered ? "2.5" : isActive ? "1.5" : "1"}
                                        onClick={() => {
                                            if (isActive) {
                                                setSelectedStateId(state.id);
                                            }
                                        }}
                                        onMouseEnter={() => {
                                            if (isActive) {
                                                setHoveredStateId(state.id);
                                            }
                                        }}
                                        onMouseLeave={() => setHoveredStateId(null)}
                                    >
                                        <title>{state.label}</title>
                                    </path>
                                );
                            })}


                        </svg>

                        {/* Map floating state indicator */}
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 shadow-sm hidden sm:block max-w-[220px]">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-primary-500 animate-ping" />
                                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                                    {currentLang === "en" ? "Active States" : "सक्रिय राज्य"}
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                                {currentLang === "en" 
                                    ? "Hover or click on highlighted states (UP, Bihar, Maharashtra) to see data."
                                    : "डेटा देखने के लिए हाइलाइट किए गए राज्यों (यूपी, बिहार, महाराष्ट्र) पर होवर या क्लिक करें।"}
                            </p>
                        </div>
                    </div>

                    {/* Right side: Interactive Info Panel */}
                    <div className="lg:col-span-5 space-y-6">
                        <AnimatePresence mode="wait">
                            {selectedState ? (
                                <motion.div
                                    key={selectedState.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold text-gray-900">
                                                {selectedState.name[currentLang]}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
                                                {currentLang === "en" ? "Active Footprint" : "सक्रिय पदचिह्न"}
                                            </p>
                                        </div>
                                        <div className="bg-primary-50 border border-primary-100 text-primary-700 rounded-2xl px-4 py-2 text-center">
                                            <span className="block text-2xl font-black">{selectedState.totalCentres}</span>
                                            <span className="text-[10px] font-black uppercase tracking-wider">
                                                {currentLang === "en" ? "Clinics" : "क्लीनिक"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Districts Grid */}
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                            {currentLang === "en" ? "Districts Served" : "सेवाकृत जिले"}
                                        </h4>

                                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                                            {selectedState.districts.map((dist, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 hover:border-slate-200 transition-colors"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-gray-900 text-sm md:text-base">
                                                            {dist.name[currentLang]}
                                                        </span>
                                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                                                            {dist.centres} {dist.centres === 1 ? (currentLang === "en" ? "Clinic" : "क्लीनिक") : (currentLang === "en" ? "Clinics" : "क्लीनिक")}
                                                        </span>
                                                    </div>
                                                    
                                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-200/50">
                                                        {dist.names.map((name, nameIdx) => (
                                                            <li key={nameIdx} className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                                                                {name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Info note */}
                                    <div className="flex items-start gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <Info className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            {currentLang === "en" 
                                                ? "You can view maps, addresses, and call details for each center directly on our Network page."
                                                : "आप हमारे नेटवर्क पेज पर सीधे प्रत्येक केंद्र के लिए मानचित्र, पते और कॉल विवरण देख सकते हैं।"}
                                        </p>
                                    </div>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
