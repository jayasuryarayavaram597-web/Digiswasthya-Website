"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export function StatsCounter({
    value,
    label,
    suffix = "",
}: {
    value: number;
    label: string;
    suffix?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 50,
        stiffness: 100,
    });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (inView) {
            motionValue.set(value);
        }
    }, [inView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            setDisplayValue(Math.floor(latest));
        });
    }, [springValue]);

    return (
        <div ref={ref} className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md border hover:border-primary-200 transition-colors">
            <span className="text-4xl font-bold text-primary-600 mb-2">
                {displayValue.toLocaleString()}
                {suffix}
            </span>
            <span className="text-sm font-medium text-gray-600 text-center uppercase tracking-wide">
                {label}
            </span>
        </div>
    );
}
