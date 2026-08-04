"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // Soft, clean color palette (Blue, Teal, Amber, Slate, Cyan)
    const ageBands: AgeBand[] = [
        { range: "0-5",          count: 3100,  color: "#2563eb" },
        { range: "6-12",         count: 4680,  color: "#059669" },
        { range: "13-18",        count: 3620,  color: "#d97706" },
        { range: "19-35",        count: 9350,  color: "#7c3aed" },
        { range: "36-60",        count: 14320, color: "#e11d48" },
        { range: "60+",          count: 7840,  color: "#0891b2" },
        { range: "Not recorded", count: 40,    color: "#64748b" }
    ];

    const displayData = data || ageBands;
    const maxY = 16000;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 mb-6 hover:shadow-md transition-all duration-200 relative overflow-hidden"
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

                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start sm:self-auto">
                    7 Age Bands
                </div>
            </div>

            {/* Canvas */}
            <div className="w-full overflow-x-auto">
                <div className="min-w-[650px] h-52 relative flex items-end pt-8 pb-10 px-10 border-b border-l border-slate-200">
                    
                    {/* Y Axis Grid & Labels */}
                    <div className="absolute left-0 top-6 bottom-10 flex flex-col justify-between text-[9.5px] font-semibold text-slate-400">
                        <span>16,000</span>
                        <span>12,000</span>
                        <span>8,000</span>
                        <span>4,000</span>
                        <span>0</span>
                    </div>

                    {/* Bars Container */}
                    <div className="w-full h-full flex items-end justify-between gap-3 px-3">
                        {displayData.map((item, idx) => {
                            const heightPct = Math.min((item.count / maxY) * 100, 100);
                            const isHovered = hoveredIdx === idx;
                            const barColor = item.color || "#2563eb";

                            return (
                                <div
                                    key={idx}
                                    className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                >
                                    {/* Glassmorphism Tooltip Card */}
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="absolute -top-11 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg z-20 whitespace-nowrap flex items-center gap-1.5 pointer-events-none"
                                        >
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: barColor }} />
                                            <span>{item.range}:</span>
                                            <span className="font-extrabold" style={{ color: barColor }}>{item.count.toLocaleString("en-IN")}</span>
                                        </motion.div>
                                    )}

                                    {/* Clean Soft Color Bar */}
                                    <motion.div
                                        initial={{ height: "0%" }}
                                        whileInView={{ height: `${heightPct}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full max-w-[50px] rounded-t-md transition-all duration-150"
                                        style={{
                                            backgroundColor: barColor,
                                            opacity: isHovered ? 1 : 0.88
                                        }}
                                    />

                                    {/* X-axis Label */}
                                    <div className="absolute -bottom-7 text-[10px] font-semibold text-slate-600 select-none">
                                        {item.range}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Pagination dots indicator */}
            <div className="flex justify-center gap-1.5 mt-8">
                {[...Array(6)].map((_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-slate-400" : "bg-slate-200"}`} />
                ))}
            </div>
        </motion.div>
    );
}
