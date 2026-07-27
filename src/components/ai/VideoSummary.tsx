"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Sparkles } from "lucide-react";

export function VideoSummary({ videoId }: { videoId: string }) {
    const [summary, setSummary] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/summarize-video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoId }),
            });

            if (!response.ok) throw new Error("Failed to fetch summary");

            const data = await response.json();
            setSummary(data.summary);
        } catch (err) {
            setError("Could not generate summary. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 border rounded-lg p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    AI Video Insights
                </h3>
                {!summary && !loading && (
                    <Button onClick={fetchSummary} variant="secondary" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Get AI Summary
                    </Button>
                )}
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary-600" />
                    <p className="text-sm">Analyzing video transcript...</p>
                </div>
            )}

            {error && (
                <div className="text-red-500 text-sm py-2 bg-red-50 px-4 rounded">
                    {error}
                </div>
            )}

            {summary && (
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">What DigiSwasthya Does:</h4>
                    <ul className="space-y-2">
                        {summary.map((point, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary-500 flex-shrink-0" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setSummary(null)} className="text-gray-500 text-xs">Clear Summary</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
