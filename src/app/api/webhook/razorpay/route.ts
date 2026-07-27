import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { saveDonation, enrollSubscriber } from "@/lib/db";
import { generate80GReceipt, generateCertificate } from "@/lib/pdf";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const body = JSON.parse(rawBody);
        const signature = req.headers.get("x-razorpay-signature");
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

        // Verify Webhook Signature (bypass in dev mode if secret is empty)
        if (secret) {
            if (!signature) {
                return NextResponse.json({ error: "No signature" }, { status: 400 });
            }

            const expectedSignature = crypto
                .createHmac("sha256", secret)
                .update(rawBody)
                .digest("hex");

            if (signature !== expectedSignature) {
                console.error("[Webhook] Signature mismatch");
                return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
            }
        } else {
            console.warn("[Webhook] Skipping signature check because RAZORPAY_WEBHOOK_SECRET is empty.");
        }

        const { event, payload } = body;
        console.log(`[Webhook] Received event: ${event}`);

        if (event === "payment.captured" || event === "order.paid") {
            const payment = payload.payment?.entity || payload.order?.entity;
            if (!payment) {
                return NextResponse.json({ error: "No payment entity found" }, { status: 400 });
            }

            const paymentId = payment.id;
            const amount = payment.amount / 100; // Convert paise/cents to standard INR
            const email = (payment.notes?.email || payment.email || "").trim();
            const name = (payment.notes?.name || payment.notes?.donorName || "Valued Donor").trim();
            const pan = (payment.notes?.pan || "").toUpperCase().trim();
            const address = payment.notes?.address || "";
            const dateStr = new Date(payment.created_at * 1000).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

            console.log(`[Webhook] Successful Payment: ID ${paymentId}, Name: ${name}, Email: ${email}, Amount: ₹${amount}`);

            if (!email) {
                console.error("[Webhook] Missing donor email. Cannot send receipts.");
                return NextResponse.json({ error: "Missing email" }, { status: 400 });
            }

            // 1. Save to Database
            await saveDonation({
                id: paymentId,
                name,
                email,
                amount,
                pan: pan || undefined,
                address: address || undefined,
                date: new Date(payment.created_at * 1000)
            });

            // 2. Auto-Enroll in Subscribers
            await enrollSubscriber(email, name);

            // 3. Generate Receipt & Certificate PDFs in memory
            const receiptBuffer = await generate80GReceipt(name, amount, dateStr, `RC-${paymentId.slice(-6).toUpperCase()}`, pan, address);
            const certificateBuffer = await generateCertificate(name, amount, dateStr);

            // 4. Construct Unsubscribe URL
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
            const unsubscribeUrl = `${appUrl}/api/unsubscribe?email=${encodeURIComponent(email)}`;

            // 5. Send Welcome Email via Resend
            // In free/sandbox mode, Resend only allows sending to the account owner's verified email.
            // In production, update the 'from' domain to your verified domain (e.g. contact@digiswasthya.org).
            const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
            
            let tierMessage = "";
            if (amount >= 10000) {
                tierMessage = `Your ₹${amount.toLocaleString("en-IN")} helped run a telemedicine centre for a week.`;
            } else if (amount >= 5000) {
                tierMessage = `Your ₹${amount.toLocaleString("en-IN")} funded an entire health awareness camp.`;
            } else if (amount >= 1000) {
                tierMessage = `Your ₹${amount.toLocaleString("en-IN")} sponsored teleconsultations for 4 rural patients.`;
            } else {
                tierMessage = `Your ₹${amount.toLocaleString("en-IN")} helped a child get their first consultation.`;
            }

            const welcomeHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
                    .header { background: #0f172a; padding: 20px; text-align: center; color: white; }
                    .content { padding: 20px; }
                    .highlight { background: #f8fafc; border-left: 4px solid #d97706; padding: 15px; margin: 20px 0; font-style: italic; }
                    .footer { font-size: 12px; color: #666; text-align: center; margin-top: 30px; padding: 20px; background: #f8fafc; }
                    a { color: #d97706; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Digiswasthya Foundation</h2>
                    </div>
                    <div class="content">
                        <p>Dear ${name},</p>
                        <p>Thank you so much for your generous support to Digiswasthya Foundation!</p>
                        
                        <div class="highlight">
                            "${tierMessage}"
                        </div>
                        
                        <p>We are pleased to attach your <strong>80G Tax Exemption Receipt</strong> and <strong>Certificate of Appreciation</strong> to this email. Your contribution helps bridge the healthcare gap in rural India by powering telemedicine centres.</p>
                        
                        <p>Warm regards,<br/><strong>Sandeep Kumar</strong><br/>Founder, Digiswasthya Foundation</p>
                    </div>
                    <div class="footer">
                        <p>Digiswasthya Foundation is a registered Section 8 NGO.</p>
                        <p>To stop receiving weekly impact stories, click <a href="${unsubscribeUrl}">here to unsubscribe</a>.</p>
                    </div>
                </div>
            </body>
            </html>
            `;

            console.log(`[Webhook] Sending Welcome Email to: ${email}`);

            const emailResponse = await resend.emails.send({
                from: `Digiswasthya Foundation <${fromEmail}>`,
                to: [email],
                subject: `Thank you for your donation, ${name}!`,
                html: welcomeHtml,
                attachments: [
                    {
                        filename: `80G_Receipt_${paymentId}.pdf`,
                        content: receiptBuffer
                    },
                    {
                        filename: `Certificate_of_Appreciation_${paymentId}.pdf`,
                        content: certificateBuffer
                    }
                ]
            });

            console.log(`[Webhook] Resend response:`, emailResponse);
        }

        return NextResponse.json({ status: "ok" });
    } catch (error: any) {
        console.error("[Webhook Error]:", error);
        return NextResponse.json({ error: error.message || "Webhook processing failed" }, { status: 500 });
    }
}

