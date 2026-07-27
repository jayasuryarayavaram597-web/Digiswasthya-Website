import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, amount, pan, address } = body;

        if (!name || !email || !amount) {
            return NextResponse.json({ error: "Missing required fields: name, email, amount" }, { status: 400 });
        }

        const donationAmount = parseFloat(amount);
        if (isNaN(donationAmount) || donationAmount <= 0) {
            return NextResponse.json({ error: "Amount must be a valid positive number" }, { status: 400 });
        }

        // Generate a random mock transaction ID
        const mockPaymentId = "pay_mock_" + Math.random().toString(36).substring(2, 12).toUpperCase();

        // Construct mock Razorpay payload
        const mockPayload = {
            event: "payment.captured",
            payload: {
                payment: {
                    entity: {
                        id: mockPaymentId,
                        entity: "payment",
                        amount: Math.round(donationAmount * 100), // paise
                        currency: "INR",
                        status: "captured",
                        email: email,
                        contact: "+919999999999",
                        notes: {
                            name: name,
                            email: email,
                            pan: pan || "",
                            address: address || ""
                        },
                        created_at: Math.floor(Date.now() / 1000)
                    }
                }
            }
        };

        // Construct the internal webhook URL relative to the request
        const webhookUrl = new URL("/api/webhook/razorpay", req.url).toString();

        console.log(`[Simulator] Forwarding mock payload for ${name} (${email}) to ${webhookUrl}`);

        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(mockPayload)
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: "Webhook simulation failed", details: result }, { status: response.status });
        }

        return NextResponse.json({
            success: true,
            message: "Simulation completed successfully. Email sent and record created.",
            paymentId: mockPaymentId,
            details: result
        });

    } catch (error: any) {
        console.error("[Simulator Error]:", error);
        return NextResponse.json({ error: error.message || "Failed to trigger simulation" }, { status: 500 });
    }
}
