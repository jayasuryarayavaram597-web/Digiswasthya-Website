"use client";

import { useState, useEffect } from "react";
import { impactData, ImpactPageData } from "@/data/impactData";

/**
 * useImpactData Hook
 *
 * Serves DigiSwasthya's 16 Impact Visualizations.
 *
 * Current Source: Static impactData.ts (updated automatically by Firebase agent pipeline)
 * Future: Will read live values from Firebase Firestore once the agent pipeline is active.
 */
export function useImpactData() {
    const [data, setData] = useState<ImpactPageData>(impactData);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        // Currently using static fallback data.
        // When Firebase agent pipeline is ready, replace this with Firestore fetch.
        setData(impactData);
        setLoading(false);
    }, []);

    return { data, loading, lastUpdated };
}
