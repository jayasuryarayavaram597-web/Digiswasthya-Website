"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Lock, Video, Newspaper, Tent, PlusCircle, Trash2, 
    CheckCircle2, AlertCircle, Eye, RefreshCw, Upload, LogOut, ArrowRight, ShieldCheck 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ContentType = "video" | "news" | "field_work";

interface MediaData {
    projectImages: Array<{ title: string; description: string; image: string; category: string }>;
    mediaCoverage: Array<{ title: string; description: string; image: string; category: string }>;
    videos: Array<{ id: string; title: string; category: string; duration?: string }>;
}

export default function AdminPage() {
    // Auth State
    const [pin, setPin] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState("");

    // Form State
    const [contentType, setContentType] = useState<ContentType>("video");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [duration, setDuration] = useState("3 min");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Submission & Data State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [mediaData, setMediaData] = useState<MediaData | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check existing session
    useEffect(() => {
        const savedPin = sessionStorage.getItem("digiswasthya_admin_pin");
        if (savedPin) {
            setPin(savedPin);
            verifyPin(savedPin);
        }
    }, []);

    const verifyPin = async (pinToTest: string) => {
        setAuthError("");
        try {
            const res = await fetch("/api/admin/media");
            if (res.ok) {
                // Pin is checked on POST/DELETE, so test pin
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const extractYouTubeId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
        return match ? match[1] : url.length === 11 ? url : null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedbackMessage(null);
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("pin", pin || sessionStorage.getItem("digiswasthya_admin_pin") || "");
            formData.append("type", contentType);
            formData.append("title", title);
            formData.append("category", category || (contentType === "video" ? "Documentary" : contentType === "news" ? "News" : "Field Work"));
            formData.append("description", description);

            if (contentType === "video") {
                formData.append("videoUrl", videoUrl);
                formData.append("duration", duration);
            } else {
                if (!selectedFile) {
                    throw new Error("Please select an image file to upload.");
                }
                formData.append("image", selectedFile);
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
            setCategory("");
            setSelectedFile(null);
            setPreviewUrl(null);
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

                        {/* ─── OPTION 1: SINGLE CLEAN FORM WITH 3-WAY SELECTOR ─── */}
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
                                            onClick={() => { setContentType("video"); setSelectedFile(null); setPreviewUrl(null); }}
                                            className={`p-4 rounded-2xl border-2 font-bold text-sm flex items-center gap-3 transition-all cursor-pointer ${
                                                contentType === "video"
                                                    ? "bg-orange-500/15 border-orange-500 text-orange-300 shadow-md"
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
                                                    ? "bg-orange-500/15 border-orange-500 text-orange-300 shadow-md"
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
                                                    ? "bg-orange-500/15 border-orange-500 text-orange-300 shadow-md"
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

                                {/* 2. Title & Category Fields */}
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                            Title / Headline *
                                        </label>
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

                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                            Category Tag
                                        </label>
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            placeholder={
                                                contentType === "video" 
                                                    ? "e.g. Documentary / Patient Story / Rural Health" 
                                                    : contentType === "news" 
                                                    ? "e.g. News / Award / Government / Partnership" 
                                                    : "e.g. Field Work / Centers / Consultation"
                                            }
                                            className="w-full bg-slate-800 border-2 border-slate-700 focus:border-orange-500 rounded-2xl p-4 text-white font-semibold text-sm outline-none transition-all placeholder:text-slate-500"
                                        />
                                    </div>
                                </div>

                                {/* 3A. Specific Fields for YouTube Video */}
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
                                                    onChange={(e) => setVideoUrl(e.target.value)}
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

                                        {/* Live YouTube Preview Thumbnail */}
                                        {videoUrl && extractYouTubeId(videoUrl) && (
                                            <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                                <img 
                                                    src={`https://img.youtube.com/vi/${extractYouTubeId(videoUrl)}/mqdefault.jpg`} 
                                                    alt="YouTube Preview" 
                                                    className="w-24 h-14 object-cover rounded-lg border border-slate-600"
                                                />
                                                <div>
                                                    <span className="text-xs font-bold text-green-400">✓ Valid YouTube Video Detected</span>
                                                    <p className="text-xs text-slate-400 font-mono">ID: {extractYouTubeId(videoUrl)}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* 3B. Specific Fields for News & Field Work Photos */
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
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                                                Upload Photo (From Camera or Gallery) *
                                            </label>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="file-upload-input"
                                            />
                                            <label
                                                htmlFor="file-upload-input"
                                                className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-slate-700 hover:border-orange-500 bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition-all text-center sm:text-left"
                                            >
                                                <Upload className="w-7 h-7 text-orange-400" />
                                                <div>
                                                    <span className="text-sm font-bold text-white block">
                                                        {selectedFile ? selectedFile.name : "Tap to choose photo from mobile or computer"}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        Supports JPG, PNG, WebP (Saved directly to {contentType === "news" ? "public/images/media/" : "public/images/resources/"})
                                                    </span>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Image Preview */}
                                        {previewUrl && (
                                            <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                                                <img 
                                                    src={previewUrl} 
                                                    alt="Upload Preview" 
                                                    className="w-20 h-14 object-cover rounded-lg border border-slate-600"
                                                />
                                                <div>
                                                    <span className="text-xs font-bold text-green-400">✓ Image Ready to Upload</span>
                                                    <p className="text-xs text-slate-400">{selectedFile?.name}</p>
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
                                            Publish Live to Website <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* ─── LIVE CONTENT INVENTORY & DELETE MANAGER ─── */}
                        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                                    <Eye className="w-5 h-5 text-orange-400" /> Current Published Items
                                </h2>
                                <button
                                    onClick={fetchCurrentData}
                                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
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
                                                <div key={i} className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl flex items-center justify-between gap-3">
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
                                                    <button
                                                        onClick={() => handleDelete("video", v.id)}
                                                        className="p-2 rounded-xl text-red-400 hover:bg-red-950/60 transition-colors flex-shrink-0 cursor-pointer"
                                                        title="Delete Video"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
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
                                                <div key={i} className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl flex items-center justify-between gap-3">
                                                    <div className="truncate">
                                                        <p className="font-bold text-xs text-white truncate">{n.title}</p>
                                                        <p className="text-[10px] text-slate-400 truncate">{n.category} • {n.image}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete("news", n.title)}
                                                        className="p-2 rounded-xl text-red-400 hover:bg-red-950/60 transition-colors flex-shrink-0 cursor-pointer"
                                                        title="Delete News Item"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
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
                                                <div key={i} className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-2xl flex items-center justify-between gap-3">
                                                    <div className="truncate">
                                                        <p className="font-bold text-xs text-white truncate">{p.title}</p>
                                                        <p className="text-[10px] text-slate-400 truncate">{p.category} • {p.image}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete("field_work", p.title)}
                                                        className="p-2 rounded-xl text-red-400 hover:bg-red-950/60 transition-colors flex-shrink-0 cursor-pointer"
                                                        title="Delete Photo"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
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

            <Footer />
        </main>
    );
}
