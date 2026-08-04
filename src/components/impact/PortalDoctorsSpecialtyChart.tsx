"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

interface SpecialtyItem {
    specialty: string;
    count: number;
}

interface PortalDoctorsSpecialtyChartProps {
    data: SpecialtyItem[];
}

export function PortalDoctorsSpecialtyChart({ data }: PortalDoctorsSpecialtyChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);

    const maxScale = 24;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 mb-6 hover:shadow-md transition-all duration-200 relative overflow-hidden"
        >
            {/* Soft accent top bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-80" />

            {/* Header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">
                            DOCTORS BY SPECIALTY
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                            <Stethoscope className="w-3 h-3 text-emerald-600" />
                            Active Network
                        </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                        Active doctors on the network by specialization
                    </p>
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start sm:self-auto">
                    Specialist Network
                </div>
            </div>

            {/* Canvas */}
            <div className="relative pt-2 pb-6 px-4 border-b border-l border-slate-200">
                <div className="space-y-2">
                    {data.map((item, idx) => {
                        const widthPct = Math.min((item.count / maxScale) * 100, 100);
                        const isHovered = hoveredIdx === idx;

                        return (
                            <div
                                key={idx}
                                className={`flex items-center gap-4 py-1 px-2 rounded-xl transition-colors cursor-pointer relative ${
                                    isHovered ? "bg-slate-100/70" : "hover:bg-slate-50"
                                }`}
                                onMouseEnter={() => setHoveredIdx(idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            >
                                {/* Left Label */}
                                <div className="w-40 text-right text-[11px] font-semibold text-slate-600 truncate">
                                    {item.specialty}
                                </div>

                                {/* Bar Container */}
                                <div className="flex-1 h-3.5 bg-slate-100/60 rounded-full relative flex items-center overflow-hidden">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: `${widthPct}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                                        className="h-full rounded-full transition-all duration-150"
                                        style={{
                                            backgroundColor: isHovered ? "#047857" : "#059669",
                                            opacity: isHovered ? 1 : 0.88
                                        }}
                                    />
                                </div>

                                {/* Glassmorphism Tooltip Card */}
                                {isHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="absolute left-[40%] -top-3 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg z-20 pointer-events-none flex items-center gap-2"
                                    >
                                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                                        <span>{item.specialty}:</span>
                                        <span className="text-emerald-600 font-extrabold">{item.count} doctors</span>
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* X Axis scale labels */}
                <div className="flex justify-between text-[9.5px] font-semibold text-slate-400 mt-4 pl-44 pr-2">
                    <span>0</span>
                    <span>6</span>
                    <span>12</span>
                    <span>18</span>
                    <span>24</span>
                </div>
            </div>

            {/* Pagination dots indicator */}
            <div className="flex justify-center gap-1.5 mt-4">
                {[...Array(6)].map((_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-slate-400" : "bg-slate-200"}`} />
                ))}
            </div>
        </motion.div>
    );
}
