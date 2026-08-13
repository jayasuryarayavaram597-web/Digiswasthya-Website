"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart } from "lucide-react";

interface DonutSlice {
    label: string;
    percentage: number;
    count?: number;
    color: string;
}

interface PortalDonutPairProps {
    genderData: DonutSlice[];
    patientTypeData: DonutSlice[];
}

function SinglePortalDonut({ title, subtitle, slices }: { title: string; subtitle: string; slices: DonutSlice[] }) {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const radius = 54;
    const strokeWidth = 22;
    const center = 80;
    const circumference = 2 * Math.PI * radius; // ~339.3

    // Ensure all slices have a minimum visual length so small slices like "Other" can be seen and clicked
    const visualSlices = slices.map((s) => {
        let visualPct = s.percentage;
        if (visualPct > 0 && visualPct < 3) {
            visualPct = 3; // minimum 3% for visual rendering
        }
        return { ...s, visualPct };
    });

    const totalVisualPct = visualSlices.reduce((acc, curr) => acc + curr.visualPct, 0) || 100;

    let cumulative = 0;
    const strokeSlices = visualSlices.map((s) => {
        const normalizedPct = (s.visualPct / totalVisualPct) * 100;
        const strokeLength = (normalizedPct / 100) * circumference;
        const strokeOffset = circumference - (cumulative / 100) * circumference;
        cumulative += normalizedPct;
        return { ...s, strokeLength, strokeOffset };
    });

    const activeSlice = slices[activeIndex] || slices[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-b from-blue-50/40 via-white to-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(13,91,225,0.05)] border border-blue-100/70 flex-1 flex flex-col items-center hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden font-sans"
        >
            {/* Dynamic accent top line based on active selection */}
            <motion.div 
                className="absolute top-0 inset-x-0 h-1 transition-all duration-300" 
                style={{ backgroundColor: activeSlice.color }}
            />

            {/* Header */}
            <div className="w-full text-left mb-1 flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">
                        {title}
                    </h3>
                    <p className="text-[10.5px] font-semibold text-slate-400 mt-0.5">
                        {subtitle}
                    </p>
                </div>
                <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all duration-300"
                    style={{ backgroundColor: `${activeSlice.color}15`, borderColor: `${activeSlice.color}30` }}
                >
                    <PieChart className="w-3.5 h-3.5 transition-colors duration-300" style={{ color: activeSlice.color }} />
                </div>
            </div>

            {/* SVG Donut */}
            <div className="relative w-36 h-36 my-2 flex items-center justify-center">
                <svg width="144" height="144" viewBox="0 0 160 160" className="transform -rotate-90 select-none overflow-visible">
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth={strokeWidth - 2}
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
                                strokeWidth={isActive ? strokeWidth + 5 : strokeWidth - 2}
                                strokeDasharray={`${slice.strokeLength} ${circumference}`}
                                strokeDashoffset={slice.strokeOffset}
                                initial={{ strokeDasharray: `0 ${circumference}` }}
                                whileInView={{ strokeDasharray: `${slice.strokeLength} ${circumference}` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: idx * 0.08 }}
                                className="cursor-pointer transition-all duration-300 origin-center"
                                style={{
                                    opacity: isActive ? 1 : 0.4,
                                    filter: isActive ? `drop-shadow(0 0 6px ${slice.color}80)` : "none"
                                }}
                                onClick={() => setActiveIndex(idx)}
                                onMouseEnter={() => setActiveIndex(idx)}
                            />
                        );
                    })}
                </svg>

                {/* Center Readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-1.5">
                    {activeSlice && (
                        <motion.div
                            key={activeSlice.label}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center justify-center"
                        >
                            <span 
                                className="text-2xl font-black leading-none tracking-tight transition-colors duration-200" 
                                style={{ color: activeSlice.color }}
                            >
                                {activeSlice.percentage < 1 && activeSlice.count && activeSlice.count > 0 ? "<1%" : `${activeSlice.percentage}%`}
                            </span>
                            <span className="text-[9.5px] font-extrabold text-slate-800 uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded-full bg-slate-100/80 truncate max-w-[90px]">
                                {activeSlice.label}
                            </span>
                            {activeSlice.count !== undefined && (
                                <span className="text-[9.5px] font-bold text-slate-500 mt-0.5">
                                    {activeSlice.count.toLocaleString("en-IN")} patients
                                </span>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Interactive Legend Pills Below */}
            <div className="w-full space-y-1.5 mt-1">
                {slices.map((slice, idx) => {
                    const isActive = activeIndex === idx;
                    return (
                        <div
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            style={{
                                backgroundColor: isActive ? `${slice.color}15` : "rgba(248,250,252,0.7)",
                                borderColor: isActive ? slice.color : "rgba(241,245,249,1)"
                            }}
                            className={`flex items-center justify-between px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                                isActive
                                    ? "shadow-2xs scale-[1.01] ring-1"
                                    : "hover:bg-slate-100/60"
                            }`}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs transition-transform duration-200"
                                    style={{ 
                                        backgroundColor: slice.color,
                                        boxShadow: isActive ? `0 0 6px ${slice.color}` : "none",
                                        transform: isActive ? "scale(1.15)" : "scale(1)"
                                    }}
                                />
                                <span className={`text-[11.5px] font-extrabold tracking-wide ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                                    {slice.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {slice.count !== undefined && (
                                    <span className="text-[10.5px] font-bold text-slate-500">
                                        {slice.count.toLocaleString("en-IN")}
                                    </span>
                                )}
                                <span
                                    className="text-[10px] font-black px-2 py-0.5 rounded-md text-white font-mono shadow-2xs"
                                    style={{ backgroundColor: slice.color }}
                                >
                                    {slice.percentage < 1 && slice.count && slice.count > 0 ? "<1%" : `${slice.percentage}%`}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export function PortalDonutPair({ genderData, patientTypeData }: PortalDonutPairProps) {
    // Custom distinct colors for Gender: Male = Blue, Female = Emerald Green, Other = Purple/Violet
    const formattedGenderData = genderData.map(g => {
        const labelLower = g.label.toLowerCase();
        if (labelLower === "female") return { ...g, color: "#059669" }; // Emerald Green
        if (labelLower === "male") return { ...g, color: "#2563eb" };   // Royal Blue
        if (labelLower === "other") return { ...g, color: "#8b5cf6" };  // Bright Purple
        return g;
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SinglePortalDonut
                title="GENDER DISTRIBUTION"
                subtitle="Patients served"
                slices={formattedGenderData}
            />
            <SinglePortalDonut
                title="NEW VS FOLLOW-UP"
                subtitle="Consultations"
                slices={patientTypeData}
            />
        </div>
    );
}
