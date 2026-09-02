"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Lock, Video, Newspaper, Tent, PlusCircle, Trash2, 
    CheckCircle2, AlertCircle, Eye, RefreshCw, Upload, LogOut, ArrowRight, 
    ShieldCheck, Edit3, X, Sparkles, Image as ImageIcon, Layers, FileText
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ContentType = "video" | "news" | "field_work";

interface MediaData {
    projectImages: Array<{ title: string; description: string; image: string; category: string }>;
    mediaCoverage: Array<{ title: string; description: string; image: string; category: string }>;
    videos: Array<{ id: string; title: string; category: string; duration?: string }>;
}

interface EditModalState {
    type: "video" | "news" | "field_work";
    originalKey: {
        id?: string;
        title?: string;
        image?: string;
    };
    title: string;
    category: string;
    description: string;
    duration?: string;
}

// Preset Category Pills and Starter Templates
const CATEGORY_PRESETS: Record<ContentType, Array<{ label: string; template: string }>> = {
    video: [
        { label: "Documentary", template: "Documentary showcasing DigiSwasthya Foundation's telemedicine impact in rural India." },
        { label: "Patient Story", template: "A real inspiring story of rural patient treatment and recovery through DigiSwasthya." },
        { label: "Founder Interview", template: "Founder Sandeep Kumar shares the mission and vision of accessible rural healthcare." },
        { label: "Health Awareness", template: "Doctor guidance and health awareness for rural families and village communities." },
        { label: "Ground Impact", template: "Real-time look at ground operations, patient consultations, and village outreach." }
    ],
    news: [
        { label: "National News", template: "DigiSwasthya Foundation featured in national media for revolutionizing rural telemedicine." },
        { label: "TV / Broadcast", template: "Television coverage highlighting DigiSwasthya's zero-cost healthcare model for villagers." },
        { label: "Award & Recognition", template: "DigiSwasthya honored for excellence in social entrepreneurship and healthcare innovation." },
        { label: "Govt & Partner", template: "Strategic partnership and government recognition expanding tele-health reach." },
        { label: "Online Press", template: "Digital press feature highlighting rural health accessibility milestones." }
    ],
    field_work: [
        { label: "Rural Health Camp", template: "Free doctor consultation and health screening camp organized by DigiSwasthya." },
        { label: "Telemedicine Center", template: "Patients receiving expert super-specialist consultations at DigiSwasthya center." },
        { label: "Patient Consultation", template: "Doctors diagnosing and advising village patients with care and free medicines." },
        { label: "Community Outreach", template: "Field volunteers creating health awareness across remote rural households." },
        { label: "Specialist Visit", template: "Senior medical specialists conducting direct patient evaluations at the village center." }
    ]
};

export default function AdminPage() {
    // Auth State
    const [pin, setPin] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState("");

    // Form State
    const [contentType, setContentType] = useState<ContentType>("video");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Documentary");
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [customCategoryText, setCustomCategoryText] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [duration, setDuration] = useState("3 min");
    
    // Multi-File Upload State
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isFetchingYouTubeTitle, setIsFetchingYouTubeTitle] = useState(false);
    const [youTubeAutoTitleNote, setYouTubeAutoTitleNote] = useState<string | null>(null);

    // Submission & Data State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [mediaData, setMediaData] = useState<MediaData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit Modal State
    const [editingItem, setEditingItem] = useState<EditModalState | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Check existing session
    useEffect(() => {
        const savedPin = sessionStorage.getItem("digiswasthya_admin_pin");
        if (savedPin) {
            setPin(savedPin);
            verifyPin(savedPin);
        }
    }, []);

    // Sync default category when switching content type
    useEffect(() => {
        const presets = CATEGORY_PRESETS[contentType];
        if (presets && presets.length > 0 && !isCustomCategory) {
            setCategory(presets[0].label);
        }
    }, [contentType]);

    const verifyPin = async (pinToTest: string) => {
        setAuthError("");
        try {
            const res = await fetch("/api/admin/media");
            if (res.ok) {
                sessionStorage.setItem("digiswasthya_admin_pin", pinToTest);
                setIsAuthenticated(true);
                fetchCurrentData();
            }
        } catch {
            setAuthError("Failed to connect to server.");
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pin.trim()) {
            setAuthError("Please enter the Admin PIN.");
            return;
        }
        sessionStorage.setItem("digiswasthya_admin_pin", pin.trim());
        setIsAuthenticated(true);
        fetchCurrentData();
    };

    const handleLogout = () => {
        sessionStorage.removeItem("digiswasthya_admin_pin");
        setIsAuthenticated(false);
        setPin("");
    };

    const fetchCurrentData = async () => {
        setIsLoadingData(true);
        try {
            const res = await fetch("/api/admin/media");
            if (res.ok) {
                const data = await res.json();
                setMediaData(data);
            }
        } catch (err) {
            console.error("Failed to load media data:", err);
        } finally {
            setIsLoadingData(false);
        }
    };

    const extractYouTubeId = (url: string) => {
        if (!url) return null;
        const clean = url.trim();
        const match = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
        return match ? match[1] : clean.length === 11 ? clean : null;
    };

    // Auto-fetch YouTube Video Title via free public oEmbed
    const handleYouTubeUrlChange = async (newUrl: string) => {
        setVideoUrl(newUrl);
        setYouTubeAutoTitleNote(null);

        const videoId = extractYouTubeId(newUrl);
        if (videoId) {
            setIsFetchingYouTubeTitle(true);
            try {
                // Free public YouTube oEmbed endpoint (zero API key needed)
                const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.title) {
                        setTitle(data.title);
                        setYouTubeAutoTitleNote(data.title);
                    }
                }
            } catch (err) {
                // Silently fallback without disrupting the user
            } finally {
                setIsFetchingYouTubeTitle(false);
            }
        }
    };

    // Multi-File selection & Smart Filename Extraction
    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Revoke old preview URLs to prevent memory leaks
        previewUrls.forEach(url => URL.revokeObjectURL(url));

        setSelectedFiles(files);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(newPreviews);

        // Smart Filename Auto-Suggest for Title
        if (!title.trim() && files.length > 0) {
            const rawName = files[0].name.replace(/\.[^/.]+$/, ""); // strip extension
            const cleanedTitle = rawName
                .replace(/[-_]+/g, " ")
                .replace(/\s+/g, " ")
                .trim()
                .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize words
            
            setTitle(cleanedTitle);
        }
    };

    // Remove single photo from batch before uploading
    const handleRemoveFile = (indexToRemove: number) => {
        URL.revokeObjectURL(previewUrls[indexToRemove]);
        const updatedFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
        const updatedPreviews = previewUrls.filter((_, idx) => idx !== indexToRemove);
        setSelectedFiles(updatedFiles);
        setPreviewUrls(updatedPreviews);
    };

    // Category Pill Click Handler with Starter Template Auto-Fill
    const handleSelectCategoryPill = (preset: { label: string; template: string }) => {
        setIsCustomCategory(false);
        setCategory(preset.label);

        // If description is empty or matches a preset template, insert clean starter template
        if (!description.trim() || Object.values(CATEGORY_PRESETS).flat().some(p => p.template === description)) {
            setDescription(preset.template);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedbackMessage(null);
        setIsSubmitting(true);

        const effectiveCategory = isCustomCategory ? customCategoryText.trim() || "General" : category;

        try {
            const formData = new FormData();
            formData.append("pin", pin || sessionStorage.getItem("digiswasthya_admin_pin") || "");
            formData.append("type", contentType);
            formData.append("title", title);
            formData.append("category", effectiveCategory);
            formData.append("description", description);

            if (contentType === "video") {
                formData.append("videoUrl", videoUrl);
                formData.append("duration", duration);
            } else {
                if (selectedFiles.length === 0) {
                    throw new Error("Please select at least one photo to upload.");
                }
                // Append all selected files for batch processing
                selectedFiles.forEach(file => {
                    formData.append("images", file);
                });
            }

            const res = await fetch("/api/admin/media", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || "Failed to publish content.");
            }

            setFeedbackMessage({ type: "success", text: result.message || "Published live to website successfully!" });
            
            // Reset form
            setTitle("");
            setDescription("");
            setVideoUrl("");
            setSelectedFiles([]);
            setPreviewUrls([]);
            setYouTubeAutoTitleNote(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

            // Refresh data list
            fetchCurrentData();

        } catch (err: any) {
            setFeedbackMessage({ type: "error", text: err.message || "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (type: "video" | "news" | "field_work", idOrTitle: string) => {
        if (!confirm(`Are you sure you want to delete this item?`)) return;

        try {
            const currentPin = pin || sessionStorage.getItem("digiswasthya_admin_pin") || "";
            const res = await fetch(`/api/admin/media?pin=${encodeURIComponent(currentPin)}&type=${type}&idOrTitle=${encodeURIComponent(idOrTitle)}`, {
                method: "DELETE"
            });

            if (res.ok) {
                fetchCurrentData();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to delete item.");
            }
        } catch (err) {
            alert("Error connecting to server.");
        }
    };

    // Open Edit Modal for existing item
    const handleOpenEdit = (type: "video" | "news" | "field_work", item: any) => {
        setEditingItem({
            type,
            originalKey: {
                id: item.id,
                title: item.title,
                image: item.image
            },
            title: item.title || "",
            category: item.category || "",
            description: item.description || "",
            duration: item.duration || "3 min"
        });
    };

    // Save Edit Modal changes via PUT
    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        setIsUpdating(true);
        try {
            const currentPin = pin || sessionStorage.getItem("digiswasthya_admin_pin") || "";
            const res = await fetch("/api/admin/media", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pin: currentPin,
                    type: editingItem.type,
                    originalId: editingItem.originalKey.id,
                    originalTitle: editingItem.originalKey.title,
                    originalImage: editingItem.originalKey.image,
                    updatedTitle: editingItem.title,
                    updatedCategory: editingItem.category,
                    updatedDescription: editingItem.description,
                    updatedDuration: editingItem.duration
                })
            });

            const result = await res.json();
            if (!res.ok) {
                alert(result.error || "Failed to update item.");
            } else {
                setEditingItem(null);
                fetchCurrentData();
            }
        } catch (err) {
            alert("Failed to connect to server.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col justify-between">
            <Navbar />

            <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl flex-grow">
                
                {/* ─── AUTH SCREEN (IF NOT LOGGED IN) ─── */}
                {!isAuthenticated ? (
                    <div className="max-w-md mx-auto my-16 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex p-4 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-4">
                                <Lock className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-black text-white">Staff Admin Portal</h1>
                            <p className="text-slate-400 text-sm mt-2">
                                Enter your DigiSwasthya staff PIN to manage YouTube videos, news coverage, and camp photos.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                    Admin Secret PIN / Password
                                </label>
                                <input
                                    type="password"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    placeholder="Enter secret PIN"
                                    className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-4 text-white font-bold text-lg outline-none transition-all placeholder:text-slate-500 focus:ring-4 focus:ring-orange-500/10"
                                />
                            </div>

                            {authError && (
                                <p className="text-sm font-semibold text-red-400 bg-red-950/50 p-3 rounded-xl border border-red-800/50">
                                    {authError}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="w-full py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Login to Dashboard <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                ) : (
                    /* ─── ADMIN DASHBOARD ─── */
                    <div className="space-y-12">
                        
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                            <div>
                                <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
                                    <ShieldCheck className="w-4 h-4" /> Authenticated Staff Session
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-black text-white">Media & Content Manager</h1>
                                <p className="text-slate-400 text-sm mt-1">
                                    Publish videos, press features, and camp photos directly to the public website.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link 
                                    href="/media" 
                                    target="_blank"
                                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
                                >
                                    <Eye className="w-4 h-4" /> View Live /media Page
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors border border-red-800/40 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        </div>

                        {/* ─── ADD NEW CONTENT FORM ─── */}
                        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />
                            
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
                                <PlusCircle className="w-6 h-6 text-orange-400" /> Add New Content
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* 1. The 3-Way Category Selector */}
                                <div>
                                    <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block mb-3">
                                        Step 1: Choose What You Want to Add
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => { setContentType("video"); setSelectedFiles([]); setPreviewUrls([]); }}
                                            className={`p-4 rounded-2xl border-2 font-bold text-sm flex items-center gap-3 transition-all cursor-pointer ${
                                                contentType === "video"
                                                    ? "bg-orange-500/15 border-orange-500 text-orange-300 shadow-md ring-2 ring-orange-500/20"
                                                    : "bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600"
                                            }`}
                                        >
                                            <Video className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                            <div className="text-left">
                                                <div>YouTube Video</div>
                                                <div className="text-[11px] font-normal text-slate-400">Documentary / Story</div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => { setContentType("news"); setVideoUrl(""); }}
                                            className={`p-4 rounded-2xl border-2 font-bold text-sm flex items-center gap-3 transition-all cursor-pointer ${
                                                contentType === "news"
                                                    ? "bg-orange-500/15 border-orange-500 text-orange-300 shadow-md ring-2 ring-orange-500/20"
                                                    : "bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600"
                                            }`}
                                        >
                                            <Newspaper className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                            <div className="text-left">
                                                <div>News & Press</div>
                                                <div className="text-[11px] font-normal text-slate-400">Article / Media</div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => { setContentType("field_work"); setVideoUrl(""); }}
                                            className={`p-4 rounded-2xl border-2 font-bold text-sm flex items-center gap-3 transition-all cursor-pointer ${
                                                contentType === "field_work"
                                                    ? "bg-orange-500/15 border-orange-500 text-orange-300 shadow-md ring-2 ring-orange-500/20"
                                                    : "bg-slate-800/60 border-slate-700/80 text-slate-400 hover:border-slate-600"
                                            }`}
                                        >
                                            <Tent className="w-5 h-5 text-orange-400 flex-shrink-0" />
                                            <div className="text-left">
                                                <div>Field Work Photo</div>
                                                <div className="text-[11px] font-normal text-slate-400">Rural Camp / Center</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* 2. Smart Category Quick-Select Pills */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Category Tag (1-Click Selection)
                                        </label>
                                        <span className="text-[11px] text-orange-400 font-medium flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" /> Auto-suggests description template
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {CATEGORY_PRESETS[contentType]?.map((preset, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleSelectCategoryPill(preset)}
                                                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                                    !isCustomCategory && category === preset.label
                                                        ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-105"
                                                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                                                }`}
                                            >
                                                <span>✓</span> {preset.label}
                                            </button>
                                        ))}

                                        {/* Custom Tag Option */}
                                        <button
                                            type="button"
                                            onClick={() => setIsCustomCategory(true)}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                                isCustomCategory
                                                    ? "bg-amber-500 text-slate-950 font-black shadow-md"
                                                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-dashed border-slate-600"
                                            }`}
                                        >
                                            + Custom Tag...
                                        </button>
                                    </div>

                                    {/* Custom Tag Input (if active) */}
                                    {isCustomCategory && (
                                        <input
                                            type="text"
                                            autoFocus
                                            value={customCategoryText}
                                            onChange={(e) => setCustomCategoryText(e.target.value)}
                                            placeholder="Type custom category name (e.g. Dental Health Camp)"
                                            className="w-full bg-slate-800/90 border-2 border-amber-500/80 rounded-xl p-3 text-white font-semibold text-xs outline-none transition-all placeholder:text-slate-500"
                                        />
                                    )}
                                </div>

                                {/* 3. Title Field with Filename/YouTube Auto-Suggest */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Title / Headline *
                                        </label>
                                        {youTubeAutoTitleNote && (
                                            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" /> Auto-fetched from YouTube!
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder={
                                            contentType === "video" 
                                                ? "e.g. Telemedicine Camp in Basti Village" 
                                                : contentType === "news" 
                                                ? "e.g. DD News Coverage of DigiSwasthya" 
                                                : "e.g. Medical Team Consulting Patients at DS1"
                                        }
                                        className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-4 text-white font-semibold text-sm outline-none transition-all placeholder:text-slate-500"
                                    />
                                </div>

                                {/* 4A. Specific Fields for YouTube Video */}
                                {contentType === "video" ? (
                                    <div className="space-y-4 bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
                                        <div className="grid sm:grid-cols-3 gap-4">
                                            <div className="sm:col-span-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                                    Paste YouTube Video Link or ID *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={videoUrl}
                                                    onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                                                    placeholder="https://www.youtube.com/watch?v=..."
                                                    className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-4 text-white font-mono text-sm outline-none transition-all placeholder:text-slate-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                                    Duration (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={duration}
                                                    onChange={(e) => setDuration(e.target.value)}
                                                    placeholder="e.g. 4 min"
                                                    className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-4 text-white font-semibold text-sm outline-none transition-all placeholder:text-slate-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Live YouTube Preview Thumbnail & Auto-fetch status */}
                                        {videoUrl && extractYouTubeId(videoUrl) && (
                                            <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                                <img 
                                                    src={`https://img.youtube.com/vi/${extractYouTubeId(videoUrl)}/mqdefault.jpg`} 
                                                    alt="YouTube Preview" 
                                                    className="w-24 h-14 object-cover rounded-lg border border-slate-600 flex-shrink-0"
                                                />
                                                <div className="overflow-hidden">
                                                    <span className="text-xs font-bold text-green-400 flex items-center gap-1">
                                                        ✓ Valid YouTube Video Detected
                                                        {isFetchingYouTubeTitle && <span className="text-slate-400 text-[10px] animate-pulse">(fetching title...)</span>}
                                                    </span>
                                                    <p className="text-xs text-slate-400 font-mono truncate">ID: {extractYouTubeId(videoUrl)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* 4B. Specific Fields for News & Field Work Photos (with Multi-Upload) */
                                    <div className="space-y-4 bg-slate-800/40 p-5 rounded-2xl border border-slate-800">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                                Description / Details
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder="Brief explanation of this news coverage or camp..."
                                                className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-4 text-white font-semibold text-sm outline-none transition-all placeholder:text-slate-500 resize-none"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                                    Upload Photos (Single or Batch Multi-Select) *
                                                </label>
                                                {selectedFiles.length > 1 && (
                                                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                                                        <Layers className="w-3.5 h-3.5" /> {selectedFiles.length} Photos Selected for Batch Upload
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleFilesChange}
                                                className="hidden"
                                                id="file-upload-input"
                                            />
                                            <label
                                                htmlFor="file-upload-input"
                                                className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-orange-500 bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition-all text-center sm:text-left"
                                            >
                                                <Upload className="w-7 h-7 text-orange-400 flex-shrink-0" />
                                                <div>
                                                    <span className="text-sm font-bold text-white block">
                                                        {selectedFiles.length > 0 
                                                            ? `${selectedFiles.length} photo(s) selected - Tap to change` 
                                                            : "Tap to choose one or multiple photos from phone/computer"}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        Supports multiple JPG, PNG, WebP (Automatically organizes into {contentType === "news" ? "public/images/media/" : "public/images/resources/"})
                                                    </span>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Multi-Photo Thumbnail Grid Preview */}
                                        {previewUrls.length > 0 && (
                                            <div className="space-y-2 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                                                <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                                                    <span>📸 Image Preview ({previewUrls.length} file{previewUrls.length > 1 ? "s" : ""})</span>
                                                    <span className="text-slate-400 text-[11px]">Click ✕ to remove any photo</span>
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                                                    {previewUrls.map((url, idx) => (
                                                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-video">
                                                            <img 
                                                                src={url} 
                                                                alt={`Preview ${idx + 1}`} 
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveFile(idx)}
                                                                className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition-transform hover:scale-110 cursor-pointer"
                                                                title="Remove Photo"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                                                                #{idx + 1}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Feedback Alerts */}
                                {feedbackMessage && (
                                    <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
                                        feedbackMessage.type === "success" 
                                            ? "bg-emerald-950/60 border-emerald-800 text-emerald-300" 
                                            : "bg-red-950/60 border-red-800 text-red-300"
                                    }`}>
                                        {feedbackMessage.type === "success" ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                        )}
                                        <span className="text-sm font-semibold">{feedbackMessage.text}</span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 sm:py-5 rounded-2xl font-black text-lg bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            {selectedFiles.length > 1 
                                                ? `Batch Publish ${selectedFiles.length} Photos Live 🚀` 
                                                : "Publish Live to Website"} <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* ─── LIVE CONTENT INVENTORY, EDIT & DELETE MANAGER ─── */}
                        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                                    <Eye className="w-5 h-5 text-orange-400" /> Current Published Items
                                </h2>
                                <button
                                    onClick={fetchCurrentData}
                                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    title="Refresh Data"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isLoadingData ? "animate-spin" : ""}`} />
                                </button>
                            </div>

                            {mediaData ? (
                                <div className="space-y-8">
                                    
                                    {/* Videos List */}
                                    <div>
                                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-orange-400 mb-3 flex items-center gap-2">
                                            <Video className="w-4 h-4" /> YouTube Videos ({mediaData.videos?.length || 0})
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {mediaData.videos?.map((v, i) => (
                                                <div key={i} className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-600 transition-all">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <img 
                                                            src={`https://img.youtube.com/vi/${v.id}/default.jpg`} 
                                                            alt={v.title}
                                                            className="w-12 h-9 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                        <div className="truncate">
                                                            <p className="font-bold text-xs text-white truncate">{v.title}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono">ID: {v.id} • {v.category}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <button
                                                            onClick={() => handleOpenEdit("video", v)}
                                                            className="p-2 rounded-xl text-slate-300 hover:text-orange-400 hover:bg-slate-700/60 transition-colors cursor-pointer"
                                                            title="Edit Video"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete("video", v.id)}
                                                            className="p-2 rounded-xl text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
                                                            title="Delete Video"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* News & Press List */}
                                    <div>
                                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                                            <Newspaper className="w-4 h-4" /> News & Press Coverage ({mediaData.mediaCoverage?.length || 0})
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {mediaData.mediaCoverage?.map((n, i) => (
                                                <div key={i} className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-600 transition-all">
                                                    <div className="truncate">
                                                        <p className="font-bold text-xs text-white truncate">{n.title}</p>
                                                        <p className="text-[10px] text-slate-400 truncate">{n.category} • {n.image}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <button
                                                            onClick={() => handleOpenEdit("news", n)}
                                                            className="p-2 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-700/60 transition-colors cursor-pointer"
                                                            title="Edit News"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete("news", n.title)}
                                                            className="p-2 rounded-xl text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
                                                            title="Delete News Item"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Field Work List */}
                                    <div>
                                        <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
                                            <Tent className="w-4 h-4" /> Field Work & Camp Photos ({mediaData.projectImages?.length || 0})
                                        </h3>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {mediaData.projectImages?.map((p, i) => (
                                                <div key={i} className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl flex items-center justify-between gap-3 hover:border-slate-600 transition-all">
                                                    <div className="truncate">
                                                        <p className="font-bold text-xs text-white truncate">{p.title}</p>
                                                        <p className="text-[10px] text-slate-400 truncate">{p.category} • {p.image}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                        <button
                                                            onClick={() => handleOpenEdit("field_work", p)}
                                                            className="p-2 rounded-xl text-slate-300 hover:text-emerald-400 hover:bg-slate-700/60 transition-colors cursor-pointer"
                                                            title="Edit Photo"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete("field_work", p.title)}
                                                            className="p-2 rounded-xl text-red-400 hover:bg-red-950/60 transition-colors cursor-pointer"
                                                            title="Delete Photo"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">Loading published content...</p>
                            )}
                        </div>

                    </div>
                )}
            </div>

            {/* ─── EDIT MODAL POPUP ─── */}
            <AnimatePresence>
                {editingItem && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-orange-400 font-bold text-sm uppercase tracking-wider">
                                    <Edit3 className="w-4 h-4" /> Edit {editingItem.type.replace("_", " ")}
                                </div>
                                <button 
                                    onClick={() => setEditingItem(null)}
                                    className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveEdit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                        Title / Headline
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingItem.title}
                                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                        className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-xl p-3.5 text-white font-semibold text-sm outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                        Category Tag
                                    </label>
                                    <input
                                        type="text"
                                        value={editingItem.category}
                                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                        className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-xl p-3.5 text-white font-semibold text-sm outline-none transition-all"
                                    />
                                </div>

                                {editingItem.type === "video" ? (
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                            Duration
                                        </label>
                                        <input
                                            type="text"
                                            value={editingItem.duration || ""}
                                            onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                                            className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-xl p-3.5 text-white font-semibold text-sm outline-none transition-all"
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                            Description / Details
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={editingItem.description}
                                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                            className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-xl p-3.5 text-white font-semibold text-sm outline-none transition-all resize-none"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingItem(null)}
                                        className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        {isUpdating ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
