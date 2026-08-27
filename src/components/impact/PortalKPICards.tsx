"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Users, Activity, Tent, Stethoscope, Building2, Info } from "lucide-react";

interface PortalKPICardsProps {
    data: {
        patientsServed: number;
        teleconsultations: number;
        healthCamps: number;
        doctors: number;
        partnerHospitals?: number;
    };
}

function AnimatedCounter({ value }: { value: number }) {
    const motionVal = useMotionValue(0);
    const springVal = useSpring(motionVal, { damping: 30, stiffness: 70 });
    const [displayVal, setDisplayVal] = useState(0);

    useEffect(() => {
        motionVal.set(value);
    }, [value, motionVal]);

    useEffect(() => {
        return springVal.on("change", (latest) => {
            setDisplayVal(Math.floor(latest));
        });
    }, [springVal]);

    return (
        <span className="tabular-nums">
            {displayVal.toLocaleString("en-IN")}
        </span>
    );
}

export function PortalKPICards({ data }: PortalKPICardsProps) {
    const cards = [
        {
            label: "PATIENTS SERVED",
            value: data.patientsServed,
            icon: Users,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-600",
            borderColor: "border-blue-100",
        },
        {
            label: "TELECONSULTATIONS",
            value: data.teleconsultations,
            icon: Activity,
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-600",
            borderColor: "border-emerald-100",
        },
        {
            label: "HEALTH CAMPS",
            value: data.healthCamps,
            icon: Tent,
            bgColor: "bg-amber-50",
            iconColor: "text-amber-600",
            borderColor: "border-amber-100",
        },
        {
            label: "DOCTORS",
            value: data.doctors,
            icon: Stethoscope,
            bgColor: "bg-purple-50",
            iconColor: "text-purple-600",
            borderColor: "border-purple-100",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, idx) => {
                const IconComponent = card.icon;
                return (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className={`bg-white rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border ${card.borderColor} flex flex-col justify-between h-40 transition-shadow hover:shadow-xl cursor-pointer group`}
                    >
                        <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-2xl ${card.bgColor} ${card.iconColor} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                <IconComponent className="w-6 h-6" />
                            </div>
                            <Info className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                        </div>

                        <div>
                            <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                                <AnimatedCounter value={card.value} />
                            </div>
                            <div className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase mt-1">
                                {card.label}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
