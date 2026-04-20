'use client'

import * as React from "react"
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom"
import logo from '../../../public/image/logo/logo.jpg'
import axios from "axios"

import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Separator } from "@/components/ui/separator"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarInset,
    SidebarTrigger,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import Footer from "@/pages/common/Footer/Footer"
import Header from "@/pages/common/Header/Header"

import Cart from "@/pages/Home/Cart/Cart"
import LiveChat from "@/pages/Home/LiveChat/Livechat"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { getNavData } from "@/data/navData"
import useModalStore from '@/store/modalStore';
import {
    Settings, HelpCircle, UserCircle,
    Carrot,
    ChefHat,
    ChevronDown,
    ChevronRight,
    Coffee,
    Cookie,
    Download,
    Fish,
    Sparkles,
    Home,
    Landmark,
    Loader2,
    Menu,
    Milk,
    Package,
    Pill,
    PlusCircle,
    Scissors,
    Search,
    Send,
    LogOut,
    ShoppingCart,
    Snowflake,
    Tags,
    RotateCw,
    Wallet,
    Camera as CameraIcon
} from 'lucide-react';
import NotificationBell from "@/components/ui/NotificationBell"
import { useAppStore } from "@/store/useAppStore"


// 1. Helper to get Token
const getAuthToken = () => {
    const session = sessionStorage.getItem("student_session");
    if (!session) return null;
    try {
        const parsedSession = JSON.parse(session);
        if (new Date().getTime() > parsedSession.expiry) {
            sessionStorage.removeItem("student_session");
            return null;
        }
        return parsedSession.token;
    } catch (e) {
        return null;
    }
};


export default function UserLayout() {
    const { walletUpdateTrigger } = useModalStore();
    const [activeCategory, setActiveCategory] = React.useState("shopping");
    const [isMobileWalletOpen, setIsMobileWalletOpen] = React.useState(false)
    const { t, i18n } = useTranslation("global")
    const navigate = useNavigate();
    const location = useLocation();

    const {
        categories, fetchCategories, studentProfile, fetchNavbarData, fetchProfile, fetchOrders,
        walletBalance, isCategoryLoading, isWalletLoading
    } = useAppStore();

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    // --- CATEGORY API STATE ---

    const [isRefreshing, setIsRefreshing] = React.useState(false); // New state for refresh animation

    const handleManualRefresh = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([
                fetchNavbarData(true)
            ]);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Avatar Logic (Sync with Header/Sidebar)
    const cacheBreaker = React.useMemo(() => Date.now(), [studentProfile]);
    const avatarUrl = React.useMemo(() => {
        const serverImageUrl = studentProfile?.image
            ? (studentProfile.image.startsWith('http') ? studentProfile.image : `${baseURL}/uploads/student/image/${studentProfile.image}?t=${cacheBreaker}`)
            : null;
        return serverImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile?.name || 'Student')}&background=FF8A00&color=fff&bold=true`;
    }, [studentProfile, baseURL, cacheBreaker]);


    // 2. Fetch on mount and when walletUpdateTrigger changes
    React.useEffect(() => {
        const loadInitialData = async () => {
            console.log("🚀 UserLayout: Initializing Student Panel Data...");
            await Promise.all([
                fetchCategories(),
                fetchProfile(),
                fetchNavbarData(),
                fetchOrders()
            ]);
        };

        loadInitialData();

        const interval = setInterval(() => {
            fetchNavbarData(true);
        }, 12000);

        return () => clearInterval(interval);
    }, [fetchCategories, fetchNavbarData, fetchProfile, fetchOrders, walletUpdateTrigger]);


    // 2. Define the handleLogout function







    // --- LANGUAGE HANDLER ---
    const handleChangeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    // --- SEARCH FUNCTIONALITY STATE ---
    const [searchText, setSearchText] = React.useState('');
    const [suggestions, setSuggestions] = React.useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [isSearching, setIsSearching] = React.useState(false);
    const [isMobileProfileOpen, setIsMobileProfileOpen] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const mobileSearchRef = React.useRef<HTMLDivElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const handleLogout = () => {
        // Clear the specific session key used by your app
        sessionStorage.removeItem("student_session");

        // Optional: Clear other storage if you use it for carts or settings
        // localStorage.clear(); 

        // Redirect to login
        navigate("/login");

        // Force a page refresh to clear all React states
        window.location.reload();
    };
    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    React.useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchText.trim().length > 0) {
                setIsSearching(true);
                try {
                    const token = getAuthToken();
                    const config = { headers: { ...(token && { Authorization: `Bearer ${token}` }) } };

                    const response = await axios.get(`${baseURL}/api/products/search?keyword=${searchText}`, config);
                    const results = response.data?.data || response.data?.products || [];
                    setSuggestions(results);
                } catch (error) {
                    console.error("Search API Error:", error);
                    setSuggestions([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchText, baseURL]);

    const handleSearch = () => {
        if (searchText) {
            setShowSuggestions(false);
            navigate(`/dashboard?q=${encodeURIComponent(searchText)}`);
        }
    };

    const getProductTitle = (product: any) => {
        if (i18n.language === 'bn' && product.product_title_bangla) {
            return product.product_title_bangla;
        }
        return product.product_title_english || product.name || 'Unknown Product';
    };

    const handleSelectSuggestion = (productTitle: string) => {
        setSearchText(productTitle);
        setShowSuggestions(false);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Image selected for search:", file);
        }
    };

    const data = React.useMemo(() => getNavData(t), [t]);

    return (
        <SidebarProvider className=''>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <div className="flex items-center justify-center py-6 border-b h-[82px]">
                        {/* Increased h-17 to h-24 to provide more room for a bigger logo */}
                        <Link to="/dashboard">
                            <img
                                src={logo}
                                alt="logo"
                                className="h-14 w-auto object-contain transition-transform duration-300 hover:scale-95"
                            /* Increased h-12 to h-16. Added a subtle hover scale for a premium feel. */
                            />
                        </Link>
                    </div>
                </SidebarHeader>

                <div className="px-2 py-2 border-b">
                    <div className="flex flex-row justify-between gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent p-1">
                        {data.categories.map((category) => (
                            <Link
                                key={category.id}
                                to={category.path}
                                onClick={() => setActiveCategory(category.id)}
                                className={`h-16 min-w-20 p-2 flex flex-col items-center justify-center rounded transition-colors ${activeCategory === category.id
                                    ? "bg-primary-default border border-primary-default text-white"
                                    : "border border-primary-default text-gray-700 hover:bg-gray-50"
                                    }`}
                                aria-label={category.name}
                            >
                                <category.icon className="h-4 w-4 mb-1" />
                                <span className="text-[12px] leading-tight text-center">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu className="px-1 md:px-3 py-4 flex flex-col gap-1">
                            {isCategoryLoading ? (
                                /* --- LOADING SKELETONS --- */
                                Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="flex items-center gap-3 w-full h-[48px] px-2 rounded-lg">
                                        <Skeleton className="h-[22px] w-[22px] rounded-md bg-[#5ca367]/10" />
                                        <Skeleton className="h-4 w-2/3 rounded-md bg-slate-200" />
                                    </div>
                                ))
                            ) : categories.length > 0 ? (
                                /* --- CATEGORY LIST --- */
                                categories.map((category) => {
                                    const categoryName = i18n.language === 'bn' ? category.name_bn : category.name_en;
                                    const categoryPath = `/dashboard/category/${category.id}`;
                                    const isActive = location.pathname === categoryPath;

                                    return (
                                        <SidebarMenuItem key={category.id} className="list-none relative group mx-0">
                                            {/* INDICATOR LINE */}
                                            <div className={cn(
                                                "absolute left-[-12px] top-[30%] h-[40%] w-1 rounded-r-full bg-[#5ca367] transition-all duration-300 z-20",
                                                isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100"
                                            )} />

                                            <SidebarMenuButton
                                                asChild
                                                className={cn(
                                                    "group relative w-full h-[48px] px-2 rounded-lg transition-all duration-300 ease-out border-none bg-transparent shadow-none",
                                                    "hover:bg-gradient-to-r hover:from-[#5ca367]/20 hover:to-transparent",
                                                    "hover:border-[#5ca367]/10 hover:shadow-lg hover:shadow-[#5ca367]/10",
                                                    isActive ? "translate-x-1" : "hover:translate-x-1"
                                                )}
                                            >
                                                <Link to={categoryPath} className="flex items-center justify-between w-full">
                                                    {/* LEFT CONTENT: Icon + Text */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1 transition-all duration-300 flex items-center justify-center bg-transparent">
                                                            <img
                                                                src={category.icon}
                                                                alt={categoryName}
                                                                className={cn(
                                                                    "h-[17px] w-[17px] object-contain transition-transform duration-300",
                                                                    isActive ? "scale-110" : "group-hover:scale-110"
                                                                )}
                                                                onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/22?text=C'}
                                                            />
                                                        </div>
                                                        <span className={cn(
                                                            "text-[14px] font-medium tracking-tight transition-colors duration-300",
                                                            isActive ? "text-[#5ca367] font-bold" : "text-slate-600 group-hover:text-slate-900"
                                                        )}>
                                                            {categoryName}
                                                        </span>
                                                    </div>

                                                    {/* RIGHT CONTENT: Arrow */}
                                                    <div className={cn(
                                                        "flex items-center justify-center transition-all duration-500 ease-in-out",
                                                        isActive ? "opacity-100 translate-x-0" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5"
                                                    )}>
                                                        <div className={cn(
                                                            "flex items-center justify-center p-1.5 rounded-full transition-all duration-300",
                                                            isActive ? "bg-[#5ca367]/20" : "group-hover:bg-slate-100"
                                                        )}>
                                                            <ChevronRight
                                                                className={cn(
                                                                    "h-4 w-4 transition-transform duration-300",
                                                                    isActive ? "text-[#5ca367] scale-110" : "text-slate-400"
                                                                )}
                                                                strokeWidth={3}
                                                            />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })
                            ) : (
                                /* --- EMPTY STATE --- */
                                <div className="p-10 text-center text-sm font-medium text-slate-400 italic">
                                    {isCategoryLoading ? "Loading..." : "No categories found"}
                                </div>
                            )}
                        </SidebarMenu>    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="relative w-full px-2" ref={containerRef}>
                                        {/* --- Floating Menu (Glassmorphism) --- */}
                                        <div className={`
                absolute bottom-[calc(100%+12px)] left-2 right-2 flex flex-col gap-1 p-2 
                bg-white/90 backdrop-blur-md rounded-[24px] border border-secondary/20 shadow-2xl 
                transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-bottom z-50
                ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'}
            `}>
                                            <div className="px-3 py-1 mb-1">
                                                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Account Hub</span>
                                            </div>

                                            <Link to="/dashboard/order" className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-all group/item">
                                                <div className="p-2 rounded-lg bg-emerald-50/50 group-hover/item:bg-white shadow-sm"><Package size={18} /></div>
                                                <span className="text-[13px] font-bold">Order History</span>
                                            </Link>

                                            <Link to="/dashboard/profile/settings" className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/10 text-slate-600 hover:text-secondary transition-all group/item">
                                                <div className="p-2 rounded-lg bg-secondary/5 group-hover/item:bg-white shadow-sm"><UserCircle size={18} /></div>
                                                <span className="text-[13px] font-bold">Manage Profile</span>
                                            </Link>

                                            <Link to="/dashboard/help" className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-all group/item">
                                                <div className="p-2 rounded-lg bg-emerald-50/50 group-hover/item:bg-white shadow-sm"><HelpCircle size={18} /></div>
                                                <span className="text-[13px] font-bold">Support Center</span>
                                            </Link>

                                            <div className="h-[1px] bg-slate-100 my-1 mx-2" />

                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center justify-between w-full p-3 rounded-xl bg-slate-100 hover:bg-red-500 text-slate-500 hover:text-white transition-all duration-300 group/logout shadow-sm border border-transparent hover:border-red-200"
                                            >
                                                <span className="text-[11px] font-black uppercase tracking-widest pl-1">
                                                    Sign Out
                                                </span>
                                                <LogOut
                                                    size={16}
                                                    className="group-hover/logout:translate-x-1 transition-transform"
                                                />
                                            </button>
                                        </div>

                                        {/* --- Main Sidebar Button --- */}
                                        <SidebarMenuButton
                                            size="lg"
                                            asChild
                                            className={`
                    h-auto min-h-[72px] w-full p-2 pr-4 flex items-center justify-between rounded-[22px] border-2 transition-all duration-300 cursor-pointer 
                    /* Using !important (!) to ensure background change is forced */
                    ${isOpen
                                                    ? '!bg-secondary !border-secondary shadow-lg shadow-secondary/20 !text-white'
                                                    : 'bg-white border-slate-100 hover:border-secondary/30 hover:bg-slate-50/50'
                                                }
                `}
                                        >
                                            <div onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full group">
                                                <div className="flex items-center gap-3 shrink-0">
                                                    {/* The Icon Box from your image */}
                                                    <div className={`
                            flex items-center justify-center h-12 w-12 rounded-[18px] transition-all duration-500
                            ${isOpen ? 'bg-white/20 text-white rotate-90' : 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white'}
                        `}>
                                                        {isOpen ? <Sparkles size={24} /> : <Settings size={24} />}
                                                    </div>

                                                    {/* Text Info */}
                                                    <div className="flex flex-col items-start justify-center">
                                                        <span className={`text-[14px] font-black uppercase tracking-tight leading-none whitespace-nowrap ${isOpen ? 'text-white' : 'text-slate-800'}`}>
                                                            {t("settings")}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 mt-2">
                                                            <div className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-white/60' : 'bg-secondary'} animate-pulse`} />
                                                            <span className={`text-[10px] font-bold uppercase tracking-[0.1em] whitespace-nowrap ${isOpen ? 'text-white/80' : 'text-slate-400'}`}>
                                                                Elite Member
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Chevron Indicator */}
                                                <div className={`transition-all duration-500 shrink-0 ${isOpen ? 'rotate-180 translate-x-1' : 'group-hover:translate-y-0.5'}`}>
                                                    <ChevronDown size={20} className={`${isOpen ? 'text-white' : 'text-slate-300'}`} />
                                                </div>
                                            </div>
                                        </SidebarMenuButton>
                                    </div>
                                </DropdownMenuTrigger>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
                <SidebarRail />
            </Sidebar>

            <SidebarInset>
                <Cart />
                <LiveChat />
                <header className="flex flex-col sticky top-0 z-40 border-b bg-white lg:hidden">

                    {/* --- ROW 1: Identity, Language, & Profile --- */}
                    {/* FIXED: Added z-[60] so the Profile dropdown stays on top of everything */}
                    <div className="flex h-14 items-center justify-between px-4 md:px-6 border-b border-slate-50 relative z-[60]">
                        <div className="flex items-center">
                            <SidebarTrigger className="text-gray-600">
                                <Menu className="h-5.5 w-5.5" />
                            </SidebarTrigger>

                            <Separator orientation="vertical" className="h-4 bg-slate-200 mx-2" />

                            <Link to="/dashboard" className="flex items-center">
                                <img
                                    src={logo}
                                    alt="logo"
                                    className="h-10 w-auto object-contain transition-opacity hover:opacity-80"
                                />
                            </Link>
                        </div>

                        {/* Right Side: Lang Toggle & Profile Image */}
                        <div className="flex items-center gap-3 pl-3 pr-1">

                            {/* Compact Language Toggle */}
                            <div className="flex items-center bg-gray-100/80 rounded-lg p-1 border border-slate-200">
                                <button
                                    onClick={() => handleChangeLanguage('en')}
                                    className={cn(
                                        "text-[10px] font-black px-2 py-1 rounded-md transition-all",
                                        i18n.language === 'en' ? "bg-white text-[#5ca367] shadow-sm" : "text-gray-400"
                                    )}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => handleChangeLanguage('bn')}
                                    className={cn(
                                        "text-[10px] font-black px-2 py-1 rounded-md transition-all",
                                        i18n.language === 'bn' ? "bg-white text-[#5ca367] shadow-sm" : "text-gray-400"
                                    )}
                                >
                                    BN
                                </button>
                            </div>

                            {/* Mobile Profile Menu (Icon Only) */}
                            <div className="relative shrink-0">
                                <button
                                    onClick={() => {
                                        setIsMobileProfileOpen(!isMobileProfileOpen);
                                        setIsMobileWalletOpen(false); // FIXED: Closes wallet if open
                                    }}
                                    className="flex items-center justify-center bg-slate-50 rounded-full border border-gray-200 hover:bg-slate-100 transition-all active:scale-95 h-10 w-10 shadow-sm overflow-hidden"
                                >
                                    <img
                                        src={avatarUrl}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile?.name || 'S')}&background=FF8A00&color=fff&bold=true`;
                                        }}
                                    />
                                </button>

                                {/* Mobile Profile Dropdown Options */}
                                {isMobileProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsMobileProfileOpen(false)}></div>

                                        <div className="absolute top-8 -right-3 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex flex-col">

                                                {/* Beautiful Dropdown Header (Shows Full Name) */}
                                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                                    <p className="text-[13px] font-bold text-slate-800 truncate">
                                                        {studentProfile?.name || "Student"}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                                        Golden Tier
                                                    </p>
                                                </div>


                                                {/* Premium Order History Item (Matching design reference) */}
                                                <div className="p-2">
                                                    <Link
                                                        to="/dashboard/order"
                                                        onClick={() => setIsMobileProfileOpen(false)}
                                                        className="flex items-center gap-4 p-3 rounded-[20px] bg-emerald-50/50 border border-emerald-100/50 hover:bg-emerald-100/60 transition-all group/order"
                                                    >
                                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm shadow-emerald-100/50 border border-emerald-50 group-hover/order:scale-105 transition-transform">
                                                            <Package className="h-5 w-5 text-emerald-600" />
                                                        </div>
                                                        <span className="text-[14px] font-bold text-emerald-700">
                                                            Order History
                                                        </span>
                                                    </Link>
                                                </div>

                                                <div className="px-2 pb-2">
                                                    <Link to="/dashboard/profile/settings" onClick={() => setIsMobileProfileOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-all">
                                                        <UserCircle size={18} className="text-slate-400" />
                                                        <span className="text-[13px] font-bold">Manage Profile</span>
                                                    </Link>
                                                    <Link to="/dashboard/help" onClick={() => setIsMobileProfileOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-all">
                                                        <HelpCircle size={18} className="text-slate-400" />
                                                        <span className="text-[13px] font-bold">Support Center</span>
                                                    </Link>
                                                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-red-50 text-red-500 transition-all mt-1">
                                                        <LogOut size={18} />
                                                        <span className="text-[13px] font-bold">Sign Out</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- ROW 2: Wallet (Full Width Prominence with Dropdown) --- */}
                    {/* FIXED: Restored Wallet Row and added z-[50] so it sits above the search bar */}
                    <div className="px-4 py-2 border-b border-slate-50 bg-slate-50/30 relative z-[50] flex items-center gap-3">

                        {/* 1. Mobile Wallet Wrapper (Flex-1 allows it to take up available space) */}
                        <div className="relative flex-1">
                            <button
                                onClick={() => {
                                    setIsMobileWalletOpen(!isMobileWalletOpen);
                                    setIsMobileProfileOpen(false); // FIXED: Closes profile if open
                                }}
                                className="w-full flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "flex items-center justify-center h-9 w-9 rounded-xl transition-all",
                                        isWalletLoading ? "bg-slate-100 animate-pulse" : "bg-[#5ca367] text-white shadow-md shadow-green-100"
                                    )}>
                                        {!isWalletLoading && <Wallet className="h-4.5 w-4.5" />}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">My Balance</span>
                                        {isWalletLoading ? (
                                            <div className="h-3 w-20 bg-slate-100 animate-pulse rounded-full mt-1" />
                                        ) : (
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[15px] font-black text-slate-900 leading-none">৳{walletBalance}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent opening dropdown
                                                        handleManualRefresh();
                                                    }}
                                                    className="p-1 hover:bg-slate-100 rounded-full transition-all"
                                                    title="Refresh Balance"
                                                >
                                                    <RotateCw className={cn("h-3 w-3 text-slate-400", isRefreshing && "animate-spin text-secondary")} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", isMobileWalletOpen && "rotate-180")} />
                            </button>

                            {/* Mobile Wallet Dropdown Options */}
                            {isMobileWalletOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsMobileWalletOpen(false)}></div>
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden origin-top animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-2 flex flex-col gap-1">
                                            <Link to="/dashboard/wallet/add" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-green-600 transition-colors">
                                                <PlusCircle className="h-5 w-5 text-green-500" />
                                                Add Money
                                            </Link>
                                            <Link to="/dashboard/wallet/send" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                                                <Send className="h-5 w-5 text-blue-500" />
                                                Send Money
                                            </Link>
                                            <Link to="/dashboard/wallet/receive" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-purple-600 transition-colors">
                                                <Download className="h-5 w-5 text-purple-500" />
                                                Receive Money
                                            </Link>
                                            <Link to="/dashboard/wallet/withdraw" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors">
                                                <Landmark className="h-5 w-5 text-orange-500" />
                                                Withdraw Money
                                            </Link>
                                            <Link to="/dashboard/wallet/purchase" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors">
                                                <Landmark className="h-5 w-5 text-orange-500" />
                                                Purchase History
                                            </Link>
                                            <Link to="/dashboard/wallet/all" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors">
                                                <Landmark className="h-5 w-5 text-orange-500" />
                                                All Transaction
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* 2. Mobile/Tablet Notification Bell */}
                        <div className="shrink-0 z-50">
                            {/* Pass your actual baseURL and token here */}
                            <NotificationBell token={getAuthToken()} />
                        </div>

                    </div>

                    {/* --- ROW 3: Utility Search --- */}
                    <div className="px-4 pb-3 pt-2" ref={mobileSearchRef}>
                        <div className="relative flex items-center w-full group">
                            <input
                                type="text"
                                value={searchText}
                                placeholder={t('header.search') || "Search products..."}
                                onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => searchText.trim() && setShowSuggestions(true)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full h-11 pl-4 pr-24 text-sm bg-gray-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#5ca367] focus:ring-4 focus:ring-[#5ca367]/5 transition-all shadow-inner"
                            />

                            <div className="absolute right-2 flex items-center gap-1 text-gray-400">
                                {isSearching && <Loader2 className="w-4 h-4 animate-spin" />}
                                <label htmlFor="mobileImageInput" className="p-2 hover:text-[#5ca367] cursor-pointer">
                                    <CameraIcon className="h-5 w-5" />
                                    <input type="file" id="mobileImageInput" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                                <div className="h-5 w-[1px] bg-slate-200 mx-0.5"></div>
                                <button className="p-2 hover:text-[#5ca367]" onClick={handleSearch}>
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Mobile Suggestions Dropdown (Floating) */}
                            {showSuggestions && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 overflow-hidden max-h-[50vh] overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-6 text-center text-slate-400 text-sm">Searching...</div>
                                    ) : suggestions.length > 0 ? (
                                        suggestions.map(p => (
                                            <Link
                                                key={p.id}
                                                to={`/dashboard?q=${encodeURIComponent(getProductTitle(p))}`}
                                                className="flex items-center p-4 hover:bg-slate-50 border-b border-slate-50 last:border-0 gap-4"
                                                onClick={() => handleSelectSuggestion(getProductTitle(p))}
                                            >
                                                <img src={p.product_image ? `${baseURL}/uploads/ecommarce/product_image/${p.product_image}` : '/placeholder.jpg'} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-slate-800 text-sm truncate">{getProductTitle(p)}</span>
                                                    <span className="text-xs font-black text-[#5ca367] mt-0.5">৳{p.offer_price}</span>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-slate-400 text-sm italic">No results matching "{searchText}"</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                <div className="hidden lg:block sticky top-0 z-40 bg-white">
                    <Header />
                </div>

                <main className="relative flex-1 w-full min-w-0 transition-all duration-200 ease-in-out peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] lg:peer-data-[variant=inset]:m-2 lg:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 lg:peer-data-[variant=inset]:ml-0 lg:peer-data-[variant=inset]:rounded-xl lg:peer-data-[variant=inset]:shadow flex flex-col min-h-screen bg-gray-50/30">
                    <Outlet />
                    <Footer />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}