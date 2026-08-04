import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
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

// Local fallback matcher for localhost when no API key is in local .env
function getLocalSmartAnswer(userMessage: string) {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("center") || msg.includes("clinic") || msg.includes("location") || msg.includes("telemedicine")) {
        return {
            content: "DigiSwasthya operates rural Telemedicine Centres across India providing consultations, diagnostic assistance, and affordable medicine access. 🏥",
            suggestedLink: { title: "Explore Telemedicine Network", url: "/network" }
        };
    }
    if (msg.includes("donate") || msg.includes("support") || msg.includes("help") || msg.includes("money") || msg.includes("fund")) {
        return {
            content: "Thank you for wanting to make a difference! Your contribution directly funds rural healthcare camps, telemedicine consultations, and patient care. 💖",
            suggestedLink: { title: "Support DigiSwasthya", url: "/donate" }
        };
    }
    if (msg.includes("doctor") || msg.includes("team") || msg.includes("founder") || msg.includes("sandeep")) {
        return {
            content: "DigiSwasthya was founded by Sandeep Kumar to bridge the healthcare gap in rural India. Our team includes dedicated doctors and advisors committed to affordable care. 🩺",
            suggestedLink: { title: "Meet Our Team", url: "/our-team" }
        };
    }
    if (msg.includes("impact") || msg.includes("patient") || msg.includes("count") || msg.includes("stats")) {
        return {
            content: "DigiSwasthya has served over 42,950+ patients and conducted 58,894+ teleconsultations across 84 districts and 633 villages! 📊",
            suggestedLink: { title: "View Impact Dashboard", url: "/our-impact" }
        };
    }
    
    return {
        content: "Welcome to DigiSwasthya! How can I assist you today with our telemedicine services, health camps, or donation programs? 🏥",
        suggestedLink: { title: "About DigiSwasthya", url: "/about-us" }
    };
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, amount } = body;

        // Quick-action preset amounts
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

        // Check for any available AI API key (Vercel or local .env)
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
        
        // If running on localhost without a local API key, use local smart knowledge base fallback
        if (!apiKey) {
            const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
            const fallback = getLocalSmartAnswer(lastUserMsg);
            return NextResponse.json(fallback);
        }

        const openai = new OpenAI({
            baseURL: process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined,
            apiKey: apiKey,
        });

        const response = await openai.chat.completions.create({
            model: process.env.OPENROUTER_API_KEY ? "openai/gpt-4o-mini" : "gpt-4o-mini",
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
        let reply = "I'm happy to help you with any questions about DigiSwasthya!";
        let suggestedLink = null;

        if (replyContent) {
            try {
                const parsed = JSON.parse(replyContent);
                reply = parsed.text || replyContent;
                suggestedLink = parsed.suggestedLink || null;
            } catch (e) {
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
