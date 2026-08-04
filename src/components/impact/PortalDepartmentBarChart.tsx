"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

interface DeptItem {
    department: string;
    count: number;
}

interface PortalDepartmentBarChartProps {
    data: DeptItem[];
}

export function PortalDepartmentBarChart({ data }: PortalDepartmentBarChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);

    const maxY = 16000;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 mb-6 hover:shadow-md transition-all duration-200 relative overflow-hidden"
        >
            {/* Soft accent top bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 opacity-80" />

            {/* Header matching line chart style */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">
                            CONSULTATIONS BY DEPARTMENT
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                            <Building2 className="w-3 h-3 text-blue-600" />
                            Clinical Specialties
                        </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                        The treating doctor&apos;s specialization
                    </p>
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start sm:self-auto">
                    Department Volume
                </div>
            </div>

            {/* Canvas Area */}
            <div className="w-full overflow-x-auto">
                <div className="min-w-[650px] h-52 relative flex items-end pt-8 pb-12 px-10 border-b border-l border-slate-200">
                    
                    {/* Y Axis Grid & Labels */}
                    <div className="absolute left-0 top-6 bottom-12 flex flex-col justify-between text-[9.5px] font-semibold text-slate-400">
                        <span>16,000</span>
                        <span>12,000</span>
                        <span>8,000</span>
                        <span>4,000</span>
                        <span>0</span>
                    </div>

                    {/* Vertical Bars */}
                    <div className="w-full h-full flex items-end justify-between gap-2 px-1">
                        {data.map((item, idx) => {
                            const heightPct = Math.min((item.count / maxY) * 100, 100);
                            const isHovered = hoveredIdx === idx;

                            return (
                                <div
                                    key={idx}
                                    className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                >
                                    {/* Glassmorphism Tooltip matching line chart style */}
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="absolute -top-11 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg z-20 whitespace-nowrap flex items-center gap-1.5 pointer-events-none"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                                            <span>{item.department}:</span>
                                            <span className="text-blue-600 font-extrabold">{item.count.toLocaleString("en-IN")}</span>
                                        </motion.div>
                                    )}

                                    {/* Soft Royal Blue Bar */}
                                    <motion.div
                                        initial={{ height: "0%" }}
                                        whileInView={{ height: `${heightPct}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full max-w-[28px] rounded-t-md transition-all duration-200"
                                        style={{
                                            backgroundColor: isHovered ? "#1d4ed8" : "#2563eb",
                                            opacity: isHovered ? 1 : 0.88,
                                            boxShadow: isHovered ? "0 4px 12px rgba(37,99,235,0.3)" : "none"
                                        }}
                                    />

                                    {/* Angled Label */}
                                    <div className={`absolute -bottom-10 origin-top-left -rotate-45 text-[9px] font-semibold whitespace-nowrap select-none transition-colors ${
                                        isHovered ? "text-blue-600 font-bold" : "text-slate-500"
                                    }`}>
                                        {item.department}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Pagination dots indicator */}
            <div className="flex justify-center gap-1.5 mt-12">
                {[...Array(6)].map((_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-slate-400" : "bg-slate-200"}`} />
                ))}
            </div>
        </motion.div>
    );
}
