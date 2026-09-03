import { initializeApp, cert, getApps, getApp, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App | undefined;
let firestoreDb: Firestore | undefined;

export function getFirebaseAdminDb(): Firestore {
    if (!firestoreDb) {
        if (getApps().length === 0) {
            const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

            if (serviceAccountKey) {
                try {
                    const creds = typeof serviceAccountKey === "string" 
                        ? JSON.parse(serviceAccountKey) 
                        : serviceAccountKey;

                    if (creds.private_key) {
                        creds.private_key = creds.private_key.replace(/\\n/g, "\n");
                    }

                    adminApp = initializeApp({
                        credential: cert(creds),
                    });
                    console.log("[Firebase Admin] Initialized successfully with Service Account.");
                } catch (err) {
                    console.error("[Firebase Admin Error] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", err);
                    adminApp = initializeApp();
                }
            } else {
                console.warn("[Firebase Admin Warning] No FIREBASE_SERVICE_ACCOUNT_KEY found. Falling back to default.");
                adminApp = initializeApp();
            }
        } else {
            adminApp = getApp();
        }

        firestoreDb = getFirestore(adminApp);
    }

    return firestoreDb;
}
