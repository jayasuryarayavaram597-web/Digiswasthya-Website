import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "mock-key", // Fallback to avoid crash if env missing during build
});

export async function POST(req: Request) {
    try {
        const { videoId } = await req.json();

        if (!videoId) {
            return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
        }

        // 1. Fetch Transcript
        let transcriptText = "";
        try {
            const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
            transcriptText = transcriptItems.map((item) => item.text).join(" ");
        } catch (e) {
            console.error("Transcript Error:", e);
            return NextResponse.json({ error: "Could not retrieve video transcript. The video might not have captions." }, { status: 500 });
        }

        // Truncate if too long (approx 15k chars for token limits safety)
        if (transcriptText.length > 15000) {
            transcriptText = transcriptText.substring(0, 15000) + "...";
        }

        // 2. Send to OpenAI
        if (!process.env.OPENAI_API_KEY) {
            // Mock response if no key
            return NextResponse.json({
                summary: [
                    "DigiSwasthya makes healthcare affordable and accessible for rural communities.",
                    "They use technology to bridge the gap between rural patients and city doctors.",
                    "The foundation organizes health camps and screenings in villages.",
                    "Teleconsultations allow patients to see specialists without traveling.",
                    "Sandeep Kumar founded it to verify that no one suffers from lack of diagnosis like he did."
                ]
            });
        }

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant for a rural Indian healthcare non-profit. Summarize the video transcript in 5-6 clear, simple bullet points.",
                },
                {
                    role: "user",
                    content: transcriptText,
                },
            ],
            model: "gpt-4",
        });

        const summaryText = completion.choices[0].message.content || "";

        // Parse bullet points manually if GPT didn't format perfectly as JSON array
        // Assuming GPT returns a list. We'll split by newline and regex.
        const summaryPoints = summaryText
            .split('\n')
            .map(line => line.replace(/^[-*•\d\.]+\s+/, '').trim())
            .filter(line => line.length > 5);

        return NextResponse.json({ summary: summaryPoints });

    } catch (error) {
        console.error("Summarization Error:", error);
        return NextResponse.json({ error: "Failed to summarize video" }, { status: 500 });
    }
}
