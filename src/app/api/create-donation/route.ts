import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function OPTIONS() {
    return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, method, isRecurring } = body;

        // 1. Validation
        if (!amount || amount < 100) {
            return NextResponse.json(
                { error: "Minimum donation amount is ₹100." },
                { status: 400 }
            );
        }

        console.log(`[Donation API] Creating order for ₹${amount} via ${method}`);

        if (method === "razorpay") {
            // Check for placeholder keys to provide better feedback
            if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("placeholder")) {
                console.warn("[Donation API] Using placeholder keys. Returning mock order for UI demonstration.");
                return NextResponse.json({
                    orderId: `mock_order_${crypto.randomBytes(4).toString("hex")}`,
                    amount: amount * 100,
                    currency: "INR",
                    key: "rzp_test_placeholder",
                    isMock: true
                });
            }

            const amountInPaise = Math.round(amount * 100);

            const options = {
                amount: amountInPaise,
                currency: "INR",
                receipt: `rcpt_${crypto.randomBytes(8).toString("hex")}`,
                notes: {
                    isRecurring: isRecurring ? "true" : "false",
                    ngo_reg: "U85300UP2020NPL130635"
                },
            };

            const order = await razorpay.orders.create(options);

            return NextResponse.json({
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
            });
        }

        if (method === "paypal") {
            // For production, you'd integrate PayPal Checkout Server SDK here
            // For now, we return a mock success or redirect URL if implementation is needed
            // However, the prompt asks for separate handling.
            // I will implement a placeholder for PayPal session creation.
            return NextResponse.json({
                message: "PayPal integration is being initialized...",
                // In a real app, return approvalUrl from PayPal API
                approvalUrl: "#"
            });
        }

        return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });

    } catch (error: any) {
        console.error("[Donation API Error]:", error);
        return NextResponse.json(
            { error: "We’re experiencing a temporary issue. Please try again." },
            { status: 500 }
        );
    }
}
