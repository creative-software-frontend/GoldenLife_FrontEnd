'use client'

import * as React from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import logo from '../../../public/image/logo/logo.jpg' // Adjust path if needed
import useModalStore from "@/store/modalStore";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import Header from "@/pages/common/Header/Header"
import NotificationBell from "@/components/ui/NotificationBell"
import {
    Settings, Sparkles, UserCircle, ChevronDown, PlusCircle, Send, Download, Landmark, RotateCw, Wallet,
    Camera as CameraIcon, Search, Menu, LogOut, Package, User, LogIn as LogInIcon, Bell, Loader2,
    ChevronRight, ShoppingBag, ShoppingCart, GraduationCap, Truck,
    ChefHat, Code, Palette, Briefcase, Camera,
    Globe, Calculator, Heart, Microscope, Leaf, DollarSign, Zap, Users, Book, Lightbulb, Grid, Home
} from 'lucide-react';
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader,
    SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
    SidebarProvider, SidebarRail, SidebarTrigger
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Footer from "@/pages/common/Footer/Footer"
import { useTranslation } from "react-i18next"
import Cart from "@/pages/Home/Cart/Cart"
import LiveChat from "@/pages/Home/LiveChat/Livechat"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function CourseLayout() {
    const [activeCategory, setActiveCategory] = React.useState("courses")
    const [isMobileOpen, setIsMobileOpen] = React.useState(false) // State for Mobile Drawer
    const { openLoginModal, changeCheckoutModal } = useModalStore();
    const { t, i18n } = useTranslation("global");
    const navigate = useNavigate();

    const {
        fetchNavbarData, fetchProfile, fetchOrders, studentProfile,
        walletBalance, isWalletLoading, isProfileLoading
    } = useAppStore();
    const { walletUpdateTrigger } = useModalStore();

    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [isMobileWalletOpen, setIsMobileWalletOpen] = React.useState(false);
    const [isMobileProfileOpen, setIsMobileProfileOpen] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');

    const containerRef = React.useRef<HTMLDivElement>(null);
    const mobileSearchRef = React.useRef<HTMLDivElement>(null);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    // 1. Helper to get Token
    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsedSession = JSON.parse(session);
            return parsedSession.token;
        } catch (e) {
            return null;
        }
    };

    const handleManualRefresh = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([fetchNavbarData(true)]);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Avatar Logic
    const cacheBreaker = React.useMemo(() => Date.now(), [studentProfile]);
    const avatarUrl = React.useMemo(() => {
        const serverImageUrl = studentProfile?.image
            ? (studentProfile.image.startsWith('http') ? studentProfile.image : `${baseURL}/uploads/student/image/${studentProfile.image}?t=${cacheBreaker}`)
            : null;
        return serverImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile?.name || 'Student')}&background=FF8A00&color=fff&bold=true`;
    }, [studentProfile, baseURL, cacheBreaker]);

    const handleLogout = () => {
        sessionStorage.removeItem("student_session");
        navigate("/login");
        window.location.reload();
    };

    const handleChangeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    };

    const handleSearch = () => {
        if (searchText.trim()) {
            navigate(`/courses?q=${encodeURIComponent(searchText.trim())}`);
            setSearchText('');
        }
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

    // Initial fetch
    React.useEffect(() => {
        const loadInitialData = async () => {
            await Promise.all([
                fetchProfile(),
                fetchNavbarData(),
                fetchOrders()
            ]);
        };
        loadInitialData();
        const interval = setInterval(() => fetchNavbarData(true), 12000);
        return () => clearInterval(interval);
    }, [fetchNavbarData, fetchProfile, fetchOrders, walletUpdateTrigger]);

    const { data: categoriesData = [] } = useQuery({
        queryKey: ['coursesCategoryIndex'],
        queryFn: async () => {
            const res = await axios.get(`${baseURL}/api/courses/category/index`);
            return res.data.data;
        }
    });

    const data = {
        categories: [
            { id: "shopping", name: t("categories2.title"), icon: ShoppingCart, path: "/dashboard" },
            { id: "courses", name: t("categories2.title1"), icon: GraduationCap, path: "/courses" },
            { id: "percel", name: t("categories2.title2"), icon: Package, path: "/percel" },
            { id: "topup", name: t("categories2.title3"), icon: Package, path: "/topup" },
            { id: "drive", name: t("categories2.title4"), icon: Truck, path: "/drive" },
            { id: "cookups", name: t("categories2.title5"), icon: ChefHat, path: "/outlet" },
        ],
        navMain: {
            courses: categoriesData.map((cat: any) => ({
                title: cat.category_name,
                url: `/courses/category/${cat.id}`,
                icon: Book,
                items: []
            })),
        }
    }

    // --- Reusable Sidebar Content (Used in both Desktop Sidebar & Mobile Sheet) ---
    const SidebarContentComponent = () => (
        <>
            {/* Category Icons (Top Row) */}
            <div className="px-4 py-3 border-b bg-gray-50/50">
                <div className="flex flex-row justify-between gap-3 overflow-x-auto scrollbar-none p-1">
                    {data.categories.map((category) => (
                        <Link
                            key={category.id}
                            to={category.path}
                            onClick={() => { setActiveCategory(category.id); setIsMobileOpen(false); }}
                            className={`shrink-0 h-16 w-20 flex flex-col items-center justify-center rounded-lg border transition-all ${activeCategory === category.id
                                ? "bg-primary-default border-primary-default text-white shadow-md"
                                : "bg-white border-gray-200 text-gray-500 hover:border-primary-default/50"
                                }`}
                        >
                            <category.icon className="h-5 w-5 mb-1" />
                            <span className="text-[10px] font-medium">{category.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Navigation Menu (Accordion) */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {activeCategory === "courses" && data.navMain.courses.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <Link to={item.url} onClick={() => setIsMobileOpen(false)}>
                                        {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                        <span className="font-medium">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </>
    );

    return (
        <SidebarProvider>

            {/* 1. DESKTOP SIDEBAR (Hidden on Mobile/Tablet) */}
            <Sidebar collapsible="icon" className="hidden lg:flex border-r bg-white z-40">
                <SidebarHeader>
                    <div className="flex items-center justify-center py-4 border-b h-16">
                        <Link to="/dashboard">
                            {/* Changed h-8 to h-12 */}
                            <img src={logo} alt="logo" className="h-12 w-auto object-contain" />
                        </Link>
                    </div>
                </SidebarHeader>

                <SidebarContentComponent />

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
                                                <div className="p-2 rounded-lg bg-emerald-50/50 group-hover/item:bg-white shadow-sm"><UserCircle size={18} /></div>
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
                                                ${isOpen
                                                    ? '!bg-secondary !border-secondary shadow-lg shadow-secondary/20 !text-white'
                                                    : 'bg-white border-slate-100 hover:border-secondary/30 hover:bg-slate-50/50'
                                                }
                                            `}
                                        >
                                            <div onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full group">
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <div className={`
                                                        flex items-center justify-center h-12 w-12 rounded-[18px] transition-all duration-500
                                                        ${isOpen ? 'bg-white/20 text-white rotate-90' : 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white'}
                                                    `}>
                                                        {isOpen ? <Sparkles size={24} /> : <Settings size={24} />}
                                                    </div>

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

            {/* 2. MOBILE DRAWER (Sheet) - Visible when hamburger is clicked */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetContent side="left" className="w-[300px] p-0 flex flex-col z-[100]">
                    <div className="p-4 border-b flex items-center gap-3 bg-gray-50 h-16">
                        <Link to="/dashboard">
                            <img src={logo} alt="logo" className="h-8 w-auto" />
                        </Link>
                        <span className="font-bold text-lg text-primary-default">Menu</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <SidebarContentComponent />
                    </div>
                    {/* Mobile Drawer Footer */}
                    <div className="p-4 border-t bg-gray-50">
                        <button onClick={openLoginModal} className="w-full flex items-center justify-center gap-2 bg-primary-default text-white py-2.5 rounded-lg font-semibold">
                            <LogInIcon className="h-4 w-4" />
                            Login / Sign Up
                        </button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* 3. MAIN CONTENT AREA */}
            <SidebarInset className="flex flex-col min-h-screen bg-gray-50/30">

                {/* MOBILE HEADER (Synchronized with UserLayout) */}
                <header className="flex flex-col sticky top-0 z-40 border-b bg-white lg:hidden">
                    <div className="flex h-14 items-center justify-between px-4 md:px-6 border-b border-slate-50 relative z-[60]">
                        <div className="flex items-center">
                            <SidebarTrigger className="text-gray-600">
                                <Menu className="h-5.5 w-5.5" />
                            </SidebarTrigger>
                            <Separator orientation="vertical" className="h-4 bg-slate-200 mx-2" />
                            <Link to="/courses" className="flex items-center">
                                <img src={logo} alt="logo" className="h-10 w-auto object-contain transition-opacity hover:opacity-80" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 pl-3 pr-1">
                            {/* Language Toggle */}
                            <div className="flex items-center bg-gray-100/80 rounded-lg p-1 border border-slate-200">
                                <button onClick={() => handleChangeLanguage('en')} className={cn("text-[10px] font-black px-2 py-1 rounded-md transition-all", i18n.language === 'en' ? "bg-white text-[#5ca367] shadow-sm" : "text-gray-400")}>EN</button>
                                <button onClick={() => handleChangeLanguage('bn')} className={cn("text-[10px] font-black px-2 py-1 rounded-md transition-all", i18n.language === 'bn' ? "bg-white text-[#5ca367] shadow-sm" : "text-gray-400")}>BN</button>
                            </div>

                            {/* Mobile Profile Menu */}
                            <div className="relative shrink-0">
                                <button
                                    onClick={() => { setIsMobileProfileOpen(!isMobileProfileOpen); setIsMobileWalletOpen(false); }}
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

                                {isMobileProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsMobileProfileOpen(false)}></div>
                                        <div className="absolute top-8 -right-3 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                            <div className="flex flex-col">
                                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                                    <p className="text-[13px] font-bold text-slate-800 truncate">{studentProfile?.name || "Student"}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Golden Tier</p>
                                                </div>
                                                <div className="p-2">
                                                    <Link to="/dashboard/order" onClick={() => setIsMobileProfileOpen(false)} className="flex items-center gap-4 p-3 rounded-[20px] bg-emerald-50/50 border border-emerald-100/50 hover:bg-emerald-100/60 transition-all">
                                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-emerald-50"><Package className="h-5 w-5 text-emerald-600" /></div>
                                                        <span className="text-[14px] font-bold text-emerald-700">Order History</span>
                                                    </Link>
                                                </div>
                                                <div className="px-2 pb-2">
                                                    <Link to="/dashboard/profile/settings" onClick={() => setIsMobileProfileOpen(false)} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-all">
                                                        <UserCircle size={18} className="text-slate-400" />
                                                        <span className="text-[13px] font-bold">Manage Profile</span>
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

                    {/* Mobile Wallet Row */}
                    <div className="px-4 py-2 border-b border-slate-50 bg-slate-50/30 relative z-[50] flex items-center gap-3">
                        <div className="relative flex-1">
                            <button
                                onClick={() => { setIsMobileWalletOpen(!isMobileWalletOpen); setIsMobileProfileOpen(false); }}
                                className="w-full flex items-center justify-between bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn("flex items-center justify-center h-9 w-9 rounded-xl transition-all", isWalletLoading ? "bg-slate-100 animate-pulse" : "bg-[#5ca367] text-white shadow-md shadow-green-100")}>
                                        {!isWalletLoading && <Wallet className="h-4.5 w-4.5" />}
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">My Balance</span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[15px] font-black text-slate-900 leading-none">৳{walletBalance}</span>
                                            <button onClick={(e) => { e.stopPropagation(); handleManualRefresh(); }} className="p-1 hover:bg-slate-100 rounded-full transition-all">
                                                <RotateCw className={cn("h-3 w-3 text-slate-400", isRefreshing && "animate-spin text-secondary")} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", isMobileWalletOpen && "rotate-180")} />
                            </button>

                            {isMobileWalletOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsMobileWalletOpen(false)}></div>
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden origin-top animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-2 flex flex-col gap-1">
                                            <Link to="/dashboard/wallet/add" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-green-600 transition-colors">
                                                <PlusCircle className="h-5 w-5 text-green-500" />
                                                Add Money
                                            </Link>
                                            <Link to="/dashboard/wallet/withdraw" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors">
                                                <Landmark className="h-5 w-5 text-orange-500" />
                                                Withdraw Money
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="shrink-0 z-50">
                            <NotificationBell token={getAuthToken()} />
                        </div>
                    </div>

                    {/* Mobile Search Row */}
                    <div className="px-4 pb-3 pt-2" ref={mobileSearchRef}>
                        <div className="relative flex items-center w-full group">
                            <input
                                type="text"
                                value={searchText}
                                placeholder="Search Courses..."
                                onChange={(e) => setSearchText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full h-11 pl-4 pr-12 text-sm bg-gray-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#5ca367] focus:ring-4 focus:ring-[#5ca367]/5 transition-all shadow-inner"
                            />
                            <button className="absolute right-3 p-2 text-gray-400 hover:text-[#5ca367]" onClick={handleSearch}>
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* DESKTOP HEADER (Synchronized with UserLayout) */}
                <div className="hidden lg:block sticky top-0 z-40 bg-white">
                    <Header placeholder="Search Courses..." />
                </div>

                <main className="flex-1 p-4 lg:p-6 relative w-full max-w-full mx-auto">
                    {/* Floating Cart Button */}
                    {/* <button
                        onClick={changeCheckoutModal}
                        className="fixed z-50 bg-white border-2 border-primary-default/20 shadow-xl flex items-center gap-2 hover:bg-gray-50 transition-all 
    bottom-25 right-4 rounded-full p-3 
    lg:bottom-auto top-[55%]  lg:top-[60%] lg:right-0 lg:rounded-l-xl lg:rounded-r-none lg:px-4 lg:py-3 lg:-translate-y-1/2"
                    > */}
                    {/* <div className="relative">
                            <ShoppingBag className="h-6 w-6 text-red-500" />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                                4
                            </span>
                        </div> */}
                    {/* Only show text on Desktop to prevent mobile overlapping */}
                    {/* <div className="hidden lg:block text-left border-l border-gray-200 pl-3 h-8">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">MY CART</div>
                            <div className="text-xs font-bold text-gray-800">৳ 2369</div>
                        </div> */}
                    {/* </button> */}
                    <Outlet />

                    <div className="mt-4">
                        <Footer />
                    </div>
                </main>
            </SidebarInset>

            {/* Global Overlays */}
            <Cart />
            <LiveChat mode="student" />
        </SidebarProvider>
    )
}