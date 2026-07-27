"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type UnitSystem = "metric" | "imperial";
type BMICategory = "Underweight" | "Normal" | "Overweight" | "Obese" | null;

interface BMIResult {
    value: number;
    category: BMICategory;
    message: string;
    color: string;
}

const categoryColors = {
    Underweight: "text-blue-600 bg-blue-50 border-blue-100",
    Normal: "text-green-600 bg-green-50 border-green-100",
    Overweight: "text-orange-600 bg-orange-50 border-orange-100",
    Obese: "text-red-600 bg-red-50 border-red-100"
};

export function BMICalculator() {
    const { t } = useLanguage();
    const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
    const [weight, setWeight] = useState<string>("");
    const [height, setHeight] = useState<string>("");
    const [heightInches, setHeightInches] = useState<string>("");
    const [result, setResult] = useState<BMIResult | null>(null);

    const guidanceMessages = {
        Underweight: t("bmiCalculator.messages.underweight"),
        Normal: t("bmiCalculator.messages.normal"),
        Overweight: t("bmiCalculator.messages.overweight"),
        Obese: t("bmiCalculator.messages.obese")
    };

    const categoryNames = {
        Underweight: t("bmiCalculator.categories.underweight"),
        Normal: t("bmiCalculator.categories.normal"),
        Overweight: t("bmiCalculator.categories.overweight"),
        Obese: t("bmiCalculator.categories.obese")
    };

    const calculateBMI = (e: React.FormEvent) => {
        e.preventDefault();
        let bmiValue = 0;
        const w = parseFloat(weight);

        if (unitSystem === "metric") {
            const h = parseFloat(height);
            if (w > 0 && h > 0) {
                const heightInMeters = h / 100;
                bmiValue = w / (heightInMeters * heightInMeters);
            }
        } else {
            const hFt = parseFloat(height);
            const hIn = parseFloat(heightInches) || 0;
            const totalInches = (hFt * 12) + hIn;
            if (w > 0 && totalInches > 0) {
                bmiValue = (w * 703) / (totalInches * totalInches);
            }
        }

        if (bmiValue > 0) {
            let cat: BMICategory = "Normal";
            if (bmiValue < 18.5) cat = "Underweight";
            else if (bmiValue < 25) cat = "Normal";
            else if (bmiValue < 30) cat = "Overweight";
            else cat = "Obese";

            setResult({
                value: bmiValue,
                category: cat,
                message: guidanceMessages[cat],
                color: categoryColors[cat]
            });
        }
    };

    const resetFields = () => {
        setWeight("");
        setHeight("");
        setHeightInches("");
        setResult(null);
    };

    return (
        <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row">
            {/* Input Section */}
            <div className="md:w-1/2 p-8 lg:p-12 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-gray-900 border-l-4 border-primary-500 pl-4 uppercase tracking-tight">{t("bmiCalculator.assessment")}</h3>
                    <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                        <button
                            onClick={() => { setUnitSystem("metric"); setResult(null); }}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${unitSystem === "metric" ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            {t("bmiCalculator.metric")}
                        </button>
                        <button
                            onClick={() => { setUnitSystem("imperial"); setResult(null); }}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${unitSystem === "imperial" ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            {t("bmiCalculator.imperial")}
                        </button>
                    </div>
                </div>

                <form onSubmit={calculateBMI} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900 flex justify-between">
                            {t("bmiCalculator.weight")}
                            <span className="text-xs font-medium text-gray-400">({unitSystem === "metric" ? t("bmiCalculator.kg") : t("bmiCalculator.lbs")})</span>
                        </label>
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder={unitSystem === "metric" ? "e.g. 70" : "e.g. 154"}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900 flex justify-between">
                            {t("bmiCalculator.height")}
                            <span className="text-xs font-medium text-gray-400">({unitSystem === "metric" ? t("bmiCalculator.cm") : t("bmiCalculator.ftIn")})</span>
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                placeholder={unitSystem === "metric" ? "e.g. 175" : "ft"}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                required
                            />
                            {unitSystem === "imperial" && (
                                <input
                                    type="number"
                                    value={heightInches}
                                    onChange={(e) => setHeightInches(e.target.value)}
                                    placeholder="in"
                                    className="w-24 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1 py-4 h-auto rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                        >
                            {t("bmiCalculator.calculate")}
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                        <button
                            type="button"
                            onClick={resetFields}
                            className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors"
                            title={t("bmiCalculator.reset")}
                        >
                            <RefreshCw className="h-6 w-6" />
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-[10px] text-gray-400 leading-relaxed italic border-t border-gray-50 pt-4">
                    {t("bmi.disclaimer")}
                </p>
            </div>

            {/* Results Section */}
            <div className="md:w-1/2 bg-gray-50/50 p-8 lg:p-12 flex flex-col items-center justify-center relative">
                <AnimatePresence mode="wait">
                    {!result ? (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center space-y-4"
                        >
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto border border-gray-100">
                                <Info className="h-10 w-10 text-primary-200" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-gray-900 font-bold">{t("bmiCalculator.readyTitle")}</p>
                                <p className="text-sm text-gray-500 max-w-[200px]">{t("bmiCalculator.readySub")}</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="w-full space-y-8"
                        >
                            <div className="text-center">
                                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">{t("bmiCalculator.yourBmiValue")}</p>
                                <div className="text-6xl font-black text-gray-900 tracking-tight">
                                    {result.value.toFixed(1)}
                                </div>
                            </div>

                            <div className={`p-6 rounded-3xl border text-center space-y-2 ${result.color}`}>
                                <h4 className="font-black text-xl uppercase tracking-tight">{categoryNames[result.category!]}</h4>
                                <p className="text-sm font-medium leading-relaxed opacity-90">{result.message}</p>
                            </div>

                            <div className="relative pt-6">
                                <div className="h-2 w-full bg-gray-200 rounded-full flex overflow-hidden">
                                    <div className="h-full bg-blue-400" style={{ width: '18.5%' }}></div>
                                    <div className="h-full bg-green-500" style={{ width: '25%' }}></div>
                                    <div className="h-full bg-orange-400" style={{ width: '25%' }}></div>
                                    <div className="h-full bg-red-500" style={{ width: '31.5%' }}></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 px-1">
                                    <span>{t("bmiCalculator.under")}</span>
                                    <span>{t("bmiCalculator.normal")}</span>
                                    <span>{t("bmiCalculator.over")}</span>
                                    <span>{t("bmiCalculator.obese")}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
