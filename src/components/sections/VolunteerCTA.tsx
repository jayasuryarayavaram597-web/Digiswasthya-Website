"use client";

import { useLanguage } from "@/context/LanguageContext";

const VOLUNTEER_FORM_URL = "https://forms.gle/GvjUfAoMBKvqTNcXA";

export function VolunteerCTA() {
    const { t } = useLanguage();

    return (
        <section className="bg-gradient-to-b from-[#f4f9f6] via-[#eaf5ef] to-[#f8fcf9] border-t border-emerald-150 py-8 sm:py-10 text-center mt-6 sm:mt-8">
            <div className="max-w-2xl mx-auto px-4 space-y-3 sm:space-y-3.5">
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-gray-900 leading-tight">
                    {t("ourTeam.volunteerCta.heading")}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal max-w-xl mx-auto">
                    {t("ourTeam.volunteerCta.body")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
                    <div className="flex items-center gap-1.5 text-primary-900 font-semibold text-xs sm:text-sm bg-white/90 px-4 py-2 rounded-xl border border-emerald-200/80 shadow-xs">
                        <span className="font-bold text-slate-700">{t("ourTeam.volunteerCta.emailLabel")}</span> support@digiswasthya.org
                    </div>
                    <a
                        href={VOLUNTEER_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 via-primary-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md shadow-emerald-700/20 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        {t("ourTeam.volunteerCta.applyButton")}
                    </a>
                </div>
            </div>
        </section>
    );
}
