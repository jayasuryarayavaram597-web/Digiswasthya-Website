import os
import sys
import json

# Force UTF-8 stdout encoding for Windows compatibility
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from scraper_agent import fetch_report_html, load_dotenv
from extractor_agent import extract_16_metrics

def run_agent_scraper_pipeline(report_url: str = None, username: str = None, password: str = None, sheet_id: str = None):
    """
    Complete Agent Scraper Pipeline Orchestrator:
    1. Agent 1: Scrapes report page / portal.
    2. Agent 2: Extracts the 16 impact data points.
    3. Storage Sync: Saves to local store (and Google Sheets if configured).
    """
    load_dotenv()

    print("\n=======================================================")
    print("[Pipeline] RUNNING AGENT SCRAPER PIPELINE")
    print("=======================================================\n")

    url = report_url or os.getenv("MANAGEMENT_PORTAL_URL", os.getenv("DIGISWASTHYA_PORTAL_URL", "public/sample-report.html"))
    user = username or os.getenv("MANAGEMENT_PORTAL_EMAIL", os.getenv("DIGISWASTHYA_PORTAL_USER", "none"))
    pwd = password or os.getenv("MANAGEMENT_PORTAL_PASSWORD", os.getenv("DIGISWASTHYA_PORTAL_PASS", "none"))
    target_sheet = sheet_id or os.getenv("GOOGLE_SHEET_ID", "local_sync_mode")

    # Step 1: Execute Agent 1
    raw_html = fetch_report_html(url, user, pwd)

    # Step 2: Execute Agent 2
    metrics_data = extract_16_metrics(raw_html)

    # Step 3: Save to Website Data Store
    output_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "liveImpactStore.json")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(metrics_data, f, indent=2)

    print(f"\n[Pipeline Storage Sync] Successfully updated website store at: {output_path}")

    # Step 4: Firebase Firestore Sync
    try:
        from firebase_sync import sync_to_firebase_firestore
        sync_to_firebase_firestore(metrics_data)
    except Exception as e:
        print(f"[Firebase Sync Warning] {e}")

    # Step 5: Google Sheets Sync
    sheet_to_use = sheet_id or os.getenv("GOOGLE_SHEET_ID", "1zPgDYjpQXs1IcFWyPNVfaEnTk3gZ8yQWDnumi_AaqKM")
    try:
        from sheets_sync import sync_to_google_sheet
        sync_to_google_sheet(metrics_data, sheet_to_use)
    except Exception as e:
        print(f"[Google Sheets Sync Warning] {e}")

    print("\n=======================================================")
    print("[Pipeline] AGENT PIPELINE COMPLETED SUCCESSFULLY!")
    print("=======================================================\n")
    return metrics_data

if __name__ == "__main__":
    url_arg = sys.argv[1] if len(sys.argv) > 1 else None
    run_agent_scraper_pipeline(url_arg)
