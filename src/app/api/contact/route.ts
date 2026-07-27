import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveInquiry } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            name,
            email,
            phone,
            contactType,
            subject,
            message,
            location,
            assistanceNeeded,
            language,
        } = body;

        if (!name || !message || !(email || phone)) {
            return NextResponse.json(
                { error: "Name, message, and either an email or phone number are required." },
                { status: 400 }
            );
        }

        await saveInquiry({
            name,
            email: email || undefined,
            phone: phone || undefined,
            contactType: contactType || "General Inquiry",
            subject: subject || undefined,
            message,
            location: location || undefined,
            assistanceNeeded: assistanceNeeded || undefined,
            language: language || undefined,
        });

        // 1. Setup Nodemailer Transporter
        const smtpEmail = process.env.SMTP_EMAIL;
        const smtpPassword = process.env.SMTP_PASSWORD;

        if (!smtpEmail || !smtpPassword || smtpEmail === "your_email@gmail.com") {
            console.warn("[Contact API] Missing or default SMTP credentials. Saving to DB only.");
            return NextResponse.json({ status: "ok", warning: "Email configuration missing" });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: smtpEmail,
                pass: smtpPassword,
            },
        });

        const notifyEmail = smtpEmail; // Set to smtpEmail so you receive the team alerts while testing!

        const detailRows = [
            ["Contact Type", contactType || "General Inquiry"],
            ["Name", name],
            ["Email", email],
            ["Phone", phone],
            ["Subject", subject],
            ["Location", location],
            ["Assistance Needed", assistanceNeeded],
        ]
            .filter(([_, value]) => value && value.trim() !== "") // Only keep fields that have an actual value
            .map(([label, value]) => `<tr><td style="padding:6px 12px;color:#666;font-weight:600;">${label}</td><td style="padding:6px 12px;">${value}</td></tr>`)
            .join("");

        // 2. Send Notification Email to the DigiSwasthya Team
        try {
            await transporter.sendMail({
                from: `"DigiSwasthya Website" <${smtpEmail}>`,
                to: notifyEmail,
                replyTo: email || undefined,
                subject: `New ${contactType || "General Inquiry"} from ${name}`,
                html: `
                <div style="font-family:sans-serif;color:#333;">
                    <h2 style="color:#1a6636;">New website inquiry</h2>
                    <table>${detailRows}</table>
                    <p style="margin-top:16px;"><strong>Message:</strong><br/>${message}</p>
                </div>
                `,
            });
        } catch (err) {
            console.error("[Contact API] Failed to send internal notification email:", err);
        }

        // 3. Send Smart Auto-Responder Email to the User
        if (email) {
            try {
                let userEmailSubject = "Thank you for reaching out to DigiSwasthya";
                let userEmailHtml = "";

                if (contactType === "Donor" || contactType === "Donor / Supporter") {
                    userEmailHtml = `
                    <div style="font-family:sans-serif;color:#333;line-height:1.6;">
                        <p>Dear ${name},</p>
                        <p>Thank you for your generous heart! Our donor relations team has just been notified of your message and we will reach out to you very shortly.</p>
                        <p>If you wish to make a contribution immediately, you can do so securely at our website: <a href="https://digiswasthya.org/donate">https://digiswasthya.org/donate</a></p>
                        <p>Warm regards,<br/><strong>DigiSwasthya Foundation</strong></p>
                    </div>
                    `;
                } else if (contactType === "Patient" || contactType === "Patient / Need Help") {
                    userEmailHtml = `
                    <div style="font-family:sans-serif;color:#333;line-height:1.6;">
                        <p>Dear ${name},</p>
                        <p>We have received your medical request. Our health coordinators are reviewing it right now.</p>
                        <p style="color:red;"><strong>If this is an urgent medical matter, please do not wait — call us immediately at +91 83184 24800.</strong></p>
                        <p>Warm regards,<br/><strong>DigiSwasthya Foundation</strong></p>
                    </div>
                    `;
                } else {
                    userEmailHtml = `
                    <div style="font-family:sans-serif;color:#333;line-height:1.6;">
                        <p>Dear ${name},</p>
                        <p>Thank you for reaching out to DigiSwasthya Foundation. Our team has received your message and will get back to you within a few hours.</p>
                        <p>Warm regards,<br/><strong>DigiSwasthya Foundation</strong></p>
                    </div>
                    `;
                }

                await transporter.sendMail({
                    from: `"DigiSwasthya Foundation" <${smtpEmail}>`,
                    to: email,
                    subject: userEmailSubject,
                    html: userEmailHtml,
                });
            } catch (err) {
                console.error("[Contact API] Failed to send confirmation email to user:", err);
            }
        }

        return NextResponse.json({ status: "ok" });
    } catch (error: any) {
        console.error("[Contact API Error]:", error);
        return NextResponse.json({ error: error.message || "Failed to submit inquiry" }, { status: 500 });
    }
}
