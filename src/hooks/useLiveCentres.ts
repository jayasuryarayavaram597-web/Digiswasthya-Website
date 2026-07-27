"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { LiveCentre } from "@/data/centreData";
export type { LiveCentre };

export function useLiveCentres() {
    const [centres, setCentres] = useState<LiveCentre[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "centres"),
            (snap) => {
                const fetched: LiveCentre[] = snap.docs
                    .map(d => ({ id: d.id, ...d.data() } as LiveCentre))
                    .filter(c => c.isActive !== false); // show all unless explicitly deactivated
                setCentres(fetched);
                setLoading(false);
            },
            (err) => {
                console.error("[useLiveCentres] Firestore error:", err);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    return { centres, loading };
}
