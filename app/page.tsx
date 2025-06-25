"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
    ChevronDown,
    ChevronUp,
    Brain,
    Zap,
    Users,
    BarChart,
    CheckCircle,
    Star,
    Linkedin,
    Twitter,
    Building,
    Mail,
    Phone,
} from "lucide-react";
import Image from "next/image";
import { submitContactForm } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import CookieModal from "@/components/cookie-banner";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"; // Renamed to avoid conflict
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

// CSS to prevent layout shift when the Select dropdown opens
const preventLayoutShift = `
  html {
    overflow-y: scroll;
    scrollbar-gutter: stable;
  }
`;

// Tech background pattern styles
const techBackgroundStyles = `
  .tech-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.1;
    background-image: 
      linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px),
      linear-gradient(0deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
  }
  
  .circuit-line {
    position: absolute;
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
    height: 2px;
    animation: pulse-current 3s ease-in-out infinite;
  }
  
  .circuit-line.horizontal {
    width: 120px;
  }
  
  .circuit-line.vertical {
    width: 2px;
    height: 80px;
    background: linear-gradient(0deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8));
  }
  
  .chip {
    position: absolute;
    width: 24px;
    height: 24px;
    background: rgba(59, 130, 246, 0.2);
    border: 2px solid rgba(59, 130, 246, 0.4);
    border-radius: 4px;
    animation: chip-glow 4s ease-in-out infinite;
  }
  
  .chip::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: rgba(147, 51, 234, 0.6);
    border-radius: 2px;
    animation: inner-pulse 2s ease-in-out infinite;
  }
  
  .node {
    position: absolute;
    width: 8px;
    height: 8px;
    background: rgba(59, 130, 246, 0.6);
    border-radius: 50%;
    animation: node-pulse 2.5s ease-in-out infinite;
  }
  
  .scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .scroll-indicator:hover {
    transform: translateX(-50%) scale(1.1);
  }
  
  .scroll-chevron {
    width: 2rem;
    height: 2rem;
    color: rgba(255, 255, 255, 0.8);
    animation: bounce-pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse-current {
    0%, 100% { opacity: 0.3; box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
    50% { opacity: 0.8; box-shadow: 0 0 15px rgba(59, 130, 246, 0.8), 0 0 25px rgba(147, 51, 234, 0.6); }
  }
  
  @keyframes chip-glow {
    0%, 100% { border-color: rgba(59, 130, 246, 0.4); box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
    50% { border-color: rgba(147, 51, 234, 0.6); box-shadow: 0 0 15px rgba(147, 51, 234, 0.5); }
  }
  
  @keyframes inner-pulse {
    0%, 100% { background: rgba(147, 51, 234, 0.6); transform: translate(-50%, -50%) scale(1); }
    50% { background: rgba(59, 130, 246, 0.8); transform: translate(-50%, -50%) scale(1.2); }
  }
  
  @keyframes node-pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.3); }
  }
  
  @keyframes bounce-pulse {
    0%, 100% { 
      transform: translateY(0);
      opacity: 0.6;
    }
    25% {
      opacity: 0.8;
    }
    50% { 
      transform: translateY(-8px);
      opacity: 1;
    }
    75% {
      opacity: 0.8;
    }
  }
`;

// Conditional analytics tracking
let trackingEnabled = false;
let trackFunction: typeof import("@vercel/analytics").track | null = null;

const initializeTracking = async () => {
    if (!trackingEnabled) {
        try {
            const { track: vercelTrackFn } = await import("@vercel/analytics");
            trackFunction = vercelTrackFn;
            trackingEnabled = true;
            console.log("Vercel Analytics custom event tracking initialized.");
            // Page view is handled by the <VercelAnalytics /> component when it mounts
        } catch (error) {
            console.error(
                "Failed to initialize Vercel Analytics custom tracking:",
                error
            );
        }
    }
};

const track = (eventName: string, properties?: Record<string, any>) => {
    if (trackingEnabled && trackFunction) {
        trackFunction(eventName, properties);
    } else {
        // Optional: log that event was not tracked due to consent
        // console.log(`Analytics not enabled. Event "${eventName}" not tracked.`);
    }
};

// Helper component for section titles
const SectionTitle = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12 font-montserrat px-4 text-responsive ${className}`}>
        {children}
    </h2>
);

// Section wrapper component to ensure consistent max-width
const SectionWrapper = ({
    children,
    className = "",
    id,
}: {
    children: React.ReactNode;
    className?: string;
    id?: string;
}) => (
    <section id={id} className={`w-full ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">{children}</div>
    </section>
);

const BenefitItem = ({
    icon,
    title,
    children,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col items-center text-center p-4 sm:p-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl mb-3 sm:mb-4 flex-shrink-0">
            {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 text-responsive">
            {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed text-responsive">
            {children}
        </p>
    </div>
);

// Workshop packages data
const workshopPackages = [
    {
        id: "ai-explorer",
        name: "AI Explorer",
        price: "€347",
        description: "Ideálne pre jednotlivcov a malé podniky",
    },
    {
        id: "ai-innovator",
        name: "AI Innovator",
        price: "€597",
        description: "Pre profesionálov a manažérov",
    },
    {
        id: "ai-visionary",
        name: "AI Visionary",
        price: "€1197",
        description: "Pre business lídrov a konzultantov",
    },
];

const faqItems = [
    {
        question: "Kto z našej spoločnosti by mal navštevovať tieto workshopy?",
        answer: "Naše workshopy sú navrhnuté pre širokú škálu profesionálov, od vedúcich pracovníkov hľadajúcich strategické poznatky o AI až po technické tímy potrebujúce praktické zručnosti a marketingové/predajné tímy, ktoré chcú využívať AI nástroje. Prispôsobujeme obsah na základe rolí a cieľov vašich účastníkov.",
    },
    {
        question: "Ponúkate školenia priamo v našich kanceláriách?",
        answer: "Áno, ponúkame školenia priamo vo vašej spoločnosti pre intenzívnejší zážitok, ako aj interaktívne online workshopy pre distribuované tímy.",
    },
    {
        question: "Aké predchádzajúce znalosti AI sú potrebné?",
        answer: "Pre mnohé z našich základných workshopov nie sú potrebné žiadne predchádzajúce znalosti AI. Prispôsobujeme zložitosť a hĺbku aktuálnemu porozumeniu vášho tímu, zabezpečujúc, že obsah je dostupný, ale zároveň náročný.",
    },
    {
        question: "Ako prispôsobujete workshopy pre naše konkrétne odvetvie?",
        answer: "Vykonávame dôkladnú analýzu potrieb na pochopenie vášho odvetvia, obchodných výziev a konkrétnych cieľov. Následne začleníme relevantné prípadové štúdie, datasety (ak sú poskytnuté a vhodné) a use cases do obsahu workshopu.",
    },
    {
        question: "Aké sú typické náklady na firemný workshop?",
        answer: "Ceny sú prispôsobené na základe rozsahu workshopu, trvania, počtu účastníkov a úrovne prispôsobenia. Kontaktujte nás pre podrobnú konzultáciu a cenový návrh prispôsobený vašim potrebám.",
    },
];

const workshopTypes = [
    {
        title: "AI Stratégia pre Vedenie",
        description:
            "Pochopte strategické dôsledky AI a identifikujte high-impact use cases pre váš biznis.",
        icon: <Brain size={20} className="mx-auto text-white" />,
    },
    {
        title: "Praktické AI pre Technické Tímy",
        description:
            "Hands-on školenie kľúčových AI nástrojov a platforiem na budovanie a nasadenie AI riešení.",
        icon: <Zap size={20} className="mx-auto  text-white" />,
    },
    {
        title: "AI-Powered Marketing & Predaj",
        description:
            "Naučte sa využívať AI pre lepšie poznatky o zákazníkoch, personalizované kampane a automatizáciu predaja.",
        icon: <BarChart size={20} className="mx-auto  text-white" />,
    },
    {
        title: "Vlastný AI Projekt Workshop",
        description:
            "Spolupracujte s našimi expertmi na spustení konkrétneho AI projektu vo vašej organizácii.",
        icon: <CheckCircle size={20} className="mx-auto  text-white" />,
    },
];

// Hero Section Component
const HeroSection = () => {
    const handleCTAClick = () => {
        track("Hero CTA Clicked", {
            section: "hero",
            ctaText: "Požiadajte o Vlastný Workshop Plán",
        });

        const element = document.getElementById("cta");
        if (element) {
            const elementTop = element.offsetTop - 80;
            window.scrollTo({ top: elementTop, behavior: "smooth" });
        }
    };

    const handleScrollClick = () => {
        track("Scroll Indicator Clicked", {
            section: "hero",
        });

        const element = document.getElementById("problem");
        if (element) {
            const elementTop = element.offsetTop - 80;
            window.scrollTo({ top: elementTop, behavior: "smooth" });
        }
    };

    return (
        <div className="bg-[#2A2F5B] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-[#2A2F5B] to-[#2A2F5B] text-white py-16 sm:py-20 md:py-32 min-h-screen flex items-center overflow-hidden w-full relative">
            {/* Tech Background Pattern */}
            <div className="tech-background"></div>

            {/* Circuit Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Top section circuit */}
                <div
                    className="circuit-line horizontal"
                    style={{
                        top: "15%",
                        left: "10%",
                        animationDelay: "0s",
                    }}></div>
                <div
                    className="circuit-line vertical"
                    style={{
                        top: "12%",
                        left: "25%",
                        animationDelay: "1s",
                    }}></div>
                <div
                    className="chip"
                    style={{
                        top: "14%",
                        left: "22%",
                        animationDelay: "0.5s",
                    }}></div>
                <div
                    className="node"
                    style={{
                        top: "16%",
                        left: "32%",
                        animationDelay: "1.5s",
                    }}></div>

                {/* Right section circuit */}
                <div
                    className="circuit-line horizontal"
                    style={{
                        top: "40%",
                        right: "8%",
                        animationDelay: "2s",
                    }}></div>
                <div
                    className="circuit-line vertical"
                    style={{
                        top: "35%",
                        right: "15%",
                        animationDelay: "0.8s",
                    }}></div>
                <div
                    className="chip"
                    style={{
                        top: "38%",
                        right: "12%",
                        animationDelay: "1.2s",
                    }}></div>
                <div
                    className="node"
                    style={{
                        top: "42%",
                        right: "20%",
                        animationDelay: "2.5s",
                    }}></div>

                {/* Bottom left circuit */}
                <div
                    className="circuit-line horizontal"
                    style={{
                        bottom: "20%",
                        left: "5%",
                        animationDelay: "1.8s",
                    }}></div>
                <div
                    className="circuit-line vertical"
                    style={{
                        bottom: "15%",
                        left: "18%",
                        animationDelay: "0.3s",
                    }}></div>
                <div
                    className="chip"
                    style={{
                        bottom: "18%",
                        left: "15%",
                        animationDelay: "2.2s",
                    }}></div>
                <div
                    className="node"
                    style={{
                        bottom: "22%",
                        left: "28%",
                        animationDelay: "0.7s",
                    }}></div>

                {/* Additional scattered elements */}
                <div
                    className="node"
                    style={{
                        top: "25%",
                        left: "70%",
                        animationDelay: "3s",
                    }}></div>
                <div
                    className="node"
                    style={{
                        top: "60%",
                        left: "15%",
                        animationDelay: "1.3s",
                    }}></div>
                <div
                    className="node"
                    style={{
                        top: "70%",
                        right: "25%",
                        animationDelay: "2.8s",
                    }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center pt-16 sm:pt-20 w-full relative z-10">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight font-montserrat text-responsive">
                    Pripravte sa na budúcnosť:
                    <br />
                    Naučte sa používať umelú inteligenciu
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 mb-6 sm:mb-8 md:mb-10 max-w-4xl mx-auto px-2 text-responsive">
                    Naše AI workshopy sú navrhnuté tak, aby vybavili váš tím
                    zručnosťami a znalosťami potrebnými na implementáciu AI
                    riešení, ktoré poháňajú efektivitu a inovácie.
                </p>
                <button
                    onClick={handleCTAClick}
                    className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 md:px-10 rounded-2xl sm:rounded-3xl text-sm sm:text-base md:text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg text-responsive">
                    Požiadajte o bezplatnú konzultáciu
                </button>
            </div>

            {/* Scroll Indicator */}
            <div className="scroll-indicator" onClick={handleScrollClick}>
                <ChevronDown className="scroll-chevron" />
            </div>
        </div>
    );
};

// Problem/Opportunity Section
const ProblemOpportunitySection = () => (
    <SectionWrapper id="problem" className="py-12 sm:py-16 md:py-24 bg-white">
        <SectionTitle>Je Vaša Spoločnosť Pripravená na AI Zmenu?</SectionTitle>
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
                <Image
                    src="/people-working.jpg"
                    alt="Skupina profesionálov pracuje na laptopoch a učí sa o umelej inteligencii v modernom kancelárskom prostredí"
                    className="rounded-2xl sm:rounded-3xl shadow-xl w-full h-auto"
                    width={600}
                    height={400}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                    priority={false}
                    quality={85}
                />
            </div>
            <div className="text-gray-700 order-1 lg:order-2">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800 text-responsive">
                    Nenechajte Zastarané Zručnosti Brzdiť Váš Rast.
                </h3>
                <p className="mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base text-responsive">
                    V dnešnom rýchlo sa meniacom technologickom prostredí,
                    neprispôsobenie sa AI nie je len zmeškaná príležitosť – je
                    to riziko pre vašu konkurenčnú výhodu. Mnohé spoločnosti
                    čelia podobným výzvam:
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <li className="flex items-start">
                        <CheckCircle
                            className="text-purple-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                            size={16}
                        />
                        <span className="text-sm sm:text-base text-responsive">
                            Sú vaše tímy neisté, ako efektívne využívať AI
                            nástroje pre hmatateľné obchodné výsledky?
                        </span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle
                            className="text-purple-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                            size={16}
                        />
                        <span className="text-sm sm:text-base text-responsive">
                            Obávate sa zaostávania za konkurenciou, ktorá už
                            implementuje AI stratégie?
                        </span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle
                            className="text-purple-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                            size={16}
                        />
                        <span className="text-sm sm:text-base text-responsive">
                            Plytvanie zdrojmi na AI iniciatívy, ktoré
                            neprinášajú jasné ROI alebo sa nezhodujú s
                            obchodnými cieľmi?
                        </span>
                    </li>
                    <li className="flex items-start">
                        <CheckCircle
                            className="text-purple-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                            size={16}
                        />
                        <span className="text-sm sm:text-base text-responsive">
                            Bojujete s preklenutím medzery medzi AI potenciálom
                            a praktickou implementáciou?
                        </span>
                    </li>
                </ul>
                <p className="leading-relaxed font-medium text-sm sm:text-base text-responsive">
                    Dobré správy? Tieto výzvy sú riešiteľné so správnym školením
                    a strategickým prístupom.
                </p>
            </div>
        </div>
    </SectionWrapper>
);

// AI Statistics Section
const AIStatisticsSection = () => (
    <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50">
        <SectionWrapper id="statistics" className="py-12 sm:py-16 md:py-24">
            <SectionTitle>AI Už Transformuje Svetové Spoločnosti</SectionTitle>
            <p className="text-center text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed text-sm sm:text-base px-4 text-responsive">
                Najúspešnejšie spoločnosti na svete už využívajú AI na
                dosiahnutie konkurenčnej výhody. Pozrite si fakty, ktoré hovoria
                za všetko:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-blue-100 text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                        <Building size={32} />
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
                        80%
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 text-responsive">
                        Fortune 500 Spoločností
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-responsive">
                        už integrovali ChatGPT do svojich pracovných procesov
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-purple-100 text-center">
                    <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-4 rounded-2xl mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                        <Zap size={32} />
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
                        70%
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 text-responsive">
                        Vyššia Produktivita
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-responsive">
                        dosiahli používatelia Microsoft 365 Copilot
                    </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-blue-100 text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                        <BarChart size={32} />
                    </div>
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">
                        59%
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 text-responsive">
                        Viac Dokumentov
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-responsive">
                        dokážu spracovať používatelia ChatGPT za 8-hodinový
                        pracovný deň (MIT štúdia)
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mt-12 text-center px-4">
                <p className="text-lg sm:text-xl text-gray-700 font-semibold max-w-4xl mx-auto text-responsive">
                    Zatiaľ čo vaša konkurencia získava náskok, vy môžete byť
                    ešte rýchlejší.
                    <span className="text-purple-600"> Začnite dnes.</span>
                </p>
            </div>
        </SectionWrapper>
    </div>
);

// Solution Section
const SolutionSection = () => (
    <div className="w-full bg-gray-50">
        <SectionWrapper id="solution" className="py-12 sm:py-16 md:py-24">
            <SectionTitle>
                Naše AI Workshopy: Praktické, Výsledkovo-Orientované Školenie
            </SectionTitle>
            <p className="text-center text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed text-sm sm:text-base px-4 text-responsive">
                Naše hands-on AI workshopy sú navrhnuté tak, aby vybavili vašich
                zamestnancov – od vedúcich pracovníkov až po technické tímy –
                znalosťami a zručnosťami na implementáciu AI riešení, ktoré
                poháňajú hmatateľný obchodný rast. Zameriavame sa na praktickú
                aplikáciu, nie len teóriu.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                <BenefitItem
                    icon={<Zap size={24} />}
                    title="Konkurenčná Výhoda">
                    Zostaňte vpred využívaním najmodernejšej AI pre významnú
                    konkurenčnú výhodu vo vašom odvetví.
                </BenefitItem>
                <BenefitItem
                    icon={<CheckCircle size={24} />}
                    title="Praktické Zručnosti">
                    Zabezpečte rozvoj praktických zručností, umožňujúc vášmu
                    tímu okamžite aplikovať AI na reálne úlohy a projekty.
                </BenefitItem>
                <BenefitItem
                    icon={<Brain size={24} />}
                    title="Prispôsobený Obsah">
                    Získajte školenie priamo relevantné pre vaše odvetvie a
                    konkrétne obchodné výzvy, maximalizúc ROI.
                </BenefitItem>
                <BenefitItem
                    icon={<Users size={24} />}
                    title="Expertní Inštruktori">
                    Učte sa od skúsených AI praktikov, ktorí prekladajú
                    komplexné koncepty do realizovateľných obchodných stratégií.
                </BenefitItem>
            </div>
            <div className="mt-8 sm:mt-12 text-center px-4">
                <p className="text-lg sm:text-xl text-gray-700 font-semibold max-w-4xl mx-auto text-responsive">
                    Na rozdiel od generických online kurzov, naše workshopy sú
                    interaktívne, plne prispôsobené vašim obchodným potrebám a
                    zameriavajú sa na praktickú implementáciu zabezpečujúcu
                    okamžitú hodnotu.
                </p>
            </div>
        </SectionWrapper>
    </div>
);

// How It Works Section
const HowItWorksSection = () => (
    <SectionWrapper className="py-12 sm:py-16 md:py-24 bg-white">
        <SectionTitle>Čo Očakávať od Našich AI Workshopov</SectionTitle>
        <p className="text-center text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed text-sm sm:text-base px-4 text-responsive">
            Ponúkame škálu AI workshopov prispôsobených rôznym potrebám vo vašej
            organizácii. Naším cieľom je poskytnúť jasnú cestu k AI enablementu,
            od stratégie po realizáciu.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {workshopTypes.map((workshop, index) => (
                <div
                    key={index}
                    className="bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-3 rounded-full w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        {workshop.icon}
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 text-center text-responsive">
                        {workshop.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm text-center leading-relaxed text-responsive">
                        {workshop.description}
                    </p>
                </div>
            ))}
        </div>

        <div className="mt-12 sm:mt-16">
            <h3 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-6 sm:mb-10 font-montserrat px-4 text-responsive">
                Náš Jednoduchý Proces Spolupráce
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
                {[
                    {
                        stage: "1. Konzultácia",
                        detail: "Úvodná diskusia a analýza potrieb na pochopenie vašich cieľov.",
                    },
                    {
                        stage: "2. Vlastný Dizajn",
                        detail: "Prispôsobené kurikulum workshopu a materiály pre váš tím.",
                    },
                    {
                        stage: "3. Interaktívne Dodanie",
                        detail: "Pútavé workshopy dodané online alebo na mieste expertmi.",
                    },
                    {
                        stage: "4. Podpora & Follow-up",
                        detail: "Post-workshop zdroje, Q&A a voliteľná pokračujúca podpora.",
                    },
                ].map((item, index) => (
                    <div
                        key={index}
                        className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl shadow-md border border-purple-100">
                        <div className="text-purple-500 font-bold text-2xl sm:text-3xl lg:text-4xl mb-2">
                            {index + 1}
                        </div>
                        <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-1 text-responsive">
                            {item.stage}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 text-responsive">
                            {item.detail}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </SectionWrapper>
);

// Pricing Section
const PricingSection = ({
    onPackageSelect,
}: {
    onPackageSelect: (packageId: string) => void;
}) => {
    const handlePackageSelect = (packageId: string) => {
        const selectedPackage = workshopPackages.find(
            (pkg) => pkg.id === packageId
        );

        track("Package Selected", {
            packageId,
            packageName: selectedPackage?.name,
            packagePrice: selectedPackage?.price,
            section: "pricing",
        });

        onPackageSelect(packageId);
        // Scroll to contact form
        const element = document.getElementById("cta");
        if (element) {
            const elementTop = element.offsetTop - 80;
            window.scrollTo({ top: elementTop, behavior: "smooth" });
        }
    };

    return (
        <div className="w-full bg-gradient-to-br from-gray-50 to-blue-50">
            <SectionWrapper id="pricing" className="py-12 sm:py-16 md:py-24">
                <SectionTitle>
                    {"AI môže nahradiť až "}
                    <span className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 px-1 sm:px-2 py-1 rounded-lg font-extrabold whitespace-nowrap">
                        300 000 000
                    </span>{" "}
                    {"pracovných miest."}
                    <div className="mt-2 sm:mt-4 pb-4">
                        {"Váš tím by nemal byť jedným z nich."}
                    </div>
                </SectionTitle>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mt-2">
                    {/* AI Explorer */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 relative h-fit">
                        <div className="text-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 font-montserrat text-responsive">
                                AI Explorer
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 text-responsive">
                                Ideálne pre jednotlivcov a malé podniky
                            </p>
                            <div className="mb-3 sm:mb-4">
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                                    €347
                                </span>
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm text-responsive">
                                Základné pochopenie AI aplikácií v biznise
                            </p>
                        </div>

                        <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-blue-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Celodenný Interaktívny Workshop
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-blue-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Digitálna Pracovná Kniha & Štandardné Zdroje
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-blue-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Live Skupinové Q&A Sekcie
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-blue-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Prístup do Súkromného Online Fóra (30 dní)
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-blue-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Pochopenie AI Krajiny a Príležitostí
                                </span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handlePackageSelect("ai-explorer")}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition duration-300 text-xs sm:text-sm">
                            Vybrať AI Explorer
                        </button>
                    </div>

                    {/* AI Innovator - Most Popular */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border-2 border-purple-300 p-4 sm:p-6 lg:p-8 relative transform lg:scale-105 h-fit">
                        <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 sm:px-4 lg:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                                NAJPOPULÁRNEJŠÍ
                            </span>
                        </div>

                        <div className="text-center mb-4 sm:mb-6 mt-3 sm:mt-4">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 font-montserrat text-responsive">
                                AI Innovator
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 text-responsive">
                                Pre profesionálov a manažérov
                            </p>
                            <div className="mb-3 sm:mb-4">
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600">
                                    €597
                                </span>
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm text-responsive">
                                Najlepší pomer ceny a hodnoty
                            </p>
                        </div>

                        <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-purple-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm font-medium text-responsive">
                                    Všetky "AI Explorer" funkcie PLUS:
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-purple-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Rozšírený Digitálny Toolkit
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-purple-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Celoživotný Prístup k Nahrávkam Workshopu
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-purple-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Detailné Analýzy Prípadových Štúdií
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-purple-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Interaktívne Problem-Solving Breakouts
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-purple-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Certifikát o Absolvovaní
                                </span>
                            </li>
                            <li className="flex items-start">
                                <Star
                                    className="text-yellow-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm font-medium text-responsive">
                                    BONUS: Live Skupinový Coaching Call (60 min)
                                </span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handlePackageSelect("ai-innovator")}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition duration-300 text-xs sm:text-sm">
                            Vybrať AI Innovator
                        </button>
                    </div>

                    {/* AI Visionary */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 relative h-fit">
                        <div className="text-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 font-montserrat text-responsive">
                                AI Visionary
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 text-responsive">
                                Pre business lídrov a konzultantov
                            </p>
                            <div className="mb-3 sm:mb-4">
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                                    €1197
                                </span>
                            </div>
                            <p className="text-gray-600 text-xs sm:text-sm text-responsive">
                                Komplexný a personalizovaný prístup
                            </p>
                        </div>

                        <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-blue-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm font-medium text-responsive">
                                    Všetky "AI Innovator" funkcie PLUS:
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-blue-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    1-na-1 Personalizovaná AI Stratégia Sesia
                                    (60 min)
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-blue-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Premium Knižnica Zdrojov
                                </span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle
                                    className="text-blue-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                    Prioritná Email Podpora (3 mesiace)
                                </span>
                            </li>
                            <li className="flex items-start">
                                <Star
                                    className="text-yellow-500 mr-2 sm:mr-3 mt-1 flex-shrink-0"
                                    size={14}
                                />
                                <span className="text-gray-700 text-xs sm:text-sm font-medium text-responsive">
                                    EXKLUZÍVNY BONUS: Malá Mastermind Skupina (2
                                    hodiny)
                                </span>
                            </li>
                        </ul>

                        <button
                            onClick={() => handlePackageSelect("ai-visionary")}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition duration-300 text-xs sm:text-sm">
                            Vybrať AI Visionary
                        </button>
                    </div>
                </div>

                <div className="mt-8 sm:mt-12 text-center px-4">
                    <p className="text-gray-600 text-xs sm:text-sm text-responsive">
                        Máte otázky o balíkoch?{" "}
                        <a
                            href="#cta"
                            onClick={(e) => {
                                e.preventDefault();
                                track("Pricing Contact Link Clicked");
                                const element = document.getElementById("cta");
                                if (element) {
                                    const elementTop = element.offsetTop - 80;
                                    window.scrollTo({
                                        top: elementTop,
                                        behavior: "smooth",
                                    });
                                }
                            }}
                            className="text-purple-600 hover:text-purple-700 font-medium">
                            Kontaktujte nás
                        </a>{" "}
                        pre bezplatnú konzultáciu.
                    </p>
                </div>
            </SectionWrapper>
        </div>
    );
};

// Lecturer Section
const LecturerSection = () => (
    <div className="w-full bg-gradient-to-br from-gray-50 to-purple-50">
        <SectionWrapper id="lecturer" className="py-12 sm:py-16 md:py-24">
            <SectionTitle>Spoznajte Vášho AI Experta</SectionTitle>
            <div className="max-w-5xl mx-auto">
                <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-purple-100">
                    <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
                        <div className="lg:col-span-1 text-center">
                            <Image
                                src="/placeholder.svg?height=200&width=200"
                                alt="Marek Matušica - AI Workshop Expert"
                                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl sm:rounded-3xl mx-auto mb-3 sm:mb-4 border-4 border-purple-200 object-cover shadow-lg"
                                width={192}
                                height={192}
                            />
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 font-montserrat text-responsive">
                                Ing. Marek Matušica
                            </h3>
                            <p className="text-purple-600 font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-responsive">
                                AI nadšenec a vývojár
                            </p>
                            <div className="flex justify-center space-x-3 sm:space-x-4">
                                <a
                                    href="#"
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        track("Social Link Clicked", {
                                            platform: "LinkedIn",
                                            section: "lecturer",
                                        });
                                    }}>
                                    <Linkedin size={20} />
                                </a>
                                {/* <a
                                    href="#"
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        track("Social Link Clicked", {
                                            platform: "Twitter",
                                            section: "lecturer",
                                        });
                                    }}>
                                    <Twitter size={20} />
                                </a> */}
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="mb-4 sm:mb-6">
                                <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-responsive">
                                    <Brain
                                        className="text-purple-500 mr-2"
                                        size={20}
                                    />
                                    Skúsenosti & Pozadie
                                </h4>
                                <p className="text-gray-600 leading-relaxed text-sm sm:text-base text-responsive">
                                    Bol som pri transformácii elv.ai, kde AI
                                    využili na moderovanie diskusií na
                                    sociálnych sieťach. Vývíjal som riešenia pre
                                    Raiffeisen, ktoré poháňa chatbotov v bankách
                                    po celej Európe. Pracoval som na projekte
                                    pre Tatra Banku, ktorá používa AI na analýzu
                                    a spracovanie nových nápadov.
                                </p>
                            </div>

                            <div className="mb-4 sm:mb-6">
                                <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-responsive">
                                    <Zap
                                        className="text-purple-500 mr-2"
                                        size={20}
                                    />
                                    Kľúčová Expertíza
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                                    {[
                                        "Tvorba AI riešení",
                                        "Návrh automatizácií",
                                        "Úspešné príbehy",
                                        "Technické vzdelanie",
                                        "AI stratégia",
                                    ].map((skill, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center">
                                            <CheckCircle
                                                className="text-purple-500 mr-2 flex-shrink-0"
                                                size={14}
                                            />
                                            <span className="text-gray-700 text-xs sm:text-sm text-responsive">
                                                {skill}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-purple-100">
                                <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 mb-2 flex items-center text-responsive">
                                    <Star
                                        className="text-purple-500 mr-2"
                                        size={16}
                                    />
                                    Filozofia
                                </h4>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed italic text-responsive">
                                    "Vďaka AI sú dnes inovácie a automatizácie
                                    dostupnejšie ako kedykoľvek predtým."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    </div>
);

// FAQ Item Component
const FAQItem = ({ q, a }: { q: string; a: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            track("FAQ Opened", {
                question: q,
                section: "faq",
            });
        }
    };

    return (
        <div className="border-b border-purple-200 py-4 sm:py-6">
            <button
                onClick={handleToggle}
                className="flex justify-between items-center w-full text-left text-gray-700 hover:text-blue-600 focus:outline-none">
                <span className="text-sm sm:text-base lg:text-lg font-medium pr-4 text-responsive">
                    {q}
                </span>
                {isOpen ? (
                    <ChevronUp
                        size={20}
                        className="text-purple-500 flex-shrink-0"
                    />
                ) : (
                    <ChevronDown size={20} className="flex-shrink-0" />
                )}
            </button>
            {isOpen && (
                <p className="mt-2 sm:mt-3 text-gray-600 leading-relaxed text-sm sm:text-base text-responsive">
                    {a}
                </p>
            )}
        </div>
    );
};

// FAQ Section
const FAQSection = () => (
    <SectionWrapper id="faq" className="py-12 sm:py-16 md:py-24 bg-white">
        <SectionTitle>Často Kladené Otázky</SectionTitle>
        <div className="max-w-4xl mx-auto">
            {faqItems.map((item, index) => (
                <FAQItem key={index} q={item.question} a={item.answer} />
            ))}
        </div>
    </SectionWrapper>
);

// CTA Section
const CTASection = ({ selectedPackage }: { selectedPackage: string }) => {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        message: "",
        subject: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { toast } = useToast();
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Update form data when selectedPackage changes
    useEffect(() => {
        if (selectedPackage) {
            const packageName =
                workshopPackages.find((pkg) => pkg.id === selectedPackage)
                    ?.name || selectedPackage;
            setFormData((prev) => ({ ...prev, subject: packageName }));
        }
    }, [selectedPackage]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, subject: e.target.value });
        track("Form Subject Changed", {
            subject: e.target.value,
            section: "contact_form",
        });
    };

    const handleTermsChange = (checked: boolean) => {
        setAgreedToTerms(checked);
        track("Terms Agreement Changed", {
            agreed: checked,
            section: "contact_form",
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        track("Form Submission Started", {
            name: formData.name,
            company: formData.company,
            subject: formData.subject,
            hasMessage: !!formData.message,
            messageLength: formData.message?.length || 0,
        });

        try {
            const message = formData.subject
                ? `Predmet: ${formData.subject}\n\n${formData.message || "Žiadna dodatočná správa"}`
                : formData.message;

            await submitContactForm({
                name: formData.name,
                email: formData.email,
                company: formData.company,
                message: message,
            });

            setIsSubmitted(true);
            setFormData({
                name: "",
                company: "",
                email: "",
                message: "",
                subject: "",
            });
            setAgreedToTerms(false);

            track("Form Submission Success", {
                company: formData.company,
                subject: formData.subject,
            });

            toast({
                title: "Úspech!",
                description:
                    "Vaša žiadosť bola odoslaná. Čoskoro sa vám ozveme.",
            });
        } catch (error) {
            track("Form Submission Error", {
                error: error instanceof Error ? error.message : "Unknown error",
                company: formData.company,
            });

            toast({
                title: "Niečo sa pokazilo",
                description:
                    "Skúste to prosím neskôr alebo nás kontaktujte priamo.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full bg-[#2A2F5B] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-500/20 via-[#2A2F5B] to-[#2A2F5B] text-white">
            <SectionWrapper id="cta" className="py-12 sm:py-16 md:py-24">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 font-montserrat text-responsive text-center">
                    Pripravení na transformáciu?
                </h2>
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-blue-100 mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto px-4 text-responsive text-center">
                    Poďme zistiť, ako môžeme spoločne posunúť váš biznis vpred.
                    Vyplňte formulár a čoskoro sa vám ozveme, aby sme
                    prediskutovali vaše potreby a možnosti spolupráce.
                </p>

                {isSubmitted ? (
                    <div className="bg-white text-green-600 p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl max-w-md mx-auto text-center border border-purple-100">
                        <CheckCircle
                            size={40}
                            className="mx-auto mb-3 sm:mb-4 text-green-500"
                        />
                        <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-responsive">
                            Ďakujeme!
                        </h3>
                        <p className="text-gray-700 text-sm sm:text-base text-responsive">
                            Vaša žiadosť bola odoslaná. Čoskoro sa vám ozveme.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white text-gray-800 p-4 sm:p-6 md:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl mx-auto border border-purple-100">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-center font-montserrat text-responsive">
                            Pripravte váš biznis na budúcnosť
                        </h3>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 sm:space-y-6">
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1">
                                    Predmet
                                </label>
                                <Input
                                    type="text"
                                    name="subject"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={handleSubjectChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                    placeholder="napr. AI Explorer Workshop, Konzultácia, Iné"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1">
                                    Celé Meno
                                </label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                    placeholder="napr. Ján Novák"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="company"
                                    className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1">
                                    Názov Spoločnosti
                                </label>
                                <Input
                                    type="text"
                                    name="company"
                                    id="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                    placeholder="napr. Acme Corp"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1">
                                    Pracovný Email
                                </label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                    placeholder="napr. jan.novak@example.com"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-xs sm:text-sm font-medium text-gray-700 text-left mb-1">
                                    Stručne opíšte vaše potreby (voliteľné)
                                </label>
                                <Textarea
                                    name="message"
                                    id="message"
                                    rows={3}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base resize-none"
                                    placeholder="napr. Záujem o AI pre marketingový tím."
                                />
                            </div>
                            <div className="flex items-start space-x-3">
                                <Checkbox
                                    id="terms"
                                    checked={agreedToTerms}
                                    onCheckedChange={handleTermsChange}
                                    className="mt-1"
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-xs sm:text-sm text-gray-700 leading-relaxed cursor-pointer">
                                    Prečítal som si a súhlasím s{" "}
                                    <Link
                                        href="/terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                        onClick={() =>
                                            track("Terms Link Clicked", {
                                                section: "contact_form",
                                            })
                                        }>
                                        Podmienkami služby
                                    </Link>{" "}
                                    a{" "}
                                    <Link
                                        href="/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                        onClick={() =>
                                            track(
                                                "Privacy Policy Link Clicked",
                                                { section: "contact_form" }
                                            )
                                        }>
                                        Zásadami ochrany súkromia
                                    </Link>
                                    .
                                </label>
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !agreedToTerms}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50">
                                {isSubmitting
                                    ? "Odosielam..."
                                    : "Požiadajte o bezplatnú konzultáciu"}
                            </Button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4 sm:mt-6 text-center px-2 text-responsive">
                            Vaša úvodná konzultácia je bezplatná, bez záväzkov.
                            Rešpektujeme vaše súkromie a nikdy nebudeme zdieľať
                            vaše informácie.
                        </p>
                    </div>
                )}
            </SectionWrapper>
        </div>
    );
};

// Footer Component
const Footer = () => (
    <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div>
                    <h5 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 text-responsive">
                        AI Workshop Experti
                    </h5>
                    <p className="text-xs sm:text-sm leading-relaxed text-responsive">
                        Posilňujeme podniky prostredníctvom transformačného AI
                        vzdelávania a praktického rozvoja zručností.
                    </p>
                </div>
                <div>
                    <h5 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 text-responsive">
                        Rýchle Odkazy
                    </h5>
                    <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <li>
                            <a
                                href="#cta"
                                onClick={(e) => {
                                    e.preventDefault();
                                    track("Footer Link Clicked", {
                                        link: "Požiadajte o Konzultáciu",
                                    });
                                    const element =
                                        document.getElementById("cta");
                                    const scrollArea = document.querySelector(
                                        "[data-radix-scroll-area-viewport]"
                                    );
                                    if (element && scrollArea) {
                                        const elementTop =
                                            element.offsetTop - 80;
                                        scrollArea.scrollTo({
                                            top: elementTop,
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                                className="hover:text-purple-400 transition-colors text-responsive">
                                Požiadajte o Konzultáciu
                            </a>
                        </li>
                        <li>
                            <a
                                href="#problem"
                                onClick={(e) => {
                                    e.preventDefault();
                                    track("Footer Link Clicked", {
                                        link: "Prečo AI Workshopy?",
                                    });
                                    const element =
                                        document.getElementById("problem");
                                    const scrollArea = document.querySelector(
                                        "[data-radix-scroll-area-viewport]"
                                    );
                                    if (element && scrollArea) {
                                        const elementTop =
                                            element.offsetTop - 80;
                                        scrollArea.scrollTo({
                                            top: elementTop,
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                                className="hover:text-purple-400 transition-colors text-responsive">
                                Prečo AI Workshopy?
                            </a>
                        </li>
                        <li>
                            <a
                                href="#solution"
                                onClick={(e) => {
                                    e.preventDefault();
                                    track("Footer Link Clicked", {
                                        link: "Náš Prístup",
                                    });
                                    const element =
                                        document.getElementById("solution");
                                    const scrollArea = document.querySelector(
                                        "[data-radix-scroll-area-viewport]"
                                    );
                                    if (element && scrollArea) {
                                        const elementTop =
                                            element.offsetTop - 80;
                                        scrollArea.scrollTo({
                                            top: elementTop,
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                                className="hover:text-purple-400 transition-colors text-responsive">
                                Náš Prístup
                            </a>
                        </li>
                        <li>
                            <a
                                href="#faq"
                                onClick={(e) => {
                                    e.preventDefault();
                                    track("Footer Link Clicked", {
                                        link: "FAQ",
                                    });
                                    const element =
                                        document.getElementById("faq");
                                    const scrollArea = document.querySelector(
                                        "[data-radix-scroll-area-viewport]"
                                    );
                                    if (element && scrollArea) {
                                        const elementTop =
                                            element.offsetTop - 80;
                                        scrollArea.scrollTo({
                                            top: elementTop,
                                            behavior: "smooth",
                                        });
                                    }
                                }}
                                className="hover:text-purple-400 transition-colors text-responsive">
                                FAQ
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 text-responsive">
                        Kontaktujte Nás
                    </h5>
                    <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                        <li className="flex items-center">
                            <Mail size={14} className="mr-2 flex-shrink-0" />
                            <span className="text-responsive">
                                info@aiworkshopexperts.com
                            </span>
                        </li>
                        <li className="flex items-center">
                            <Phone size={14} className="mr-2 flex-shrink-0" />
                            <span className="text-responsive">
                                +421 123 456 789
                            </span>
                        </li>
                        <li className="flex items-center">
                            <Building
                                size={14}
                                className="mr-2 flex-shrink-0"
                            />
                            <span className="text-responsive">
                                Bratislava, Slovensko
                            </span>
                        </li>
                    </ul>
                    <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4">
                        <a
                            href="#"
                            aria-label="LinkedIn"
                            className="text-gray-400 hover:text-purple-400 transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                track("Social Link Clicked", {
                                    platform: "LinkedIn",
                                    section: "footer",
                                });
                            }}>
                            <Linkedin size={18} />
                        </a>
                        <a
                            href="#"
                            aria-label="Twitter"
                            className="text-gray-400 hover:text-purple-400 transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                track("Social Link Clicked", {
                                    platform: "Twitter",
                                    section: "footer",
                                });
                            }}>
                            <Twitter size={18} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
                <p className="text-responsive">
                    &copy; {new Date().getFullYear()} AI Workshop Experti.
                    Všetky práva vyhradené.
                </p>
                <p className="mt-1 text-responsive">
                    <a
                        href="/privacy"
                        className="hover:text-purple-400 transition-colors"
                        onClick={() =>
                            track("Footer Link Clicked", {
                                link: "Zásady Ochrany Súkromia",
                            })
                        }>
                        Zásady Ochrany Súkromia
                    </a>{" "}
                    |{" "}
                    <a
                        href="/terms"
                        className="hover:text-purple-400 transition-colors"
                        onClick={() =>
                            track("Footer Link Clicked", {
                                link: "Podmienky Služby",
                            })
                        }>
                        Podmienky Služby
                    </a>
                </p>
            </div>
        </div>
    </footer>
);

// Main App Component
export default function Home() {
    const [selectedPackage, setSelectedPackage] = useState("");
    const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

    const handlePackageSelect = (packageId: string) => {
        setSelectedPackage(packageId);
    };

    useEffect(() => {
        const cookieConsent = localStorage.getItem("cookieConsent");
        if (cookieConsent === "accepted") {
            setAnalyticsAllowed(true);
            initializeTracking();
        }
    }, []);

    const handleCookieAccept = () => {
        setAnalyticsAllowed(true);
        initializeTracking();
    };

    return (
        <div className="font-sans antialiased text-gray-900 overflow-x-hidden">
            <Navbar />
            <HeroSection />
            <ProblemOpportunitySection />
            <SolutionSection />
            <AIStatisticsSection />
            <HowItWorksSection />
            <LecturerSection />
            <PricingSection onPackageSelect={handlePackageSelect} />
            <FAQSection />
            <CTASection selectedPackage={selectedPackage} />
            <Footer />
            <CookieModal onAccept={handleCookieAccept} />
            {analyticsAllowed && <VercelAnalytics />}
        </div>
    );
}
