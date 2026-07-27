"use client";

import { useLanguage } from "@/context/LanguageContext";

const VOLUNTEER_FORM_URL = "https://forms.gle/GvjUfAoMBKvqTNcXA";

export function VolunteerCTA() {
    const { t } = useLanguage();

    return (
        <section className="bg-gradient-to-br from-[#f0f7ff] via-white to-[#e0f2fe] border-t border-blue-100 py-16 text-center mt-12">
            <div className="max-w-2xl mx-auto px-4 space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">{t("ourTeam.volunteerCta.heading")}</h2>
                <p className="text-gray-600 leading-relaxed font-medium">
                    {t("ourTeam.volunteerCta.body")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="flex items-center gap-2 text-primary-700 font-semibold text-sm bg-primary-50 px-4 py-2.5 rounded-xl border border-primary-100">
                        <span className="font-bold">{t("ourTeam.volunteerCta.emailLabel")}</span> support@digiswasthya.org
                    </div>
                    <a
                        href={VOLUNTEER_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-colors duration-200"
                    >
                        {t("ourTeam.volunteerCta.applyButton")}
                    </a>
                </div>
            </div>
        </section>
    );
}
