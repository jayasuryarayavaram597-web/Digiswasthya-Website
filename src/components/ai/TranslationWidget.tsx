"use client";

import { useState } from "react";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi (हिंदी)" },
];

export function TranslationWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    const handleLanguageChange = (langCode: string) => {
        setLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start">
            {isOpen && (
                <div className="mb-4 w-56 rounded-[1.5rem] border-4 border-white bg-white/90 backdrop-blur-md shadow-2xl overflow-hidden max-h-[70vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-5 duration-300 ring-1 ring-black/5">
                    <div className="px-5 py-4 bg-primary-600 text-white font-bold text-xs uppercase tracking-widest text-center border-b border-white/10">
                        {t("common.selectLanguage")}
                    </div>
                    <div className="p-2 space-y-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={cn(
                                    "flex w-full items-center justify-between px-4 py-3 text-sm rounded-xl transition-all duration-200",
                                    language === lang.code
                                        ? "bg-primary-600 text-white font-bold shadow-md scale-[1.02]"
                                        : "text-gray-700 hover:bg-primary-50 hover:text-primary-700 font-medium"
                                )}
                            >
                                {lang.name}
                                {language === lang.code && <Check className="h-4 w-4 text-white" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3">
                <Button
                    variant="primary"
                    size="icon"
                    className="h-16 w-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-primary-600 hover:bg-primary-700 hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <Globe className="h-7 w-7 text-white" />
                </Button>

                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/95 backdrop-blur-md text-primary-900 text-sm font-bold px-4 py-2 rounded-2xl shadow-xl border-2 border-primary-100 flex items-center gap-2"
                >
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {languages.find(l => l.code === language)?.name}
                </motion.div>
            </div>
        </div>
    );
}
