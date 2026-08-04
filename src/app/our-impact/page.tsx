"use client";

import { Navbar }                         from "@/components/layout/Navbar";
import { Footer }                         from "@/components/layout/Footer";
import { ImpactHero }                     from "@/components/impact/ImpactHero";
import { ImpactFilterBar }                from "@/components/impact/ImpactFilterBar";
import { PortalKPICards }                 from "@/components/impact/PortalKPICards";
import { PortalSmoothLineChart }          from "@/components/impact/PortalSmoothLineChart";
import { PortalDepartmentBarChart }       from "@/components/impact/PortalDepartmentBarChart";
import { PortalTopDiseasesChart }         from "@/components/impact/PortalTopDiseasesChart";
import { PortalAgeDistributionChart }     from "@/components/impact/PortalAgeDistributionChart";
import { PortalDonutPair }                from "@/components/impact/PortalDonutPair";
import { PortalHealthCampsBarChart }      from "@/components/impact/PortalHealthCampsBarChart";
import { PortalDoctorsSpecialtyChart }    from "@/components/impact/PortalDoctorsSpecialtyChart";
import { DistrictsList }                  from "@/components/impact/DistrictsList";
import { ImpactTimeline }                 from "@/components/impact/ImpactTimeline";
import { InteractiveReachMap }            from "@/components/impact/InteractiveReachMap";
import { useImpactData }                  from "@/hooks/useImpactData";

export default function OurImpact() {
    const { data, refetch } = useImpactData();

    const handleApplyFilters = (filters: any) => {
        console.log("Filters applied:", filters);
        refetch();
    };

    // Data mappings matching portal screenshots exact figures
    const kpiData = {
        patientsServed: 42950,
        teleconsultations: 58894,
        healthCamps: 5,
        doctors: 125,
        partnerHospitals: 0
    };

    const patientGrowthData = [
        { year: "2020", value: 120 },
        { year: "2024", value: 450 },
        { year: "2025", value: 19836 },
        { year: "2026", value: 28000 }
    ];

    const teleconsultationGrowthData = [
        { year: "2020", value: 150 },
        { year: "2024", value: 600 },
        { year: "2025", value: 21000 },
        { year: "2026", value: 38000 }
    ];

    const healthCampsGrowthData = [
        { year: "2026", value: 5 }
    ];

    const departmentData = [
        { department: "General Medicine", count: 16120 },
        { department: "Dermatologist", count: 10180 },
        { department: "Pediatrician", count: 3680 },
        { department: "Gynaecologist", count: 3450 },
        { department: "Orthopaedics", count: 3250 },
        { department: "General Physician", count: 3100 },
        { department: "Paediatrician", count: 2850 },
        { department: "ENT", count: 2100 },
        { department: "Homoeopathic", count: 520 },
        { department: "Neurologist", count: 480 },
        { department: "Ophthalmology", count: 310 },
        { department: "Cardiology", count: 180 }
    ];

    const diseaseData = [
        { disease: "UrTI", count: 2650 },
        { disease: "Eczema", count: 2380 },
        { disease: "Xerosis", count: 795 },
        { disease: "Lrti", count: 760 },
        { disease: "Upper Respiratory Tract Inf", count: 620 },
        { disease: "T2Dm", count: 580 },
        { disease: "Age", count: 510 },
        { disease: "Knee Pain", count: 480 }
    ];

    const ageDistributionData = [
        { range: "0-5",          count: 3100,  color: "#2563eb", gradient: "linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)", shadowColor: "rgba(37,99,235,0.3)" },
        { range: "6-12",         count: 4680,  color: "#059669", gradient: "linear-gradient(180deg, #34d399 0%, #059669 100%)", shadowColor: "rgba(5,150,105,0.3)" },
        { range: "13-18",        count: 3620,  color: "#d97706", gradient: "linear-gradient(180deg, #fbbf24 0%, #d97706 100%)", shadowColor: "rgba(217,119,6,0.3)" },
        { range: "19-35",        count: 9350,  color: "#7e22ce", gradient: "linear-gradient(180deg, #c084fc 0%, #7e22ce 100%)", shadowColor: "rgba(126,34,206,0.3)" },
        { range: "36-60",        count: 14320, color: "#e11d48", gradient: "linear-gradient(180deg, #fb7185 0%, #e11d48 100%)", shadowColor: "rgba(225,29,72,0.3)" },
        { range: "60+",          count: 7840,  color: "#0891b2", gradient: "linear-gradient(180deg, #22d3ee 0%, #0891b2 100%)", shadowColor: "rgba(8,145,178,0.3)" },
        { range: "Not recorded", count: 40,    color: "#475569", gradient: "linear-gradient(180deg, #94a3b8 0%, #475569 100%)", shadowColor: "rgba(71,85,105,0.3)" }
    ];

    const genderSlices = [
        { label: "Female", percentage: 56, color: "#e11d48" },
        { label: "Male", percentage: 43, color: "#2563eb" },
        { label: "Other", percentage: 1, color: "#8b5cf6" }
    ];

    const patientTypeSlices = [
        { label: "Follow-up", percentage: 5, color: "#059669" },
        { label: "New", percentage: 26, color: "#2563eb" },
        { label: "Not categorised", percentage: 69, color: "#d97706" }
    ];

    const doctorSpecialtyData = [
        { specialty: "Dentist", count: 21 },
        { specialty: "Paediatrician", count: 8 },
        { specialty: "Ophthalmologist", count: 6 },
        { specialty: "Gynecologist", count: 5 },
        { specialty: "Pulmonologist", count: 2 },
        { specialty: "Clinical Dietitian", count: 1 },
        { specialty: "Family Physician", count: 1 },
        { specialty: "General Surgeon", count: 1 },
        { specialty: "Gastrointestinal", count: 1 },
        { specialty: "Homoeopathic", count: 1 },
        { specialty: "Orthopaedics", count: 1 },
        { specialty: "Thoracic Surgeon", count: 1 }
    ];

    return (
        <main className="min-h-screen bg-[#f4f8f6] flex flex-col justify-between font-sans">
            <div>
                <Navbar />

                {/* Hero Section */}
                <ImpactHero />

                <div className="container max-w-7xl mx-auto px-4 pt-6">
                    {/* Top Filter Bar (Image 1) */}
                    <ImpactFilterBar onApplyFilters={handleApplyFilters} />

                    {/* Top 5 KPI Summary Cards (Image 1) */}
                    <PortalKPICards data={kpiData} />

                    {/* Side-by-side Compact Line Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Patient Growth Smooth Line Curve (Image 2) */}
                        <PortalSmoothLineChart
                            title="PATIENT GROWTH"
                            subtitle="Patients registered per period"
                            data={patientGrowthData}
                            lineColor="#2563eb"
                            gradientFrom="#2563eb"
                            maxScale={28000}
                        />

                        {/* Teleconsultation Growth Smooth Line Curve (Image 3) */}
                        <PortalSmoothLineChart
                            title="TELECONSULTATION GROWTH"
                            subtitle="Completed consultations per period"
                            data={teleconsultationGrowthData}
                            lineColor="#059669"
                            gradientFrom="#059669"
                            maxScale={38000}
                        />
                    </div>

                    {/* Consultations by Department Vertical Bar Chart (Image 4) */}
                    <PortalDepartmentBarChart data={departmentData} />

                    {/* Top Diseases Horizontal Bar Chart (Image 5) */}
                    <PortalTopDiseasesChart data={diseaseData} />

                    {/* Age Distribution 7-Color Bar Chart (Image 6) */}
                    <PortalAgeDistributionChart data={ageDistributionData} />

                    {/* Gender Distribution & New vs Follow-up Donut Pair (Image 7) */}
                    <PortalDonutPair genderData={genderSlices} patientTypeData={patientTypeSlices} />

                    {/* Health Camps Growth Chart (Image 8 - Golden Amber Bar Chart) */}
                    <PortalHealthCampsBarChart />

                    {/* Doctors by Specialty Emerald Horizontal Bar Chart (Image 9) */}
                    <PortalDoctorsSpecialtyChart data={doctorSpecialtyData} />

                    {/* Districts Covered List (Image 10) */}
                    <DistrictsList data={data.regionalReach} totalDistricts={84} totalVillages={633} />
                </div>

                {/* Geographic Map (UNTOUCHED) */}
                <InteractiveReachMap />

                {/* Journey Timeline (UNTOUCHED) */}
                <ImpactTimeline />
            </div>

            <Footer />
        </main>
    );
}
