"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const testimonials = [
    {
        name: "Jaysing Hande",
        problem: "Leg Swelling & Back Pain — DS3",
        body: "After consulting Dr. Leena Saxena online through DigiSwasthya, his health showed remarkable improvement. Within just 15 days, his leg swelling significantly reduced and back pain became much more manageable.",
        image: null
    },
    {
        name: "Sudhanshu Kumar",
        problem: "Lymph Node Swelling — DS2",
        body: "Sudhanshu endured persistent lymph node swelling for an entire year, facing misdiagnoses at three different hospitals. After an online consultation through DigiSwasthya, the correct condition was diagnosed and he made a full recovery.",
        image: "/images/testimonials/sudhanshu-kumar.png"
    },
    {
        name: "Bimala Devi",
        problem: "Early-Stage Cancer — DS2",
        body: "Through DigiSwasthya's online consultations and tests, Bimala was diagnosed with early-stage cancer in time. She received treatment followed by surgery. The timely intervention was a turning point in her health journey.",
        image: "/images/testimonials/bimala-devi.png"
    },
    {
        name: "Balu Katale",
        problem: "Diabetic Foot Ulcers — DS3",
        body: "I work in farming and encountered skin burns on my leg due to agricultural chemicals. Learning about DigiSwasthya through a village health camp, I sought their services. Timely intervention saved both time and money.",
        image: "/images/testimonials/balu-katale.png"
    },
    {
        name: "Jagruti",
        problem: "Weight Loss Problem — DS4",
        body: "Despite treatments from several hospitals, nothing worked. She was introduced to DigiSwasthya and only spent Rs. 400 on the initial prescription. A strict diet plan resulted in positive results. She is grateful to DigiSwasthya.",
        image: "/images/testimonials/jagruti.png"
    },
    {
        name: "Manisha Kumari",
        problem: "Osteosarcoma Cancer — DS1",
        body: "Diagnosed with Osteosarcoma cancer and feeling hopeless, DigiSwasthya Foundation connected us with doctors in Mumbai. Thanks to financial assistance from the Ratan Tata Trust, the surgery was possible. Forever grateful.",
        image: "/images/testimonials/manisha-kumari.png"
    },
    {
        name: "Rajneeta Devi",
        problem: "Breast Cancer — DS1",
        body: "DigiSwasthya arranged a second opinion tele-consultation with an oncologist from Homi Bhabha Cancer Hospital. Rajneeta underwent six cycles of chemotherapy. Today she is fully recovered and running a small business.",
        image: "/images/testimonials/rajneeta-devi.png"
    },
    {
        name: "Ram Dulare",
        problem: "Mouth Ulcer — DS5",
        body: "For eight months I suffered from severe mouth ulcers with no relief at multiple hospitals. I consulted an online doctor from Mumbai through DigiSwasthya, who prescribed effective medication. Within a week I felt significant relief.",
        image: "/images/testimonials/ram-dulare.png"
    },
    {
        name: "Shiv Daras Yadav",
        problem: "Chronic Skin Condition — DS6",
        body: "After multiple unsuccessful treatments, he visited a DigiSwasthya center. Through a tele-consultation with a specialist, he received a precise diagnosis. His condition improved drastically within weeks.",
        image: "/images/testimonials/shiv-daras-yadav.png"
    }
];

const ITEMS_PER_PAGE = 3;

export function MediaImpact() {
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
    const current = testimonials.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

    return (
        <section className="py-20 bg-white" id="testimonials">
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="max-w-2xl mb-14">
                    <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold uppercase tracking-widest mb-4">
                        <span className="h-px w-6 bg-primary-600" /> Patient Voices
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
                        Stories from the communities we serve
                    </h2>
                </div>

                {/* Cards */}
                <motion.div
                    key={page}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
                >
                    {current.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col bg-gray-50 border border-gray-100 rounded-xl p-6 hover:border-primary-200 hover:shadow-sm transition-all duration-300"
                        >
                            {/* Profile */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-11 h-11 rounded-full bg-primary-50 border border-primary-100 overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={44}
                                            height={44}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-primary-400" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                                    <div className="text-xs text-primary-600 font-medium">{item.problem}</div>
                                </div>
                            </div>

                            {/* Quote line */}
                            <div className="border-l-2 border-primary-200 pl-4">
                                <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Pagination */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setPage(p => (p - 1 + totalPages) % totalPages)}
                        className="w-9 h-9 rounded-full border border-gray-200 hover:border-primary-600 hover:text-primary-600 flex items-center justify-center transition-colors text-gray-400"
                        aria-label="Previous"
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`w-2 h-2 rounded-full transition-all ${page === i ? "bg-primary-600 w-5" : "bg-gray-200"}`}
                            aria-label={`Page ${i + 1}`}
                        />
                    ))}
                    <button
                        onClick={() => setPage(p => (p + 1) % totalPages)}
                        className="w-9 h-9 rounded-full border border-gray-200 hover:border-primary-600 hover:text-primary-600 flex items-center justify-center transition-colors text-gray-400"
                        aria-label="Next"
                    >
                        ›
                    </button>
                </div>

            </div>
        </section>
    );
}
