"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import en from "@/translations/en.json";
import hi from "@/translations/hi.json";

type Translations = typeof en;

interface LanguageContextType {
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<string, Translations> = {
    en,
    hi,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<string>(() => {
        if (typeof window !== "undefined") {
            const savedLang = localStorage.getItem("ds-language");
            if (savedLang && (savedLang === "en" || savedLang === "hi")) {
                return savedLang;
            }
        }
        return "en";
    });

    useEffect(() => {
        if (typeof document !== "undefined") {
            document.documentElement.lang = language;
        }
    }, [language]);

    const setLanguage = (lang: string) => {
        setLanguageState(lang);
        localStorage.setItem("ds-language", lang);
        if (typeof document !== "undefined") {
            document.documentElement.lang = lang;
        }
    };

    const t = (key: string): string => {
        const keys = key.split(".");
        let value: Record<string, unknown> | string | undefined = translations[language];

        for (const k of keys) {
            if (value && typeof value === "object" && k in value) {
                value = (value as Record<string, unknown>)[k];
            } else {
                return key; // Return the key if translation not found
            }
        }

        return typeof value === "string" ? value : key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
