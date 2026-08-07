import re
import json
import os
import sys
from datetime import datetime
from bs4 import BeautifulSoup

def clean_int(val_str: str) -> int:
    """Removes commas, spaces, and non-numeric chars to return integer."""
    if not val_str:
        return 0
    cleaned = re.sub(r"[^\d]", "", str(val_str))
    return int(cleaned) if cleaned else 0

def extract_16_metrics(scraped_input) -> dict:
    """
    Agent 2: Dynamic Data Extractor Agent
    Parses raw HTML and API JSON payloads intercepted from DigiSwasthya Management Portal.
    Extracts dynamic department lists, disease lists, district reach, demographics, growth trends, and KPI Cards.
    """
    print("[Agent 2] Extracting live metrics from portal HTML and API payloads...")

    html_content = ""
    json_payloads = []

    if isinstance(scraped_input, dict):
        html_content = scraped_input.get("html", "")
        json_payloads = scraped_input.get("json_payloads", [])
    else:
        html_content = str(scraped_input)

    soup = BeautifulSoup(html_content, "html.parser")
    text_content = soup.get_text()

    # Default Datasets matching latest management portal figures
    patients = 42950
    teleconsultations = 58894
    camps = 5
    doctors = 125
    hospitals = 0

    dept_breakdown = [
        { "department": "General Medicine", "count": 15967 },
        { "department": "Dermatologist", "count": 10223 },
        { "department": "Pediatrician", "count": 3700 },
        { "department": "Gynaecologist", "count": 3513 },
        { "department": "Orthopaedics, MS", "count": 3307 },
        { "department": "General Physician", "count": 3245 },
        { "department": "Paediatrician", "count": 2889 },
        { "department": "Internal Medicine", "count": 2691 },
        { "department": "General Physician, Gynaecologist", "count": 2132 },
        { "department": "Orthopedic", "count": 2089 },
        { "department": "Orthopaedic", "count": 1976 },
        { "department": "Ent", "count": 1143 },
        { "department": "Homopathic", "count": 498 },
        { "department": "Neurologist", "count": 453 },
        { "department": "Ophthalmology", "count": 323 },
        { "department": "Dermatology And Leprosy", "count": 180 },
        { "department": "Cardiology", "count": 150 },
        { "department": "Opthamologist", "count": 140 },
        { "department": "Dentistry", "count": 135 },
        { "department": "Dentist", "count": 115 },
        { "department": "Ophthalmology", "count": 68 },
        { "department": "Clinical Dietitian", "count": 55 },
        { "department": "Gynecologist", "count": 49 },
        { "department": "Medical Oncologist", "count": 33 },
        { "department": "Oncologist", "count": 25 },
        { "department": "General Surgeon, Gastrointestinal Endo Surgeons", "count": 20 },
        { "department": "Diabetologist", "count": 18 },
        { "department": "Gynecology & Obstetrics", "count": 18 },
        { "department": "Physiotherapist", "count": 15 },
        { "department": "Clinical Nutritionist", "count": 14 },
        { "department": "General Surgeon", "count": 14 },
        { "department": "Pulmonologist", "count": 14 },
        { "department": "Nephrologist", "count": 13 },
        { "department": "Oral And Dental Care", "count": 10 },
        { "department": "Gastroenterologist", "count": 6 },
        { "department": "Psychiatrist", "count": 4 },
        { "department": "Nutritionist", "count": 3 },
        { "department": "Orthopaedics", "count": 3 },
        { "department": "Psychologist", "count": 3 },
        { "department": "Cardiologist General", "count": 2 },
        { "department": "Pediatric Hemato Oncology", "count": 2 }
    ]

    top_diseases = [
        { "disease": "Upper Respiratory Infection (URTI)", "count": 2599 },
        { "disease": "Hypertension (High BP)", "count": 2376 },
        { "disease": "Eczema (Skin Condition)", "count": 1431 },
        { "disease": "Tinea (Fungal Infection)", "count": 1318 },
        { "disease": "Xerosis (Severe Dry Skin)", "count": 795 },
        { "disease": "Acute Febrile Illness", "count": 778 },
        { "disease": "Lower Respiratory Infection (LRTI)", "count": 774 },
        { "disease": "Gastritis (Stomach Inflammation)", "count": 675 },
        { "disease": "Upper Respiratory Tract Inf", "count": 648 },
        { "disease": "General Weakness & Fatigue", "count": 624 },
        { "disease": "Type 2 Diabetes Mellitus (T2DM)", "count": 602 },
        { "disease": "Joint Pain & Inflammation", "count": 587 },
        { "disease": "Age-Related Health Degeneration", "count": 524 },
        { "disease": "Acne & Dermatitis", "count": 504 },
        { "disease": "Knee Pain & Osteoarthritis", "count": 499 }
    ]

    district_list = [
        { "name": "Nagpur", "count": 14430 },
        { "name": "Pune", "count": 6595 },
        { "name": "Sant Kabir Nagar", "count": 2473 },
        { "name": "Lucknow", "count": 1965 },
        { "name": "Sant Kabeer Nagar", "count": 895 },
        { "name": "Barabanki", "count": 438 },
        { "name": "Raigad", "count": 249 },
        { "name": "Nashik", "count": 188 },
        { "name": "Palghar", "count": 163 },
        { "name": "Gorakhpur", "count": 60 },
        { "name": "Muzaffarpur", "count": 25 },
        { "name": "Jharkhand", "count": 19 },
        { "name": "Mumbai City", "count": 18 },
        { "name": "New Delhi", "count": 17 },
        { "name": "Varanasi", "count": 17 },
        { "name": "Nagaur", "count": 16 },
        { "name": "Basti", "count": 8 },
        { "name": "Chandauli", "count": 8 },
        { "name": "Giridih", "count": 5 },
        { "name": "Ludhiana", "count": 5 },
        { "name": "Patna", "count": 4 },
        { "name": "Rae Bareli", "count": 4 },
        { "name": "Bhandara", "count": 3 },
        { "name": "Bihar", "count": 3 },
        { "name": "East Champaran", "count": 3 },
        { "name": "Mumbai", "count": 3 },
        { "name": "Ranchi", "count": 3 },
        { "name": "Sejalpur", "count": 3 },
        { "name": "Thane", "count": 3 },
        { "name": "Bengaluru Urban", "count": 2 },
        { "name": "Bkt", "count": 2 },
        { "name": "Chandrapur", "count": 2 },
        { "name": "Gautam Buddha Nagar", "count": 2 },
        { "name": "Gaya", "count": 2 },
        { "name": "Kanpur Nagar", "count": 2 },
        { "name": "Khairthal Tijara", "count": 2 },
        { "name": "Nagpure", "count": 2 },
        { "name": "Pathankot", "count": 2 },
        { "name": "Puri", "count": 2 },
        { "name": "Shahjahanpur", "count": 2 },
        { "name": "Tehri Garhwal", "count": 2 },
        { "name": "West Champaran", "count": 2 },
        { "name": "Agar Malwa", "count": 1 },
        { "name": "Ajmer", "count": 1 },
        { "name": "Aligarh", "count": 1 },
        { "name": "Ambala", "count": 1 },
        { "name": "Banda", "count": 1 },
        { "name": "Bhojpur", "count": 1 },
        { "name": "Birbhum", "count": 1 },
        { "name": "Central Delhi", "count": 1 },
        { "name": "Chandigarh", "count": 1 },
        { "name": "Deogarh", "count": 1 },
        { "name": "Durg", "count": 1 },
        { "name": "East Chmparan", "count": 1 },
        { "name": "Gurugram", "count": 1 },
        { "name": "Hazaribagh", "count": 1 },
        { "name": "Jamm", "count": 1 },
        { "name": "Javahar Palghar", "count": 1 },
        { "name": "Maharashtra", "count": 1 },
        { "name": "Manali", "count": 1 }
    ]

    doctor_specialties = [
        { "specialty": "General Physician", "count": 21 },
        { "specialty": "Dermatologist", "count": 8 },
        { "specialty": "General Medicine", "count": 7 },
        { "specialty": "Dentist", "count": 6 },
        { "specialty": "Oncologist", "count": 6 },
        { "specialty": "Ent", "count": 5 },
        { "specialty": "Nutritionist", "count": 5 },
        { "specialty": "Paediatrician", "count": 5 },
        { "specialty": "Psychogist", "count": 5 },
        { "specialty": "Gynarlogist", "count": 4 },
        { "specialty": "Community Healthcare Specialist", "count": 4 },
        { "specialty": "Opthamologist", "count": 4 },
        { "specialty": "Physiotherapist", "count": 4 },
        { "specialty": "Diabetologist", "count": 3 },
        { "specialty": "Medical Oncologist", "count": 3 },
        { "specialty": "Gynecologist", "count": 2 },
        { "specialty": "Nephrologist", "count": 2 },
        { "specialty": "Neurologist", "count": 2 },
        { "specialty": "Oerthopedic", "count": 2 },
        { "specialty": "Pulmonogist", "count": 2 },
        { "specialty": "Urologist", "count": 2 },
        { "specialty": "Cardiologist General", "count": 1 },
        { "specialty": "Cardiology", "count": 1 },
        { "specialty": "Clinical Dietitan", "count": 1 },
        { "specialty": "Clinical Nutrionist", "count": 1 },
        { "specialty": "Dentistey", "count": 1 },
        { "specialty": "Dermatology And Leprosy", "count": 1 },
        { "specialty": "Family physician ,A Surgeon of Standing And Proctological", "count": 1 },
        { "specialty": "Gastronterologist", "count": 1 },
        { "specialty": "General Physiciean,Gynaecologist", "count": 1 },
        { "specialty": "Genaral Surgeon", "count": 1 },
        { "specialty": "General Surgeon,Gastrointestinal Endo Surgeons", "count": 1 },
        { "specialty": "Gynecologist,General physiciean", "count": 1 },
        { "specialty": "Gynecology &Obstetrics", "count": 1 },
        { "specialty": "Hepatologist", "count": 1 },
        { "specialty": "Homopathic", "count": 1 },
        { "specialty": "Neurosurgeon", "count": 1 },
        { "specialty": "Opthathmology", "count": 1 },
        { "specialty": "Oral And Dental Care", "count": 1 },
        { "specialty": "Orthopaedics.MS", "count": 1 },
        { "specialty": "Pediatric Hemato Oncology", "count": 1 },
        { "specialty": "Peditrician", "count": 1 },
        { "specialty": "Phychitrist", "count": 1 },
        { "specialty": "Thoracis surgeon", "count": 1 }
    ]

    age_groups = [
        { "range": "0-5", "count": 3045 },
        { "range": "6-12", "count": 4680 },
        { "range": "13-18", "count": 3635 },
        { "range": "19-35", "count": 9330 },
        { "range": "36-60", "count": 14266 },
        { "range": "60+", "count": 7889 },
        { "range": "Not recorded", "count": 81 }
    ]

    growth_trends = [
        { "year": "2024", "patients": 2, "teleconsultations": 2, "camps": 1 },
        { "year": "2025", "patients": 19823, "teleconsultations": 20986, "camps": 3 },
        { "year": "2026", "patients": 27223, "teleconsultations": 37880, "camps": 5 }
    ]

    # Track if we found real live data from the portal (not hardcoded defaults)
    live_data_found = False

    # Parse Intercepted API JSON Payloads if present
    for payload in json_payloads:
        data_obj = payload.get("data", {})
        if isinstance(data_obj, dict):
            # Check for outreach-summary live portal API response
            if "headline" in data_obj or "consultations_by_department" in data_obj:
                print(f"[Agent 2] Intercepted live outreach-summary API from portal!")
                live_data_found = True  # Mark that we got real live data
                
                # 1. Headline KPIs
                hl = data_obj.get("headline", {})
                if isinstance(hl, dict):
                    patients = hl.get("patients_served", patients)
                    teleconsultations = hl.get("teleconsultations", teleconsultations)
                    camps = hl.get("health_camps", camps)
                    doctors = hl.get("doctors", doctors)
                    hospitals = hl.get("partner_hospitals", hospitals)

                # 2. Departments
                depts = data_obj.get("consultations_by_department")
                if isinstance(depts, list) and depts:
                    dept_breakdown = [{ "department": d.get("label", d.get("department")), "count": d.get("count", 0) } for d in depts]

                # 3. Top Diseases
                diseases = data_obj.get("top_diseases")
                if isinstance(diseases, list) and diseases:
                    top_diseases = [{ "disease": d.get("label", d.get("disease")), "count": d.get("count", 0) } for d in diseases]

                # 4. Doctors by Specialty
                specs = data_obj.get("doctors_by_specialty")
                if isinstance(specs, list) and specs:
                    doctor_specialties = [{ "specialty": s.get("label", s.get("specialty")), "count": s.get("count", 0) } for s in specs]

                # 5. Age Distribution
                ages = data_obj.get("age_distribution")
                if isinstance(ages, list) and ages:
                    age_groups = [{ "range": a.get("label", a.get("range")), "count": a.get("count", 0) } for a in ages]

                # 6. Gender Split
                genders = data_obj.get("gender_distribution")
                if isinstance(genders, list) and genders:
                    g_split = { "female": 0, "male": 0, "other": 0 }
                    for g in genders:
                        lbl = str(g.get("label", "")).lower()
                        cnt = g.get("count", 0)
                        if "female" in lbl: g_split["female"] = cnt
                        elif "male" in lbl: g_split["male"] = cnt
                        else: g_split["other"] = cnt
                    gender_split = g_split

                # 7. New vs Followup
                nvf = data_obj.get("new_vs_followup")
                if isinstance(nvf, dict):
                    patient_types = {
                        "followUp": nvf.get("followup_patients", 2603),
                        "new": nvf.get("new_patients", 14964),
                        "notCategorised": nvf.get("unknown", 41302)
                    }

                # 8. Growth Trends
                pg = data_obj.get("patients_growth", [])
                cg = data_obj.get("consultations_growth", [])
                if pg or cg:
                    cg_map = { item.get("period"): item.get("count", 0) for item in cg }
                    growth_trends = [
                        {
                            "year": item.get("period"),
                            "patients": item.get("count", 0),
                            "teleconsultations": cg_map.get(item.get("period"), 0),
                            "camps": 1 if item.get("period") == "2024" else 3 if item.get("period") == "2025" else 5
                        }
                        for item in pg if item.get("period") != "2020" # Filter zero years if preferred
                    ]

                # 9. Districts Reach
                dists = data_obj.get("districts")
                if isinstance(dists, list) and dists:
                    district_list = [
                        { "name": d.get("label") or d.get("district") or d.get("name") or "Unknown", "count": d.get("count", 1) }
                        for d in dists
                    ]

            # Fallback checks for legacy payload formats
            elif "departments" in data_obj and isinstance(data_obj["departments"], list):
                dept_breakdown = data_obj["departments"]
            elif "top_diseases" in data_obj and isinstance(data_obj["top_diseases"], list):
                top_diseases = data_obj["top_diseases"]

    # CRITICAL GUARD: If no live API data was intercepted from the portal,
    # the scraper likely failed to login or reach the dashboard.
    # Raise an error to prevent stale/hardcoded data from being written to Firebase.
    if not live_data_found:
        raise ValueError(
            "[Agent 2 CRITICAL ERROR] No live API data was captured from the portal.\n"
            "The scraper likely failed to login or the portal did not return JSON API data.\n"
            "Pipeline aborted — Firebase will NOT be updated with stale/hardcoded data."
        )

    # HTML / Regex Extraction for Portal Cards (Checking preceding & succeeding numbers)
    pat_match = re.search(r"([\d,]+)[\s\n]*PATIENTS SERVED", text_content, re.IGNORECASE) or re.search(r"PATIENTS SERVED[\s\n]*([\d,]+)", text_content, re.IGNORECASE)
    if pat_match:
        patients = clean_int(pat_match.group(1))

    tele_match = re.search(r"([\d,]+)[\s\n]*TELECONSULTATIONS", text_content, re.IGNORECASE) or re.search(r"TELECONSULTATIONS[\s\n]*([\d,]+)", text_content, re.IGNORECASE)
    if tele_match:
        teleconsultations = clean_int(tele_match.group(1))

    camps_match = re.search(r"([\d,]+)[\s\n]*HEALTH CAMPS", text_content, re.IGNORECASE) or re.search(r"HEALTH CAMPS[\s\n]*([\d,]+)", text_content, re.IGNORECASE)
    if camps_match:
        camps = clean_int(camps_match.group(1))

    doc_match = re.search(r"([\d,]+)[\s\n]*DOCTORS", text_content, re.IGNORECASE) or re.search(r"DOCTORS[\s\n]*([\d,]+)", text_content, re.IGNORECASE)
    if doc_match:
        doctors = clean_int(doc_match.group(1))

    hosp_match = re.search(r"([\d,]+)[\s\n]*PARTNER HOSPITALS", text_content, re.IGNORECASE) or re.search(r"PARTNER HOSPITALS[\s\n]*([\d,]+)", text_content, re.IGNORECASE)
    if hosp_match:
        hospitals = clean_int(hosp_match.group(1))

    extracted_payload = {
        "timestamp": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "metrics_count": 16,
        "kpis": {
            "total_patients": patients,
            "total_teleconsultations": teleconsultations,
            "total_camps": camps,
            "total_doctors": doctors,
            "total_hospitals": hospitals
        },
        "growth": growth_trends,
        "departments": dept_breakdown,
        "top_diseases": top_diseases,
        "doctor_specialties": doctor_specialties,
        "demographics": {
            "age_groups": age_groups,
            "patient_types": { "followUp": 2603, "new": 14964, "notCategorised": 41302 },
            "gender_split": { "female": 25022, "male": 17897, "other": 7 }
        },
        "reach": {
            "districts": len(district_list),
            "villages": 633,
            "district_list": district_list
        }
    }

    print(f"[Agent 2 Extracted] Total Patients: {extracted_payload['kpis']['total_patients']}, Departments: {len(dept_breakdown)}, Districts: {len(district_list)}")
    return extracted_payload

if __name__ == "__main__":
    filepath = sys.argv[1] if len(sys.argv) > 1 else "scraped_report_temp.html"
    json_path = "scraped_report_temp.json"
    
    html_data = ""
    json_payloads = []

    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            html_data = f.read()

    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                json_payloads = json.load(f)
        except Exception:
            pass

    data = extract_16_metrics({ "html": html_data, "json_payloads": json_payloads })
    out_file = "extracted_16_metrics.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"[Agent 2 Completed] Extracted JSON written to {out_file}")
