"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Milestone } from "@/types/milestone";
import { useLanguage } from "@/context/LanguageContext";

interface MilestoneFloatingPillProps {
    milestone: Milestone;
    isOpen: boolean;
    onOpenModal: () => void;
    onDismiss: () => void;
}

export const MilestoneFloatingPill: React.FC<MilestoneFloatingPillProps> = ({
    milestone,
    isOpen,
    onOpenModal,
    onDismiss
}) => {
    const { language } = useLanguage();
    const isHindi = language === "hi";
    const headlineText = isHindi ? milestone.headline.hi : milestone.headline.en;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="milestone-floating-pill"
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                        opacity: 0,
                        y: 35,
                        scale: 0.92,
                        transition: { duration: 0.25, ease: "easeInOut" }
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9990] max-w-md w-[calc(100%-2rem)] sm:w-auto"
                >
                    <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/15 shadow-2xl transition-all duration-200">
                        {/* Animated Sparkle Icon */}
                        <span className="flex h-2.5 w-2.5 relative shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                        </span>

                        {/* Milestone Snippet */}
                        <div className="text-xs font-semibold text-slate-100 truncate max-w-[200px] sm:max-w-[260px]">
                            {headlineText}
                        </div>

                        {/* Action Button to Open Full Modal */}
                        <button
                            onClick={onOpenModal}
                            className="px-3 py-1 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all duration-150 shrink-0 shadow-sm"
                        >
                            {isHindi ? "देखें 🎉" : "Celebrate 🎉"}
                        </button>

                        {/* Dismiss Pill Button */}
                        <button
                            onClick={onDismiss}
                            aria-label="Dismiss milestone pill"
                            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
