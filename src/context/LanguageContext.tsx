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
    const [language, setLanguageState] = useState("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("ds-language");
        if (savedLang && (savedLang === "en" || savedLang === "hi")) {
            setLanguageState(savedLang);
            // Apply HTML lang attribute
            document.documentElement.lang = savedLang;
        }
    }, []);

    const setLanguage = (lang: string) => {
        setLanguageState(lang);
        localStorage.setItem("ds-language", lang);
        document.documentElement.lang = lang;
    };

    const t = (key: string): string => {
        const keys = key.split(".");
        let value: any = translations[language];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
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
