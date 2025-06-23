"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface CookieModalProps {
    onAccept: () => void;
}

export default function CookieModal({ onAccept }: CookieModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const cookieConsent = localStorage.getItem("cookieConsent");
        if (!cookieConsent) {
            // Show modal after a short delay
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 500); // Reduced from 1000ms to 500ms
            return () => clearTimeout(timer);
        } else if (cookieConsent === "accepted") {
            // If previously accepted, enable analytics immediately
            onAccept();
        }
    }, [onAccept]);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setIsOpen(false);
        onAccept();
        console.log("Cookies accepted - analytics enabled");
    };

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined");
        setIsOpen(false);
        console.log("Cookies declined - no tracking will be initialized");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <DialogContent className="sm:max-w-md mx-4" hideCloseButton={true}>
                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Cookie className="text-blue-600" size={24} />
                        </div>
                    </div>
                    <DialogTitle className="text-xl font-bold text-gray-800">
                        Súhlas so Zberom Údajov
                    </DialogTitle>
                </DialogHeader>

                <div className="text-sm text-gray-600 leading-relaxed space-y-4">
                    <div>
                        Pre zlepšenie našich služieb a pochopenie toho, ako
                        používate našu webovú stránku, zbierame anonymné
                        analytické údaje pomocou Vercel Analytics. Tieto údaje
                        nám pomáhajú optimalizovať obsah a používateľskú
                        skúsenosť.
                    </div>

                    <div>
                        <div className="font-semibold mb-2">Zbierame:</div>
                        <ul className="list-disc list-inside space-y-1 text-left">
                            <li>Informácie o návštevách stránok</li>
                            <li>Kliknutia na tlačidlá a odkazy</li>
                            <li>Formulárové interakcie</li>
                            <li>Technické údaje o prehliadači</li>
                        </ul>
                    </div>

                    <div>
                        Všetky údaje sú anonymné a neobsahujú osobné informácie.
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button
                        onClick={handleDecline}
                        variant="outline"
                        className="flex-1 text-gray-700 border-gray-300 hover:bg-gray-50">
                        Odmietnuť
                    </Button>
                    <Button
                        onClick={handleAccept}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        Súhlasím a Pokračovať
                    </Button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                    Svoje rozhodnutie môžete kedykoľvek zmeniť vymazaním cookies
                    v prehliadači.
                </p>
            </DialogContent>
        </Dialog>
    );
}
