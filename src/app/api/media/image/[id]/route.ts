import { NextRequest, NextResponse } from "next/server";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        // Safe ID resolution across Next.js versions
        let imageId = "";
        if (context && context.params) {
            const resolved = await context.params;
            imageId = resolved.id || "";
        }
        if (!imageId) {
            imageId = req.nextUrl.pathname.split("/").pop() || "";
        }

        if (!imageId) {
            return NextResponse.json({ error: "Image ID required" }, { status: 400 });
        }

        const db = getFirebaseAdminDb();
        const docSnap = await db.collection("media_images").doc(imageId).get();

        if (!docSnap.exists) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }

        const data = docSnap.data();
        if (!data || !data.base64Data) {
            return NextResponse.json({ error: "Invalid image data" }, { status: 404 });
        }

        const imageBuffer = Buffer.from(data.base64Data, "base64");
        const contentType = data.mimeType || "image/webp";

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Length": imageBuffer.length.toString(),
                // Cache aggressively: 1 year public cache + stale-while-revalidate for CDN
                "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
            },
        });
    } catch (err: any) {
        console.error("[Media Image Serve Error]:", err);
        return NextResponse.json({ error: "Failed to load image" }, { status: 500 });
    }
}
