"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Heart, ShieldCheck, ArrowRight, Bot, User } from "lucide-react";

type Message = {
    role: "user" | "assistant";
    content: string;
    paymentAmount?: number;
};

interface SmartDonationAgentProps {
    onInitiatePayment: (amount: number, isRecurring: boolean) => void;
}

export function SmartDonationAgent({ onInitiatePayment }: SmartDonationAgentProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! I'm the DigiSwasthya support agent. How much impact would you like to make today? I can help you process a donation or answer any questions about where your money goes.",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (text: string, amountOverride?: number) => {
        if (!text.trim()) return;

        const newMessages: Message[] = [...messages, { role: "user", content: text }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages, amount: amountOverride }),
            });

            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = "";
            let parsedAmount: number | undefined = amountOverride;

            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                assistantMessage += chunk;
                
                try {
                    const parsed = JSON.parse(assistantMessage);
                    if (parsed.content) assistantMessage = parsed.content;
                    if (parsed.amount) parsedAmount = parsed.amount;
                } catch(e) {
                    // Ignore JSON parse errors for stream chunks
                }

                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { 
                        role: "assistant", 
                        content: assistantMessage,
                        paymentAmount: parsedAmount
                    };
                    return updated;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "I'm sorry, I encountered an error. Please try again." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        { label: "₹500", desc: "Medicines", amount: 500, message: "I want to donate ₹500 to provide medicines." },
        { label: "₹1000", desc: "Health Checkups", amount: 1000, message: "I want to donate ₹1000 for health checkups." },
        { label: "₹5000", desc: "Sponsor a Camp", amount: 5000, message: "I want to donate ₹5000 to sponsor a health camp." },
    ];

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 max-w-2xl mx-auto my-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                        <Sparkles className="w-6 h-6 text-yellow-300" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold font-serif">Smart Donation Agent</h2>
                        <p className="text-sm text-primary-100 opacity-90">Ask me anything about your impact</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
                    <ShieldCheck className="w-4 h-4 text-green-300" />
                    <span>Secure & Transparent</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="h-[400px] overflow-y-auto p-6 bg-gray-50 flex flex-col gap-4">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-gray-200 text-gray-600" : "bg-primary-100 text-primary-600"}`}>
                                {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`rounded-2xl px-4 py-3 text-sm ${
                                msg.role === "user" 
                                ? "bg-gray-800 text-white rounded-tr-sm" 
                                : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm leading-relaxed"
                            }`}>
                                {msg.content}
                                
                                {/* Render payment button if agent included a payment amount */}
                                {msg.role === "assistant" && msg.paymentAmount && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => onInitiatePayment(msg.paymentAmount!, false)}
                                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                                        >
                                            Proceed to Donate ₹{msg.paymentAmount} <ArrowRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%]">
                             <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary-100 text-primary-600">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions & Input */}
            <div className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
                    {quickActions.map((action) => (
                        <button
                            key={action.label}
                            onClick={() => handleSendMessage(action.message, action.amount)}
                            disabled={isLoading}
                            className="flex-shrink-0 bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-100 rounded-full px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                            <Heart size={12} className="fill-primary-600 text-primary-600" />
                            {action.label} - {action.desc}
                        </button>
                    ))}
                </div>
                
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
                    className="flex items-center gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask where your money goes..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-all"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
