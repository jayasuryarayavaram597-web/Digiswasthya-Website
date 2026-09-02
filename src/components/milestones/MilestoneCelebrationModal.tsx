"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Milestone } from "@/types/milestone";
import { ConfettiCanvas } from "./ConfettiCanvas";
import { useLanguage } from "@/context/LanguageContext";

interface MilestoneCelebrationModalProps {
    milestone: Milestone;
    isOpen: boolean;
    onClose: () => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
    milestone,
    isOpen,
    onClose
}) => {
    const { language } = useLanguage();
    const isHindi = language === "hi";

    // Internal state for guaranteed slow, smooth closing animation
    const [isRendered, setIsRendered] = useState(false);
    const [isAnimatedIn, setIsAnimatedIn] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            setIsClosing(false);
            // Trigger entrance animation
            const timer = setTimeout(() => {
                setIsAnimatedIn(true);
            }, 30);
            return () => clearTimeout(timer);
        } else {
            setIsAnimatedIn(false);
            setIsRendered(false);
            setIsClosing(false);
        }
    }, [isOpen]);

    // Handle Esc key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isClosing) {
                handleTriggerClose();
            }
        };

        if (isRendered) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isRendered, isClosing]);

    // Smooth, cinematic slow close handler (900ms)
    const handleTriggerClose = () => {
        if (isClosing) return;
        setIsClosing(true);
        setIsAnimatedIn(false);

        // Allow full 900ms for the smooth slow exit animation to play completely
        setTimeout(() => {
            setIsRendered(false);
            setIsClosing(false);
            onClose();
        }, 900);
    };

    if (!isRendered) return null;

    const headlineText = isHindi ? milestone.headline.hi : milestone.headline.en;
    const descText = isHindi ? milestone.description.hi : milestone.description.en;
    const badgeText = isHindi ? milestone.badge.hi : milestone.badge.en;

    return (
        <div
            className={`fixed inset-0 z-[99990] flex items-center justify-center p-3 sm:p-4 overflow-y-auto transition-opacity duration-[900ms] ease-in-out ${
                isAnimatedIn && !isClosing ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
            {/* Backdrop with Slow, Soft Fade-out (900ms) */}
            <div
                onClick={handleTriggerClose}
                className={`fixed inset-0 bg-slate-950/70 transition-all duration-[900ms] ease-in-out cursor-pointer ${
                    isAnimatedIn && !isClosing
                        ? "opacity-100 backdrop-blur-sm"
                        : "opacity-0 backdrop-blur-none"
                }`}
            />

            {/* Confetti Animation */}
            {isAnimatedIn && !isClosing && <ConfettiCanvas durationMs={4500} />}

            {/* Modal Container: Slow, graceful scale & glide down animation (900ms) */}
            <div
                className={`relative w-full max-w-[440px] bg-white rounded-3xl shadow-2xl overflow-hidden z-[99999] border border-slate-100 my-auto max-h-[92vh] flex flex-col pointer-events-auto transform transition-all duration-[900ms] ${
                    isAnimatedIn && !isClosing
                        ? "opacity-100 scale-100 translate-y-0 filter-none"
                        : "opacity-0 scale-85 translate-y-8 blur-[2px]"
                }`}
                style={{
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
                }}
            >
                {/* Close Button (Top Right) */}
                <button
                    onClick={handleTriggerClose}
                    aria-label="Close celebration popup"
                    className="absolute top-2.5 right-2.5 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md transition-all duration-300 shadow-md group cursor-pointer active:scale-90"
                >
                    <svg
                        className={`w-3.5 h-3.5 transition-transform duration-700 ${
                            isClosing ? "rotate-180 scale-75" : "group-hover:rotate-90"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Banner Image: Exact 16:9 Aspect Ratio with category-aware framing */}
                <div className="relative w-full aspect-[16/9] bg-slate-900 shrink-0">
                    <Image
                        src={milestone.image}
                        alt={headlineText}
                        fill
                        priority
                        className={`object-cover ${
                            milestone.category === "women_health"
                                ? "object-[18%_25%]"
                                : "object-center"
                        }`}
                        sizes="(max-width: 640px) 100vw, 440px"
                    />
                </div>

                {/* Modal Body Content */}
                <div className="p-4 sm:p-5 text-center flex flex-col items-center">
                    {/* Pill Badge */}
                    <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200/80 text-[11px] font-bold uppercase tracking-wider mb-2.5 shadow-xs">
                        <span>{badgeText}</span>
                    </div>

                    {/* Bold Headline */}
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug mb-2">
                        {headlineText}
                    </h2>

                    {/* Gratitude & Emotional Text */}
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 font-normal max-w-sm">
                        {descText}
                    </p>

                    {/* Thin Divider Line */}
                    <div className="w-full h-px bg-slate-100 mb-4" />

                    {/* Single Full-Width Action CTA Button */}
                    <Link
                        href="/donate"
                        onClick={handleTriggerClose}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-orange-600/25 transition-all duration-200"
                    >
                        <span>{isHindi ? "और जिंदगियों को संवारें" : "Support More Lives"}</span>
                        <span className="text-base font-black transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};
