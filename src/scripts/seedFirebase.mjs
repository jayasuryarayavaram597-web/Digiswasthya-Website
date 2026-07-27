/**
 * DigiSwasthya Firebase Seed Script
 * 
 * Populates ONLY impactStats/summary in Firebase.
 * (Centres and Milestones load from local static files per request)
 * 
 * Usage: node src/scripts/seedFirebase.mjs
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBPqP5y524_7sc81Pu1rk-SNV8RfxVQOaM",
    authDomain: "digiswasthya-dc8a2.firebaseapp.com",
    projectId: "digiswasthya-dc8a2",
    storageBucket: "digiswasthya-dc8a2.firebasestorage.app",
    messagingSenderId: "395068135429",
    appId: "1:395068135429:web:79b0800422cbfe838ae46c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const impactSummary = {
    totalPatients:       150000,
    totalConsultations:  97104,
    totalCamps:          2146,
    totalCHCCamps:       133,
    totalDoctors:        213,
    livesImpacted:       2850000,
    totalCentres:        18,

    growthTrends: [
        { year: "2020", patients: 2400,  camps: 12,  doctors: 8  },
        { year: "2021", patients: 8700,  camps: 89,  doctors: 24 },
        { year: "2022", patients: 21300, camps: 312, doctors: 67 },
        { year: "2023", patients: 48600, camps: 734, doctors: 121 },
        { year: "2024", patients: 89200, camps: 1456, doctors: 178 },
        { year: "2025", patients: 150000, camps: 2146, doctors: 213 },
    ],

    diseaseDistribution: [
        { name: { en: "General Medicine",       hi: "सामान्य चिकित्सा"    }, value: 35, color: "#1e7e42" },
        { name: { en: "Maternal & Child Health", hi: "मातृ एवं बाल स्वास्थ्य"}, value: 20, color: "#27ae5f" },
        { name: { en: "Diabetes & Hypertension", hi: "मधुमेह और उच्च रक्तचाप"}, value: 18, color: "#d97706" },
        { name: { en: "Respiratory Disease",    hi: "श्वास रोग"           }, value: 12, color: "#f59e0b" },
        { name: { en: "Skin & Eye",             hi: "त्वचा और नेत्र"      }, value: 9,  color: "#0ea5e9" },
        { name: { en: "Other",                  hi: "अन्य"               }, value: 6,  color: "#94a3b8" },
    ],

    regionalReach: [
        { district: { en: "Nagpur",          hi: "नागपुर"        }, count: 54200 },
        { district: { en: "Sant Kabir Nagar",hi: "संत कबीर नगर" }, count: 28400 },
        { district: { en: "Pune",            hi: "पुणे"          }, count: 18600 },
        { district: { en: "Muzaffarpur",     hi: "मुजफ्फरपुर"   }, count: 9100  },
        { district: { en: "Palghar",         hi: "पालघर"        }, count: 4200  },
        { district: { en: "Nashik",          hi: "नाशिक"        }, count: 2100  },
        { district: { en: "Raigad",          hi: "रायगड"        }, count: 1044  },
    ],
};

async function seed() {
    console.log("\n🌱 DigiSwasthya Firebase Seed (Summary Only)...\n");
    await setDoc(doc(db, "impactStats", "summary"), {
        ...impactSummary,
        updatedAt: new Date().toISOString(),
    });
    console.log("✅ impactStats/summary updated successfully in Firebase.");
    process.exit(0);
}

seed().catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
});
