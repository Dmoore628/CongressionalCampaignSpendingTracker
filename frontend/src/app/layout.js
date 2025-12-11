import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const metadata = {
    title: "Grassroots Tracker",
    description: "Track non-corporate spending in the 2026 election cycle.",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased`}>
            <body className="font-sans min-h-screen flex flex-col items-center justify-start py-6 px-4 sm:px-6 md:py-12 md:px-8 selection:bg-grassroots-200 selection:text-grassroots-900 relative bg-surface-50 text-surface-900 overflow-x-hidden">

                {/* --- Ambient Background: Modern & Subtle --- */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
                    {/* Primary Glow */}
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-grassroots-400/20 rounded-full blur-[100px] opacity-60 animate-pulse-subtle" />
                    {/* Secondary Warm Glow */}
                    <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-corporate-300/15 rounded-full blur-[120px] opacity-50 animate-pulse-subtle" style={{ animationDelay: '2s' }} />
                    {/* Bottom Grounding Glow */}
                    <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[600px] bg-surface-200/40 rounded-full blur-[100px] opacity-30" />
                </div>

                <main className="w-full max-w-xl mx-auto z-10 animate-slide-up">
                    <div className="w-full">
                        {children}
                    </div>

                    <footer className="mt-12 text-center pb-8">
                        <p className="text-[10px] tracking-widest text-surface-400 font-bold uppercase opacity-80">
                            Grassroots <span className="text-grassroots-500">•</span> Tracker
                        </p>
                    </footer>
                </main>
            </body>
        </html>
    );
}
