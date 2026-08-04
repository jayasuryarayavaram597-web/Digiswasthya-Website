"use client";

import { useState } from "react";
import { MapPin, Search, ChevronDown, Building } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DistrictItem {
    district: { en: string; hi: string };
    count: number;
}

interface DistrictsListProps {
    data: DistrictItem[];
    totalDistricts?: number;
    totalVillages?: number;
}

export function DistrictsList({ data, totalDistricts = 84, totalVillages = 633 }: DistrictsListProps) {
    const { language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = data.filter((item) =>
        item.district[currentLang].toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 font-serif">Districts Covered</h3>
                        <p className="text-xs text-gray-500 font-medium">
                            Patients served, by home district. Feeds the coverage map.
                        </p>
                    </div>
                </div>

                <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 self-start sm:self-auto">
                    <span className="text-blue-600 font-extrabold">{totalDistricts} districts</span> · <span className="text-emerald-600 font-extrabold">{totalVillages} villages</span>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search district..."
                    className="w-full bg-gray-50 border border-gray-200 text-xs font-medium rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>

            {/* Scrollable District List */}
            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                {filtered.length > 0 ? (
                    filtered.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-100"
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-xs font-bold text-gray-800">
                                    {item.district[currentLang]}
                                </span>
                            </div>
                            <span className="text-xs font-mono font-extrabold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-md">
                                {item.count.toLocaleString("en-IN")}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="py-6 text-center text-xs text-gray-400 font-medium">
                        No district matching &quot;{searchQuery}&quot;
                    </div>
                )}
            </div>

            {/* Scroll indicator footer */}
            <div className="mt-3 pt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center justify-center gap-1 border-t border-gray-50">
                <span>Scroll to see all {totalDistricts} districts</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
            </div>
        </div>
    );
}
