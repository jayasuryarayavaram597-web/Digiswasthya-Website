"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info, Users, Activity } from "lucide-react";
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
    pinCoords: { x: number; y: number; label: string };
};

interface DistrictItem {
    district: { en: string; hi: string };
    count: number;
}

interface InteractiveReachMapProps {
    districtList?: DistrictItem[];
    totalVillages?: number;
}

const REACH_DATA: Record<string, StateData> = {
    "up": {
        id: "up",
        name: { en: "Uttar Pradesh", hi: "उत्तर प्रदेश" },
        totalCentres: 3,
        color: "fill-emerald-500 hover:fill-emerald-600 stroke-emerald-600 stroke-[1.5]",
        accentColor: "emerald",
        pinCoords: { x: 290, y: 250, label: "UP Hub" },
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
        pinCoords: { x: 380, y: 265, label: "Bihar Hub" },
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
        pinCoords: { x: 190, y: 400, label: "MH Hub" },
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
                    "Bharatwada (DS-TMC-012)"
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

export function InteractiveReachMap({ districtList = [], totalVillages = 633 }: InteractiveReachMapProps) {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const [selectedStateId, setSelectedStateId] = useState<string>("mh");
    const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);

    const reachData = REACH_DATA;
    const selectedState = reachData[selectedStateId] || null;

    // Calculate dynamic state patient counts from districtList
    const statePatientTotals = useMemo(() => {
        const totals: Record<string, number> = { mh: 0, up: 0, br: 0 };
        const mhDistricts = ["nagpur", "pune", "raigad", "nashik", "palghar", "mumbai", "thane", "bhandara", "chandrapur"];
        const upDistricts = ["sant kabir nagar", "lucknow", "sant kabeer nagar", "barabanki", "gorakhpur", "varanasi", "basti", "chandauli", "rae bareli"];
        const brDistricts = ["muzaffarpur", "patna", "bihar", "east champaran", "west champaran", "gaya"];

        districtList.forEach((d) => {
            const name = d.district.en.toLowerCase();
            if (mhDistricts.some(m => name.includes(m))) totals.mh += d.count;
            else if (upDistricts.some(u => name.includes(u))) totals.up += d.count;
            else if (brDistricts.some(b => name.includes(b))) totals.br += d.count;
        });

        // Fallback defaults if list not loaded yet
        if (totals.mh === 0) totals.mh = 21650;
        if (totals.up === 0) totals.up = 5870;
        if (totals.br === 0) totals.br = 38;

        return totals;
    }, [districtList]);

    const totalDistrictsCount = districtList.length || 60;

    return (
        <section className="py-16 bg-white border-b border-gray-100 font-sans">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                    <div className="inline-flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-widest bg-primary-50 px-3.5 py-1.5 rounded-full border border-primary-100">
                        <MapPin className="w-3.5 h-3.5 text-primary-600 animate-bounce" />
                        {currentLang === "en" ? "Geographical Footprint" : "भौगोलिक उपस्थिति"}
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                        {currentLang === "en" ? "Interactive Reach & Coverage Map" : "इंटरएक्टिव रीच और कवरेज मैप"}
                    </h2>
                    
                    <p className="text-slate-600 text-base md:text-lg font-light leading-relaxed">
                        {currentLang === "en" 
                            ? "Explore live patient numbers and telemedicine hubs directly on the map across India."
                            : "भारत भर के मानचित्र पर सीधे लाइव रोगी संख्या और टेलीमेडिसिन हब का अन्वेषण करें।"}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/50 rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xs">
                    {/* Left side: Interactive SVG Map with Live Badges */}
                    <div className="lg:col-span-7 flex flex-col items-center relative min-h-[480px]">
                        <svg 
                            viewBox="0 0 612 696" 
                            className="w-full max-w-[420px] h-auto drop-shadow-sm select-none"
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

                            {/* Overlay Live Patient Count Badges on Active Map Pins */}
                            {Object.entries(reachData).map(([stId, stObj]) => {
                                const total = statePatientTotals[stId] || 0;
                                const formattedVal = total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total.toString();
                                const isSelected = selectedStateId === stId;
                                const isHovered = hoveredStateId === stId;

                                return (
                                    <g 
                                        key={stId} 
                                        transform={`translate(${stObj.pinCoords.x}, ${stObj.pinCoords.y})`}
                                        className="cursor-pointer"
                                        onClick={() => setSelectedStateId(stId)}
                                        onMouseEnter={() => setHoveredStateId(stId)}
                                        onMouseLeave={() => setHoveredStateId(null)}
                                    >
                                        {/* Outer Pulse Circle */}
                                        <circle r="14" fill="#0d5be1" opacity="0.2" className="animate-ping" />
                                        
                                        {/* Pin Marker Background */}
                                        <rect 
                                            x="-36" 
                                            y="-14" 
                                            width="72" 
                                            height="26" 
                                            rx="13" 
                                            fill={isSelected || isHovered ? "#0d5be1" : "#0f172a"} 
                                            stroke="#ffffff"
                                            strokeWidth="2"
                                            className="shadow-md transition-all duration-200"
                                        />
                                        
                                        {/* Patient Count Text on Map */}
                                        <text 
                                            x="0" 
                                            y="3" 
                                            textAnchor="middle" 
                                            fill="#ffffff" 
                                            fontSize="11" 
                                            fontWeight="800" 
                                            fontFamily="sans-serif"
                                        >
                                            {formattedVal} pts
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Map Footer Summary Pill */}
                        <div className="mt-4 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-2xl px-4 py-2.5 shadow-2xs flex items-center justify-between w-full max-w-[420px]">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-ping" />
                                <span className="text-xs font-bold text-slate-800">
                                    {totalDistrictsCount} Districts Covered
                                </span>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                {totalVillages} Villages
                            </span>
                        </div>
                    </div>

                    {/* Right side: Interactive State Patient Summary Panel */}
                    <div className="lg:col-span-5 space-y-5 w-full">
                        <AnimatePresence mode="wait">
                            {selectedState ? (
                                <motion.div
                                    key={selectedState.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white rounded-3xl p-6 shadow-xs border border-slate-100 space-y-5"
                                >
                                    {/* State Header */}
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                        <div>
                                            <h3 className="text-2xl font-serif font-bold text-gray-900">
                                                {selectedState.name[currentLang]}
                                            </h3>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                                                Active State Reach
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl px-4 py-2 text-center">
                                            <span className="block text-2xl font-black">
                                                {statePatientTotals[selectedState.id]?.toLocaleString("en-IN") || "0"}
                                            </span>
                                            <span className="text-[9px] font-black uppercase tracking-wider">
                                                Patients Served
                                            </span>
                                        </div>
                                    </div>

                                    {/* State Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
                                            <span className="block text-xs font-bold text-slate-400 uppercase">Active Clinics</span>
                                            <span className="text-lg font-black text-slate-800">{selectedState.totalCentres}</span>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
                                            <span className="block text-xs font-bold text-slate-400 uppercase">Districts</span>
                                            <span className="text-lg font-black text-slate-800">{selectedState.districts.length}</span>
                                        </div>
                                    </div>

                                    {/* District Clinics Breakdown */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                            <span>District Clinics & Hubs</span>
                                            <Users className="w-3.5 h-3.5 text-blue-600" />
                                        </h4>

                                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                                            {selectedState.districts.map((dist, idx) => (
                                                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                                                    <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                                                        <span>{dist.name[currentLang]}</span>
                                                        <span className="bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-[10px]">
                                                            {dist.centres} {dist.centres === 1 ? "Clinic" : "Clinics"}
                                                        </span>
                                                    </div>
                                                    
                                                    <ul className="space-y-1 pt-1 border-t border-slate-200/60">
                                                        {dist.names.map((name, nameIdx) => (
                                                            <li key={nameIdx} className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                                {name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Note */}
                                    <div className="flex items-start gap-3 bg-blue-50/50 rounded-2xl p-3.5 border border-blue-100/60">
                                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                            Click on any map pin or state to view active clinic locations and patient metrics.
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
