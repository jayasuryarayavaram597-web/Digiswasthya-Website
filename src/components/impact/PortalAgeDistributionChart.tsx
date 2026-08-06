"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";

export interface AgeBand {
    range: string;
    count: number;
    color?: string;
    gradient?: string;
    shadowColor?: string;
}

interface PortalAgeDistributionChartProps {
    data?: AgeBand[];
}

export function PortalAgeDistributionChart({ data }: PortalAgeDistributionChartProps) {
    // Default selected index to 2 (13-18 age band as requested)
    const [selectedIdx, setSelectedIdx] = useState<number | null>(2);

    const ageBands: AgeBand[] = [
        { range: "0-5",          count: 3045,  color: "#2563eb" },
        { range: "6-12",         count: 4680,  color: "#059669" },
        { range: "13-18",        count: 3635,  color: "#d97706" },
        { range: "19-35",        count: 9330,  color: "#7c3aed" },
        { range: "36-60",        count: 14266, color: "#e11d48" },
        { range: "60+",          count: 7889,  color: "#0891b2" }
    ];

    const rawData = data || ageBands;
    const displayData = rawData.filter(b => b.range.toLowerCase() !== "not recorded");
    const maxY = 16000;

    const activeItem = selectedIdx !== null ? displayData[selectedIdx] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 h-full flex flex-col justify-between relative overflow-hidden font-sans"
        >
            {/* Top accent bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 opacity-80" />

            {/* Header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">
                            AGE DISTRIBUTION
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
                            <Users className="w-3 h-3 text-slate-600" />
                            Demographics
                        </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                        Patients served, by age band
                    </p>
                </div>

                {/* Selected Age Band Live Badge */}
                {activeItem && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs self-start sm:self-auto"
                    >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activeItem.color || "#2563eb" }} />
                        <span className="text-xs font-semibold text-slate-600">Age {activeItem.range}:</span>
                        <span className="text-xs font-extrabold text-slate-900">{activeItem.count.toLocaleString("en-IN")} patients</span>
                    </motion.div>
                )}
            </div>

            {/* Canvas - Full width without horizontal scrolling */}
            <div className="w-full pt-6 pb-2">
                <div className="w-full h-64 relative flex items-end pt-12 pb-10 pl-10 pr-2 border-b border-l border-slate-200">
                    
                    {/* Y Axis Grid & Labels */}
                    <div className="absolute left-0 top-10 bottom-10 flex flex-col justify-between text-[9.5px] font-semibold text-slate-400 pointer-events-none">
                        <span>16,000</span>
                        <span>12,000</span>
                        <span>8,000</span>
                        <span>4,000</span>
                        <span>0</span>
                    </div>

                    {/* Dotted Grid Lines */}
                    <div className="absolute left-10 right-0 top-10 bottom-10 flex flex-col justify-between pointer-events-none">
                        {[16000, 12000, 8000, 4000, 0].map((step) => (
                            <div key={step} className="w-full border-b border-dashed border-slate-200/70 h-0" />
                        ))}
                    </div>

                    {/* Bars Container */}
                    <div className="w-full h-full flex items-end justify-between gap-1.5 z-10">
                        {displayData.map((item, idx) => {
                            const heightPct = Math.min((item.count / maxY) * 100, 100);
                            const isSelected = selectedIdx === idx;
                            const barColor = item.color || "#2563eb";

                            return (
                                <div
                                    key={idx}
                                    className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                                    onClick={() => setSelectedIdx(idx)}
                                    onMouseEnter={() => setSelectedIdx(idx)}
                                >
                                    {/* Number Popover directly on top of bar */}
                                    {isSelected && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 4, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="absolute -top-10 bg-slate-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-xl z-30 whitespace-nowrap flex items-center gap-1.5 pointer-events-none"
                                        >
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: barColor }} />
                                            <span>{item.range}:</span>
                                            <span className="text-amber-300 font-extrabold">{item.count.toLocaleString("en-IN")}</span>
                                        </motion.div>
                                    )}

                                    {/* Clean Color Bar */}
                                    <motion.div
                                        initial={{ height: "0%" }}
                                        whileInView={{ height: `${heightPct}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full max-w-[38px] rounded-t-md transition-all duration-150 relative"
                                        style={{
                                            backgroundColor: barColor,
                                            opacity: isSelected ? 1 : 0.85,
                                            boxShadow: isSelected ? `0 4px 14px ${barColor}55` : "none",
                                            transform: isSelected ? "scaleX(1.05)" : "scaleX(1)"
                                        }}
                                    />

                                    {/* X-axis Label */}
                                    <div className={`absolute -bottom-7 text-[11px] font-semibold transition-colors select-none ${
                                        isSelected ? "text-slate-900 font-bold underline decoration-2 underline-offset-4" : "text-slate-500"
                                    }`}>
                                        {item.range}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
