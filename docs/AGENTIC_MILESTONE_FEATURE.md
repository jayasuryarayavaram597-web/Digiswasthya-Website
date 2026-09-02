befre # 🚀 Feature Specification: Autonomous Impact & Milestone Celebration Engine

## 1. Overview
The **Autonomous Impact & Milestone Celebration Engine** is an agentic feature for the DigiSwasthya website that automatically detects major organizational achievements from live data and presents engaging, gratitude-driven celebratory updates to website visitors and donors.

---

## 2. Core Objectives
- **Build Radical Trust & Transparency**: Provide live, indisputable proof of real-world impact.
- **Boost Donor Retention & Contributions**: Gratitude-first messaging (*"Your contribution made this possible"*) validates donors and inspires further giving.
- **Zero-Maintenance Freshness**: Automatically generate celebratory announcements without manual developer intervention.
- **Token-Efficient & Non-Intrusive**: Avoid token waste and eliminate popup spam.

---

## 3. Strict Milestone Trigger Rules & Numeric Ranges
To avoid spam and keep token costs near ₹0, the engine strictly triggers **ONLY** at these predefined numeric intervals:

| Metric Category | Tier 2: Progress Interval<br>*(Subtle Floating Pill)* | Tier 1: Mega Milestone<br>*(Celebration Modal + Confetti)* | Rationale & Dynamics |
| :--- | :--- | :--- | :--- |
| **👥 Patients Served** | **Every +10,000 (10k)**<br>*(60k, 70k, 80k, 90k, 110k...)* | **1 Lakh, 1.5 Lakh, 2 Lakh, 5 Lakh** | Takes several weeks/months to cross; perfect cadence for website freshness without noise. |
| **🏥 Physical Centres** | **Every 1 New Centre Opened** | **5th, 10th, 15th Centre** | Physical centres are major infrastructure feats; each 1 clinic opened is a historic milestone. |
| **🩺 Teleconsultations** | **Every +10,000 (10k)**<br>*(30k, 40k, 50k, 60k...)* | **50,000 & 1,00,000 (1 Lakh)** | Validates doctor volunteer hours and telemedicine clinical capacity. |
| **🌸 Women's Healthcare**| **Every +5,000 (5k)**<br>*(30k, 35k, 40k, 45k...)* | **50,000 Rural Women Treated** | Top CSR & grant criteria (58% women patients). |
| **📍 Districts Reached** | **Every +5 New Districts** | **Brand-New State or 100 Districts** | Demonstrates geographic footprint expansion across rural India. |
| **👨‍⚕️ Specialist Doctors**| **Every +25 Doctors**<br>*(150, 175, 200, 225...)* | **200 & 500 Doctors Onboarded** | Validates doctor volunteer hours and clinical network. |
| **🎪 Mega Health Camps** | **Every +5 Camps** | **10th Mega Camp / 1,000+ Screenings** | Showcases high-impact single-day village health drives. |

---

## 4. Location-Neutral Copywriting Standards (No Specific Villages/Districts/States)
To keep the messaging universal, pan-India, and always accurate, all narrative templates use **clean, location-neutral phrasing**:

| Category | Dynamic Headline | Dynamic Context & Story | Founder Gratitude Note |
| :--- | :--- | :--- | :--- |
| **🌸 Women's Health** | *"{count}+ Rural Women & Mothers Treated with Dignity!"* | *"In remote communities where private gynecological care is rare, your support gave {count} rural mothers and grandmothers free, compassionate specialist care."* | *"No mother in rural India should have to compromise on health. This milestone belongs to your generosity." — Pushpendra Singh* |
| **👥 Total Patients** | *"{count}+ Rural Lives Touched Across India!"* | *"Bringing quality healthcare directly to remote villages — your kindness turns hope into healing for over {count} families."* | *"Having survived cancer, I know the value of timely care. Thank you for walking this path with us." — Pushpendra Singh* |
| **🩺 Teleconsultations** | *"{count}+ Free Specialist Teleconsultations Completed!"* | *"Connecting rural families directly with leading city specialists in minutes, saving thousands of rupees in travel and lost wages."* | *"Technology bridges the distance, but your generosity bridges the healthcare divide." — Pushpendra Singh* |
| **🏥 Physical Centres** | *"New Rural Telemedicine Centre Inaugurated!"* | *"A brand-new solar-powered digital health clinic is now live, bringing specialist healthcare to over 25 remote surrounding villages."* | *"Every new centre is a permanent sanctuary of health for rural families. Thank you for expanding our reach." — Pushpendra Singh* |
| **👨‍⚕️ Specialist Doctors** | *"{count}+ Specialist Doctors Volunteering for Rural India!"* | *"Leading oncologists, cardiologists, and pediatricians from premier hospitals are donating their clinical expertise to heal remote communities."* | *"Our volunteer doctors give their time and skill, but our donors give them the platform to heal." — Pushpendra Singh* |
| **📍 Geographic Reach** | *"DigiSwasthya Expands Care to {count}+ Rural Districts!"* | *"Our mission to eliminate healthcare inequality in underserved rural communities continues to grow across the nation."* | *"From our humble beginnings to nationwide reach — thank you for believing in healthcare for all." — Pushpendra Singh* |
| **🎪 Mega Health Camps** | *"{count}+ Rural Villagers Screened in Mega Health Camp!"* | *"Our on-ground medical teams conducted specialized cancer and general checkup drives for remote village communities."* | *"Early diagnosis saves lives. Your support brings medical camps directly to village doorsteps." — Pushpendra Singh* |

---

## 5. Visual Asset Registry (`public/images/milestones/`)
All 7 visual assets are pre-generated and stored locally for `<5ms` instant loading:
- `public/images/milestones/women_health.jpg`
- `public/images/milestones/total_patients.jpg`
- `public/images/milestones/teleconsultations.jpg`
- `public/images/milestones/centres.jpg`
- `public/images/milestones/doctors.jpg`
- `public/images/milestones/expansion_map.jpg`
- `public/images/milestones/health_camps.jpg`

---

## 6. Milestone Lifecycle & User Experience Rules
- **Active Duration:** Remains active until a new milestone occurs OR up to 30–45 days.
- **Per-User Memory (`localStorage`):** Clicking `[✕]` immediately closes the popup and records the milestone ID so the same user is not disturbed again.
- **Smart Reset:** When a new milestone is crossed, the system resets and announces it fresh to all visitors.
- **Actionable CTAs:** Includes 1-click **WhatsApp / LinkedIn Share** and direct **Support Rural Patients** donation button (no fixed prices).
