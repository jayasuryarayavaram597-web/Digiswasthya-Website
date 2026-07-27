"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import { motion } from "framer-motion";

const projectImages = [
    {
        title: "DigiSwasthya Team at DS1 Center",
        description: "Our dedicated medical team consulting at the DS1 Telemedicine Center, providing quality healthcare to rural communities.",
        image: "/images/resources/telemedicine-team.jpg",
        category: "Field Work"
    },
    {
        title: "Rural Telemedicine Hub",
        description: "Bringing technology-driven healthcare to the doorsteps of rural families in their own village environment.",
        image: "/images/resources/rural-clinic.jpg",
        category: "Centers"
    },
    {
        title: "Impact in Real-time",
        description: "Bridging the gap between specialized doctors and remote patients through digital connectivity.",
        image: "/images/resources/consultation.jpg",
        category: "Consultation"
    }
];

const infographics = [
    {
        title: "Healthcare Transformation Pillars",
        description: "Our core focus areas: Referral Networks, Awareness Campaigns, Cancer Care, and Digital Prescriptions.",
        image: "/images/resources/healthcare-pillars.png"
    },
    {
        title: "Mission & Values",
        description: "Awareness, Accessibility, Affordability, and Aid — the pillars of DigiSwasthya Foundation's impact.",
        image: "/images/resources/foundation-mission.jpg"
    }
];

const mediaCoverage = [
    {
        title: "Ministry of Information and Broadcasting",
        description: "@MIB_India - Stories that Inspire (May 19, 2023). Recognized for the groundbreaking telemedicine mission in rural India.",
        image: "/images/media/mib-india.jpg",
        category: "Government"
    },
    {
        title: "India in Ireland (Embassy of India, Dublin)",
        description: "@IndiainIreland Ambassador @AkhileshIFS meeting with Mr. Sandeep Kumar. Very inspiring work spearheading healthcare in rural India.",
        image: "/images/media/embassy-ireland.jpg",
        category: "International"
    },
    {
        title: "Bridging the Medical Divide",
        description: "A film by Bidit Roy documenting DigiSwasthya Foundation's journey to connect rural patients with urban specialists.",
        image: "/images/media/bridging-divide.jpg",
        category: "Documentary"
    },
    {
        title: "DD Sahyadri News Coverage",
        description: "GNM_भाग७३ — मुंबईच्या संदीप कुमार यांनी सुरू केलं डीजी स्वास्थ्य हे आरोग्य अभियान. Marathi news feature on our mission.",
        image: "/images/media/dd-sahyadri.jpg",
        category: "News"
    },
    {
        title: "Covid Champions On The Ground",
        description: "Sandeep Kumar has been working tirelessly to provide aid during the pandemic, bridging the gap in healthcare infrastructure.",
        image: "/images/media/covid-champions.png",
        category: "Award"
    },
    {
        title: "Cancer survivor’s telemedicine centre links medics with villagers in remote areas",
        description: "How a cancer survivor's telemedicine mission is bridging the healthcare gap in remote villages. Featured in Gaon Connection.",
        image: "/images/media/gaon-connection.jpg",
        category: "Inspiration"
    },
    {
        title: "Augnito partners with DigiSwasthya to provide access to health care in rural India",
        description: "Strategic collaboration to leverage advanced speech-to-text AI for better healthcare documentation in rural settings.",
        image: "/images/media/augnito-partnership-1.jpg",
        category: "Partnership"
    },
    {
        title: "Augnito partners with DigiSwasthya to make healthcare accessible in rural India",
        description: "Working together to streamline medical records and improve doctor-patient interactions in underserved communities.",
        image: "/images/media/augnito-partnership-2.jpg",
        category: "Partnership"
    },
    {
        title: "Support received by DigiSwasthya so far",
        description: "Recognizing the vital CSR support and contributions from partners that fuel our healthcare missions.",
        image: "/images/media/csr-support.jpg",
        category: "Support"
    },
    {
        title: "Augnito Partners With DigiSwasthya",
        description: "A growing partnership focused on bridging the digital divide in India's rural healthcare infrastructure.",
        image: "/images/media/remote-health-mission.png",
        category: "Partnership"
    },
    {
        title: "An achievement for DigiSwasthya",
        description: "Reaching new heights in delivering affordable healthcare services to the last mile of rural India.",
        image: "/images/media/achievement.jpg",
        category: "Achievement"
    },
    {
        title: "10th National Conference On Social Innovation To Be Held In Pune on Nov 17th",
        description: "Selected to present our social innovation model at the prestigious Pune International Centre conference.",
        image: "/images/media/pune-conference.jpg",
        category: "Conference"
    },
    {
        title: "Village development professional, city doctor join hands to offer tele-medicine advice platform NGO",
        description: "Bridging the gap between rural needs and urban expertise through a collaborative NGO-driven platform.",
        image: "/images/media/telemedicine-platform.jpg",
        category: "News"
    }
];

const videos = [
    { id: "A-WMlwtqcX0", title: "DigiSwasthya Foundation Impact" },
    { id: "F4QX0j6TprI", title: "Healthcare at Doorstep" },
    { id: "WxtLBpEzfhM", title: "Rural Telemedicine Mission" },
    { id: "3iefGVKirs0", title: "Tele-medicine Advice Platform" }
];

export default function Media() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-primary-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] opacity-10 bg-cover bg-center"></div>
                <div className="container relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-black mb-6 tracking-tight"
                    >
                        Media & Resources
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-primary-100 max-w-2xl mx-auto font-medium"
                    >
                        Capturing our mission to make healthcare accessible and affordable across rural India.
                    </motion.p>
                </div>
            </section>

            {/* Media Coverage Section */}
            <section className="py-24 bg-white">
                <div className="container">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <span className="px-4 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Media Coverage</span>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">DigiSwasthya in the News</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {mediaCoverage.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-secondary-600 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-secondary-100">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex-grow">
                                    <h3 className="font-black text-xl text-gray-900 mb-3 leading-tight group-hover:text-secondary-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 font-medium text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Gallery Section */}
            <section className="py-24 bg-gray-900 text-white">
                <div className="container">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <span className="px-4 py-1.5 bg-primary-600 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-4">Videos</span>
                        <h2 className="text-4xl font-black tracking-tight">Impact & Documentaries</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                        {videos.map((vid, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 bg-black group-hover:border-primary-500 transition-all duration-300">
                                    <iframe
                                        className="absolute inset-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${vid.id}?rel=0&modestbranding=1`}
                                        title={vid.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-center group-hover:text-primary-400 transition-colors">
                                    {vid.title}
                                </h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Photo Gallery Section */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="container">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <span className="px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Gallery</span>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Our Work in the Field</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {projectImages.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex-grow">
                                    <h3 className="font-black text-xl text-gray-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 font-medium text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Infographics Section */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="container">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <span className="px-4 py-1.5 bg-secondary-100 text-secondary-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Information</span>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Primary Healthcare Impacts</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {infographics.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-8 border border-gray-50 shadow-inner bg-gray-50 flex items-center justify-center p-4">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={800}
                                        height={500}
                                        className="object-contain max-h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="px-4 pb-4 text-center">
                                    <h3 className="font-black text-2xl text-gray-900 mb-3 tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 font-medium text-lg max-w-md mx-auto">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
