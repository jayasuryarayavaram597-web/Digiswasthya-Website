"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Users } from "lucide-react";

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

// Smooth animated dynamic number counter
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const duration = 1200;
        let animationFrame: number;

        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(value * ease));
            if (progress < 1) {
                animationFrame = requestAnimationFrame(step);
            } else {
                setDisplay(value);
            }
        };
        animationFrame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrame);
    }, [value]);

    return <span>{display.toLocaleString("en-IN")}{suffix}</span>;
}

function SinglePortalDonut({ title, subtitle, slices }: { title: string; subtitle: string; slices: DonutSlice[] }) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const radius = 54;
    const strokeWidth = 22;
    const center = 80;
    const circumference = 2 * Math.PI * radius; // ~339.29

    // Total percentage sum (or count)
    const totalPercentage = slices.reduce((acc, curr) => acc + curr.percentage, 0) || 100;
    const totalCount = slices.reduce((acc, curr) => acc + (curr.count || 0), 0);

    // Dynamic clean gap between segments (in degrees) to strictly prevent color collisions
    const gapDegrees = slices.length > 1 ? 5 : 0;
    const totalGapDegrees = gapDegrees * slices.length;
    const usableDegrees = Math.max(0, 360 - totalGapDegrees);

    // Calculate exact start angles and arc lengths for each slice
    // Start from -90 deg (12 o'clock) or -45 deg for aesthetic balance
    let currentAngle = -90;
    const computedSlices = slices.map((s, idx) => {
        const normalizedShare = s.percentage / totalPercentage;
        const sweepAngle = normalizedShare * usableDegrees;
        const startAngle = currentAngle;
        const arcLength = (sweepAngle / 360) * circumference;

        // Advance angle for next segment with gap
        currentAngle += sweepAngle + gapDegrees;

        return {
            ...s,
            sweepAngle,
            startAngle,
            arcLength,
            idx
        };
    });

    // Primary dominant slice
    const primarySlice = slices.reduce((max, s) => (s.percentage > max.percentage ? s : max), slices[0]);
    const activeSlice = hoveredIdx !== null ? computedSlices[hoveredIdx] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-b from-blue-50/40 via-white to-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(13,91,225,0.05)] border border-blue-100/70 flex-1 flex flex-col items-center hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden font-sans"
        >
            {/* Top accent line */}
            <div
                className="absolute top-0 inset-x-0 h-1 transition-colors duration-300"
                style={{ backgroundColor: activeSlice ? activeSlice.color : primarySlice?.color || "#2563eb" }}
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
                    className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors duration-300"
                    style={{
                        backgroundColor: `${activeSlice ? activeSlice.color : primarySlice?.color || "#2563eb"}15`,
                        borderColor: `${activeSlice ? activeSlice.color : primarySlice?.color || "#2563eb"}30`
                    }}
                >
                    <PieChart className="w-3.5 h-3.5" style={{ color: activeSlice ? activeSlice.color : primarySlice?.color || "#2563eb" }} />
                </div>
            </div>

            {/* SVG Donut - crisp butt caps, perfectly separated arcs, smooth draw animation */}
            <div className="relative w-40 h-40 my-2 flex items-center justify-center">
                <svg
                    width="160"
                    height="160"
                    viewBox="0 0 160 160"
                    className="select-none overflow-visible"
                >
                    {/* Background subtle guide track */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth={strokeWidth}
                    />

                    {/* Donut Slices */}
                    {computedSlices.map((slice) => {
                        const isHovered = hoveredIdx === slice.idx;
                        const hasHover = hoveredIdx !== null;
                        return (
                            <motion.circle
                                key={slice.idx}
                                cx={center}
                                cy={center}
                                r={radius}
                                fill="transparent"
                                stroke={slice.color}
                                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                                strokeLinecap="butt"
                                strokeDasharray={`${slice.arcLength} ${circumference}`}
                                strokeDashoffset={0}
                                transform={`rotate(${slice.startAngle} ${center} ${center})`}
                                initial={{ strokeDasharray: `0 ${circumference}` }}
                                whileInView={{ strokeDasharray: `${slice.arcLength} ${circumference}` }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 1.0,
                                    ease: [0.16, 1, 0.3, 1],
                                    delay: slice.idx * 0.1
                                }}
                                className="cursor-pointer transition-all duration-200"
                                style={{
                                    opacity: !hasHover || isHovered ? 1 : 0.45,
                                    filter: isHovered ? `drop-shadow(0 0 8px ${slice.color}80)` : "none"
                                }}
                                onMouseEnter={() => setHoveredIdx(slice.idx)}
                                onMouseLeave={() => setHoveredIdx(null)}
                            />
                        );
                    })}
                </svg>

                {/* Center Badge / Information */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    {activeSlice ? (
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center px-1"
                        >
                            <span className="text-xl font-black leading-none font-mono tracking-tight" style={{ color: activeSlice.color }}>
                                {activeSlice.percentage}%
                            </span>
                            <span className="text-[10px] font-bold text-slate-600 truncate max-w-[90px] mt-0.5">
                                {activeSlice.label}
                            </span>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Users className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                            <span className="text-sm font-black text-slate-800 leading-none font-mono tracking-tight">
                                {totalCount > 0 ? (
                                    <AnimatedNumber value={totalCount} />
                                ) : (
                                    "100%"
                                )}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                Total
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Legend with dynamically animated numbers */}
            <div className="w-full space-y-1.5 mt-1">
                {slices.map((slice, idx) => {
                    const isHovered = hoveredIdx === idx;
                    return (
                        <div
                            key={idx}
                            className={`flex items-center justify-between px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                                isHovered
                                    ? "bg-white shadow-sm ring-1"
                                    : "bg-slate-50/70 border-slate-100 hover:bg-slate-100/60"
                            }`}
                            style={{
                                borderColor: isHovered ? slice.color : undefined
                            }}
                            onMouseEnter={() => setHoveredIdx(idx)}
                            onMouseLeave={() => setHoveredIdx(null)}
                        >
                            <div className="flex items-center gap-2 truncate">
                                <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs transition-transform duration-200"
                                    style={{
                                        backgroundColor: slice.color,
                                        transform: isHovered ? "scale(1.25)" : "scale(1)"
                                    }}
                                />
                                <span className="text-[11.5px] font-extrabold tracking-wide text-slate-700">
                                    {slice.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {slice.count !== undefined && (
                                    <span className="text-[11px] font-bold text-slate-500 font-mono">
                                        <AnimatedNumber value={slice.count} />
                                    </span>
                                )}
                                <span
                                    className="text-[10px] font-black px-2 py-0.5 rounded-md text-white font-mono shadow-2xs"
                                    style={{ backgroundColor: slice.color }}
                                >
                                    {slice.percentage < 1 && slice.count && slice.count > 0 ? (
                                        "<1%"
                                    ) : (
                                        <AnimatedNumber value={slice.percentage} suffix="%" />
                                    )}
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
    // Static brand colors matching reference design:
    // Male = Vibrant Royal Blue, Female = Vibrant Magenta / Pink, Other = Purple
    const formattedGenderData = genderData.map((g) => {
        const labelLower = g.label.toLowerCase();
        if (labelLower === "female") return { ...g, color: "#d81b60" }; // Vibrant Pink / Magenta (Image format)
        if (labelLower === "male") return { ...g, color: "#1d63ed" };   // Royal Blue (Image format)
        if (labelLower === "other") return { ...g, color: "#8b5cf6" };  // Purple
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

