import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

async function testFetch() {
    console.log("Testing fetch from impactStats/summary...");
    try {
        const ref = doc(db, "impactStats", "summary");
        const snap = await getDoc(ref);
        if (snap.exists()) {
            console.log("SUCCESS! Firestore data found:", snap.data());
        } else {
            console.log("DOCUMENT DOES NOT EXIST in impactStats/summary!");
        }
    } catch (e) {
        console.error("FIRESTORE FETCH FAILED:", e);
    }
}

testFetch();
