"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import {
    ShieldCheck, Lock, CheckCircle2, AlertCircle,
    ArrowRight, Loader2, Heart, X, ChevronLeft,
    Search, Eye, EyeOff, Edit2, User, Mail, Repeat, CreditCard as CardIcon,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UpiQrModal, RazorpayModal, DonationSummaryModal } from "@/components/donate/PaymentModals";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

export default function DonatePage() {
    const [amount, setAmount] = useState<number | "">(1000);
    const [method, setMethod] = useState<"upi_qr" | "razorpay">("razorpay");
    const [isRecurring, setIsRecurring] = useState(false);
    const [donorName, setDonorName] = useState("");
    const [donorEmail, setDonorEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
    const [activeModal, setActiveModal] = useState<null | "summary" | "upi_qr" | "razorpay">(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [livesImpacted, setLivesImpacted] = useState<number>(2850000);

    const formatNumber = (num: number) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    useEffect(() => {
        async function fetchStats() {
            try {
                const ref = doc(db, "stats", "main");
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data();
                    if (data.livesImpacted !== undefined && data.livesImpacted !== null) {
                        setLivesImpacted(data.livesImpacted);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch donate page stats:", err);
            }
        }
        fetchStats();
    }, []);

    const handleDonation = () => {
        if (status === "processing") return;
        const donationAmount = Number(amount);
        if (!donationAmount || donationAmount < 100) {
            setErrorMessage("Minimum donation amount is ₹100.");
            return;
        }
        setErrorMessage(null);
        // Show summary first — donor reviews before paying
        setActiveModal("summary");
    };

    const handleUpiConfirm = () => { setActiveModal(null); setStatus("success"); };

    /* kept for demo/mock fallback only */
    const handleRazorpayConfirm = useCallback(() => {
        setActiveModal(null);
        setStatus("success");
    }, []);

    /* ── Load Razorpay checkout.js once ── */
    const loadRazorpayScript = (): Promise<boolean> =>
        new Promise((resolve) => {
            if (typeof window !== "undefined" && window.Razorpay) { resolve(true); return; }
            const s = document.createElement("script");
            s.src = "https://checkout.razorpay.com/v1/checkout.js";
            s.onload = () => resolve(true);
            s.onerror = () => resolve(false);
            document.body.appendChild(s);
        });

    /* ── Real Razorpay payment flow ── */
    const initiateRazorpayPayment = useCallback(async () => {
        setActiveModal(null);
        setStatus("processing");
        setErrorMessage(null);
        try {
            /* 1. Create order on our backend */
            const res = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: Number(amount), method: "razorpay" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Order creation failed");

            /* 2. Demo/mock mode — show fake modal instead */
            if (data.isMock) {
                setStatus("idle");
                setActiveModal("razorpay");
                return;
            }

            /* 3. Load Razorpay checkout script */
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error("Failed to load payment gateway. Check your connection.");
            setStatus("idle");

            /* 4. Open Razorpay checkout popup */
            const rzp = new window.Razorpay({
                key: data.key,
                amount: data.amount,
                currency: data.currency,
                name: "DigiSwasthya Foundation",
                description: isRecurring ? "Monthly Donation" : "One-time Donation",
                order_id: data.orderId,
                prefill: { name: donorName, email: donorEmail },
                theme: { color: "#1a6b3a" },
                notes: { 
                    ngo_reg: "U85300UP2020NPL130635",
                    name: donorName,
                    email: donorEmail
                },
                handler: async (response: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) => {
                    /* 5. Verify payment signature */
                    const vRes = await fetch("/api/verify-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    const vData = await vRes.json();
                    if (vData.success) {
                        setStatus("success");
                    } else {
                        setStatus("error");
                        setErrorMessage("Payment verification failed. Please contact support.");
                    }
                },
                modal: { ondismiss: () => setStatus("idle") },
            });
            rzp.open();
        } catch (err) {
            console.error("Razorpay error:", err);
            setStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "Payment failed. Please try again.");
        }
    }, [amount, donorName, donorEmail, isRecurring]);

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* ── Hero Strip ── */}
            <div className="bg-primary-900 py-5 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                        {/* Left — existing content */}
                        <div>
                            <div className="inline-flex items-center gap-2 text-secondary-400 text-xs font-semibold uppercase tracking-widest mb-4">
                                <span className="h-px w-6 bg-secondary-400" /> Support DigiSwasthya Foundation
                            </div>
                            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                                Every Rupee Saves a Life
                            </h1>
                            <p className="text-primary-300 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
                                Help us bring quality healthcare to underserved communities across rural India.
                            </p>
                            <div className="flex flex-wrap gap-10 border-t border-primary-800 pt-8">
                                <div><div className="text-2xl font-bold text-white">{formatNumber(livesImpacted)}+</div><div className="text-xs text-primary-400 uppercase tracking-wide mt-1">Lives Impacted</div></div>
                                <div><div className="text-2xl font-bold text-secondary-400">80G</div><div className="text-xs text-primary-400 uppercase tracking-wide mt-1">Tax Exempt</div></div>
                            </div>
                        </div>

                        {/* Right — Linktree impact link */}
                        <div className="flex flex-col items-start lg:items-end justify-center">
                            <div className="bg-white/5 border border-white/10 rounded-2xl px-8 py-8 backdrop-blur-sm max-w-sm w-full">
                                <p className="text-primary-300 text-sm font-medium uppercase tracking-widest mb-3">See Our Impact</p>
                                <p className="text-white text-base leading-relaxed mb-5">
                                    View images of the impact <span className="text-secondary-400 font-semibold">your donation</span> can create for rural communities.
                                </p>
                                <a
                                    href="https://linktr.ee/DigiSwasthya"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-secondary-500 hover:bg-secondary-400 text-white font-bold text-base px-6 py-3 rounded-xl transition-all duration-200 group"
                                    style={{ boxShadow: "0 4px 18px rgba(0,0,0,0.25)" }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                    </svg>
                                    linktr.ee/DigiSwasthya
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            {/* ── Main Content — unchanged ── */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

                        {/* LEFT — unchanged */}
                        <div className="flex flex-col gap-5">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-xl overflow-hidden">
                                <Image src="/images/ds-medical-camp.jpg" alt="DigiSwasthya Foundation medical camp" width={720} height={460} className="w-full h-auto object-cover" priority />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="rounded-xl overflow-hidden">
                                <Image src="/images/ds-community-outreach.jpg" alt="DigiSwasthya Foundation community outreach" width={720} height={340} className="w-full h-auto object-cover" />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.28 }} className="border-l-4 border-primary-500 pl-5 py-1">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    <span className="font-semibold text-gray-900">Your contribution</span> helps bring essential healthcare services to underserved communities across rural India.
                                </p>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.38 }} className="border-l-4 border-secondary-400 pl-5 py-1">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    To view images of the impact that you can contribute to, kindly visit:{" "}
                                    <a
                                        href="https://linktr.ee/DigiSwasthya"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary-700 font-semibold underline underline-offset-2 hover:text-primary-900 transition-colors duration-150"
                                    >
                                        linktr.ee/DigiSwasthya
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </a>
                                </p>
                            </motion.div>
                        </div>

                        {/* RIGHT — form unchanged */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="sticky top-6">
                            <div className="border border-gray-200 rounded-xl overflow-hidden">

                                <div className="bg-primary-800 px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-primary-200 text-xs font-semibold uppercase tracking-wider"><Lock size={13} /> Secure Donation</div>
                                    <div className="flex items-center gap-2 text-primary-200 text-xs font-semibold uppercase tracking-wider"><ShieldCheck size={13} /> SSL Encrypted</div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {status === "success" ? (
                                        <motion.div key="success" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                                            className="flex flex-col items-center justify-center text-center px-8 py-16 min-h-[440px]">
                                            <motion.div
                                                initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 18 }}
                                                className="w-20 h-20 rounded-full bg-primary-50 border-2 border-primary-200 flex items-center justify-center gap-1 mb-6">
                                                <CheckCircle2 size={36} className="text-primary-600" strokeWidth={1.8} />
                                                <Heart size={18} className="text-green-500 fill-green-500" />
                                            </motion.div>
                                            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3">Thank You for Your Contribution</h2>
                                            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-5">
                                                Your support enables DigiSwasthya Foundation to continue providing essential healthcare services to underserved communities.
                                            </p>
                                            <div className="text-sm text-primary-700 font-semibold border border-primary-200 bg-primary-50 px-5 py-2 rounded-md mb-8">
                                                {isRecurring ? "Monthly" : "One-time"} Contribution: ₹{Number(amount).toLocaleString("en-IN")}
                                            </div>
                                            <a href="/" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-7 py-3 rounded-md transition-colors">
                                                Return to Home <ArrowRight size={15} />
                                            </a>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="p-7">

                                            {/* One-time / Monthly */}
                                            <div className="flex bg-gray-100 rounded-lg p-1 gap-1 mb-7">
                                                <button id="btn-one-time" onClick={() => setIsRecurring(false)}
                                                    className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all ${!isRecurring ? "bg-white text-primary-700 shadow-sm" : "text-gray-500"}`}>
                                                    One-time
                                                </button>
                                                <button id="btn-monthly" onClick={() => setIsRecurring(true)}
                                                    className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all ${isRecurring ? "bg-white text-primary-700 shadow-sm" : "text-gray-500"}`}>
                                                    Monthly
                                                </button>
                                            </div>

                                            {/* Preset amounts */}
                                            <div className="mb-6">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Amount</label>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {PRESET_AMOUNTS.map((preset) => (
                                                        <button key={preset} id={`preset-${preset}`} onClick={() => setAmount(preset)}
                                                            className={`py-3 rounded-lg border text-sm font-semibold transition-all ${amount === preset ? "border-primary-600 bg-primary-50 text-primary-700" : "border-gray-200 bg-white text-gray-600 hover:border-primary-300"}`}>
                                                            ₹{preset.toLocaleString("en-IN")}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Custom amount */}
                                            <div className="mb-6">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Or Enter Custom Amount</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold text-lg pointer-events-none">₹</span>
                                                    <Input id="donation-amount-input" type="number" value={amount}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                                                        placeholder="Enter amount"
                                                        className="pl-9 h-14 text-lg font-bold text-gray-900 border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 rounded-lg" />
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2">Minimum donation amount is ₹100</p>
                                            </div>

                                            {/* Name */}
                                            <div className="mb-5">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3" htmlFor="donor-name-input">Your Name</label>
                                                <Input id="donor-name-input" type="text" value={donorName}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonorName(e.target.value)}
                                                    placeholder="Enter your full name" className="h-12 border-gray-300 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal focus:border-primary-500 rounded-lg" />
                                            </div>

                                            {/* Email */}
                                            <div className="mb-5">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3" htmlFor="donor-email-input">Email Address</label>
                                                <Input id="donor-email-input" type="email" value={donorEmail}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDonorEmail(e.target.value)}
                                                    placeholder="Enter your email address" className="h-12 border-gray-300 text-gray-900 font-semibold placeholder:text-gray-400 placeholder:font-normal focus:border-primary-500 rounded-lg" />
                                            </div>

                                            {/* Payment method — unchanged */}
                                            <div className="mb-6">
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Payment Method</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button id="method-upi-qr" onClick={() => setMethod("upi_qr")}
                                                        className={`flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 text-sm font-semibold transition-all ${
                                                            method === "upi_qr"
                                                                ? "border-primary-500 bg-primary-100 text-primary-800"
                                                                : "border-gray-200 bg-white text-gray-500 hover:border-primary-300"
                                                        }`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                                            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
                                                            <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" /><rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" /><rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
                                                            <path d="M14 14h3v3h-3z" fill="currentColor" stroke="none" /><path d="M17 17h4" /><path d="M17 14v7" />
                                                        </svg>
                                                        <span>UPI QR</span>
                                                    </button>
                                                    <button id="method-razorpay" onClick={() => setMethod("razorpay")}
                                                        className={`flex flex-col items-center justify-center gap-2 py-5 rounded-xl border-2 text-sm font-semibold transition-all ${
                                                            method === "razorpay"
                                                                ? "border-primary-500 bg-primary-100 text-primary-800"
                                                                : "border-gray-200 bg-white text-gray-500 hover:border-primary-300"
                                                        }`}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                                        </svg>
                                                        <span>Razorpay</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Error */}
                                            <AnimatePresence>
                                                {status === "error" && (
                                                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                        className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-5 text-red-700 text-sm font-medium">
                                                        <AlertCircle size={15} /><span>{errorMessage}</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Donate Now — unchanged */}
                                            <button id="donate-now-btn" onClick={handleDonation} disabled={status === "processing"}
                                                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-lg transition-all mb-5 ${status === "processing" ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "text-white"}`}
                                                style={status !== "processing" ? { background: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)", boxShadow: "0 4px 20px rgba(142, 84, 233, 0.45)" } : {}}>
                                                {status === "processing" ? (
                                                    <><Loader2 size={20} className="animate-spin" /><span>Processing...</span></>
                                                ) : (
                                                    <><Heart size={18} className="fill-white" /><span>Donate {isRecurring ? "Monthly" : "Now"}</span><span className="text-xl">→</span></>
                                                )}
                                            </button>

                                            {/* Trust row */}
                                            <div className="flex items-center justify-center gap-2 flex-wrap text-gray-400 text-xs font-medium border-t border-gray-100 pt-5">
                                                <Lock size={11} /><span>Secure Donation</span>
                                                <span className="text-gray-200">•</span>
                                                <ShieldCheck size={11} /><span>Transparent Fund Utilization</span>
                                            </div>
                                            <p className="text-center mt-3 text-[10px] text-gray-300 uppercase tracking-widest font-medium">
                                                NGO Reg. No: <span className="font-mono text-gray-400">U85300UP2020NPL130635</span>
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />

            {/* ── MODALS ── */}
            <AnimatePresence>
                {activeModal === "summary" && (
                    <DonationSummaryModal
                        amount={Number(amount)}
                        name={donorName}
                        email={donorEmail}
                        isRecurring={isRecurring}
                        method={method}
                        onConfirm={() => method === "razorpay" ? initiateRazorpayPayment() : setActiveModal(method)}
                        onEdit={() => setActiveModal(null)}
                    />
                )}
                {activeModal === "upi_qr" && (
                    <UpiQrModal amount={Number(amount)} onConfirm={handleUpiConfirm} onClose={() => setActiveModal(null)} />
                )}
                {activeModal === "razorpay" && (
                    <RazorpayModal amount={Number(amount)} isRecurring={isRecurring} onConfirm={handleRazorpayConfirm} onClose={() => setActiveModal(null)} />
                )}
            </AnimatePresence>
        </main>
    );
}

