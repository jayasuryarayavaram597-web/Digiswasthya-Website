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
    value: number;
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
    color: string;
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
            en: "Live aggregate figures from the DigiSwasthya Management Portal. Explore our healthcare reach, teleconsultations, and demographic distribution.",
            hi: "डिजीस्वास्थ्य प्रबंधन पोर्टल से लाइव कुल आंकड़े। हमारी स्वास्थ्य पहुंच, टेलीमेडिसिन परामर्श और जनसांख्यिकीय वितरण का अन्वेषण करें।"
        }
    },

    // ─── TOP 5 KPI CARDS (Matching Management Portal Header) ─────────────────────
    kpis: [
        {
            id: "patients-served",
            value: 42950,
            label: { en: "Patients Served", hi: "मरीजों की सेवा की" },
            icon: "Users",
            description: {
                en: "Total patients registered across all telemedicine centres.",
                hi: "सभी टेलीमेडिसिन केंद्रों में पंजीकृत कुल मरीज।"
            }
        },
        {
            id: "total-consultations",
            value: 58894,
            label: { en: "Teleconsultations", hi: "टेली-परामर्श" },
            icon: "Stethoscope",
            description: {
                en: "Completed consultations with specialist doctors.",
                hi: "विशेषज्ञ डॉक्टरों के साथ पूरे किए गए परामर्श।"
            }
        },
        {
            id: "health-camps",
            value: 5,
            label: { en: "Health Camps", hi: "स्वास्थ्य शिविर" },
            icon: "Tent",
            description: {
                en: "On-ground medical camps conducted for rural communities.",
                hi: "ग्रामीण समुदायों के लिए आयोजित जमीनी चिकित्सा शिविर।"
            }
        },
        {
            id: "expert-doctors",
            value: 125,
            label: { en: "Doctors", hi: "डॉक्टर" },
            icon: "UserPlus",
            description: {
                en: "Empanelled doctors and healthcare specialists.",
                hi: "पैनल में शामिल डॉक्टर और स्वास्थ्य विशेषज्ञ।"
            }
        },
        {
            id: "partner-hospitals",
            value: 0,
            label: { en: "Partner Hospitals", hi: "भागीदार अस्पताल" },
            icon: "Building2",
            description: {
                en: "Empanelled tertiary care hospitals.",
                hi: "सूचीबद्ध तृतीयक देखरेख अस्पताल।"
            }
        }
    ],

    // ─── GROWTH TRENDS ──────────────────────────────────────────────────────────
    growthTrends: [
        { year: "2020", patients: 120, camps: 0, doctors: 10 },
        { year: "2024", patients: 450, camps: 1, doctors: 40 },
        { year: "2025", patients: 19836, camps: 3, doctors: 90 },
        { year: "2026", patients: 28000, camps: 5, doctors: 125 }
    ],

    teleconsultationGrowth: [
        { year: "2020", consultations: 150 },
        { year: "2024", consultations: 600 },
        { year: "2025", consultations: 21000 },
        { year: "2026", consultations: 38000 }
    ],

    // ─── TOP DISEASES (Horizontal Bar Chart) ────────────────────────────────────
    diseaseDistribution: [
        { name: { en: "UrTI (Upper Respiratory Tract Infection)", hi: "ऊपरी श्वसन पथ संक्रमण" }, value: 2650, color: "#8b5cf6" },
        { name: { en: "Eczema",                                  hi: "एक्जिमा" },               value: 2380, color: "#8b5cf6" },
        { name: { en: "Xerosis",                                 hi: "जेरोसिस (सूखी त्वचा)" },   value: 795,  color: "#8b5cf6" },
        { name: { en: "LRTI (Lower Respiratory Tract Infection)", hi: "निचले श्वसन पथ का संक्रमण" }, value: 760,  color: "#8b5cf6" },
        { name: { en: "Upper Respiratory Infection",            hi: "ऊपरी श्वसन संक्रमण" },    value: 620,  color: "#8b5cf6" },
        { name: { en: "T2DM (Type 2 Diabetes Mellitus)",         hi: "टाइप 2 मधुमेह" },         value: 580,  color: "#8b5cf6" },
        { name: { en: "Age-Related Degeneration",                hi: "उम्र संबंधी स्थिति" },     value: 510,  color: "#8b5cf6" },
        { name: { en: "Knee Pain / Osteoarthritis",              hi: "घुटने का दर्द" },         value: 480,  color: "#8b5cf6" }
    ],

    // ─── CONSULTATION BY DEPARTMENT ─────────────────────────────────────────────
    consultationByDepartment: [
        { department: { en: "General Medicine",  hi: "सामान्य चिकित्सा" }, count: 16120, color: "#2563eb" },
        { department: { en: "Dermatologist",     hi: "त्वचा रोग" },        count: 10180, color: "#2563eb" },
        { department: { en: "Pediatrician",       hi: "बाल रोग" },         count: 3680,  color: "#2563eb" },
        { department: { en: "Gynaecologist",     hi: "स्त्री रोग" },       count: 3450,  color: "#2563eb" },
        { department: { en: "Orthopaedics",      hi: "हड्डी रोग" },        count: 3250,  color: "#2563eb" },
        { department: { en: "General Physician", hi: "सामान्य चिकित्सक" }, count: 3100,  color: "#2563eb" },
        { department: { en: "Paediatrician",     hi: "बाल चिकित्सा" },     count: 2850,  color: "#2563eb" },
        { department: { en: "ENT",               hi: "कान, नाक, गला" },    count: 2100,  color: "#2563eb" },
        { department: { en: "Homoeopathic",      hi: "होम्योपैथिक" },      count: 520,   color: "#2563eb" },
        { department: { en: "Neurologist",       hi: "न्यूरोलॉजिस्ट" },    count: 480,   color: "#2563eb" },
        { department: { en: "Ophthalmology",     hi: "नेत्र विज्ञान" },     count: 310,   color: "#2563eb" },
        { department: { en: "Cardiology",        hi: "हृदय रोग" },         count: 180,   color: "#2563eb" }
    ],

    // ─── DOCTORS BY SPECIALTY (Horizontal Bar Chart) ────────────────────────────
    doctorsBySpecialty: [
        { specialty: { en: "Dentist",              hi: "दंत चिकित्सक" },   count: 21, color: "#059669" },
        { specialty: { en: "Paediatrician",        hi: "बाल रोग" },        count: 8,  color: "#059669" },
        { specialty: { en: "Ophthalmologist",     hi: "नेत्र रोग" },       count: 6,  color: "#059669" },
        { specialty: { en: "Gynecologist",        hi: "स्त्री रोग" },      count: 5,  color: "#059669" },
        { specialty: { en: "Pulmonologist",       hi: "फेफड़े का रोग" },  count: 2,  color: "#059669" },
        { specialty: { en: "Clinical Dietitian",  hi: "आहार विशेषज्ञ" },  count: 1,  color: "#059669" },
        { specialty: { en: "Family Physician",   hi: "पारिवारिक डॉक्टर" }, count: 1,  color: "#059669" },
        { specialty: { en: "General Surgeon",     hi: "सामान्य सर्जन" },    count: 1,  color: "#059669" },
        { specialty: { en: "Gastrointestinal",   hi: "पेट रोग" },         count: 1,  color: "#059669" },
        { specialty: { en: "Homoeopathic",       hi: "होम्योपैथी" },      count: 1,  color: "#059669" },
        { specialty: { en: "Orthopaedics",       hi: "हड्डी रोग" },       count: 1,  color: "#059669" },
        { specialty: { en: "Thoracic Surgeon",   hi: "थॉरेसिक सर्जन" },   count: 1,  color: "#059669" }
    ],

    // ─── AGE DISTRIBUTION (7 Bands Multi-Color) ────────────────────────────────
    ageDistribution: [
        { ageGroup: "0-5",          count: 3100,  color: "#2563eb" },
        { ageGroup: "6-12",         count: 4680,  color: "#059669" },
        { ageGroup: "13-18",        count: 3620,  color: "#d97706" },
        { ageGroup: "19-35",        count: 9350,  color: "#8b5cf6" },
        { ageGroup: "36-60",        count: 14320, color: "#ef4444" },
        { ageGroup: "60+",          count: 7840,  color: "#0891b2" },
        { ageGroup: "Not recorded", count: 40,    color: "#ec4899" }
    ],

    // ─── GENDER DISTRIBUTION ────────────────────────────────────────────────────
    genderDistribution: [
        { gender: { en: "Female", hi: "महिला" }, count: 24050, percentage: 56, color: "#ec4899" },
        { gender: { en: "Male",   hi: "पुरुष" },  count: 18450, percentage: 43, color: "#2563eb" },
        { gender: { en: "Other",  hi: "अन्य" },  count: 450,   percentage: 1,  color: "#8b5cf6" }
    ],

    // ─── NEW VS FOLLOW-UP ───────────────────────────────────────────────────────
    patientTypeDistribution: [
        { type: { en: "Follow-up",      hi: "अनुवर्ती" },      count: 2100,  percentage: 5,  color: "#059669" },
        { type: { en: "New",            hi: "नए मरीज" },      count: 11200, percentage: 26, color: "#2563eb" },
        { type: { en: "Not categorised",hi: "अवर्गीकृत" },    count: 29650, percentage: 69, color: "#d97706" }
    ],

    // ─── DISTRICTS COVERED (84 Districts · 633 Villages) ────────────────────────
    regionalReach: [
        { district: { en: "Basti",           hi: "बस्ती" },           count: 8 },
        { district: { en: "Chandauli",       hi: "चंदौली" },          count: 8 },
        { district: { en: "Giridih",         hi: "गिरिडीह" },         count: 5 },
        { district: { en: "Jalgaon",         hi: "जलगांव" },          count: 5 },
        { district: { en: "Ludhiana",        hi: "लुधियाना" },        count: 5 },
        { district: { en: "Bengaluru Urban", hi: "बेंगलुरु अर्बन" },   count: 4 },
        { district: { en: "Patna",           hi: "पटना" },            count: 4 },
        { district: { en: "Rae Bareli",      hi: "रायबरेली" },        count: 4 },
        { district: { en: "Sant Kabir Nagar",hi: "संत कबीर नगर" },    count: 24850 },
        { district: { en: "Nagpur",          hi: "नागपुर" },          count: 8400 },
        { district: { en: "Muzaffarpur",     hi: "मुजफ्फरपुर" },      count: 5600 },
        { district: { en: "Pune",            hi: "पुणे" },             count: 3200 },
        { district: { en: "Lucknow",         hi: "लखनऊ" },            count: 480 }
    ],

    // ─── TIMELINE (UNTOUCHED) ───────────────────────────────────────────────────
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
