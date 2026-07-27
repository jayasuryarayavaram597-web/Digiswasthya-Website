"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
    Users,
    Stethoscope,
    Activity,
    HeartHandshake,
    ShieldCheck,
    CheckCircle,
    FileText,
    ExternalLink,
    Quote,
    Megaphone,
    Info,
    Database,
    Clock,
    RefreshCcw,
    ClipboardList,
    ArrowRight,
    Cpu,
    Smartphone,
    TrendingUp,
    AlertTriangle,
    ArrowDown
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

/* Fade-in-up for cards with stagger support */
const cardVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay, ease: "easeOut" as const }
    })
};

// Local translation dictionary for the new/redesigned content
const contentDict = {
    section1: {
        title: { en: "Who We Are", hi: "हम कौन हैं" },
        text: {
            en: "DigiSwasthya Foundation is a technology-enabled healthcare organization committed to making quality healthcare accessible, affordable, and inclusive for underserved communities across India. By combining digital healthcare, expert medical professionals, and community outreach initiatives, DigiSwasthya works to bridge the gap between healthcare services and the people who need them the most.",
            hi: "डिजीस्वास्थ्य फाउंडेशन एक प्रौद्योगिकी-सक्षम स्वास्थ्य सेवा संगठन है जो भारत भर के वंचित समुदायों के लिए गुणवत्तापूर्ण स्वास्थ्य सेवा को सुलभ, किफायती और समावेशी बनाने के लिए प्रतिबद्ध है। डिजिटल स्वास्थ्य सेवा, विशेषज्ञ चिकित्सा पेशेवरों और सामुदायिक संपर्क पहलों को मिलाकर, डिजीस्वास्थ्य स्वास्थ्य सेवाओं और उन लोगों के बीच की खाई को पाटने का काम करता है जिन्हें इनकी सबसे अधिक आवश्यकता है।"
        }
    },
    section2: {
        title: { en: "The Healthcare Challenge", hi: "स्वास्थ्य सेवा चुनौती" },
        text: {
            en: "Millions of people across India continue to face barriers in accessing quality healthcare. Rural and underserved communities often experience shortages of specialist doctors, delayed diagnosis, limited healthcare infrastructure, financial constraints, and low health awareness. These challenges prevent timely treatment and negatively impact overall community health.",
            hi: "भारत भर में लाखों लोग गुणवत्तापूर्ण स्वास्थ्य सेवा प्राप्त करने में बाधाओं का सामना कर रहे हैं। ग्रामीण और वंचित समुदायों में अक्सर विशेषज्ञ डॉक्टरों की कमी, निदान में देरी, सीमित स्वास्थ्य सेवा बुनियादी ढांचा, वित्तीय बाधाएं और कम स्वास्थ्य जागरूकता का अनुभव होता है। ये चुनौतियाँ समय पर उपचार को रोकती हैं और समग्र सामुदायिक स्वास्थ्य को नकारात्मक रूप से प्रभावित करती हैं।"
        },
        challenges: [
            { icon: Users, title: { en: "Doctor Shortages", hi: "डॉक्टरों की कमी" }, desc: { en: "Critical shortage of medical specialists in remote primary centers.", hi: "दूरदराज के प्राथमिक केंद्रों में चिकित्सा विशेषज्ञों की भारी कमी।" } },
            { icon: Clock, title: { en: "Delayed Diagnosis", hi: "निदान में देरी" }, desc: { en: "Inability to detect symptoms early, leading to severe health complications.", hi: "लक्षणों का जल्दी पता न चल पाना, जिससे गंभीर स्वास्थ्य समस्याएं पैदा होती हैं।" } },
            { icon: Activity, title: { en: "Limited Infrastructure", hi: "सीमित बुनियादी ढांचा" }, desc: { en: "Lack of advanced testing laboratories and clinics in rural areas.", hi: "ग्रामीण क्षेत्रों में उन्नत परीक्षण प्रयोगशालाओं और क्लीनिकों की कमी।" } },
            { icon: ShieldCheck, title: { en: "Low Health Awareness", hi: "कम स्वास्थ्य जागरूकता" }, desc: { en: "Inadequate knowledge about preventive care and correct treatment paths.", hi: "निवारक देखभाल और सही उपचार मार्गों के बारे में अपर्याप्त ज्ञान।" } }
        ]
    },
    section3: {
        title: { en: "Why DigiSwasthya Exists", hi: "डिजीस्वास्थ्य क्यों अस्तित्व में है" },
        text: {
            en: "DigiSwasthya was established to reduce the gap between healthcare providers and underserved communities. Through technology-driven healthcare solutions, medical expertise, health camps, preventive screening programs, and awareness initiatives, the organization aims to ensure that quality healthcare reaches people regardless of their location or financial background.",
            hi: "डिजीस्वास्थ्य की स्थापना स्वास्थ्य सेवा प्रदाताओं और वंचित समुदायों के बीच के अंतर को कम करने के लिए की गई थी। प्रौद्योगिकी संचालित स्वास्थ्य सेवा समाधानों, चिकित्सा विशेषज्ञता, स्वास्थ्य शिविरों, निवारक स्क्रीनिंग कार्यक्रमों और जागरूकता पहलों के माध्यम से, संगठन का उद्देश्य यह सुनिश्चित करना है कि गुणवत्तापूर्ण स्वास्थ्य सेवा लोगों तक पहुंचे, चाहे उनका स्थान या वित्तीय पृष्ठभूमि कुछ भी हो।"
        }
    },
    section4: {
        title: { en: "How We Create Impact", hi: "हम कैसे प्रभाव पैदा करते हैं" },
        process: [
            { icon: Megaphone, label: { en: "Community Outreach", hi: "सामुदायिक संपर्क" }, desc: { en: "Regular engagement with rural communities to identify local health issues and build trust.", hi: "स्थानीय स्वास्थ्य मुद्दों की पहचान करने और विश्वास बनाने के लिए ग्रामीण समुदायों के साथ नियमित जुड़ाव।" } },
            { icon: Activity, label: { en: "Health Camps", hi: "स्वास्थ्य शिविर" }, desc: { en: "Conducting periodic health camps in remote areas to provide on-the-ground checkups.", hi: "जमीनी स्तर पर जांच प्रदान करने के लिए दूरदराज के क्षेत्रों में समय-समय पर स्वास्थ्य शिविर आयोजित करना।" } },
            { icon: ClipboardList, label: { en: "Health Screening", hi: "स्वास्थ्य स्क्रीनिंग" }, desc: { en: "Basic diagnostic screenings to check vitals and check for symptoms early.", hi: "महत्वपूर्ण संकेतों और लक्षणों की शीघ्र पहचान के लिए बुनियादी नैदानिक स्क्रीनिंग।" } },
            { icon: Stethoscope, label: { en: "Doctor Consultation", hi: "चिकित्सक परामर्श" }, desc: { en: "Connecting patients via telemedicine video links with specialist city doctors.", hi: "शहर के विशेषज्ञ डॉक्टरों के साथ टेलीमेडिसिन वीडियो लिंक के माध्यम से रोगियों को जोड़ना।" } },
            { icon: RefreshCcw, label: { en: "Digital Follow-up", hi: "डिजिटल फॉलो-अप" }, desc: { en: "Ensuring continuity of care with digital EMR tracking and routine check-ins.", hi: "डिजिटल ईएमआर ट्रैकिंग और नियमित चेक-इन के साथ देखभाल की निरंतरता सुनिश्चित करना।" } },
            { icon: HeartHandshake, label: { en: "Healthier Communities", hi: "स्वस्थ समुदाय" }, desc: { en: "Empowering families with preventive knowledge and timely interventions.", hi: "निवारक ज्ञान और समय पर हस्तक्षेप के साथ परिवारों को सशक्त बनाना।" } }
        ]
    },
    section5_6: {
        mission: {
            title: { en: "Our Mission", hi: "हमारा मिशन" },
            text: {
                en: "To make quality healthcare accessible to every individual by leveraging technology, medical expertise, preventive care, and community-driven healthcare initiatives that improve health outcomes and promote well-being.",
                hi: "प्रौद्योगिकी, चिकित्सा विशेषज्ञता, निवारक देखभाल और समुदाय-संचालित स्वास्थ्य पहलों का लाभ उठाकर हर व्यक्ति के लिए गुणवत्तापूर्ण स्वास्थ्य सेवा सुलभ बनाना जो स्वास्थ्य परिणामों में सुधार करती हैं और कल्याण को बढ़ावा देती हैं।"
            }
        },
        vision: {
            title: { en: "Our Vision", hi: "हमारा विजन" },
            text: {
                en: "To build a healthier and more inclusive India where every individual, regardless of geography or financial background, has access to timely, affordable, and quality healthcare.",
                hi: "एक स्वस्थ और अधिक समावेशी भारत का निर्माण करना जहाँ हर व्यक्ति, चाहे वह किसी भी भूगोल या वित्तीय पृष्ठभूमि का हो, समय पर, किफायती और गुणवत्तापूर्ण स्वास्थ्य सेवा प्राप्त कर सके।"
            }
        }
    },
    section7: {
        title: { en: "Why Our Work Matters", hi: "हमारा काम क्यों मायने रखता है" },
        text: {
            en: "Every healthcare consultation, awareness campaign, and community health initiative contributes toward building healthier communities. DigiSwasthya believes that healthcare should not be a privilege but a fundamental right. By improving accessibility, promoting preventive healthcare, and connecting communities with trusted medical professionals, the organization is creating long-term social impact across India.",
            hi: "प्रत्येक स्वास्थ्य परामर्श, जागरूकता अभियान और सामुदायिक स्वास्थ्य पहल स्वस्थ समुदायों के निर्माण में योगदान देती है। डिजीस्वास्थ्य का मानना है कि स्वास्थ्य सेवा एक विशेषाधिकार नहीं बल्कि एक मौलिक अधिकार होना चाहिए। पहुंच में सुधार करके, निवारक स्वास्थ्य सेवा को बढ़ावा देकर और समुदायों को विश्वसनीय चिकित्सा पेशेवरों से जोड़कर, संगठन पूरे भारत में दीर्घकालिक सामाजिक प्रभाव पैदा कर रहा है।"
        },
        cards: [
            { title: { en: "Improving Healthcare Accessibility", hi: "स्वास्थ्य सेवा पहुंच में सुधार" }, desc: { en: "Bringing quality medical consultations and diagnostics to the doorsteps of rural communities.", hi: "ग्रामीण समुदायों के दरवाजे पर गुणवत्तापूर्ण चिकित्सा परामर्श और निदान लाना।" } },
            { title: { en: "Promoting Preventive Care", hi: "निवारक देखभाल को बढ़ावा देना" }, desc: { en: "Catching symptoms early through health screenings and educational health camps.", hi: "स्वास्थ्य जांच और शैक्षिक स्वास्थ्य शिविरों के माध्यम से लक्षणों को जल्दी पकड़ना।" } },
            { title: { en: "Empowering Communities", hi: "समुदायों को सशक्त बनाना" }, desc: { en: "Educating families on hygiene, nutrition, and correct medical pathways.", hi: "स्वच्छता, पोषण और सही चिकित्सा मार्गों पर परिवारों को शिक्षित करना।" } },
            { title: { en: "Leveraging Technology", hi: "प्रौद्योगिकी का लाभ उठाना" }, desc: { en: "Using hybrid telemedicine software to bridge the gap between villages and expert city doctors.", hi: "गांवों और शहर के विशेषज्ञ डॉक्टरों के बीच की दूरी को पाटने के लिए हाइब्रिड टेलीमेडिसिन सॉफ्टवेयर का उपयोग करना।" } }
        ]
    }
};

export default function AboutUs() {
    const { t, language } = useLanguage();
    const currentLang = (language === "en" || language === "hi") ? language : "en";

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* SECTION 1 — WHO WE ARE (Hero Section) */}
            <section className="relative bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 border-b border-white/10 py-16 lg:py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />
                </div>
                <div className="absolute -top-32 -right-32 w-[36rem] h-[36rem] bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="container max-w-7xl relative z-10 px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="space-y-6 text-center lg:text-left">
                            <motion.span
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-sm"
                            >
                                {contentDict.section1.title[currentLang]}
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight drop-shadow-lg"
                            >
                                {currentLang === "hi" ? (
                                    <>
                                        गुणवत्तापूर्ण स्वास्थ्य सेवा <br />
                                        <span className="text-secondary-400 font-extrabold">सभी के लिए</span>
                                    </>
                                ) : (
                                    <>
                                        Quality Healthcare <br />
                                        <span className="text-secondary-400 font-extrabold drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]">For Everyone</span>
                                    </>
                                )}
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-300 text-base md:text-lg font-normal leading-relaxed text-justify"
                            >
                                {contentDict.section1.text[currentLang]}
                            </motion.p>
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25, duration: 0.5 }}
                            className="relative h-[240px] md:h-[340px] lg:h-[380px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 group"
                        >
                            <Image
                                src="/images/about/who-we-are.jpg"
                                alt="DigiSwasthya Health Camp - Serving rural communities"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SECTION 2 — THE HEALTHCARE CHALLENGE IN INDIA */}
            <section className="py-24 bg-gradient-to-b from-slate-50 to-white border-b border-gray-100">
                <div className="container max-w-7xl px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="relative h-[240px] sm:h-[320px] md:h-[360px] rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-200/60 group order-2 lg:order-1"
                        >
                            <Image
                                src="/images/about/healthcare-challenge.jpg"
                                alt="DigiSwasthya Health Awareness Camp at rural school"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </motion.div>

                        <div className="space-y-8 order-1 lg:order-2">
                            <div className="space-y-4 text-center lg:text-left">
                                <span className="inline-block text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 border border-red-100 px-3.5 py-1 rounded-full">
                                    {currentLang === "hi" ? "भारत में चुनौती" : "The Gap In India"}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight">
                                    {contentDict.section2.title[currentLang]}
                                </h2>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                                    {contentDict.section2.text[currentLang]}
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {contentDict.section2.challenges.map((challenge, index) => {
                                    const Icon = challenge.icon;
                                    return (
                                        <div key={index} className="group relative flex flex-col gap-4 p-6 rounded-3xl bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm ring-4 ring-white">
                                                <Icon className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div className="space-y-2 relative z-10">
                                                <h4 className="text-base font-black text-gray-900 group-hover:text-red-700 transition-colors duration-300">{challenge.title[currentLang]}</h4>
                                                <p className="text-sm font-medium text-gray-500 leading-relaxed">{challenge.desc[currentLang]}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 3 — WHY DIGISWASTHYA EXISTS & OUR MISSION/VISION */}
            <section className="py-24 bg-gradient-to-br from-primary-50/40 via-white to-slate-50 border-b border-gray-100">
                <div className="container max-w-7xl px-4">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
                        <div className="space-y-6">
                            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary-800 bg-primary-100/70 border border-primary-200/50 px-3.5 py-1 rounded-full text-center lg:text-left">
                                {contentDict.section3.title[currentLang]}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight text-center lg:text-left">
                                {currentLang === "hi" ? "हमारा दृष्टिकोण" : "Bridging the Distance"}
                            </h2>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                                {contentDict.section3.text[currentLang]}
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="relative h-[240px] sm:h-[320px] md:h-[360px] rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-200/60 group"
                        >
                            <Image
                                src="/images/about/why-digiswasthya-exists.jpg"
                                alt="DigiSwasthya Telemedicine Consultation"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                        </motion.div>
                    </div>

                    {/* OUR MISSION & VISION */}
                    <div className="mt-20 pt-16 border-t border-gray-200/70">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="relative h-[280px] sm:h-[360px] lg:h-[400px] rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-200/60 group order-2 lg:order-1"
                            >
                                <Image
                                    src="/images/about/healthy-communities.jpg"
                                    alt="DigiSwasthya Foundation community health camp"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                            </motion.div>

                            <div className="space-y-12 order-1 lg:order-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-4"
                                >
                                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-primary-800 bg-primary-100/70 border border-primary-200/50 px-3.5 py-1 rounded-full">
                                        {contentDict.section5_6.mission.title[currentLang]}
                                    </span>
                                    <h3 className="text-3xl font-serif font-bold text-gray-900 leading-tight">
                                        {currentLang === "hi" ? "गुणवत्ता और समावेशी स्वास्थ्य सेवा" : "Accessible Quality Healthcare"}
                                    </h3>
                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                                        {contentDict.section5_6.mission.text[currentLang]}
                                    </p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-4"
                                >
                                    <span className="inline-block text-[10px] font-black uppercase tracking-widest text-secondary-800 bg-secondary-100/70 border border-secondary-200/50 px-3.5 py-1 rounded-full">
                                        {contentDict.section5_6.vision.title[currentLang]}
                                    </span>
                                    <h3 className="text-3xl font-serif font-bold text-gray-900 leading-tight">
                                        {currentLang === "hi" ? "स्वस्थ एवं खुशहाल ग्रामीण भारत" : "Healthy & Happy Rural India"}
                                    </h3>
                                    <p className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                                        {contentDict.section5_6.vision.text[currentLang]}
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4 — SANDEEP'S STORY */}
            <section className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(circle_at_1px_1px,#16a34a_1px,transparent_0)] [background-size:32px_32px] pointer-events-none" />
                <div className="container max-w-7xl px-4 relative z-10">
                    <div id="sandeeps-story" className="max-w-6xl mx-auto scroll-mt-24">
                        <div className="grid lg:grid-cols-[1.6fr_1.1fr] gap-12 items-start">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight pb-3 border-b-4 border-primary-500 inline-block">Sandeep's Story</h3>
                                <div className="space-y-4 text-gray-600 leading-relaxed text-sm font-medium text-justify">
                                    <p>
                                        In 2007, Sandeep was unwell. He wandered from one hospital to another but did not get the right diagnosis due to lack of qualified doctors and under-equipped hospitals in Sant-Kabir-Nagar, a small district in Uttar Pradesh. Lack of access to guidance of what needed to be done added to the worries.
                                    </p>
                                    <p>
                                        After 6-months, he got a biopsy done and was diagnosed with Ewing-Sarcoma (a type of bone-cancer). His whole right-humerus-bone was replaced. Doctors later proclaimed that Sandeep would have become immobilized if diagnosis would have been delayed.
                                    </p>
                                    <p>
                                        Over the next few months, he recovered slowly at Tata Memorial Hospital, Mumbai. However, the journey from being clueless as to what was the cause of his ailment to being detected with cancer, to gradually recovering, was nothing less than a miracle for him and his family. Sandeep was determined to give back to the society and started working with social-sector organizations (health) from 2015 to 2020. He devoted himself to work for thousands of cancer patients, cancer-survivors, and their families, providing them guidance, emotional support, financial support for their diagnostics, treatment, care and education.
                                    </p>
                                    <p>
                                        While his work created a positive impact on the lives of several patients, he realized that his ultimate calling was to go back to the grassroots and address the challenges from where they initiate – villages where there is lack of awareness of health issues and lack of access to healthcare infrastructure. Sandeep took a break from his job, and started conceiving an idea around how by leveraging technology, he can address the challenges he had earlier identified and make primary healthcare affordable and accessible in rural areas, where more than 65% of India's 1.4 Billion population live. After numerous interviews with people living in these areas, discussions with senior administrators of India's biggest hospitals, professors and government officials and evaluation of how other developing nations are handling the problem, Sandeep conceived the idea of DigiSwasthya (Digi=Digital, Swasthya = Health). He invested most of his savings till then to establish DigiSwasthya's 1st telemedicine clinic in July 2020 in his home district, Sant-Kabir-Nagar.
                                    </p>
                                    <p>
                                        By creating a full stack primary healthcare platform, from creating a safe and hygienic physical space for patients to come, hiring trained nursing staff, creating tie-ups with doctors from prominent city hospitals, onboarding a tele-medicine software and hardware, to getting prescriptions fulfilled from adjoining pharmacies, Sandeep created one of the state's 1st hybrid medical consultation facility.
                                    </p>
                                    <p>
                                        By creating a network of such standardized clinics across India, Sandeep and his motivated team is on a mission "to transform the country's primary healthcare system and make healthcare services affordable and accessible for rural communities by leveraging technology".
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative lg:sticky lg:top-24 mt-8 lg:mt-0"
                            >
                                <div className="rounded-3xl overflow-hidden bg-black shadow-[0_24px_60px_-12px_rgba(0,0,0,0.3)] ring-1 ring-gray-200">
                                    <video
                                        controls
                                        className="w-full h-auto"
                                        preload="metadata"
                                    >
                                        <source src="/Videos/Motive (Digiswasthya).mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className="mt-3 text-center">
                                    <p className="text-sm font-semibold text-primary-600">🎥 Why Sandeep Started DigiSwasthya</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5 — HOW WE WORK & OUR CARE MODEL */}
            <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 border-b border-gray-100">
                <div className="container max-w-7xl px-4">
                    {/* KEEP ORIGINAL "How We Work" (8 Pillars) & "Our Care Model" (7 Cards) AS REQUESTED */}
                    <div>
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h3 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">How We Work</h3>
                            <p className="text-gray-600 text-lg font-medium mt-2">DigiSwasthya bridges the healthcare gap in underserved communities through a structured and technology-enabled support system.</p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                            {[
                                { title: "Awareness Campaigns", icon: Megaphone, color: "text-blue-600", bg: "bg-blue-50", arrowColor: "text-blue-400", desc: "We conduct community outreach and health awareness initiatives to educate rural populations about preventive care and early detection." },
                                { title: "Accurate Information", icon: Info, color: "text-indigo-600", bg: "bg-indigo-50", arrowColor: "text-indigo-400", desc: "Our trained coordinators provide reliable health information and guidance, reducing misinformation and promoting informed decisions." },
                                { title: "Electronic Medical Records", icon: Database, color: "text-purple-600", bg: "bg-purple-50", arrowColor: "text-purple-400", desc: "We assist in digitally recording patient health information to ensure continuity of care and better coordination with specialists." },
                                { title: "Primary Health Checkups", icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-50", arrowColor: "text-emerald-400", desc: "Basic health assessments are conducted at village centers to identify early symptoms and determine the need for further consultation." },
                                { title: "Expert Opinion", icon: Stethoscope, color: "text-cyan-600", bg: "bg-cyan-50", arrowColor: "text-cyan-400", desc: "Through teleconsultation support, beneficiaries are connected with qualified medical professionals for specialist advice." },
                                { title: "Timely Diagnosis", icon: Clock, color: "text-amber-600", bg: "bg-amber-50", arrowColor: "text-amber-400", desc: "By facilitating quicker access to professional consultation, we help reduce delays in identifying health conditions." },
                                { title: "Referral Pathways", icon: ExternalLink, color: "text-orange-600", bg: "bg-orange-50", arrowColor: "text-orange-400", desc: "When necessary, we guide patients toward appropriate healthcare facilities or partner hospitals for advanced treatment." },
                                { title: "Follow-Ups", icon: RefreshCcw, color: "text-rose-600", bg: "bg-rose-50", arrowColor: "text-rose-400", desc: "We support follow-up coordination to encourage adherence to prescribed treatment plans and monitor recovery progress." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    custom={i * 0.05}
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.04)] group cursor-default hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    <div className={`relative w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ring-4 ring-white`}>
                                        <item.icon className={`${item.color} w-7 h-7`} />
                                    </div>
                                    <h4 className="relative text-lg font-black text-gray-900 mb-3 leading-tight group-hover:text-primary-700 transition-colors duration-300">{item.title}</h4>
                                    <p className="relative text-gray-500 leading-relaxed text-sm font-medium">
                                        {item.desc}
                                    </p>
                                    <div className={`relative flex items-center gap-1 mt-5 ${item.arrowColor} opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1`}>
                                        <ArrowRight className="w-4 h-4 font-bold" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-200/60 pt-20 mt-20">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h3 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight">Our Care Model</h3>
                            <p className="text-gray-600 text-lg font-medium mt-2">How every DigiSwasthya centre delivers safe, continuous, and trusted care — designed for the realities of rural India.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {[
                                { title: "Bringing Healthcare Closer to Communities", lead: "Trusted care, within your community.", icon: Users, color: "text-blue-600", bg: "bg-blue-50", desc: "A trained coordinator welcomes each patient, records their history and vital signs, and connects them with a qualified doctor over live video — followed by a digital prescription, counselling, and a clear follow-up plan, all without travelling long distances." },
                                { title: "Delivering Better Care Through Technology", lead: "Technology strengthens care — it never replaces it.", icon: Cpu, color: "text-indigo-600", bg: "bg-indigo-50", desc: "Doctors instantly review a patient's past consultations, diagnoses, and medications, while AI summarises histories, highlights key clinical information, and checks prescriptions for interactions before they are issued — so clinicians can focus on the patient. AI enhances clinical judgement; it never replaces it." },
                                { title: "Caring Beyond a Single Consultation", lead: "Continuity, not isolated visits.", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Chronic conditions like diabetes and hypertension need ongoing care. Patients receive regular follow-ups and a complete longitudinal health record, and coordinators reach out to those who miss appointments — turning episodic visits into lasting care relationships." },
                                { title: "Understanding the Whole Person", lead: "Health is shaped by more than symptoms.", icon: HeartHandshake, color: "text-rose-600", bg: "bg-rose-50", desc: "Our model considers family health history, household conditions, water and sanitation, and nutrition — giving clinicians a fuller picture, helping identify risks earlier within families, and supporting healthier communities." },
                                { title: "Built for Rural India", lead: "Designed for real-world conditions.", icon: Smartphone, color: "text-cyan-600", bg: "bg-cyan-50", desc: "Our systems work reliably even where connectivity is limited — coordinators keep registering patients and recording information offline, with data securely synced once back online. The platform runs in English and Hindi on affordable Android devices." },
                                { title: "Protecting Every Patient's Trust", lead: "Privacy is fundamental to how we work.", icon: ShieldCheck, color: "text-amber-600", bg: "bg-amber-50", desc: "Patient information is encrypted, securely stored, and accessible only to authorised healthcare professionals involved in a patient's care. Strong security and controlled access keep confidentiality and dignity central to every consultation." },
                                { title: "Scaling Quality Healthcare", lead: "Every improvement reaches every community.", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50", desc: "As our network grows, new clinical guidance, enhanced safety features, improved AI capabilities, and better workflows roll out across all centres — so patients receive a consistent standard of care wherever they seek treatment." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className={`relative bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] group cursor-default hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden ${i === 6 ? "lg:col-start-2" : ""}`}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.02] [background-image:radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:16px_16px] transition-opacity duration-300 pointer-events-none" />
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-full pointer-events-none" />

                                    <div className={`relative w-16 h-16 ${item.bg} rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-lg`}>
                                        <item.icon className={`${item.color} w-8 h-8`} />
                                    </div>
                                    <h4 className="relative text-xl font-black text-gray-900 mb-3 leading-tight group-hover:text-gray-800 transition-colors duration-300">{item.title}</h4>
                                    <p className={`relative text-[11px] font-bold mb-4 ${item.color} tracking-wide uppercase`}>{item.lead}</p>
                                    <p className="relative text-gray-600 leading-relaxed text-sm font-medium">
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6 — WHY OUR WORK MATTERS */}
            <section className="py-24 bg-white border-b border-gray-100 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
                <div className="container max-w-7xl px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <span className="inline-block text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-100 px-3.5 py-1 rounded-full mb-3">
                            {contentDict.section7.title[currentLang]}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                            {currentLang === "hi" ? "हमारा काम क्यों मायने रखता है" : "The Core of Our Mission"}
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-4 max-w-2xl mx-auto text-center">
                            {contentDict.section7.text[currentLang]}
                        </p>
                    </motion.div>

                    {/* 4 Value Cards */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {contentDict.section7.cards.map((card, index) => {
                            // Assign unique icons
                            const icons = [TrendingUp, ShieldCheck, Users, Cpu];
                            const Icon = icons[index];
                            return (
                                <motion.div
                                    key={index}
                                    custom={index * 0.08}
                                    variants={cardVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col group cursor-default hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                                >
                                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-100 transition-colors">
                                        <Icon className="text-primary-600 w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors">
                                        {card.title[currentLang]}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed text-sm font-medium flex-grow">
                                        {card.desc[currentLang]}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 8 — CREDENTIALS, PARTNERS & TRANSPARENCY (Existing Sections) */}
            <section id="our-partners" className="py-24 bg-gradient-to-b from-slate-50 to-white scroll-mt-24">
                <div className="container max-w-6xl px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-start border-b border-gray-200/50 pb-24">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">Transparency & Legitimacy</h2>
                            <p className="text-gray-600 text-lg mb-8">
                                DigiSwasthya is a registered non-profit committed to the highest standards of accountability and regulatory compliance.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-700 bg-white p-5 rounded-2xl border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
                                    <FileText className="text-primary-600 w-5 h-5 shrink-0" />
                                    <span><strong>NGO Registration:</strong> U85300UP2020NPL130635</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-4 italic underline decoration-gray-200">
                                    Registered and compliant with applicable healthcare regulations in India.
                                </p>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-6 text-gray-900 border-b border-gray-100 pb-4">
                                <HeartHandshake className="text-primary-600 w-6 h-6" />
                                <h3 className="text-xl font-black uppercase tracking-tight">Our Partners</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {[
                                    { id: "01", image: "/images/partner-1.png" },
                                    { id: "02", image: "/images/partner-2.png" },
                                    { id: "03", image: "/images/partner-3.png" },
                                    { id: "04", image: "/images/partner-4.png" },
                                    { id: "05", image: "/images/partner-5.png" },
                                    { id: "06", image: "/images/partner-6.png" },
                                    { id: "07", image: "/images/partner-7.png" },
                                    { id: "08", image: "/images/partner-8.png" },
                                    { id: "09", image: "/images/partner-9.png", link: "https://empowerpragati.in/" },
                                    { id: "10", image: "/images/partner-10.png" },
                                    { id: "11", image: "/images/partner-11.png" },
                                    { id: "12", image: "/images/partner-12.png", link: "https://svpindia.org/" },
                                    { id: "13", image: "/images/partner-13.jpg", link: "https://linktr.ee/teamspreadingsmilesofjoy" },
                                    { id: "14", image: "/images/partner-14.jpg" },
                                    { id: "15", image: "/images/partner-15.png" },
                                    { id: "16", image: "/images/partner-16.png" }
                                ].map((p, i) => {
                                    const CardContent = (
                                        <div
                                            className="h-24 bg-white rounded-2xl border border-gray-100 flex items-center justify-center p-4 shadow-sm hover:shadow-md hover:border-primary-100 transition-all duration-200"
                                        >
                                            {p.image ? (
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={p.image}
                                                        alt={`Partner ${p.id}`}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-center opacity-40">
                                                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1 text-[8px]">Partner</div>
                                                    <div className="text-xs font-black text-gray-500">ORG-{p.id}</div>
                                                </div>
                                            )}
                                        </div>
                                    );

                                    return p.link ? (
                                        <a
                                            key={i}
                                            href={p.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block transition-transform hover:scale-[1.02]"
                                        >
                                            {CardContent}
                                        </a>
                                    ) : (
                                        <div key={i} className="cursor-default">
                                            {CardContent}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Transparency Micro-Section */}
            <section className="py-24 bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 relative overflow-hidden">
                <div className="container px-4">
                <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:24px_24px] pointer-events-none" />
                <div className="absolute -top-20 right-0 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
                    <motion.div
                        {...fadeIn}
                        className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck className="w-32 h-32" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Promise of Accountability</h2>
                        <p className="text-primary-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                            We are committed to ethical healthcare delivery and transparent use of funds. Every contribution is tracked to ensure maximum impact in our rural communities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <a
                                href="/annual-report.pdf"
                                className="flex items-center gap-2 text-white font-bold hover:text-secondary-400 transition-colors border border-white/20 hover:border-secondary-400 rounded-full px-6 py-2.5 hover:bg-white/5"
                            >
                                <FileText className="w-5 h-5" />
                                Download Annual Report 2021-22
                            </a>
                            <span className="hidden sm:inline w-1 h-8 bg-white/20" />
                            <a
                                href="/contact-us"
                                className="flex items-center gap-2 group text-white font-bold hover:text-secondary-400 transition-colors border border-white/20 hover:border-secondary-400 rounded-full px-6 py-2.5 hover:bg-white/5"
                            >
                                Contact Our Ethics Office
                                <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
