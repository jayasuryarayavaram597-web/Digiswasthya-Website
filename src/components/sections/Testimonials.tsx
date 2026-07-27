"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function Testimonials() {
    const images = [
        "/images/testimonials/rajneeta-devi.png",
        "/images/testimonials/ram-dulare.png",
        "/images/testimonials/shiv-daras-yadav.png",
        "/images/testimonials/bimala-devi.png",
        "/images/testimonials/sudhanshu-kumar.png",
        "/images/testimonials/manoj-sharma.png",
        "/images/testimonials/vinay.png",
        "/images/testimonials/manisha-kumari.png",
        "/images/testimonials/jagruti.png",
        "/images/testimonials/balu-katale.png"
    ];

    return (
        <section className="py-16 bg-primary-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="max-w-2xl mb-10">
                    <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-semibold uppercase tracking-widest mb-4">
                        <span className="h-px w-6 bg-primary-600" /> Patient Stories
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
                        Lives we have touched
                    </h2>
                    <p className="mt-3 text-gray-500 leading-relaxed">
                        Real people, real impact — stories from the communities we serve.
                    </p>
                </div>

                {/* Auto-scrolling testimonial images */}
                <div className="relative w-full overflow-hidden rounded-xl">
                    <motion.div
                        className="flex gap-4"
                        animate={{
                            x: [
                                "0%",
                                "-100%",
                            ]
                        }}
                        transition={{
                            duration: 40,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                        style={{ width: `${images.length * 2 * 220}px` }}
                    >
                        {[...images, ...images].map((src, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-48 h-48 rounded-xl overflow-hidden border-2 border-white shadow-sm"
                            >
                                <Image
                                    src={src}
                                    alt={`Patient testimonial ${(i % images.length) + 1}`}
                                    width={192}
                                    height={192}
                                    className="object-cover w-full h-full"
                                    priority={i === 0}
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
