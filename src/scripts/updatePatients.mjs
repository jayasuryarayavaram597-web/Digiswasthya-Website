import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

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

async function testUpdate() {
    console.log("Updating totalPatients to 150000 in Firebase...");
    try {
        const ref = doc(db, "impactStats", "summary");
        await updateDoc(ref, {
            totalPatients: 150000
        });
        console.log("UPDATE SUCCESSFUL! totalPatients is now 150000");
    } catch (e) {
        console.error("UPDATE FAILED:", e);
    }
}

testUpdate();
