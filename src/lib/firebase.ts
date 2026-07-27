import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBPqP5y524_7sc81Pu1rk-SNV8RfxVQOaM",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "digiswasthya-dc8a2.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "digiswasthya-dc8a2",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "digiswasthya-dc8a2.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "395068135429",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:395068135429:web:79b0800422cbfe838ae46c",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-63JYTEGCYZ",
};

// Prevent re-initialization in Next.js hot reloads
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export default app;

