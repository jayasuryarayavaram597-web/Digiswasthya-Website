"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";

interface DeptItem {
    department: string;
    count: number;
}

interface PortalDepartmentBarChartProps {
    data: DeptItem[];
}

export function PortalDepartmentBarChart({ data }: PortalDepartmentBarChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(0);
    const [showAll, setShowAll] = useState(false);

    const displayData = showAll ? data : data.slice(0, 12);
    const maxVal = Math.max(...data.map(d => d.count), 16000);
    const maxY = Math.ceil(maxVal / 4000) * 4000;

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

            {/* Header */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">
                            CONSULTATIONS BY DEPARTMENT
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
                            <Building2 className="w-3 h-3 text-blue-600" />
                            {data.length} Clinical Specialties
                        </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                        The treating doctor&apos;s specialization across all clinical consultations
                    </p>
                </div>

                <button
                    onClick={() => setShowAll(!showAll)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200/80 transition-all cursor-pointer self-start sm:self-auto shadow-sm"
                >
                    {showAll ? (
                        <>
                            <span>Show Top 12</span>
                            <ChevronUp className="w-3.5 h-3.5 text-blue-600" />
                        </>
                    ) : (
                        <>
                            <span>Show All {data.length} Departments</span>
                            <ChevronDown className="w-3.5 h-3.5 text-blue-600" />
                        </>
                    )}
                </button>
            </div>

            {/* Scrollable Canvas Area */}
            <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                <div 
                    className="h-64 relative flex items-end pt-8 pb-16 px-10 border-b border-l border-slate-200 transition-all"
                    style={{ minWidth: showAll ? `${Math.max(data.length * 45, 750)}px` : "680px" }}
                >
                    {/* Y Axis Grid & Labels */}
                    <div className="absolute left-0 top-6 bottom-16 flex flex-col justify-between text-[9.5px] font-semibold text-slate-400 pointer-events-none">
                        <span>{maxY.toLocaleString("en-IN")}</span>
                        <span>{(maxY * 0.75).toLocaleString("en-IN")}</span>
                        <span>{(maxY * 0.5).toLocaleString("en-IN")}</span>
                        <span>{(maxY * 0.25).toLocaleString("en-IN")}</span>
                        <span>0</span>
                    </div>

                    {/* Vertical Bars */}
                    <div className="w-full h-full flex items-end justify-between gap-1.5 px-1">
                        {displayData.map((item, idx) => {
                            const heightPct = Math.min((item.count / maxY) * 100, 100);
                            const isHovered = hoveredIdx === idx;

                            return (
                                <div
                                    key={idx}
                                    className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                >
                                    {/* Glassmorphism Tooltip */}
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="absolute -top-11 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl z-30 whitespace-nowrap flex items-center gap-1.5 pointer-events-none"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                                            <span>{item.department}:</span>
                                            <span className="text-blue-300 font-extrabold">{item.count.toLocaleString("en-IN")}</span>
                                        </motion.div>
                                    )}

                                    {/* Royal Blue Bar */}
                                    <motion.div
                                        initial={{ height: "0%" }}
                                        animate={{ height: `${heightPct}%` }}
                                        transition={{ duration: 0.5, delay: Math.min(idx * 0.02, 0.4), ease: [0.16, 1, 0.3, 1] }}
                                        className="w-full max-w-[28px] rounded-t-md transition-all duration-200"
                                        style={{
                                            backgroundColor: isHovered ? "#1d4ed8" : "#2563eb",
                                            opacity: isHovered ? 1 : 0.88,
                                            boxShadow: isHovered ? "0 4px 12px rgba(37,99,235,0.3)" : "none"
                                        }}
                                    />

                                    {/* Angled Label */}
                                    <div className={`absolute -bottom-14 origin-top-left -rotate-45 text-[9px] font-semibold whitespace-nowrap select-none transition-colors ${
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

            {/* Department grid expander when Show All is clicked */}
            <AnimatePresence>
                {showAll && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-slate-100"
                    >
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                            <span>All {data.length} Clinical Departments Breakdown</span>
                            <span className="h-px flex-1 bg-slate-100" />
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                            {data.map((dept, i) => (
                                <div 
                                    key={i} 
                                    className="bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl p-2.5 transition-all duration-150 flex flex-col justify-between"
                                >
                                    <span className="text-[11px] font-bold text-slate-800 truncate" title={dept.department}>
                                        {dept.department}
                                    </span>
                                    <span className="text-xs font-black text-blue-600 mt-1">
                                        {dept.count.toLocaleString("en-IN")} <span className="text-[9px] font-medium text-slate-400">cases</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
