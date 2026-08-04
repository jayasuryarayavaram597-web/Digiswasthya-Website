"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart } from "lucide-react";

interface DonutSlice {
    label: string;
    percentage: number;
    color: string;
}

interface PortalDonutPairProps {
    genderData: DonutSlice[];
    patientTypeData: DonutSlice[];
}

function SinglePortalDonut({ title, subtitle, slices }: { title: string; subtitle: string; slices: DonutSlice[] }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const radius = 54;
    const strokeWidth = 22;
    const center = 80;
    const circumference = 2 * Math.PI * radius; // ~339.3

    let cumulative = 0;
    const strokeSlices = slices.map((s) => {
        const strokeLength = (s.percentage / 100) * circumference;
        const strokeOffset = circumference - (cumulative / 100) * circumference;
        cumulative += s.percentage;
        return { ...s, strokeLength, strokeOffset };
    });

    const activeSlice = activeIndex !== null ? slices[activeIndex] : slices[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 flex-1 flex flex-col items-center hover:shadow-md transition-all duration-200 relative overflow-hidden"
        >
            {/* Soft accent top line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-indigo-500 opacity-80" />

            {/* Header */}
            <div className="w-full text-left mb-2 flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">
                        {title}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                        {subtitle}
                    </p>
                </div>
                <div className="w-7 h-7 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center border border-slate-100">
                    <PieChart className="w-3.5 h-3.5 text-slate-500" />
                </div>
            </div>

            {/* SVG Donut */}
            <div className="relative w-36 h-36 my-2 flex items-center justify-center">
                <svg width="140" height="140" viewBox="0 0 160 160" className="transform -rotate-90 select-none overflow-visible">
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth={strokeWidth}
                    />

                    {strokeSlices.map((slice, idx) => {
                        const isActive = activeIndex === idx;
                        return (
                            <motion.circle
                                key={idx}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="transparent"
                                stroke={slice.color}
                                strokeWidth={isActive ? strokeWidth + 3 : strokeWidth}
                                strokeDasharray={`${slice.strokeLength} ${circumference}`}
                                strokeDashoffset={slice.strokeOffset}
                                initial={{ strokeDasharray: `0 ${circumference}` }}
                                whileInView={{ strokeDasharray: `${slice.strokeLength} ${circumference}` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
                                className="cursor-pointer transition-all duration-150"
                                opacity={isActive ? 1 : 0.85}
                                onMouseEnter={() => setActiveIndex(idx)}
                            />
                        );
                    })}
                </svg>

                {/* Center Readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    {activeSlice && (
                        <motion.div
                            key={activeSlice.label}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-2xl font-black text-slate-900 leading-none tracking-tight" style={{ color: activeSlice.color }}>
                                {activeSlice.percentage}%
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 px-1 truncate max-w-[90px]">
                                {activeSlice.label}
                            </span>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Legend Pills */}
            <div className="w-full space-y-1.5 mt-2">
                {slices.map((slice, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                        <div
                            key={idx}
                            className={`flex items-center justify-between px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer ${
                                isActive
                                    ? "bg-slate-100/90 border border-slate-200/90"
                                    : "bg-slate-50/60 border border-slate-100 hover:bg-slate-100/40"
                            }`}
                            onMouseEnter={() => setActiveIndex(idx)}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: slice.color }}
                                />
                                <span className="text-[11px] font-bold text-slate-700 tracking-wide">
                                    {slice.label}
                                </span>
                            </div>
                            <span
                                className="text-[10px] font-extrabold px-2 py-0.5 rounded-md text-white font-mono"
                                style={{ backgroundColor: slice.color }}
                            >
                                {slice.percentage}%
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center gap-1 mt-3">
                {[...Array(6)].map((_, i) => (
                    <span key={i} className={`w-1 h-1 rounded-full ${i === 0 ? "bg-slate-400" : "bg-slate-200"}`} />
                ))}
            </div>
        </motion.div>
    );
}

export function PortalDonutPair({ genderData, patientTypeData }: PortalDonutPairProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SinglePortalDonut
                title="GENDER DISTRIBUTION"
                subtitle="Patients served"
                slices={genderData}
            />
            <SinglePortalDonut
                title="NEW VS FOLLOW-UP"
                subtitle="Consultations"
                slices={patientTypeData}
            />
        </div>
    );
}
