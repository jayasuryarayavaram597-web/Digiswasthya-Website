"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Search,
    CheckCircle2,
    Navigation,
    Activity
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { indiaStates } from "@/data/indiaStatesPaths";

export interface ClinicItem {
    id: string;
    code: string;
    name: { en: string; hi: string };
    district: { en: string; hi: string };
    state: { en: string; hi: string };
    stateId: "up" | "br" | "mh";
    pincode: string;
    x: number;
    y: number;
    defaultPatients: number;
    color: string;
    accentBg: string;
}

interface DistrictItem {
    district: { en: string; hi: string };
    count: number;
}

interface InteractiveReachMapProps {
    districtList?: DistrictItem[];
    totalVillages?: number;
}

// 18 Official Physical Telemedicine Clinics of DigiSwasthya (100% Geographically Verified)
export const ALL_18_CLINICS: ClinicItem[] = [
    // ─── UTTAR PRADESH (3 Clinics) ──────────────────────────────────────────
    {
        id: "DS-TMC-001",
        code: "DS-TMC-001",
        name: { en: "Kathaicha Clinic", hi: "कथैचा क्लीनिक" },
        district: { en: "Sant Kabir Nagar", hi: "संत कबीर नगर" },
        state: { en: "Uttar Pradesh", hi: "उत्तर प्रदेश" },
        stateId: "up",
        pincode: "272176",
        x: 310,
        y: 257,
        defaultPatients: 2473,
        color: "#1d4ed8",
        accentBg: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
        id: "DS-TMC-003",
        code: "DS-TMC-003",
        name: { en: "Asharafpur Clinic", hi: "अशरफपुर क्लीनिक" },
        district: { en: "Sant Kabir Nagar", hi: "संत कबीर नगर" },
        state: { en: "Uttar Pradesh", hi: "उत्तर प्रदेश" },
        stateId: "up",
        pincode: "272162",
        x: 313,
        y: 252,
        defaultPatients: 968,
        color: "#1d4ed8",
        accentBg: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
        id: "DS-TMC-004",
        code: "DS-TMC-004",
        name: { en: "Itaunja Clinic", hi: "इटौंजा क्लीनिक" },
        district: { en: "Lucknow", hi: "लखनऊ" },
        state: { en: "Uttar Pradesh", hi: "उत्तर प्रदेश" },
        stateId: "up",
        pincode: "226203",
        x: 266,
        y: 247,
        defaultPatients: 1978,
        color: "#1d4ed8",
        accentBg: "bg-blue-50 text-blue-700 border-blue-200"
    },

    // ─── BIHAR (1 Clinic) ───────────────────────────────────────────────────
    {
        id: "DS-TMC-002",
        code: "DS-TMC-002",
        name: { en: "Sahebganj Clinic", hi: "साहेबगंज क्लीनिक" },
        district: { en: "Muzaffarpur", hi: "मुजफ्फरपुर" },
        state: { en: "Bihar", hi: "बिहार" },
        stateId: "br",
        pincode: "843125",
        x: 354,
        y: 267,
        defaultPatients: 27,
        color: "#d97706",
        accentBg: "bg-amber-50 text-amber-700 border-amber-200"
    },

    // ─── MAHARASHTRA (14 Clinics) ───────────────────────────────────────────
    {
        id: "TMC-DSF0018",
        code: "TMC-DSF0018",
        name: { en: "Khodala, Mokhada Clinic", hi: "खोडाला, मोखाडा क्लीनिक" },
        district: { en: "Palghar", hi: "पालघर" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "401604",
        x: 138,
        y: 416,
        defaultPatients: 167,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },
    {
        id: "TMC-00-DS19",
        code: "TMC-00-DS19",
        name: { en: "Borgaon Clinic", hi: "बोरगांव क्लीनिक" },
        district: { en: "Nashik", hi: "नाशिक" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "422211",
        x: 154,
        y: 406,
        defaultPatients: 195,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },
    {
        id: "TMC-0020",
        code: "TMC-0020",
        name: { en: "Khalapur Clinic", hi: "खालापूर क्लीनिक" },
        district: { en: "Raigad", hi: "रायगढ़" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "410202",
        x: 144,
        y: 442,
        defaultPatients: 269,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },

    // Pune Rural (3 Centres)
    {
        id: "DS-TMC-013",
        code: "DS-TMC-013",
        name: { en: "Peth Clinic", hi: "पेठ क्लीनिक" },
        district: { en: "Pune", hi: "पुणे" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "410512",
        x: 160,
        y: 448,
        defaultPatients: 2450,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },
    {
        id: "DS-TMC-014",
        code: "DS-TMC-014",
        name: { en: "Rajgurunagar Clinic", hi: "राजगुरुनगर क्लीनिक" },
        district: { en: "Pune", hi: "पुणे" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "410505",
        x: 164,
        y: 452,
        defaultPatients: 2200,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },
    {
        id: "DS-TMC-015",
        code: "DS-TMC-015",
        name: { en: "Karanjawane Clinic", hi: "करंजावणे क्लीनिक" },
        district: { en: "Pune", hi: "पुणे" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "412209",
        x: 168,
        y: 456,
        defaultPatients: 2051,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },

    // Nagpur Hub (8 Centres)
    {
        id: "DS-TMC-005",
        code: "DS-TMC-005",
        name: { en: "Gorewada Clinic", hi: "गोरेवाड़ा क्लीनिक" },
        district: { en: "Nagpur", hi: "नागपुर" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "440013",
        x: 246,
        y: 396,
        defaultPatients: 2100,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },
    {
        id: "DS-TMC-006",
        code: "DS-TMC-006",
        name: { en: "Jagnath Budhwari Clinic", hi: "जगन्नाथ बुधवारि क्लीनिक" },
        district: { en: "Nagpur", hi: "नागपुर" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "440002",
        x: 250,
        y: 396,
        defaultPatients: 1950,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },
    {
        id: "DS-TMC-007",
        code: "DS-TMC-007",
        name: { en: "Indira Gandhi Rugnalaya (IGR)", hi: "इंदिरा गांधी रुग्णालय (IGR)" },
        district: { en: "Nagpur", hi: "नागपुर" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "440033",
        x: 254,
        y: 396,
        defaultPatients: 1880,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },
    {
        id: "DS-TMC-008",
        code: "DS-TMC-008",
        name: { en: "Chinchbhavan Clinic", hi: "चिंचभवन क्लीनिक" },
        district: { en: "Nagpur", hi: "नागपुर" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "440037",
        x: 244,
        y: 402,
        defaultPatients: 1820,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },
    {
        id: "DS-TMC-009",
        code: "DS-TMC-009",
        name: { en: "Narsala Clinic", hi: "नरसला क्लीनिक" },
        district: { en: "Nagpur", hi: "नागपुर" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "440034",
        x: 248,
        y: 402,
        defaultPatients: 1790,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },
    {
        id: "DS-TMC-010",
        code: "DS-TMC-010",
        name: { en: "Hasanbagh Clinic", hi: "हसनबाग क्लीनिक" },
        district: { en: "Nagpur", hi: "नागपुर" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "440024",
        x: 252,
        y: 402,
        defaultPatients: 1740,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },
    {
        id: "DS-TMC-011",
        code: "DS-TMC-011",
        name: { en: "Chakole Clinic", hi: "चकोले क्लीनिक" },
        district: { en: "Nagpur", hi: "नागपुर" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "440008",
        x: 246,
        y: 408,
        defaultPatients: 1650,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    },
    {
        id: "DS-TMC-012",
        code: "DS-TMC-012",
        name: { en: "Bharatwada, Vijay Nagar Clinic", hi: "भरतवाड़ा क्लीनिक" },
        district: { en: "Nagpur", hi: "नागपुर" },
        state: { en: "Maharashtra", hi: "महाराष्ट्र" },
        stateId: "mh",
        pincode: "440035",
        x: 250,
        y: 408,
        defaultPatients: 1650,
        color: "#dc2626",
        accentBg: "bg-red-50 text-red-700 border-red-200"
    }
];

// Exact authentic political map color palette matching classic Indian Atlas styling
const ATLAS_STATE_COLORS: Record<string, { fill: string; hover: string }> = {
    // ─── NORTH ───
    jk: { fill: "#e54646", hover: "#dc2626" }, // Crimson Red (Jammu & Kashmir)
    hp: { fill: "#86efac", hover: "#4ade80" }, // Lime Green (Himachal Pradesh)
    pb: { fill: "#fbbf24", hover: "#f59e0b" }, // Golden Yellow (Punjab)
    ut: { fill: "#c084fc", hover: "#a855f7" }, // Soft Purple (Uttarakhand)
    hr: { fill: "#38bdf8", hover: "#0ea5e9" }, // Cyan (Haryana)
    dl: { fill: "#ef4444", hover: "#dc2626" }, // Red (Delhi)
    ch: { fill: "#ef4444", hover: "#dc2626" }, // Red (Chandigarh)
    rj: { fill: "#a78bfa", hover: "#8b5cf6" }, // Lavender Violet (Rajasthan)
    gj: { fill: "#fef08a", hover: "#fde047" }, // Pale Sand Yellow (Gujarat)

    // ─── CENTRAL & EAST ───
    up: { fill: "#a3e635", hover: "#84cc16" }, // Vibrant Chartreuse / Lime Green (Uttar Pradesh)
    mp: { fill: "#e9d5ff", hover: "#d8b4fe" }, // Soft Pale Pink-Lavender (Madhya Pradesh)
    br: { fill: "#8b5cf6", hover: "#7c3aed" }, // Deep Purple (Bihar)
    jh: { fill: "#fef3c7", hover: "#fde68a" }, // Pale Cream / Peach (Jharkhand)
    wb: { fill: "#38bdf8", hover: "#0ea5e9" }, // Cyan Blue (West Bengal)
    or: { fill: "#f59e0b", hover: "#d97706" }, // Orange-Gold (Odisha)
    ct: { fill: "#7dd3fc", hover: "#38bdf8" }, // Sky Blue (Chhattisgarh)
    sk: { fill: "#f59e0b", hover: "#d97706" }, // Gold (Sikkim)

    // ─── MAHARASHTRA & SOUTH ───
    mh: { fill: "#f87171", hover: "#ef4444" }, // Coral Salmon Pink (Maharashtra)
    ga: { fill: "#facc15", hover: "#eab308" }, // Gold Yellow (Goa)
    ka: { fill: "#7c3aed", hover: "#6d28d9" }, // Deep Violet Purple (Karnataka)
    tg: { fill: "#84cc16", hover: "#65a30d" }, // Lime Green (Telangana)
    ap: { fill: "#f87171", hover: "#ef4444" }, // Coral Red-Pink (Andhra Pradesh)
    kl: { fill: "#f59e0b", hover: "#d97706" }, // Amber Orange (Kerala)
    tn: { fill: "#4ade80", hover: "#22c55e" }, // Fresh Green (Tamil Nadu)
    py: { fill: "#ef4444", hover: "#dc2626" }, // Red (Puducherry)

    // ─── NORTH-EAST ───
    as: { fill: "#a3e635", hover: "#84cc16" }, // Lime Green (Assam)
    ar: { fill: "#e54646", hover: "#dc2626" }, // Crimson Red (Arunachal Pradesh)
    nl: { fill: "#0ea5e9", hover: "#0284c7" }, // Ocean Cyan (Nagaland)
    mn: { fill: "#a855f7", hover: "#9333ea" }, // Purple (Manipur)
    mz: { fill: "#fef08a", hover: "#fde047" }, // Pale Yellow (Mizoram)
    tr: { fill: "#e54646", hover: "#dc2626" }, // Crimson (Tripura)
    ml: { fill: "#f59e0b", hover: "#d97706" }, // Orange-Gold (Meghalaya)

    // ─── ISLANDS & UTS ───
    an: { fill: "#0284c7", hover: "#0369a1" },
    ld: { fill: "#0284c7", hover: "#0369a1" },
    dn: { fill: "#facc15", hover: "#eab308" },
    dd: { fill: "#facc15", hover: "#eab308" }
};

export function InteractiveReachMap({ districtList = [] }: InteractiveReachMapProps) {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";

    const [selectedClinicId, setSelectedClinicId] = useState<string>("DS-TMC-001");
    const [hoveredClinicId, setHoveredClinicId] = useState<string | null>(null);
    const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [stateFilter, setStateFilter] = useState<"all" | "mh" | "up" | "br">("all");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filtered clinics list
    const filteredClinics = useMemo(() => {
        return ALL_18_CLINICS.filter((c) => {
            const matchesState = stateFilter === "all" ? true : c.stateId === stateFilter;
            const q = searchQuery.trim().toLowerCase();
            const matchesSearch =
                q === ""
                    ? true
                    : c.name[currentLang].toLowerCase().includes(q) ||
                      c.district[currentLang].toLowerCase().includes(q) ||
                      c.code.toLowerCase().includes(q) ||
                      c.pincode.includes(q);
            return matchesState && matchesSearch;
        });
    }, [stateFilter, searchQuery, currentLang]);

    const activeClinic = useMemo(() => {
        if (hoveredClinicId) {
            return ALL_18_CLINICS.find((c) => c.id === hoveredClinicId) || filteredClinics[0] || ALL_18_CLINICS[0];
        }
        return filteredClinics.find((c) => c.id === selectedClinicId) || filteredClinics[0] || ALL_18_CLINICS[0];
    }, [hoveredClinicId, selectedClinicId, filteredClinics]);

    const hoveredState = useMemo(() => {
        if (!hoveredStateId) return null;
        return indiaStates.find((s) => s.id === hoveredStateId);
    }, [hoveredStateId]);

    return (
        <section className="py-6 md:py-8 bg-white border-b border-gray-100 font-sans">
            <div className="container max-w-5xl mx-auto px-4">
                {/* Section Header - Compact */}
                <div className="text-center max-w-xl mx-auto mb-4 space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-blue-600 text-[10.5px] font-black uppercase tracking-wider bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100 shadow-2xs">
                        <Navigation className="w-2.5 h-2.5 text-blue-600 animate-pulse" />
                        {currentLang === "en" ? "18 Active Telemedicine Centres" : "18 सक्रिय टेलीमेडिसिन केंद्र"}
                    </div>

                    <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900 leading-tight">
                        {currentLang === "en" ? "Official Telemedicine Clinics Network" : "आधिकारिक टेलीमेडिसिन क्लीनिक नेटवर्क"}
                    </h2>

                    <p className="text-slate-500 text-xs leading-relaxed max-w-lg mx-auto">
                        {currentLang === "en"
                            ? "Explore DigiSwasthya's 18 operational clinics delivering specialist consultations across Maharashtra, Uttar Pradesh, and Bihar."
                            : "महाराष्ट्र, उत्तर प्रदेश और बिहार में विशेषज्ञ डॉक्टर परामर्श प्रदान करने वाले डिजीस्वास्थ्य के 18 परिचालन क्लीनिकों का अन्वेषण करें।"}
                    </p>
                </div>

                {/* Main Interactive Map & Details Grid - Equal Height Proportions */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch bg-slate-50/80 rounded-3xl p-4 md:p-5 border border-slate-200/80 shadow-xs">
                    
                    {/* Left Column: Compact Colorful India Map Canvas */}
                    <div className="lg:col-span-7 flex flex-col items-center justify-between relative">
                        
                        {/* State Filter Buttons & Search Bar */}
                        <div className="w-full max-w-[400px] flex flex-col sm:flex-row items-center justify-between gap-2 mb-2.5 z-10">
                            {/* State Filter Buttons */}
                            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs w-full sm:w-auto">
                                <button
                                    onClick={() => {
                                        setStateFilter("all");
                                    }}
                                    className={`px-2.5 py-1 text-[10.5px] font-bold rounded-lg transition-all ${
                                        stateFilter === "all"
                                            ? "bg-slate-900 text-white shadow-2xs"
                                            : "text-slate-600 hover:bg-slate-100"
                                    }`}
                                >
                                    {currentLang === "en" ? "All (18)" : "सभी (18)"}
                                </button>
                                <button
                                    onClick={() => {
                                        setStateFilter("mh");
                                        setSelectedClinicId("TMC-DSF0018");
                                    }}
                                    className={`px-2.5 py-1 text-[10.5px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                                        stateFilter === "mh"
                                            ? "bg-red-500 text-white shadow-2xs"
                                            : "text-red-700 hover:bg-red-50"
                                    }`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                    {currentLang === "en" ? "MH (14)" : "महाराष्ट्र (14)"}
                                </button>
                                <button
                                    onClick={() => {
                                        setStateFilter("up");
                                        setSelectedClinicId("DS-TMC-001");
                                    }}
                                    className={`px-2.5 py-1 text-[10.5px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                                        stateFilter === "up"
                                            ? "bg-lime-600 text-white shadow-2xs"
                                            : "text-lime-800 hover:bg-lime-50"
                                    }`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                                    {currentLang === "en" ? "UP (3)" : "यूपी (3)"}
                                </button>
                                <button
                                    onClick={() => {
                                        setStateFilter("br");
                                        setSelectedClinicId("DS-TMC-002");
                                    }}
                                    className={`px-2.5 py-1 text-[10.5px] font-bold rounded-lg transition-all flex items-center gap-1 ${
                                        stateFilter === "br"
                                            ? "bg-purple-600 text-white shadow-2xs"
                                            : "text-purple-800 hover:bg-purple-50"
                                    }`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                    {currentLang === "en" ? "Bihar (1)" : "बिहार (1)"}
                                </button>
                            </div>

                            {/* Search input */}
                            <div className="relative w-full sm:w-36">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder={currentLang === "en" ? "Search clinic..." : "खोजें..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-2.5 py-1 text-[10.5px] bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1.5 focus:ring-blue-500 text-slate-800 shadow-2xs"
                                />
                            </div>
                        </div>

                        {/* Compact White Canvas Card with Distinct Colorful India Map */}
                        <div className="relative w-full flex items-center justify-center flex-1 min-h-[310px] md:min-h-[340px] bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs">
                            
                            {/* Map Title Tag */}
                            <div className="absolute top-2.5 right-3.5 text-right pointer-events-none z-20">
                                <span className="text-[10.5px] font-bold text-slate-500 tracking-wide font-sans">
                                    India - States
                                </span>
                            </div>

                            {/* Hovered State Tooltip Pill */}
                            {hoveredState && (
                                <div className="absolute top-2.5 left-3.5 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10.5px] font-bold shadow-md pointer-events-none z-20 flex items-center gap-1.5">
                                    <span
                                        className="w-2 h-2 rounded-full border border-white"
                                        style={{
                                            backgroundColor: ATLAS_STATE_COLORS[hoveredState.id]?.fill || "#94a3b8"
                                        }}
                                    />
                                    <span>{hoveredState.label}</span>
                                    {hoveredState.id === "mh" && <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.2 rounded font-mono">14 Clinics</span>}
                                    {hoveredState.id === "up" && <span className="text-[9px] bg-lime-500 text-slate-900 px-1.5 py-0.2 rounded font-mono">3 Clinics</span>}
                                    {hoveredState.id === "br" && <span className="text-[9px] bg-purple-500 text-white px-1.5 py-0.2 rounded font-mono">1 Clinic</span>}
                                </div>
                            )}

                            {/* SVG Canvas - Reduced Compact Size */}
                            <svg
                                viewBox="0 0 612 696"
                                className="w-full max-w-[270px] md:max-w-[295px] h-auto select-none overflow-visible relative z-10"
                                style={{ filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.07))" }}
                            >
                                <defs>
                                    {/* Radial Glow Filters for Breathing Auras */}
                                    <radialGradient id="clinicBeaconPulse" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
                                        <stop offset="60%" stopColor="#334155" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
                                    </radialGradient>
                                </defs>

                                {/* India Multi-Colored Political State Outlines with Crisp Black Borders */}
                                {indiaStates.map((state) => {
                                    const stateColor = ATLAS_STATE_COLORS[state.id] || {
                                        fill: "#e2e8f0",
                                        hover: "#cbd5e1"
                                    };
                                    const isHovered = hoveredStateId === state.id;
                                    const isOperational = state.id === "mh" || state.id === "up" || state.id === "br";

                                    return (
                                        <path
                                            key={state.id}
                                            d={state.d}
                                            aria-label={`${state.label}${isOperational ? " (Active DigiSwasthya Network)" : ""}`}
                                            fill={isHovered ? stateColor.hover : stateColor.fill}
                                            stroke="#1e293b"
                                            strokeWidth="0.85"
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            className="transition-colors duration-150 cursor-pointer"
                                            onMouseEnter={() => setHoveredStateId(state.id)}
                                            onMouseLeave={() => setHoveredStateId(null)}
                                        />
                                    );
                                })}

                                {/* 18 Animated Clinic Location Pins */}
                                {filteredClinics.map((clinic, idx) => {
                                    const isSelected = selectedClinicId === clinic.id;
                                    const isHovered = hoveredClinicId === clinic.id;
                                    const isActive = isSelected || isHovered;

                                    // Stagger delay for organic wave breathing effect
                                    const staggerDelay = (idx % 6) * 0.25;

                                    return (
                                        <g
                                            key={clinic.id}
                                            transform={`translate(${clinic.x}, ${clinic.y})`}
                                            className="cursor-pointer"
                                            onClick={() => setSelectedClinicId(clinic.id)}
                                            onMouseEnter={() => setHoveredClinicId(clinic.id)}
                                            onMouseLeave={() => setHoveredClinicId(null)}
                                        >
                                            {/* 1. Pulsing / Breathing Radar Ripple Wave */}
                                            <motion.circle
                                                cx="0"
                                                cy="0"
                                                r="10"
                                                fill="url(#clinicBeaconPulse)"
                                                animate={{
                                                    scale: isActive ? [1, 2.4, 1] : [0.9, 1.8, 0.9],
                                                    opacity: isActive ? [0.9, 0.2, 0.9] : [0.6, 0.1, 0.6]
                                                }}
                                                transition={{
                                                    duration: isActive ? 1.8 : 2.4,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                    delay: staggerDelay
                                                }}
                                            />

                                            {/* 2. Anchor Ground Dot */}
                                            <circle
                                                cx="0"
                                                cy="0"
                                                r={isActive ? "3.5" : "2.5"}
                                                fill="#0f172a"
                                                stroke="#ffffff"
                                                strokeWidth="1"
                                            />

                                            {/* 3. Teardrop Map Location Pin */}
                                            <motion.g
                                                animate={
                                                    isActive
                                                        ? { scale: 1.35, y: -2 }
                                                        : {
                                                              scale: [0.9, 1.15, 0.9],
                                                              y: [0, -1.5, 0]
                                                          }
                                                }
                                                transition={
                                                    isActive
                                                        ? { duration: 0.2 }
                                                        : {
                                                              duration: 2.2,
                                                              repeat: Infinity,
                                                              ease: "easeInOut",
                                                              delay: staggerDelay
                                                          }
                                                }
                                                style={{ transformOrigin: "0px 0px" }}
                                            >
                                                {/* Teardrop Pin Shape */}
                                                <path
                                                    d="M0,0 C-1.5,-2 -7.5,-9 -7.5,-15 C-7.5,-19 -4.1,-22.5 0,-22.5 C4.1,-22.5 7.5,-19 7.5,-15 C7.5,-9 1.5,-2 0,0 Z"
                                                    fill="#0f172a"
                                                    stroke="#ffffff"
                                                    strokeWidth={isActive ? "2" : "1.2"}
                                                    className="drop-shadow-md"
                                                />

                                                {/* Inner Hollow Badge */}
                                                <circle
                                                    cx="0"
                                                    cy="-15"
                                                    r="3"
                                                    fill="#ffffff"
                                                />

                                                {/* Inner Center Dot */}
                                                <circle
                                                    cx="0"
                                                    cy="-15"
                                                    r="1.5"
                                                    fill={clinic.color}
                                                />
                                            </motion.g>

                                            {/* Mini Floating Tooltip on Hover */}
                                            {isHovered && (
                                                <g transform="translate(0, -30)" className="pointer-events-none z-30">
                                                    <rect
                                                        x="-50"
                                                        y="-18"
                                                        width="100"
                                                        height="20"
                                                        rx="10"
                                                        fill="#0f172a"
                                                        stroke="#ffffff"
                                                        strokeWidth="1"
                                                        className="drop-shadow-lg"
                                                    />
                                                    <text
                                                        x="0"
                                                        y="-5"
                                                        textAnchor="middle"
                                                        fill="#ffffff"
                                                        fontSize="8.5"
                                                        fontWeight="800"
                                                        fontFamily="sans-serif"
                                                    >
                                                        {clinic.name[currentLang]}
                                                    </text>
                                                </g>
                                            )}
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>

                        {/* Map Footer Summary Pill - Compact */}
                        <div className="mt-2.5 bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 shadow-2xs inline-flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                            <span className="text-[11px] font-bold text-slate-800 font-sans">
                                18 Active Clinics
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Prominent, Equal-Height Clinic Details Card */}
                    <div className="lg:col-span-5 h-full flex flex-col">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeClinic.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-200/90 h-full flex flex-col justify-between space-y-4"
                            >
                                {/* Header Section */}
                                <div className="border-b border-slate-100 pb-3.5 space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wider text-blue-600">
                                            <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                            <span>{activeClinic.district[currentLang]}, {activeClinic.state[currentLang]}</span>
                                        </div>
                                        <span
                                            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${activeClinic.accentBg}`}
                                        >
                                            {activeClinic.code}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight">
                                        {activeClinic.name[currentLang]}
                                    </h3>

                                    <p className="text-xs text-slate-500 font-medium">
                                        Postal PIN: <span className="font-mono font-bold text-slate-700">{activeClinic.pincode}</span> • Region: <span className="font-semibold text-slate-700">{activeClinic.state[currentLang]}</span>
                                    </p>
                                </div>

                                {/* Key Metrics KPI Blocks */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 text-center flex flex-col justify-center">
                                        <span className="block text-[9.5px] font-bold text-emerald-800 uppercase tracking-wider">
                                            Clinic Status
                                        </span>
                                        <div className="inline-flex items-center justify-center gap-1.5 text-xs md:text-sm font-black text-emerald-700 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            Active Hub
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-center flex flex-col justify-center">
                                        <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                                            Patients Served
                                        </span>
                                        <span className="text-xl md:text-2xl font-black text-slate-900 font-mono mt-0.5 block">
                                            {activeClinic.defaultPatients.toLocaleString("en-IN")}+
                                        </span>
                                    </div>
                                </div>

                                {/* Clinic Services & Features Highlight */}
                                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-600">
                                    <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Full Telemedicine Setup</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        Nurse-assisted digital consultation booth connected with expert empanelled specialist doctors.
                                    </p>
                                </div>

                                {/* Bottom Interactive Helper */}
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-slate-600 flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-medium">
                                        <Activity className="w-4 h-4 text-blue-600 shrink-0" />
                                        <span>Click any pin to inspect centre</span>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                                        {activeClinic.stateId.toUpperCase()}
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
