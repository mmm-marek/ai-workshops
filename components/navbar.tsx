"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    // Track scroll position to show/hide navbar background
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 60) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleContactClick = () => {
        track("Navbar Contact Clicked", {
            section: "navbar",
            scrolled: isScrolled,
        });

        const element = document.getElementById("cta");
        if (element) {
            const elementTop = element.offsetTop - 80;
            window.scrollTo({ top: elementTop, behavior: "smooth" });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 w-full ${
                isScrolled
                    ? "bg-[#2A2F5B]/95 backdrop-blur-sm shadow-md py-2 sm:py-3"
                    : "bg-transparent py-3 sm:py-5"
            }`}>
            <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center"
                        onClick={() =>
                            track("Logo Clicked", { section: "navbar" })
                        }>
                        <span className="text-white font-bold text-sm sm:text-base font-montserrat">
                            AI Workshop
                        </span>
                    </Link>

                    {/* CTA Button - responsive sizing */}
                    <button
                        onClick={handleContactClick}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-2xl sm:rounded-3xl text-xs sm:text-sm md:text-md transition duration-300 ease-in-out transform shadow-lg whitespace-nowrap">
                        Kontakt
                    </button>
                </div>
            </div>
        </header>
    );
}
