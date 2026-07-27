"use client";

import { motion } from "framer-motion";

export function VideoHighlight() {
    return (
        <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:24px_24px] pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-14 items-center">

                    {/* Left — text */}
                    <div>
                        <div className="inline-flex items-center gap-2.5 text-secondary-400 text-xs font-bold uppercase tracking-[0.18em] mb-5">
                            <span className="h-px w-7 bg-secondary-400" /> Watch Our Story
                        </div>
                        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug mb-5">
                            See DigiSwasthya in action
                        </h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            Watch how we are bringing specialist healthcare to the doorstep of rural communities across India through technology-enabled telemedicine centers.
                        </p>
                    </div>

                    {/* Right — video */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative aspect-video rounded-3xl overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.5)] ring-1 ring-white/10 bg-black"
                    >
                        <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/KOQjv1xyfkg?autoplay=0&rel=0&modestbranding=1"
                            title="DigiSwasthya Impact Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
