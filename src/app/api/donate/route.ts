import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "your_secret_here",
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { amount, isRecurring } = body;

        // 1. Basic Validation
        if (!amount || amount < 1) {
            return NextResponse.json(
                { error: "Invalid donation amount." },
                { status: 400 }
            );
        }

        // 2. Logging for debugging (In production, use a proper logger)
        console.log(`[Donation API] Received request for ₹${amount}. Recurring: ${isRecurring}`);

        // 3. Create Razorpay Order
        // Amount is in smaller currency unit (paise for INR)
        const amountInPaise = Math.round(amount * 100);

        const options = {
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_don_${Date.now()}`,
            notes: {
                isRecurring: isRecurring.toString(),
                source: "DigiSwasthya Website",
            },
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            throw new Error("Failed to create Razorpay order");
        }

        return NextResponse.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
        });

    } catch (error: any) {
        console.error("[Donation API Error]:", error);

        // Return a friendly error message to the client
        return NextResponse.json(
            { error: "Gateway connection failed. Please try again in a moment." },
            { status: 502 } // Bad Gateway (user's current issue, now handled)
        );
    }
}
