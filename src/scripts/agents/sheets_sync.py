import json
import os
import sys

def sync_to_google_sheet(json_data: dict, sheet_id: str):
    """
    Syncs the 16 extracted metrics into the user's Google Sheet via real Google Sheets API (gspread).
    Sheet ID: 1zPgDYjpQXs1IcFWyPNVfaEnTk3gZ8yQWDnumi_AaqKM
    """
    print(f"[Google Sheets Sync] Syncing 16 metrics to Google Sheet ID: {sheet_id}...")
    
    kpis = json_data.get("kpis", {})
    reach = json_data.get("reach", {})
    timestamp = json_data.get("timestamp", "")

    # Extract computed values from live data for rows 7-15
    growth = json_data.get("growth", [])
    departments = json_data.get("departments", [])
    top_diseases = json_data.get("top_diseases", [])
    doctor_specialties = json_data.get("doctor_specialties", [])
    demographics = json_data.get("demographics", {})
    age_groups = demographics.get("age_groups", [])
    pt = demographics.get("patient_types", {})
    gs = demographics.get("gender_split", {})

    latest_growth = growth[-1] if growth else {}
    top_dept = f"{departments[0]['department']} ({departments[0]['count']:,})" if departments else "N/A"
    top_disease = f"{top_diseases[0]['disease']} ({top_diseases[0]['count']:,})" if top_diseases else "N/A"
    top_spec = f"{doctor_specialties[0]['specialty']} ({doctor_specialties[0]['count']})" if doctor_specialties else "N/A"

    dom_age = max(age_groups, key=lambda x: x["count"]) if age_groups else {}
    age_total = sum(a["count"] for a in age_groups) or 1
    dom_age_str = f"{dom_age.get('range', 'N/A')} ({round(dom_age.get('count', 0) * 100 / age_total)}%)" if dom_age else "N/A"

    pt_total = sum(pt.values()) or 1
    new_pct = round(pt.get("new", 0) * 100 / pt_total)
    fu_pct = round(pt.get("followUp", 0) * 100 / pt_total)
    pt_str = f"{new_pct}% New / {fu_pct}% Follow-up"

    gs_total = sum(gs.values()) or 1
    f_pct = round(gs.get("female", 0) * 100 / gs_total)
    m_pct = round(gs.get("male", 0) * 100 / gs_total)
    gender_str = f"{f_pct}% Female / {m_pct}% Male"

    summary_rows = [
        ["Metric #", "Data Point Name", "Extracted Value", "Last Updated"],
        [1, "Total Patients Served", kpis.get("total_patients", 0), timestamp],
        [2, "Total Teleconsultations", kpis.get("total_teleconsultations", 0), timestamp],
        [3, "Total Health Camps", kpis.get("total_camps", 0), timestamp],
        [4, "Total Doctors Enrolled", kpis.get("total_doctors", 0), timestamp],
        [5, "Total Volunteers Registered", kpis.get("total_volunteers", 0), timestamp],
        [6, "Partner Hospitals Count", kpis.get("total_hospitals", 0), timestamp],
        [7, "Patients Growth (Latest Year)", latest_growth.get("patients", 0), timestamp],
        [8, "Teleconsultation Growth (Latest Year)", latest_growth.get("teleconsultations", 0), timestamp],
        [9, "Health Camps (Latest Year)", latest_growth.get("camps", 0), timestamp],
        [10, "Top Department", top_dept, timestamp],
        [11, "Top Diagnosed Condition", top_disease, timestamp],
        [12, "Top Doctor Specialty", top_spec, timestamp],
        [13, "Dominant Age Group", dom_age_str, timestamp],
        [14, "New vs Follow-up Ratio", pt_str, timestamp],
        [15, "Gender Distribution", gender_str, timestamp],
        [16, "Geographic Reach", f"{reach.get('districts', 0)} Districts / {reach.get('villages', 0)} Villages", timestamp]
    ]

    # Local CSV backup
    csv_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "google_sheet_backup.csv")
    os.makedirs(os.path.dirname(csv_file), exist_ok=True)
    with open(csv_file, "w", encoding="utf-8") as f:
        for row in summary_rows:
            f.write(",".join(f'"{str(cell)}"' for cell in row) + "\n")
    print(f"[Google Sheets Sync] Updated local CSV backup at: {csv_file}")

    # Real Google Sheets API Push
    creds_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "google-service-account.json")
    if not os.path.exists(creds_path):
        creds_path = "google-service-account.json"

    if os.path.exists(creds_path):
        try:
            import gspread
            gc = gspread.service_account(filename=creds_path)
            sh = gc.open_by_key(sheet_id)
            worksheet = sh.sheet1
            
            # Clear & update sheet
            worksheet.clear()
            worksheet.update(values=summary_rows, range_name="A1")
            print(f"[Google Sheets Sync SUCCESS] Live Google Sheet {sheet_id} updated with {len(summary_rows)-1} metrics!")
            return True
        except Exception as err:
            print(f"[Google Sheets API Warning] Could not push live to Google Sheets API: {err}")
    else:
        print("[Google Sheets Sync] Service account credentials file not found. Running in offline/backup mode.")

    return True

if __name__ == "__main__":
    sheet = sys.argv[1] if len(sys.argv) > 1 else os.getenv("GOOGLE_SHEET_ID", "1zPgDYjpQXs1IcFWyPNVfaEnTk3gZ8yQWDnumi_AaqKM")
    sample_file = os.path.join(os.path.dirname(__file__), "..", "..", "data", "liveImpactStore.json")
    
    if os.path.exists(sample_file):
        with open(sample_file, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        # Fallback sample data if file doesn't exist
        data = {
            "timestamp": "2026-08-03T12:00:00Z",
            "kpis": {"total_patients": 42850, "total_teleconsultations": 28400, "total_camps": 185, "total_doctors": 140, "total_volunteers": 650, "total_hospitals": 24},
            "reach": {"districts": 18, "villages": 420}
        }
    
    sync_to_google_sheet(data, sheet)
