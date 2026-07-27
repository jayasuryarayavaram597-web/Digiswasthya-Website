"use client";

import { useState } from "react";
import Link from "next/link";

export default function TestMailPage() {
    const [name, setName] = useState("Jaswant");
    const [email, setEmail] = useState("");
    const [amount, setAmount] = useState("500");
    const [pan, setPan] = useState("ABCDE1234F");
    const [address, setAddress] = useState("Sant Kabir Nagar, UP, India");

    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState<"success" | "error" | "">("");

    const [cronLoading, setCronLoading] = useState(false);
    const [cronMessage, setCronMessage] = useState("");
    const [cronStatusType, setCronStatusType] = useState<"success" | "error" | "">("");

    const handleSimulatePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !amount) {
            setStatusMessage("Please fill in Name, Email, and Amount.");
            setStatusType("error");
            return;
        }

        setLoading(true);
        setStatusMessage("Simulating transaction capture...");
        setStatusType("");

        try {
            const res = await fetch("/api/test-donation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    amount: parseFloat(amount),
                    pan: pan || undefined,
                    address: address || undefined
                })
            });

            const data = await res.json();
            if (res.ok) {
                setStatusMessage(`Success! Payment ID: ${data.paymentId}. Check your email inbox!`);
                setStatusType("success");
            } else {
                setStatusMessage(`Error: ${data.error || "Failed to trigger simulation."} ${data.details?.error || ""}`);
                setStatusType("error");
            }
        } catch (error) {
            setStatusMessage("Failed to connect to simulation endpoint.");
            setStatusType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleTriggerCron = async () => {
        setCronLoading(true);
        setCronMessage("Running weekly cron job...");
        setCronStatusType("");

        try {
            // Trigger local cron route
            const res = await fetch("/api/cron/weekly-email?secret=digiswasthya_cron_dev_secret_123");
            const data = await res.json();

            if (res.ok) {
                setCronMessage(`Cron ran successfully! Sent ${data.emailsSentCount} email(s).`);
                setCronStatusType("success");
            } else {
                setCronMessage(`Cron failed: ${data.error || "Unknown error"}`);
                setCronStatusType("error");
            }
        } catch (error) {
            setCronMessage("Failed to connect to cron endpoint.");
            setCronStatusType("error");
        } finally {
            setCronLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
            <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
                
                {/* Header */}
                <div className="mb-8 text-center border-b border-slate-800 pb-6">
                    <span className="text-amber-500 text-xs font-bold uppercase tracking-widest bg-amber-950/40 px-3 py-1 rounded-full border border-amber-900/30">
                        Developer Dashboard
                    </span>
                    <h1 className="text-3xl font-extrabold tracking-tight mt-3">Email System Tester</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Simulate payments and trigger weekly updates without real Razorpay keys.
                    </p>
                </div>

                <div className="space-y-8">
                    
                    {/* Section 1: Welcome Email Simulator */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                            Welcome Email & 80G PDF Simulator
                        </h2>

                        <form onSubmit={handleSimulatePayment} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Donor Name</label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Donor Email</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="Your Resend Account Email"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500" 
                                        required 
                                    />
                                    <span className="text-[10px] text-slate-500 mt-1 block">Must be your Resend login email in sandbox.</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Amount (₹)</label>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500" 
                                        required 
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">PAN Number (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={pan} 
                                        onChange={(e) => setPan(e.target.value)} 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Address (Optional)</label>
                                <input 
                                    type="text" 
                                    value={address} 
                                    onChange={(e) => setAddress(e.target.value)} 
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-amber-500" 
                                />
                            </div>

                            {/* Preset Buttons */}
                            <div className="flex gap-2 flex-wrap">
                                {["500", "1000", "5000", "10000"].map((preset) => (
                                    <button 
                                        type="button" 
                                        key={preset}
                                        onClick={() => setAmount(preset)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border relative cursor-pointer ${
                                            amount === preset 
                                            ? "bg-amber-500/20 border-amber-500 text-amber-400" 
                                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                                        }`}
                                    >
                                        ₹{preset}
                                    </button>
                                ))}
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-amber-800 text-white font-bold py-3 rounded-xl transition duration-200 cursor-pointer text-sm font-sans"
                            >
                                {loading ? "Running simulation..." : "Simulate Donation & Send Welcome Email"}
                            </button>
                        </form>

                        {statusMessage && (
                            <div className={`mt-4 p-4 rounded-xl text-sm border ${
                                statusType === "success" 
                                ? "bg-green-950/30 border-green-800/40 text-green-400" 
                                : "bg-red-950/30 border-red-800/40 text-red-400"
                            }`}>
                                {statusMessage}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-800 my-6"></div>

                    {/* Section 2: Weekly Cron Simulator */}
                    <div>
                        <h2 className="text-lg font-bold text-slate-200 mb-2 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                            Weekly Newsletter Cron Simulator
                        </h2>
                        <p className="text-slate-400 text-xs mb-4">
                            Pings the weekly update scheduler. This fetches active subscribers from Firestore and sends them the newsletter update.
                        </p>

                        <button 
                            onClick={handleTriggerCron}
                            disabled={cronLoading}
                            className="w-full bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 border border-slate-700 text-slate-200 font-bold py-2.5 rounded-xl transition duration-200 cursor-pointer text-sm font-sans"
                        >
                            {cronLoading ? "Running cron..." : "Trigger Weekly Cron Job"}
                        </button>

                        {cronMessage && (
                            <div className={`mt-4 p-4 rounded-xl text-sm border ${
                                cronStatusType === "success" 
                                ? "bg-green-950/30 border-green-800/40 text-green-400" 
                                : "bg-red-950/30 border-red-800/40 text-red-400"
                            }`}>
                                {cronMessage}
                            </div>
                        )}
                    </div>
                </div>

                {/* Back Link */}
                <div className="mt-8 text-center border-t border-slate-800 pt-4">
                    <Link href="/" className="text-slate-500 hover:text-slate-400 text-xs">
                        ← Back to Homepage
                    </Link>
                </div>

            </div>
        </div>
    );
}
