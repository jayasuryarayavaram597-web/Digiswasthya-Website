export interface LocalizedString {
    en: string;
    hi: string;
}

export interface KPICardData {
    id: string;
    value: number;
    suffix?: string;
    label: LocalizedString;
    icon: string;
    description: LocalizedString;
}

export interface GrowthChartPoint {
    year: string;
    patients: number;
    camps: number;
    doctors: number;
}

export interface TeleconsultationGrowthPoint {
    year: string;
    consultations: number;
}

export interface DiseaseDistributionItem {
    name: LocalizedString;
    value: number; // percentage (e.g. 35)
    color: string;
}

export interface RegionalReachItem {
    district: LocalizedString;
    count: number;
}

export interface MilestoneItem {
    year: string;
    title: LocalizedString;
    description: LocalizedString;
    icon: string;
}

export interface ConsultationByDeptItem {
    department: LocalizedString;
    count: number;
    color: string;
}

export interface DoctorsBySpecialtyItem {
    specialty: LocalizedString;
    count: number;
    color: string;
}

export interface AgeDistributionItem {
    ageGroup: string;
    count: number;
}

export interface GenderItem {
    gender: LocalizedString;
    count: number;
    percentage: number;
    color: string;
}

export interface PatientTypeItem {
    type: LocalizedString;
    count: number;
    percentage: number;
    color: string;
}

export interface ImpactPageData {
    hero: {
        badge: LocalizedString;
        title: LocalizedString;
        subtitle: LocalizedString;
    };
    kpis: KPICardData[];
    growthTrends: GrowthChartPoint[];
    teleconsultationGrowth: TeleconsultationGrowthPoint[];
    diseaseDistribution: DiseaseDistributionItem[];
    regionalReach: RegionalReachItem[];
    timeline: MilestoneItem[];
    consultationByDepartment: ConsultationByDeptItem[];
    doctorsBySpecialty: DoctorsBySpecialtyItem[];
    ageDistribution: AgeDistributionItem[];
    genderDistribution: GenderItem[];
    patientTypeDistribution: PatientTypeItem[];
}

/**
 * DigiSwasthya Impact Report Data
 *
 * NOTE FOR PRODUCTION:
 * All values below are DUMMY/PLACEHOLDER data.
 * Once Supabase credentials are obtained from DigiSwasthya, connect directly
 * to Supabase (Option B — Direct Supabase → Website) and replace these values
 * with live aggregate queries. Do NOT store sensitive patient records here —
 * only totals, counts, and year-wise summaries.
 */
export const impactData: ImpactPageData = {
    hero: {
        badge: {
            en: "Transparent Social Impact",
            hi: "पारदर्शी सामाजिक प्रभाव"
        },
        title: {
            en: "Our Measurable Healthcare Impact",
            hi: "हमारा मापने योग्य स्वास्थ्य प्रभाव"
        },
        subtitle: {
            en: "We believe in transparency and data-driven storytelling. Explore DigiSwasthya's scale of operations, growth trends, and geographical footprint in rural India.",
            hi: "हम पारदर्शिता और डेटा-आधारित कहानी कहने में विश्वास करते हैं। ग्रामीण भारत में डिजीस्वास्थ्य के संचालन के पैमाने, विकास के रुझान और भौगोलिक पहुंच का अन्वेषण करें।"
        }
    },

    // ─── KPI CARDS ──────────────────────────────────────────────────────────────
    kpis: [
        {
            id: "patients-served",
            value: 150000,
            suffix: "+",
            label: { en: "Patients Served", hi: "मरीजों की सेवा की" },
            icon: "Users",
            description: {
                en: "Total individuals registered and treated across our telemedicine network.",
                hi: "हमारे टेलीमेडिसिन नेटवर्क के माध्यम से पंजीकृत और इलाज किए गए कुल व्यक्ति।"
            }
        },
        {
            id: "total-consultations",
            value: 97104,
            label: { en: "Total Consultations", hi: "कुल परामर्श" },
            icon: "Stethoscope",
            description: {
                en: "Medical consultations successfully facilitated with specialist doctors.",
                hi: "विशेषज्ञ डॉक्टरों के साथ सफलतापूर्वक प्रदान किए गए चिकित्सा परामर्श।"
            }
        },
        {
            id: "health-camps",
            value: 2146,
            label: { en: "Health & Awareness Camps", hi: "स्वास्थ्य एवं जागरूकता शिविर" },
            icon: "Activity",
            description: {
                en: "Community drives conducted to raise hygiene, wellness, and preventive care awareness.",
                hi: "स्वच्छता, कल्याण और निवारक देखभाल जागरूकता बढ़ाने के लिए आयोजित सामुदायिक अभियान।"
            }
        },
        {
            id: "expert-doctors",
            value: 213,
            label: { en: "Expert Doctors Onboard", hi: "विशेषज्ञ डॉक्टर संबद्ध" },
            icon: "HeartHandshake",
            description: {
                en: "Qualified physicians and specialists volunteering or working on our panel.",
                hi: "हमारे पैनल में स्वेच्छा से या काम कर रहे योग्य चिकित्सक और विशेषज्ञ।"
            }
        },
        {
            id: "chc-phc-camps",
            value: 133,
            label: { en: "CHC / PHC Health Camps", hi: "सीएचसी/पीएचसी स्वास्थ्य शिविर" },
            icon: "Building",
            description: {
                en: "Collaborative health clinics held at Government Community and Primary Health Centers.",
                hi: "सरकारी सामुदायिक और प्राथमिक स्वास्थ्य केंद्रों पर आयोजित सहयोगी स्वास्थ्य क्लीनिक।"
            }
        },
        {
            id: "lives-impacted",
            value: 2850000,
            suffix: "+",
            label: { en: "Lives Impacted", hi: "प्रभावित जीवन" },
            icon: "TrendingUp",
            description: {
                en: "Indirect impact through awareness drives, family support, and community outreach.",
                hi: "जागरूकता अभियानों, पारिवारिक सहायता और सामुदायिक पहुंच के माध्यम से अप्रत्यक्ष प्रभाव।"
            }
        },
        {
            id: "total-volunteers",
            value: 312,
            label: { en: "Active Volunteers", hi: "सक्रिय स्वयंसेवक" },
            icon: "UserCheck",
            description: {
                en: "Dedicated ground-level volunteers enabling last-mile healthcare delivery across rural regions.",
                hi: "ग्रामीण क्षेत्रों में अंतिम-मील स्वास्थ्य सेवा वितरण को सक्षम करने वाले समर्पित जमीनी स्तर के स्वयंसेवक।"
            }
        },
        {
            id: "partner-hospitals",
            value: 28,
            label: { en: "Partner Hospitals", hi: "भागीदार अस्पताल" },
            icon: "Building2",
            description: {
                en: "Empanelled hospitals and diagnostic centers supporting DigiSwasthya's referral network.",
                hi: "डिजीस्वास्थ्य के रेफरल नेटवर्क का समर्थन करने वाले सूचीबद्ध अस्पताल और निदान केंद्र।"
            }
        }
    ],

    // ─── GROWTH TRENDS ──────────────────────────────────────────────────────────
    growthTrends: [
        { year: "2020", patients: 12450, camps: 230,  doctors: 32  },
        { year: "2021", patients: 28900, camps: 580,  doctors: 65  },
        { year: "2022", patients: 52400, camps: 980,  doctors: 110 },
        { year: "2023", patients: 78100, camps: 1420, doctors: 155 },
        { year: "2024", patients: 98450, camps: 1850, doctors: 190 },
        { year: "2025", patients: 150000, camps: 2146, doctors: 213 }
    ],

    teleconsultationGrowth: [
        { year: "2020", consultations: 5800  },
        { year: "2021", consultations: 14200 },
        { year: "2022", consultations: 32500 },
        { year: "2023", consultations: 56800 },
        { year: "2024", consultations: 78200 },
        { year: "2025", consultations: 97104 }
    ],

    // ─── DISEASE DISTRIBUTION ───────────────────────────────────────────────────
    diseaseDistribution: [
        { name: { en: "General Medicine / Primary Ailments", hi: "सामान्य चिकित्सा / प्राथमिक रोग" }, value: 35, color: "#1e7e42" },
        { name: { en: "Cardiovascular / Hypertension",       hi: "हृदय रोग / उच्च रक्तचाप" },         value: 18, color: "#b45309" },
        { name: { en: "Diabetes & Endocrine",               hi: "मधुमेह और अंतःस्रावी" },             value: 15, color: "#0f3a1f" },
        { name: { en: "Pediatrics & Child Health",           hi: "बाल रोग और बाल स्वास्थ्य" },        value: 12, color: "#fbbf24" },
        { name: { en: "Ophthalmology / Eye Care",            hi: "नेत्र रोग / आंखों की देखभाल" },     value: 10, color: "#3d9b5e" },
        { name: { en: "Other Specialties",                   hi: "अन्य विशिष्टताएं" },                value: 10, color: "#9ca3af" }
    ],

    // ─── REGIONAL REACH ─────────────────────────────────────────────────────────
    regionalReach: [
        { district: { en: "Sant Kabir Nagar", hi: "संत कबीर नगर" }, count: 42000 },
        { district: { en: "Nagpur",           hi: "नागपुर" },        count: 28000 },
        { district: { en: "Muzaffarpur",      hi: "मुजफ्फरपुर" },   count: 21000 },
        { district: { en: "Pune",             hi: "पुणे" },          count: 14000 },
        { district: { en: "Lucknow",          hi: "लखनऊ" },         count: 8500  },
        { district: { en: "Other Regions",    hi: "अन्य क्षेत्र" }, count: 4144  }
    ],

    // ─── CONSULTATION BY DEPARTMENT ─────────────────────────────────────────────
    consultationByDepartment: [
        { department: { en: "General Medicine",       hi: "सामान्य चिकित्सा" },       count: 38420, color: "#1e7e42" },
        { department: { en: "Pediatrics",             hi: "बाल रोग" },                count: 18200, color: "#d97706" },
        { department: { en: "Cardiology",             hi: "हृदय रोग" },               count: 12800, color: "#0f3a1f" },
        { department: { en: "Ophthalmology",          hi: "नेत्र रोग" },              count: 9600,  color: "#3d9b5e" },
        { department: { en: "Gynecology & Obstetrics",hi: "स्त्री रोग एवं प्रसूति" },count: 8900,  color: "#b45309" },
        { department: { en: "Orthopedics",            hi: "हड्डी रोग" },              count: 6200,  color: "#6cb885" },
        { department: { en: "ENT",                    hi: "कान, नाक और गला" },        count: 2984,  color: "#fbbf24" }
    ],

    // ─── DOCTORS BY SPECIALTY ───────────────────────────────────────────────────
    doctorsBySpecialty: [
        { specialty: { en: "General Physicians",  hi: "सामान्य चिकित्सक" },          count: 88, color: "#1e7e42" },
        { specialty: { en: "Pediatricians",       hi: "बाल रोग विशेषज्ञ" },          count: 32, color: "#d97706" },
        { specialty: { en: "Cardiologists",       hi: "हृदय रोग विशेषज्ञ" },         count: 28, color: "#0f3a1f" },
        { specialty: { en: "Ophthalmologists",    hi: "नेत्र रोग विशेषज्ञ" },        count: 24, color: "#3d9b5e" },
        { specialty: { en: "Gynecologists",       hi: "स्त्री रोग विशेषज्ञ" },       count: 20, color: "#b45309" },
        { specialty: { en: "Orthopedic Surgeons", hi: "अस्थि शल्य चिकित्सक" },      count: 14, color: "#6cb885" },
        { specialty: { en: "ENT Specialists",     hi: "कान, नाक, गला विशेषज्ञ" },   count: 7,  color: "#fbbf24" }
    ],

    // ─── AGE DISTRIBUTION ───────────────────────────────────────────────────────
    ageDistribution: [
        { ageGroup: "0 – 14 yrs",  count: 22400 },
        { ageGroup: "15 – 24 yrs", count: 14800 },
        { ageGroup: "25 – 44 yrs", count: 42600 },
        { ageGroup: "45 – 64 yrs", count: 49200 },
        { ageGroup: "65+ yrs",     count: 21000 }
    ],

    // ─── GENDER DISTRIBUTION ────────────────────────────────────────────────────
    genderDistribution: [
        { gender: { en: "Male",   hi: "पुरुष" },  count: 79800, percentage: 53, color: "#1e7e42" },
        { gender: { en: "Female", hi: "महिला" }, count: 68400, percentage: 46, color: "#d97706" },
        { gender: { en: "Other",  hi: "अन्य" },  count: 1800,  percentage: 1,  color: "#9ca3af" }
    ],

    // ─── NEW VS FOLLOW-UP PATIENTS ──────────────────────────────────────────────
    patientTypeDistribution: [
        { type: { en: "New Patients",      hi: "नए मरीज" },      count: 96500, percentage: 64, color: "#1e7e42" },
        { type: { en: "Follow-up Patients",hi: "अनुवर्ती मरीज" },count: 53500, percentage: 36, color: "#d97706" }
    ],

    // ─── TIMELINE ───────────────────────────────────────────────────────────────
    timeline: [
        {
            year: "2020",
            title: { en: "Organisation Founded", hi: "संगठन की स्थापना" },
            description: {
                en: "DigiSwasthya Foundation was registered as an NGO, with the core mission of bridging the rural healthcare gap using technology.",
                hi: "डिजीस्वास्थ्य फाउंडेशन को एक गैर सरकारी संगठन (NGO) के रूप में पंजीकृत किया गया, जिसका मुख्य उद्देश्य प्रौद्योगिकी का उपयोग करके ग्रामीण स्वास्थ्य सेवा के अंतर को पाटना था।"
            },
            icon: "Building"
        },
        {
            year: "2021",
            title: { en: "First Community Health Camp", hi: "पहला सामुदायिक स्वास्थ्य शिविर" },
            description: {
                en: "Conducted our first physical health and awareness camp in a remote village, validating the on-the-ground needs of rural patients.",
                hi: "एक सुदूर गाँव में अपना पहला भौतिक स्वास्थ्य और जागरूकता शिविर आयोजित किया, जिससे ग्रामीण रोगियों की जमीनी जरूरतों की पुष्टि हुई।"
            },
            icon: "Activity"
        },
        {
            year: "2022",
            title: { en: "Expansion to Multiple Districts", hi: "कई जिलों में विस्तार" },
            description: {
                en: "Scaled outreach to cover villages in multiple adjoining districts, establishing a reliable volunteer network.",
                hi: "एक विश्वसनीय स्वयंसेवक नेटवर्क स्थापित करते हुए, कई निकटवर्ती जिलों के गांवों को कवर करने के लिए पहुंच का विस्तार किया।"
            },
            icon: "Users"
        },
        {
            year: "2023",
            title: { en: "Telemedicine Programme Launch", hi: "टेलीमेडिसिन कार्यक्रम का शुभारंभ" },
            description: {
                en: "Inaugurated dedicated digital teleconsultation nodes linking rural centres with specialist doctors in Tier 1 cities.",
                hi: "टियर 1 शहरों में विशेषज्ञ डॉक्टरों के साथ ग्रामीण केंद्रों को जोड़ने वाले समर्पित डिजिटल टेली-परामर्श नोड्स का उद्घाटन किया।"
            },
            icon: "Stethoscope"
        },
        {
            year: "2024",
            title: { en: "National Recognition & Scaled Operations", hi: "राष्ट्रीय मान्यता और उन्नत संचालन" },
            description: {
                en: "Certified as a Great Place to Work, while expanding tele-clinics to new rural districts and serving over 90,000 patients.",
                hi: "महान कार्यस्थल (Great Place to Work) के रूप में प्रमाणित, जबकि नए ग्रामीण जिलों में टेली-क्लीनिक का विस्तार किया और 90,000 से अधिक रोगियों की सेवा की।"
            },
            icon: "Award"
        },
        {
            year: "2025",
            title: { en: "100,000+ Patients Served", hi: "1,00,000+ मरीजों की सेवा" },
            description: {
                en: "Reached a major milestone of directly treating over 100,000 individuals through telemedicine consultations and regional checkup camps.",
                hi: "टेलीमेडिसिन परामर्श और क्षेत्रीय जांच शिविरों के माध्यम से सीधे 1,00,000 से अधिक व्यक्तियों का इलाज करने का एक बड़ा मील का पत्थर हासिल किया।"
            },
            icon: "HeartHandshake"
        },
        {
            year: "2030",
            title: { en: "Future Vision 2030", hi: "भविष्य की दृष्टि 2030" },
            description: {
                en: "Targeting complete saturation of digital tele-clinics in every rural block of Uttar Pradesh, extending services to over 5 million people.",
                hi: "उत्तर प्रदेश के प्रत्येक ग्रामीण ब्लॉक में डिजिटल टेली-क्लीनिक की पूर्ण संतृप्ति का लक्ष्य, जिससे 50 लाख से अधिक लोगों को सेवाएं दी जा सकें।"
            },
            icon: "TrendingUp"
        }
    ]
};
