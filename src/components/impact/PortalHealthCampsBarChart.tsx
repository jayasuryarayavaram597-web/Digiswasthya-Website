"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CampPoint {
    year: string;
    count: number;
}

interface PortalHealthCampsBarChartProps {
    data?: CampPoint[];
}

export function PortalHealthCampsBarChart({ data }: PortalHealthCampsBarChartProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(0); // Default hover on 2026 like screenshot 8

    const defaultCamps: CampPoint[] = [
        { year: "2026", count: 5 }
    ];

    const campsData = data || defaultCamps;
    const maxY = 8;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 mb-8 hover:shadow-md transition-shadow relative overflow-hidden"
        >
            {/* Header matching Screenshot 8 */}
            <div className="mb-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">
                    HEALTH CAMPS GROWTH
                </h3>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                    Camps held per period
                </p>
            </div>

            {/* Inner Gray Canvas Container matching Screenshot 8 */}
            <div className="w-full overflow-x-auto">
                <div className="min-w-[650px] h-64 relative bg-[#cbd5e1]/60 rounded-xl flex items-end pt-8 pb-8 px-12 border-b border-l border-slate-400">
                    
                    {/* Y Axis Labels (0, 2, 4, 6, 8) */}
                    <div className="absolute left-3 top-8 bottom-8 flex flex-col justify-between text-[10px] font-bold text-slate-600">
                        <span>8</span>
                        <span>6</span>
                        <span>4</span>
                        <span>2</span>
                        <span>0</span>
                    </div>

                    {/* Bars Container */}
                    <div className="w-full h-full flex items-end justify-center px-8 relative">
                        {campsData.map((item, idx) => {
                            const heightPct = Math.min((item.count / maxY) * 100, 100);
                            const isHovered = hoveredIdx === idx;

                            return (
                                <div
                                    key={idx}
                                    className="w-full max-w-[480px] flex flex-col items-center h-full justify-end relative group cursor-pointer"
                                    onMouseEnter={() => setHoveredIdx(idx)}
                                    onMouseLeave={() => setHoveredIdx(null)}
                                >
                                    {/* Tooltip Box matching Screenshot 8 EXACTLY */}
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            className="absolute -top-14 bg-white border border-slate-200 rounded-lg shadow-xl px-5 py-2.5 text-center z-30 pointer-events-none"
                                        >
                                            <div className="font-bold text-slate-900 text-xs">
                                                {item.year}
                                            </div>
                                            <div className="font-semibold text-amber-600 text-xs mt-0.5">
                                                count : {item.count}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Solid Vibrant Orange Bar matching Screenshot 8 */}
                                    <motion.div
                                        initial={{ height: "0%" }}
                                        whileInView={{ height: `${heightPct}%` }}
                                        viewport={{ once: true }}
                                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                        className="w-full rounded-t-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-md relative overflow-hidden transition-all duration-200"
                                        style={{
                                            boxShadow: isHovered ? "0 8px 24px rgba(245, 158, 11, 0.45)" : "0 4px 12px rgba(245, 158, 11, 0.2)"
                                        }}
                                    >
                                        {/* Vibrant shimmer animation sweep */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                                    </motion.div>

                                    {/* X-axis Label (2026) */}
                                    <div className="absolute -bottom-7 text-[11px] font-bold text-slate-700 select-none">
                                        {item.year}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Pagination dots indicator at bottom */}
            <div className="flex justify-center gap-1.5 mt-4">
                {[...Array(6)].map((_, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-slate-400" : "bg-slate-200"}`} />
                ))}
            </div>
        </motion.div>
    );
}
