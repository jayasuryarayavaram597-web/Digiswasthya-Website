import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "mediaData.json");
const DEFAULT_PIN = "digiswasthya@2026";

function getAdminPin() {
    return process.env.ADMIN_PIN || DEFAULT_PIN;
}

function readMediaData() {
    try {
        if (!fs.existsSync(DATA_FILE_PATH)) {
            return { projectImages: [], infographics: [], mediaCoverage: [], videos: [] };
        }
        const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        return JSON.parse(raw);
    } catch (err) {
        console.error("[Media API] Error reading mediaData.json:", err);
        return { projectImages: [], infographics: [], mediaCoverage: [], videos: [] };
    }
}

function writeMediaData(data: any) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function extractYouTubeId(urlOrId: string): string | null {
    if (!urlOrId) return null;
    const clean = urlOrId.trim();
    // If it's already an 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
        return clean;
    }
    // Regex for full youtube.com / youtu.be / shorts URLs
    const match = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
    return match ? match[1] : null;
}

// GET: Fetch all current media items
export async function GET() {
    const data = readMediaData();
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

        const mediaData = readMediaData();

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
                duration: (formData.get("duration") as string || "3 min").trim()
            };

            // Prevent exact duplicates
            const exists = mediaData.videos.some((v: any) => v.id === videoId);
            if (!exists) {
                mediaData.videos.unshift(newVideo);
                writeMediaData(mediaData);
            }

            return NextResponse.json({ success: true, item: newVideo, message: "YouTube video added successfully!" });
        }

        // 2. Handle News / Press Item OR Field Work Photo
        if (type === "news" || type === "field_work") {
            const file = formData.get("image") as File | null;
            let imagePath = formData.get("imagePath") as string || "";

            if (file && typeof file !== "string" && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
                
                const targetSubDir = type === "news" ? "media" : "resources";
                const targetFolder = path.join(process.cwd(), "public", "images", targetSubDir);

                if (!fs.existsSync(targetFolder)) {
                    fs.mkdirSync(targetFolder, { recursive: true });
                }

                const fullPath = path.join(targetFolder, cleanFileName);
                fs.writeFileSync(fullPath, buffer);
                imagePath = `/images/${targetSubDir}/${cleanFileName}`;
            }

            if (!imagePath) {
                return NextResponse.json({ error: "Please select an image to upload." }, { status: 400 });
            }

            const newItem = {
                title,
                description: description || title,
                image: imagePath,
                category: category || (type === "news" ? "News" : "Field Work")
            };

            if (type === "news") {
                mediaData.mediaCoverage.unshift(newItem);
            } else {
                mediaData.projectImages.unshift(newItem);
            }

            writeMediaData(mediaData);
            return NextResponse.json({ success: true, item: newItem, message: "Published successfully!" });
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

        const mediaData = readMediaData();

        if (type === "video") {
            mediaData.videos = mediaData.videos.filter((v: any) => v.id !== idOrTitle && v.title !== idOrTitle);
        } else if (type === "news") {
            mediaData.mediaCoverage = mediaData.mediaCoverage.filter((n: any) => n.title !== idOrTitle && n.image !== idOrTitle);
        } else if (type === "field_work") {
            mediaData.projectImages = mediaData.projectImages.filter((p: any) => p.title !== idOrTitle && p.image !== idOrTitle);
        }

        writeMediaData(mediaData);
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

        const mediaData = readMediaData();

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

            writeMediaData(mediaData);
            return NextResponse.json({ success: true, item: mediaData.videos[videoIndex], message: "Video updated successfully!" });
        }

        // 2. Update News or Field Work
        if (type === "news" || type === "field_work") {
            const list = type === "news" ? mediaData.mediaCoverage : mediaData.projectImages;
            const itemIndex = list.findIndex((item: any) => item.title === originalIdOrTitle || item.image === originalIdOrTitle);

            if (itemIndex === -1) {
                return NextResponse.json({ error: "Item not found to update." }, { status: 404 });
            }

            let imagePath = list[itemIndex].image;
            const file = formData.get("image") as File | null;

            if (file && typeof file !== "string" && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
                
                const targetSubDir = type === "news" ? "media" : "resources";
                const targetFolder = path.join(process.cwd(), "public", "images", targetSubDir);

                if (!fs.existsSync(targetFolder)) {
                    fs.mkdirSync(targetFolder, { recursive: true });
                }

                const fullPath = path.join(targetFolder, cleanFileName);
                fs.writeFileSync(fullPath, buffer);
                imagePath = `/images/${targetSubDir}/${cleanFileName}`;
            }

            list[itemIndex] = {
                ...list[itemIndex],
                title,
                description: description || title,
                image: imagePath,
                category: category || (type === "news" ? "News" : "Field Work")
            };

            writeMediaData(mediaData);
            return NextResponse.json({ success: true, item: list[itemIndex], message: "Item updated successfully!" });
        }

        return NextResponse.json({ error: "Invalid content type." }, { status: 400 });

    } catch (error: any) {
        console.error("[Admin Media PUT Error]:", error);
        return NextResponse.json({ error: error.message || "Failed to update item." }, { status: 500 });
    }
}

