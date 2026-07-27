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

async function check() {
    const snap = await getDoc(doc(db, "impactStats", "summary"));
    if (snap.exists()) {
        console.log("FIREBASE_FIELDS:", JSON.stringify(snap.data(), null, 2));
    } else {
        console.log("Document impactStats/summary does not exist!");
    }
    process.exit(0);
}

check().catch(e => {
    console.error(e);
    process.exit(1);
});
