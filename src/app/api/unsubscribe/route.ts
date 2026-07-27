import { NextRequest, NextResponse } from "next/server";
import { unsubscribeUser, enrollSubscriber } from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.redirect(new URL("/unsubscribe?status=error", req.url));
        }

        const success = await unsubscribeUser(email);

        if (success) {
            return NextResponse.redirect(new URL(`/unsubscribe?status=success&email=${encodeURIComponent(email)}`, req.url));
        } else {
            return NextResponse.redirect(new URL("/unsubscribe?status=notfound", req.url));
        }

    } catch (error) {
        console.error("[Unsubscribe API Error]:", error);
        return NextResponse.redirect(new URL("/unsubscribe?status=error", req.url));
    }
}

export async function POST(req: NextRequest) {
    try {
        const { email, action } = await req.json();
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        if (action === "subscribe") {
            await enrollSubscriber(email, "Resubscribed Donor");
            return NextResponse.json({ success: true, message: "Resubscribed successfully!" });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error: any) {
        console.error("[Resubscribe API Error]:", error);
        return NextResponse.json({ error: error.message || "Failed to resubscribe" }, { status: 500 });
    }
}
