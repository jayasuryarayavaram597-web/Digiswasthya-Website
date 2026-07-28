import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Optional: You can specify edge runtime for better performance with streaming
// export const runtime = 'edge'; 

// OpenAI client initialized dynamically inside POST function below

import { getWebsiteContext } from "@/data/botKnowledge";

const getSystemPrompt = () => `You are Swasthya, the official AI assistant for DigiSwasthya Foundation. You speak like a warm, friendly, and knowledgeable human receptionist of the NGO.

ANSWER STYLE RULES (follow these strictly):
1. Keep answers SHORT and CLEAR — 2 to 4 lines maximum for simple questions.
2. NEVER write a wall of text. If a topic has many details, give a brief summary first, then ask: "Would you like more details on any specific point?"
3. Use bullet points ONLY when listing items (max 5 items). If there are more, show 5 and say "and more..."
4. Use 1 emoji per message to make it feel warm and human — not robotic.
5. End answers with a soft follow-up question to keep the user engaged.
6. For donors specifically — be extra warm, appreciative, and motivating. Make them feel their donation truly matters.
7. ALWAYS output your response as a valid JSON object with the following structure:
   {
      "text": "Your short, warm answer here",
      "suggestedLink": { "title": "Button Text", "url": "/page-url" } 
   }
8. CRITICAL RULE: You MUST provide a "suggestedLink" for EVERY single response. Do not ever set it to null. Pick the MOST relevant page based on their question.
9. Allowed URLs (ONLY use these exact valid paths): /network (for Telemedicine Centres/Network), /our-team (for Team/Doctors/Advisors), /our-impact (for Impact & Statistics), /donate (for Donations & Support), /about-us (for About Us & Founder Story), /contact-us (for Contact Info), /health-tools (for Health Tools/BMI), /blogs (for Blogs/Articles). CRITICAL: For Telemedicine Centres, ALWAYS use /network (NEVER use /our-network).
10. Never give long paragraphs. Use short sentences.

RULES:
- Answer ONLY using the knowledge base provided below.
- NEVER say partner names, beneficiary stories, or team details are private or undisclosed. All partner organizations (e.g., Tata Memorial Hospital, Ratan Tata Trust, Homi Bhabha Cancer Hospital) and beneficiaries (e.g., Pinki Paware, Balu Katale, Manisha Kumari) in the knowledge base are public and MUST be shared proudly when asked.
- If a question is 100% unrelated to DigiSwasthya, healthcare, or NGOs, politely decline and redirect.
- Never say "I don't know" if the answer can be reasonably deduced from the knowledge base.

${getWebsiteContext()}`;


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, amount } = body;

        // If it's a preset amount quick-action, return a structured JSON response instantly.
        if (amount) {
            let impact = "support our health initiatives";
            if (amount === 500) impact = "provide essential medicines for a patient";
            if (amount === 1000) impact = "fund full health checkups for two children";
            if (amount === 2500) impact = "support a telemedicine clinic for a day";
            if (amount === 5000) impact = "sponsor a complete health camp for a rural village";

            return NextResponse.json({
                content: `That's wonderful! Your generous donation of ₹${amount} will directly ${impact}. Click the button below to proceed securely.`,
                amount: amount
            });
        }

        // Check for any available AI API key (OpenRouter, OpenAI, or Gemini)
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                content: "I am currently in demo mode because my AI brain (API key) hasn't been connected yet, but I'm ready to help you change the world once it is!",
                suggestedLink: { title: "Learn About Us", url: "/about-us" }
            });
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
        });

        // Otherwise, fetch response from AI
        const response = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini", // Using OpenRouter syntax for gpt-4o-mini
            messages: [
                { role: "system", content: getSystemPrompt() },
                ...messages.map((m: any) => ({ role: m.role, content: m.content }))
            ],
            stream: false,
            temperature: 0.7,
            max_tokens: 300,
            response_format: { type: "json_object" }
        });

        const replyContent = response.choices[0]?.message?.content;
        let reply = "I'm sorry, I couldn't generate a response.";
        let suggestedLink = null;

        if (replyContent) {
            try {
                const parsed = JSON.parse(replyContent);
                reply = parsed.text || replyContent;
                suggestedLink = parsed.suggestedLink || null;
            } catch (e) {
                // fallback if LLM didn't return valid JSON
                reply = replyContent;
            }
        }

        return NextResponse.json({
            content: reply,
            suggestedLink: suggestedLink
        });

    } catch (error) {
        console.error("Chat API error:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}
