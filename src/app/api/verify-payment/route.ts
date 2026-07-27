import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET || "";

        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            console.log("[Payment Verification] Success:", razorpay_payment_id);
            return NextResponse.json({ success: true });
        } else {
            console.error("[Payment Verification] Failed: Signature Mismatch");
            return NextResponse.json({ success: false, error: "Signature verification failed" }, { status: 400 });
        }
    } catch (error) {
        console.error("[Payment Verification Error]:", error);
        return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
    }
}
