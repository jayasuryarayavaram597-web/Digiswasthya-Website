"use client";

import { useState } from "react";
import { Calendar, Filter, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImpactFilterBarProps {
    onApplyFilters: (filters: {
        fromDate: string;
        toDate: string;
        period: string;
        centerStatus: string;
    }) => void;
}

export function ImpactFilterBar({ onApplyFilters }: ImpactFilterBarProps) {
    const [fromDate, setFromDate] = useState("2026-08-04");
    const [toDate, setToDate] = useState("");
    const [period, setPeriod] = useState("By year");
    const [centerStatus, setCenterStatus] = useState("Active centers");
    const [isApplying, setIsApplying] = useState(false);

    const handleApply = () => {
        setIsApplying(true);
        onApplyFilters({ fromDate, toDate, period, centerStatus });
        setTimeout(() => setIsApplying(false), 400);
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Header Title */}
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                        <Layers className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 font-serif">Outreach & Impact</h2>
                        <p className="text-xs text-gray-500 font-medium">
                            Aggregate network figures for publishing. No patient-level data appears on this page. <span className="uppercase text-primary-600 font-bold ml-1">ALL TIME</span>
                        </p>
                    </div>
                </div>

                {/* Filter Controls Bar */}
                <div className="flex flex-wrap items-end gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-100">
                    
                    {/* FROM DATE */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">From</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="bg-white border border-gray-200 text-gray-800 text-xs font-medium rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-2xs"
                            />
                        </div>
                    </div>

                    {/* TO DATE */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">To</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                placeholder="dd-mm-yyyy"
                                className="bg-white border border-gray-200 text-gray-800 text-xs font-medium rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-2xs"
                            />
                        </div>
                    </div>

                    {/* CHART PERIODS */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Chart Periods</label>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-2xs cursor-pointer"
                        >
                            <option value="By year">By year</option>
                            <option value="By month">By month</option>
                        </select>
                    </div>

                    {/* CENTER STATUS */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Center Status</label>
                        <select
                            value={centerStatus}
                            onChange={(e) => setCenterStatus(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-2xs cursor-pointer"
                        >
                            <option value="Active centers">Active centers</option>
                            <option value="include inactive">include inactive</option>
                            <option value="inactive only">inactive only</option>
                        </select>
                    </div>

                    {/* APPLY BUTTON */}
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleApply}
                            disabled={isApplying}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                            {isApplying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                        </Button>
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest hidden xl:inline">PRESS APPLY</span>
                    </div>

                </div>

            </div>
        </div>
    );
}
