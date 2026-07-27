import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import { AccessibilityToolbar } from "@/components/features/AccessibilityToolbar";
import { TranslationWidget } from "@/components/ai/TranslationWidget";
import ChatBot from "@/components/chat/ChatBot";
import "./globals.css";

import { LanguageProvider } from "@/context/LanguageContext";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "DigiSwasthya Foundation | Accessible Healthcare",
  description: "Making healthcare services affordable and accessible for rural communities across India by leveraging technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${lora.variable} font-sans`}>
        <LanguageProvider>
          {children}
          <AccessibilityToolbar />
          <TranslationWidget />
          <ChatBot />
        </LanguageProvider>
      </body>
    </html>
  );
}
