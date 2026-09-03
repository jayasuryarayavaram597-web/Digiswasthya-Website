import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PIN = "digiswasthya@2026";

function getAdminPin() {
    return process.env.ADMIN_PIN || DEFAULT_PIN;
}

// POST: Verify admin PIN
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const pin = body.pin as string;

        if (!pin || pin !== getAdminPin()) {
            return NextResponse.json({ error: "Invalid Admin PIN." }, { status: 401 });
        }

        return NextResponse.json({ success: true, message: "PIN verified." });
    } catch {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
}
