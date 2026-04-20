"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import axios from "axios"
import {
    Link, Outlet, useLocation, useNavigate
} from "react-router-dom"
import {
    ChevronRight, ShoppingCart, GraduationCap, Package,
    Truck, Pill, HelpCircleIcon, Carrot, Baby, Home,
    Scissors, Snowflake, Milk, Fish, Coffee, Cookie,
    Tags, HelpCircle, Loader2, LogInIcon, XCircle, ChefHat
} from 'lucide-react'

import { useTranslation } from "react-i18next"
import {
    SidebarProvider,
    SidebarInset
} from "@/components/ui/sidebar"

export default function HelpLayout() {
    const { t } = useTranslation("global")
    const location = useLocation()
    const navigate = useNavigate()
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com'

    // --- STATE ---
    const [searchTerm, setSearchTerm] = React.useState('')
    const [categories, setCategories] = React.useState<any[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = React.useState(true)

    const isVendor = location.pathname.startsWith('/vendor');
    const basePath = isVendor ? '/vendor/dashboard/help' : '/dashboard/help';

    const handleClear = () => setSearchTerm('')

    // --- BANNER LOGIC ---
    const getBannerForPage = () => {
        const titleStyle = "text-2xl md:text-4xl font-black tracking-tight drop-shadow-sm"
        // Updated paths to match /dashboard/help structure
        switch (location.pathname) {
            case `${basePath}/our-story`: return <h1 className={titleStyle}>{t("Hmenu.story")}</h1>;
            case `${basePath}/career`: return <h1 className={titleStyle}>{t("Hmenu.Career")}</h1>;
            case `${basePath}/contact`: return <h1 className={titleStyle}>{t("Hmenu.ContactUs")}</h1>;
            case `${basePath}/privacy-policy`: return <h1 className={titleStyle}>{t("Hmenu.PrivacyPolicy")}</h1>;
            case `${basePath}/terms`: return <h1 className={titleStyle}>{t("Hmenu.TermsofUse")}</h1>;
            case `${basePath}/profile/settings`: return <h1 className={titleStyle}>Profile Settings</h1>;
            case `${basePath}/faq`: return <h1 className={titleStyle}>Frequently Asked FAQ</h1>;
            case `${basePath}/ticket`: return <h1 className={titleStyle}>Support Ticket</h1>;
            case `${basePath}/hotline`: return <h1 className={titleStyle}>Hotline Support</h1>;
            case `${basePath}/ai`: return <h1 className={titleStyle}>AI Support Agent</h1>;
            default: return <h1 className={titleStyle}>{t("Hmenu.WelcometoHelp")}</h1>;
        }
    }

    // --- HELPER: Active Tab Styling ---
    const getTabClass = (path: string) => {
        const isActive = location.pathname === path;
        return cn(
            "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors",
            isActive
                ? "border-secondary text-secondary"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
        );
    }

    return (
        <SidebarProvider>
            <SidebarInset>
                <main className="min-h-screen bg-white">
                    {/* Header Section: Using Secondary Green */}
                    <section className="bg-secondary py-16 md:py-20 transition-all">
                        <div className="text-center text-white px-4">
                            <div className="mb-6">{getBannerForPage()}</div>

                            <div className="relative max-w-md mx-auto">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Type keywords to find an answer..."
                                    className="w-full px-6 py-3 rounded-full border-none text-gray-800 shadow-lg focus:ring-4 focus:ring-white/20 outline-none"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={handleClear}
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-secondary"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                )}
                            </div>

                            {/* Suggested Student Panel Questions */}
                            <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-2xl mx-auto">
                                <button onClick={() => setSearchTerm('How to earn money?')} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm transition-colors shadow-sm">
                                    How to earn money?
                                </button>
                                <button onClick={() => setSearchTerm('Referral income')} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm transition-colors shadow-sm">
                                    Referral income
                                </button>
                                <button onClick={() => setSearchTerm('Wallet withdraw')} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm transition-colors shadow-sm">
                                    Wallet withdraw
                                </button>
                                <button onClick={() => setSearchTerm('Course enroll')} className="bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm transition-colors shadow-sm">
                                    Course enroll
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Navigation Tabs - Responsive with scrolling */}
                    <div className="sticky top-0 bg-white z-20 border-b border-gray-200 shadow-sm">
                        <div className="max-w-7xl mx-auto">
                            <nav className="-mb-px flex space-x-6 md:space-x-12 justify-start md:justify-center overflow-x-auto px-6 py-2 no-scrollbar" aria-label="Tabs">
                                <Link to={basePath} className={getTabClass(basePath)}>
                                    Help Center
                                </Link>
                                <Link to={`${basePath}/our-story`} className={getTabClass(`${basePath}/our-story`)}>
                                    {t("Hmenu.story")}
                                </Link>
                                <Link to={`${basePath}/career`} className={getTabClass(`${basePath}/career`)}>
                                    {t("Hmenu.Career")}
                                </Link>
                                <Link to={`${basePath}/contact`} className={getTabClass(`${basePath}/contact`)}>
                                    {t("Hmenu.ContactUs")}
                                </Link>
                                <Link to={`${basePath}/privacy-policy`} className={getTabClass(`${basePath}/privacy-policy`)}>
                                    {t("Hmenu.PrivacyPolicy")}
                                </Link>
                                <Link to={`${basePath}/terms`} className={getTabClass(`${basePath}/terms`)}>
                                    {t("Hmenu.TermsofUse")}
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area: This is where sub-routes like FAQ or ProfileSettings render */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <Outlet />
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}