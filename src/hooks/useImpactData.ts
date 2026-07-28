"use client";

import { useState } from "react";
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
    const [data] = useState<ImpactPageData>(impactData);
    const [loading] = useState(false);
    const [lastUpdated] = useState<Date | null>(new Date());

    return { data, loading, lastUpdated };
}
