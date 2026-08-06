import os
import sys
import json

def sync_to_firebase_firestore(metrics_data: dict) -> bool:
    """
    Syncs the 10 scraped impact metrics directly to Firebase Firestore collection 'impact_store' document 'latest'.
    Supports either FIREBASE_SERVICE_ACCOUNT_KEY env var (JSON string) or application default credentials.
    """
    print("[Firebase Sync] Connecting to Firebase Firestore...")
    
    try:
        import firebase_admin
        from firebase_admin import credentials, firestore

        if not firebase_admin._apps:
            service_account_env = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
            if service_account_env:
                try:
                    cred_dict = json.loads(service_account_env)
                    cred = credentials.Certificate(cred_dict)
                    firebase_admin.initialize_app(cred)
                except Exception as e:
                    print(f"[Firebase Sync Warning] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY: {e}")
                    firebase_admin.initialize_app()
            else:
                # Fallback to local default / environment
                firebase_admin.initialize_app()

        db = firestore.client()
        doc_ref = db.collection("impact_store").document("latest")
        doc_ref.set(metrics_data)
        print("[Firebase Sync SUCCESS] Successfully updated Firebase Firestore document 'impact_store/latest'!")
        return True

    except Exception as e:
        print(f"[Firebase Sync Warning] Could not sync to Firebase: {e}")
        return False
