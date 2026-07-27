"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);
    const { t } = useLanguage();

    const navLinks = [
        { name: t("nav.home"), href: "/" },
        { name: t("nav.about"), href: "/about-us" },
        { name: t("nav.impact"), href: "/our-impact" },
        { name: t("nav.network"), href: "/network" },
        { name: t("nav.contact"), href: "/contact-us" },
        { name: t("nav.team"), href: "/our-team" },
    ];

    const resourcesLinks = [
        { name: t("nav.healthTools"), href: "/health-tools" },
        { name: t("nav.media"), href: "/media" },
        { name: t("nav.privacy"), href: "/privacy-policy" },
        { name: t("nav.terms"), href: "/terms-and-conditions" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-24 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-4 group ml-4 lg:ml-10">
                    <div className="relative h-20 w-20 shrink-0 transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/images/digiswasthya-logo-hero.png"
                            alt="DigiSwasthya Foundation Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex flex-col leading-none">
                        <div className="flex flex-wrap items-baseline gap-1.5">
                            <span className="text-xl md:text-2xl font-black text-primary-600 tracking-tighter">DigiSwasthya</span>
                            <span className="text-xl md:text-2xl font-black text-secondary-600 tracking-tighter">Foundation</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">{t("common.tagline")}</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-bold text-primary-950 transition-colors hover:text-primary-700"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Resources Dropdown */}
                    <div className="relative group">
                        <button
                            onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                            className="flex items-center gap-1 text-sm font-bold text-primary-950 hover:text-primary-700 focus:outline-none"
                        >
                            {t("nav.resources")} <ChevronDown className="h-4 w-4" />
                        </button>

                        {/* Dropdown Menu (Hover or Click) */}
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="py-2">
                                {resourcesLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Button asChild variant="primary" className="gap-2">
                        <Link href="/donate">
                            <Heart className="h-4 w-4 fill-current" /> {t("nav.donate")}
                        </Link>
                    </Button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t bg-white">
                    <div className="container py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-bold text-gray-900 hover:text-primary-700"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="border-t pt-2">
                            <div className="font-bold text-sm text-gray-900 mb-2">{t("nav.resources")}</div>
                            {resourcesLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-2 text-sm text-gray-700 hover:text-primary-600 pl-4"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <Button asChild variant="primary" className="w-full gap-2">
                            <Link href="/donate" onClick={() => setIsOpen(false)}>
                                <Heart className="h-4 w-4 fill-current" /> {t("nav.donate")}
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
}
