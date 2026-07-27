import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

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

async function cleanup() {
    console.log("🧹 Deleting 'centres' and 'milestones' from Firebase...");

    // Delete centres
    const centresSnap = await getDocs(collection(db, "centres"));
    for (const d of centresSnap.docs) {
        await deleteDoc(doc(db, "centres", d.id));
        console.log(` Deleted centre: ${d.id}`);
    }

    // Delete milestones
    const milestonesSnap = await getDocs(collection(db, "milestones"));
    for (const d of milestonesSnap.docs) {
        await deleteDoc(doc(db, "milestones", d.id));
        console.log(` Deleted milestone: ${d.id}`);
    }

    console.log("✅ Cleanup complete! Firebase now only contains 'impactStats/summary' (Item #1).");
    process.exit(0);
}

cleanup().catch(err => {
    console.error("Cleanup error:", err);
    process.exit(1);
});
