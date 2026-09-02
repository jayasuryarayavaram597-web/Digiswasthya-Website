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

// POST: Add new YouTube video, News item, or Field Work photo (supports single or batch uploads)
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

        // 2. Handle News / Press Item OR Field Work Photo (Supports Single & Multiple Batch Files)
        if (type === "news" || type === "field_work") {
            // Check for multiple files
            const allFiles = formData.getAll("image").filter(f => f && typeof f !== "string" && (f as File).size > 0) as File[];
            const extraFiles = formData.getAll("images").filter(f => f && typeof f !== "string" && (f as File).size > 0) as File[];
            const combinedFiles = [...allFiles, ...extraFiles];

            const targetSubDir = type === "news" ? "media" : "resources";
            const targetFolder = path.join(process.cwd(), "public", "images", targetSubDir);

            if (!fs.existsSync(targetFolder)) {
                fs.mkdirSync(targetFolder, { recursive: true });
            }

            if (combinedFiles.length === 0) {
                // Check if an existing imagePath was provided
                const fallbackPath = formData.get("imagePath") as string;
                if (!fallbackPath) {
                    return NextResponse.json({ error: "Please select at least one photo to upload." }, { status: 400 });
                }

                const newItem = {
                    title,
                    description: description || title,
                    image: fallbackPath,
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

            // Process all uploaded files
            const addedItems: any[] = [];
            const timestamp = Date.now();

            for (let i = 0; i < combinedFiles.length; i++) {
                const file = combinedFiles[i];
                const buffer = Buffer.from(await file.arrayBuffer());
                const cleanFileName = `${timestamp}_${i + 1}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
                const fullPath = path.join(targetFolder, cleanFileName);
                
                fs.writeFileSync(fullPath, buffer);
                const imagePath = `/images/${targetSubDir}/${cleanFileName}`;

                // If multiple photos, number them nicely if title is generic
                const itemTitle = combinedFiles.length > 1 ? `${title} (Photo ${i + 1})` : title;

                const newItem = {
                    title: itemTitle,
                    description: description || title,
                    image: imagePath,
                    category: category || (type === "news" ? "News" : "Field Work")
                };

                addedItems.push(newItem);

                if (type === "news") {
                    mediaData.mediaCoverage.unshift(newItem);
                } else {
                    mediaData.projectImages.unshift(newItem);
                }
            }

            writeMediaData(mediaData);
            return NextResponse.json({ 
                success: true, 
                items: addedItems, 
                message: combinedFiles.length > 1 
                    ? `Successfully uploaded all ${combinedFiles.length} photos!` 
                    : "Published successfully!" 
            });
        }

        return NextResponse.json({ error: "Invalid content type." }, { status: 400 });

    } catch (error: any) {
        console.error("[Admin Media API Error]:", error);
        return NextResponse.json({ error: error.message || "Failed to save item." }, { status: 500 });
    }
}

// PUT: Edit / Update an existing video, news, or field work item
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { pin, type, originalId, originalTitle, originalImage, updatedTitle, updatedCategory, updatedDescription, updatedDuration } = body;

        if (pin !== getAdminPin()) {
            return NextResponse.json({ error: "Invalid Admin PIN. Access Denied." }, { status: 401 });
        }

        if (!type) {
            return NextResponse.json({ error: "Content type is required." }, { status: 400 });
        }

        const mediaData = readMediaData();

        if (type === "video") {
            const index = mediaData.videos.findIndex((v: any) => v.id === originalId || v.title === originalTitle);
            if (index === -1) {
                return NextResponse.json({ error: "Video item not found." }, { status: 404 });
            }
            if (updatedTitle) mediaData.videos[index].title = updatedTitle.trim();
            if (updatedCategory) mediaData.videos[index].category = updatedCategory.trim();
            if (updatedDuration) mediaData.videos[index].duration = updatedDuration.trim();
            writeMediaData(mediaData);
            return NextResponse.json({ success: true, message: "Video updated successfully!", item: mediaData.videos[index] });
        }

        if (type === "news") {
            const index = mediaData.mediaCoverage.findIndex((n: any) => n.image === originalImage || n.title === originalTitle);
            if (index === -1) {
                return NextResponse.json({ error: "News item not found." }, { status: 404 });
            }
            if (updatedTitle) mediaData.mediaCoverage[index].title = updatedTitle.trim();
            if (updatedCategory) mediaData.mediaCoverage[index].category = updatedCategory.trim();
            if (updatedDescription !== undefined) mediaData.mediaCoverage[index].description = updatedDescription.trim();
            writeMediaData(mediaData);
            return NextResponse.json({ success: true, message: "News item updated successfully!", item: mediaData.mediaCoverage[index] });
        }

        if (type === "field_work") {
            const index = mediaData.projectImages.findIndex((p: any) => p.image === originalImage || p.title === originalTitle);
            if (index === -1) {
                return NextResponse.json({ error: "Field work item not found." }, { status: 404 });
            }
            if (updatedTitle) mediaData.projectImages[index].title = updatedTitle.trim();
            if (updatedCategory) mediaData.projectImages[index].category = updatedCategory.trim();
            if (updatedDescription !== undefined) mediaData.projectImages[index].description = updatedDescription.trim();
            writeMediaData(mediaData);
            return NextResponse.json({ success: true, message: "Field work item updated successfully!", item: mediaData.projectImages[index] });
        }

        return NextResponse.json({ error: "Invalid type specified." }, { status: 400 });

    } catch (error: any) {
        console.error("[Admin Media PUT Error]:", error);
        return NextResponse.json({ error: error.message || "Failed to update item." }, { status: 500 });
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
