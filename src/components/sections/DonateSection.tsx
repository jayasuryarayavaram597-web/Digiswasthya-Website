"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function DonateSection() {
    const { t } = useLanguage();
    const customVideoId = "KOQjv1xyfkg";

    return (
        <section className="py-20 bg-gray-50">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Content Side */}
                    <div className="space-y-6">
                        {/* Eyebrow */}
                        <div className="inline-flex items-center gap-2 text-secondary-600 text-sm font-semibold uppercase tracking-widest">
                            <span className="h-px w-6 bg-secondary-600" /> Make a Difference
                        </div>

                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
                            {t("donateSection.title")}
                        </h2>

                        <p className="text-gray-600 leading-relaxed">
                            {t("donateSection.description")}
                        </p>

                        {/* Donation info box — clean, no rounded gimmick */}
                        <div className="border-l-4 border-primary-500 pl-5 py-2 space-y-2">
                            <p className="text-gray-800 font-medium text-sm">
                                {t("donateSection.boxText")}{" "}
                                <span className="text-primary-700 font-bold">{t("donateSection.boxHighlight")}</span>{" "}
                                {t("donateSection.boxTextAfter")}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">{t("donateSection.donateNowLabel")}:</span> bit.ly/Gift2DS
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold">{t("donateSection.upiLabel")}:</span> digiswasthya@yesbank
                            </p>
                            <p className="text-sm text-gray-600 pt-1">
                                To view images of the impact that you can contribute to, kindly visit:{" "}
                                <a
                                    href="https://linktr.ee/digiswasthya"
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
                        </div>

                        {/* 80G Badge */}
                        <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold px-4 py-2 rounded-full">
                            ✓ Donations eligible for 80G Tax Exemption
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                Payment Method
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {/* UPI QR Card */}
                                <button className="flex flex-col items-center justify-center gap-2 border-2 border-primary-300 bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold rounded-xl py-5 px-4 transition-colors duration-200 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7" rx="1" />
                                        <rect x="14" y="3" width="7" height="7" rx="1" />
                                        <rect x="3" y="14" width="7" height="7" rx="1" />
                                        <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
                                        <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
                                        <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
                                        <path d="M14 14h3v3h-3z" fill="currentColor" stroke="none" />
                                        <path d="M17 17h4" />
                                        <path d="M17 14v7" />
                                    </svg>
                                    <span>UPI QR</span>
                                </button>
                                {/* Razorpay Card */}
                                <button className="flex flex-col items-center justify-center gap-2 border-2 border-primary-300 bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold rounded-xl py-5 px-4 transition-colors duration-200 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                    <span>Razorpay</span>
                                </button>
                            </div>
                        </div>

                        {/* Donate Now Button */}
                        <Link
                            href="/donate"
                            className="flex items-center justify-center gap-3 w-full text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-200"
                            style={{
                                background: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)",
                                boxShadow: "0 4px 20px rgba(142, 84, 233, 0.45)"
                            }}
                        >
                            <Heart className="h-5 w-5 fill-current" />
                            Donate Now
                            <span className="text-xl">→</span>
                        </Link>
                    </div>

                    {/* Video Side */}
                    <div>
                        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md bg-black">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${customVideoId}`}
                                title="DigiSwasthya Introduction"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
