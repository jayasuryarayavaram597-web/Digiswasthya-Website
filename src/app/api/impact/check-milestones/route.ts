import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp, query, where } from "firebase/firestore";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Milestone definitions.
 * Add more milestones here as the organisation grows.
 */
const PATIENT_MILESTONES = [5000, 10000, 25000, 50000, 100000, 150000, 200000, 500000, 1000000];
const CENTRE_MILESTONES = [5, 10, 15, 20, 25, 50];
const CAMP_MILESTONES = [500, 1000, 1500, 2000, 2500, 5000];

/**
 * POST /api/impact/check-milestones
 * 
 * Call this route whenever impact stats are updated in Firebase.
 * It checks whether any new milestone has been crossed and sends
 * a celebration email to all active subscribers.
 * 
 * Can be triggered:
 * - Manually by an admin
 * - Via a cron job (e.g. weekly)
 * - Via Firebase Cloud Functions on data write
 */
export async function POST(req: NextRequest) {
    try {
        // ── 1. Read current stats from Firestore ──────────────────────
        const summaryRef = doc(db, "impactStats", "summary");
        const summarySnap = await getDoc(summaryRef);

        if (!summarySnap.exists()) {
            return NextResponse.json({ message: "No impact stats found in Firestore." }, { status: 200 });
        }

        const summary = summarySnap.data();
        const currentPatients: number = summary?.totalPatients ?? 0;
        const currentCentres: number = summary?.totalCentres ?? 0;
        const currentCamps: number = summary?.totalCamps ?? 0;

        // ── 2. Read already-triggered milestones ──────────────────────
        const triggeredRef = doc(db, "milestoneAlerts", "triggered");
        const triggeredSnap = await getDoc(triggeredRef);
        const triggered: string[] = triggeredSnap.exists() ? (triggeredSnap.data()?.list ?? []) : [];

        // ── 3. Find newly crossed milestones ─────────────────────────
        const newMilestones: { type: string; value: number; label: string }[] = [];

        for (const m of PATIENT_MILESTONES) {
            const key = `patients_${m}`;
            if (currentPatients >= m && !triggered.includes(key)) {
                newMilestones.push({ type: "patients", value: m, label: `${m.toLocaleString("en-IN")} Patients Served` });
                triggered.push(key);
            }
        }

        for (const m of CENTRE_MILESTONES) {
            const key = `centres_${m}`;
            if (currentCentres >= m && !triggered.includes(key)) {
                newMilestones.push({ type: "centres", value: m, label: `${m} Telemedicine Centres` });
                triggered.push(key);
            }
        }

        for (const m of CAMP_MILESTONES) {
            const key = `camps_${m}`;
            if (currentCamps >= m && !triggered.includes(key)) {
                newMilestones.push({ type: "camps", value: m, label: `${m.toLocaleString("en-IN")} Health Camps Conducted` });
                triggered.push(key);
            }
        }

        if (newMilestones.length === 0) {
            return NextResponse.json({ message: "No new milestones crossed." }, { status: 200 });
        }

        // ── 4. Get all active subscribers ────────────────────────────
        const subscribersCol = collection(db, "subscribers");
        const q = query(subscribersCol, where("isSubscribed", "==", true));
        const subscribersSnap = await getDocs(q);

        if (subscribersSnap.empty) {
            // Still save triggered milestones even if no subscribers
            await setDoc(triggeredRef, { list: triggered, updatedAt: serverTimestamp() });
            return NextResponse.json({ message: "Milestones crossed but no subscribers to notify.", milestones: newMilestones });
        }

        const subscribers = subscribersSnap.docs.map(d => ({
            email: d.data().email as string,
            name: d.data().name as string,
        }));

        // ── 5. Build email HTML ──────────────────────────────────────
        const milestoneListHTML = newMilestones
            .map(m => `<li style="margin-bottom:8px;">🎉 <strong>${m.label}</strong></li>`)
            .join("");

        const emailHTML = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;background:#f8faf9;margin:0;padding:0;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    
    <div style="background:linear-gradient(135deg,#1a6b3a,#27ae5f);padding:32px 32px 24px;text-align:center;">
      <p style="color:rgba(255,255,255,0.8);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">DigiSwasthya Foundation</p>
      <h1 style="color:#ffffff;font-size:28px;font-weight:800;margin:0;line-height:1.2;">We Just Hit a Milestone 🎉</h1>
      <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:12px 0 0;">And your support made this possible.</p>
    </div>

    <div style="padding:32px;">
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
        Dear Supporter,<br/><br/>
        Thanks to you and thousands of believers like you, DigiSwasthya has just crossed an incredible milestone in our mission to bring healthcare to rural India.
      </p>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <p style="color:#14532d;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">New Milestones Achieved</p>
        <ul style="color:#166534;font-size:15px;margin:0;padding-left:20px;line-height:1.8;">
          ${milestoneListHTML}
        </ul>
      </div>

      <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 28px;">
        Every rupee donated goes directly toward keeping our telemedicine centres running, funding health camps in remote villages, and connecting rural patients with specialist doctors.
      </p>

      <div style="text-align:center;margin-bottom:28px;">
        <a href="https://digiswasthya.org/our-impact" 
           style="display:inline-block;background:linear-gradient(135deg,#1a6b3a,#27ae5f);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:50px;box-shadow:0 4px 14px rgba(26,107,58,0.3);">
          See Our Full Impact →
        </a>
      </div>

      <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
        You are receiving this because you donated to or subscribed to DigiSwasthya Foundation.<br/>
        <a href="https://digiswasthya.org/unsubscribe" style="color:#6b7280;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;

        // ── 6. Send emails to all subscribers ────────────────────────
        const emailPromises = subscribers.map(sub =>
            resend.emails.send({
                from: "DigiSwasthya Foundation <no-reply@digiswasthya.org>",
                to: sub.email,
                subject: `🎉 DigiSwasthya just crossed ${newMilestones[0].label}!`,
                html: emailHTML,
            }).catch(err => {
                console.error(`[Milestone Email] Failed to send to ${sub.email}:`, err);
            })
        );

        await Promise.allSettled(emailPromises);

        // ── 7. Save triggered milestones to Firestore ─────────────────
        await setDoc(triggeredRef, { list: triggered, updatedAt: serverTimestamp() });

        return NextResponse.json({
            success: true,
            milestonesCrossed: newMilestones.map(m => m.label),
            emailsSent: subscribers.length,
        });

    } catch (err) {
        console.error("[check-milestones] Error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
