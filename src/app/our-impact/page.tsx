"use client";

import { Navbar }              from "@/components/layout/Navbar";
import { Footer }              from "@/components/layout/Footer";
import { ImpactHero }          from "@/components/impact/ImpactHero";
import { StatsGrid }           from "@/components/impact/StatsGrid";
import { GrowthTrends }        from "@/components/impact/GrowthTrends";
import { MedicalBreakdown }    from "@/components/impact/MedicalBreakdown";
import { PatientAnalytics }    from "@/components/impact/PatientAnalytics";
import { ImpactDistribution }  from "@/components/impact/ImpactDistribution";
import { ImpactTimeline }      from "@/components/impact/ImpactTimeline";
import { InteractiveReachMap } from "@/components/impact/InteractiveReachMap";

export default function OurImpact() {
    return (
        <main className="min-h-screen bg-[#f8faf9] flex flex-col justify-between">
            <div>
                <Navbar />

                {/* 1. Hero */}
                <ImpactHero />

                {/* 2. KPI Flip Cards — 8 metrics at a glance */}
                <StatsGrid />

                {/* 3. Growth Trends — 4 line charts (patients, consultations, camps, doctors) */}
                <GrowthTrends />

                {/* 4. Clinical Breakdown — dept consultations + doctor specialties */}
                <MedicalBreakdown />

                {/* 5. Patient Analytics — new/followup, gender, age distribution */}
                <PatientAnalytics />

                {/* 6. Disease distribution + regional reach */}
                <ImpactDistribution />

                {/* 7. Geographic Map */}
                <InteractiveReachMap />

                {/* 8. Journey Timeline */}
                <ImpactTimeline />
            </div>

            <Footer />
        </main>
    );
}
