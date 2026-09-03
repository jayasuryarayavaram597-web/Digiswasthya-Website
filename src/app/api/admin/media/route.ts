import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { getFirebaseAdminDb } from "@/lib/firebaseAdmin";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "mediaData.json");
const DEFAULT_PIN = "digiswasthya@2026";

function getAdminPin() {
    return process.env.ADMIN_PIN || DEFAULT_PIN;
}

function readLocalMediaData() {
    try {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            return { projectImages: [], infographics: [], mediaCoverage: [], videos: [] };
        }
        const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        return JSON.parse(raw);
    } catch (err) {
        console.error("[Media API] Error reading local mediaData.json:", err);
        return { projectImages: [], infographics: [], mediaCoverage: [], videos: [] };
    }
}

// Retrieves data from Firebase Firestore, automatically seeding from local mediaData.json on first run
async function getMediaData() {
    try {
        const db = getFirebaseAdminDb();
        const docRef = db.collection("media_store").doc("latest");
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            return {
                projectImages: data?.projectImages || [],
                infographics: data?.infographics || [],
                mediaCoverage: data?.mediaCoverage || [],
                videos: data?.videos || []
            };
        }

        // First time initialization: seed Firestore with existing mediaData.json items
        const initialData = readLocalMediaData();
        await docRef.set({
            ...initialData,
            lastUpdated: new Date().toISOString()
        });
        console.log("[Media API] Successfully seeded Firestore with initial media items!");
        return initialData;
    } catch (err) {
        console.warn("[Media API Warning] Firestore read error, using local fallback:", err);
        return readLocalMediaData();
    }
}

// Persists updated media data to Firestore (and local file if environment allows writable disk)
async function saveMediaData(data: any) {
    const db = getFirebaseAdminDb();
    const docRef = db.collection("media_store").doc("latest");

    // 1. Cloud persistence (works everywhere including Vercel serverless)
    await docRef.set({
        ...data,
        lastUpdated: new Date().toISOString()
    });

    // 2. Local disk synchronization (for local dev workflow)
    try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch {
        // Read-only filesystem on Vercel is expected and normal
    }
}

// Optimizes image and stores in Firestore media_images collection, returning a fast CDN-cached URL
async function storeImageFile(file: File, prefix: string): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());

    // High-performance image optimization: max 1400px, WebP format (typically 80-180 KB)
    const optimized = await sharp(buffer)
        .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

    const docId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const db = getFirebaseAdminDb();

    await db.collection("media_images").doc(docId).set({
        fileName: file.name,
        mimeType: "image/webp",
        base64Data: optimized.toString("base64"),
        size: optimized.length,
        prefix,
        createdAt: new Date().toISOString()
    });

    return `/api/media/image/${docId}`;
}

// Cleanly removes stored image from Firestore if item is edited or deleted
async function deleteStoredImageIfAny(imagePathOrUrl?: string) {
    if (!imagePathOrUrl) return;
    const match = imagePathOrUrl.match(/\/api\/media\/image\/(img_[a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        try {
            const db = getFirebaseAdminDb();
            await db.collection("media_images").doc(match[1]).delete();
            console.log(`[Media API] Deleted stored image: ${match[1]}`);
        } catch (err) {
            console.warn(`[Media API Warning] Failed to delete image doc ${match[1]}:`, err);
        }
    }
}

function extractYouTubeId(urlOrId: string): string | null {
    if (!urlOrId) return null;
    const clean = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
        return clean;
    }
    const match = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : null;
}

// GET: Fetch all current media items (from Firestore with fallback)
export async function GET() {
    const data = await getMediaData();
    return NextResponse.json(data);
}

// POST: Add new YouTube video, News item, or Field Work photo
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const pin = formData.get("pin") as string;

        if (pin !== getAdminPin()) {
            return NextResponse.json({ error: "Invalid Admin PIN. Access Denied." }, { status: 401 });
        }

        const type = formData.get("type") as "video" | "news" | "field_work";
        const title = (formData.get("title") as string || "").trim();
        const category = (formData.get("category") as string || "General").trim();
        const description = (formData.get("description") as string || "").trim();

        if (!title) {
            return NextResponse.json({ error: "Title is required." }, { status: 400 });
        }

        const mediaData = await getMediaData();

        // 1. Handle YouTube Video
        if (type === "video") {
            const videoUrl = formData.get("videoUrl") as string;
            const videoId = extractYouTubeId(videoUrl);

            if (!videoId) {
                return NextResponse.json({ error: "Invalid YouTube Link or Video ID. Please check the URL." }, { status: 400 });
            }

            const newVideo = {
                id: videoId,
                title,
                category: category || "Documentary",
                duration: (formData.get("duration") as string || "3 min").trim(),
                createdAt: new Date().toISOString()
            };

            // Prevent exact duplicates
            const exists = mediaData.videos.some((v: any) => v.id === videoId);
            if (!exists) {
                mediaData.videos.unshift(newVideo);
                await saveMediaData(mediaData);
            }

            return NextResponse.json({ success: true, item: newVideo, message: "YouTube video added successfully!" });
        }

        // 2. Handle News / Press Item OR Field Work Photo
        if (type === "news" || type === "field_work") {
            const rawFiles = [...formData.getAll("images"), ...formData.getAll("image")];
            const files = rawFiles.filter(f => f && typeof f !== "string" && (f as File).size > 0) as File[];

            if (files.length === 0) {
                return NextResponse.json({ error: "Please select at least one photo to upload." }, { status: 400 });
            }

            const newItems: Array<{ title: string; description: string; image: string; category: string; createdAt: string }> = [];
            const timestampNow = new Date().toISOString();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const imageUrl = await storeImageFile(file, type);
                const itemTitle = files.length > 1 ? `${title} (${i + 1})` : title;

                newItems.push({
                    title: itemTitle,
                    description: description || title,
                    image: imageUrl,
                    category: category || (type === "news" ? "News" : "Field Work"),
                    createdAt: timestampNow
                });
            }

            if (type === "news") {
                mediaData.mediaCoverage.unshift(...newItems);
            } else {
                mediaData.projectImages.unshift(...newItems);
            }

            await saveMediaData(mediaData);
            const msg = newItems.length > 1 
                ? `Successfully published batch of ${newItems.length} photos!` 
                : "Published photo live to website successfully!";

            return NextResponse.json({ success: true, items: newItems, count: newItems.length, message: msg });
        }

        return NextResponse.json({ error: "Invalid content type." }, { status: 400 });

    } catch (error: any) {
        console.error("[Admin Media API Error]:", error);
        return NextResponse.json({ error: error.message || "Failed to save item." }, { status: 500 });
    }
}

// DELETE: Remove a video or photo
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const pin = searchParams.get("pin");
        const type = searchParams.get("type");
        const idOrTitle = searchParams.get("idOrTitle");

        if (pin !== getAdminPin()) {
            return NextResponse.json({ error: "Invalid Admin PIN. Access Denied." }, { status: 401 });
        }

        if (!type || !idOrTitle) {
            return NextResponse.json({ error: "Missing type or identifier." }, { status: 400 });
        }

        const mediaData = await getMediaData();

        if (type === "video") {
            mediaData.videos = mediaData.videos.filter((v: any) => v.id !== idOrTitle && v.title !== idOrTitle);
        } else if (type === "news") {
            const item = mediaData.mediaCoverage.find((n: any) => n.title === idOrTitle || n.image === idOrTitle);
            if (item) await deleteStoredImageIfAny(item.image);
            mediaData.mediaCoverage = mediaData.mediaCoverage.filter((n: any) => n.title !== idOrTitle && n.image !== idOrTitle);
        } else if (type === "field_work") {
            const item = mediaData.projectImages.find((p: any) => p.title === idOrTitle || p.image === idOrTitle);
            if (item) await deleteStoredImageIfAny(item.image);
            mediaData.projectImages = mediaData.projectImages.filter((p: any) => p.title !== idOrTitle && p.image !== idOrTitle);
        }

        await saveMediaData(mediaData);
        return NextResponse.json({ success: true, message: "Item deleted successfully." });

    } catch (error: any) {
        console.error("[Admin Delete Error]:", error);
        return NextResponse.json({ error: error.message || "Failed to delete item." }, { status: 500 });
    }
}

// PUT: Update an existing video, news, or field work photo
export async function PUT(req: NextRequest) {
    try {
        const formData = await req.formData();
        const pin = formData.get("pin") as string;

        if (pin !== getAdminPin()) {
            return NextResponse.json({ error: "Invalid Admin PIN. Access Denied." }, { status: 401 });
        }

        const type = formData.get("type") as "video" | "news" | "field_work";
        const originalIdOrTitle = formData.get("originalIdOrTitle") as string;
        const title = (formData.get("title") as string || "").trim();
        const category = (formData.get("category") as string || "General").trim();
        const description = (formData.get("description") as string || "").trim();

        if (!type || !originalIdOrTitle || !title) {
            return NextResponse.json({ error: "Type, original identifier, and title are required." }, { status: 400 });
        }

        const mediaData = await getMediaData();

        // 1. Update Video
        if (type === "video") {
            const videoIndex = mediaData.videos.findIndex((v: any) => v.id === originalIdOrTitle || v.title === originalIdOrTitle);
            if (videoIndex === -1) {
                return NextResponse.json({ error: "Video not found to update." }, { status: 404 });
            }

            const videoUrl = formData.get("videoUrl") as string;
            const newVideoId = videoUrl ? extractYouTubeId(videoUrl) : mediaData.videos[videoIndex].id;

            mediaData.videos[videoIndex] = {
                ...mediaData.videos[videoIndex],
                id: newVideoId || mediaData.videos[videoIndex].id,
                title,
                category: category || "Documentary",
                duration: (formData.get("duration") as string || mediaData.videos[videoIndex].duration || "3 min").trim()
            };

            await saveMediaData(mediaData);
            return NextResponse.json({ success: true, item: mediaData.videos[videoIndex], message: "Video updated successfully!" });
        }

        // 2. Update News or Field Work
        if (type === "news" || type === "field_work") {
            const list = type === "news" ? mediaData.mediaCoverage : mediaData.projectImages;
            const itemIndex = list.findIndex((item: any) => item.title === originalIdOrTitle || item.image === originalIdOrTitle);

            if (itemIndex === -1) {
                return NextResponse.json({ error: "Item not found to update." }, { status: 404 });
            }

            const file = formData.get("image") as File | null;
            if (file && typeof file !== "string" && file.size > 0) {
                const oldImage = list[itemIndex].image;
                const newImageUrl = await storeImageFile(file, type);
                await deleteStoredImageIfAny(oldImage);
                list[itemIndex].image = newImageUrl;
            }

            list[itemIndex] = {
                ...list[itemIndex],
                title,
                description: description || title,
                category: category || (type === "news" ? "News" : "Field Work")
            };

            await saveMediaData(mediaData);
            return NextResponse.json({ success: true, item: list[itemIndex], message: "Item updated successfully!" });
        }

        return NextResponse.json({ error: "Invalid content type." }, { status: 400 });

    } catch (error: any) {
        console.error("[Admin Media PUT Error]:", error);
        return NextResponse.json({ error: error.message || "Failed to update item." }, { status: 500 });
    }
}
