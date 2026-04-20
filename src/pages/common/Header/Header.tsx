'use client'

import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Wallet, Search, Menu, GraduationCap, Package, ChevronDown, PlusCircle, Send, Download, Landmark, Loader2, LayoutDashboard, X } from 'lucide-react';
import { ImageSearchButton } from '@/components/search';

import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import useModalStore from '@/store/modalStore';
import { useTranslation } from 'react-i18next';
import LoginOptionsModal from '@/components/LoginoptionsModal';
import NotificationBell from '@/components/ui/NotificationBell';
import { useAppStore } from '@/store/useAppStore';
import { getAuthToken } from '@/store/utils';
import axios from 'axios';
import { toast } from 'react-toastify';

const Header: React.FC = () => {
    const { isLoginModalOpen, openLoginModal, closeLoginModal, walletUpdateTrigger } = useModalStore();

    const navigate = useNavigate();
    const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
    // Config : Dynamic Base URL from Environment Variables
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    // Auth & UI States
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const cancelButtonRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [t, i18n] = useTranslation('global');
    const [isLoginOptionsModalOpen, setIsLoginOptionsModalOpen] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'phone' | 'email' | null>(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    // --- SEARCH STATES ---
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isMobileWalletOpen, setIsMobileWalletOpen] = useState(false);
    // Split refs for Desktop and Mobile so clicking outside works properly
    const desktopSearchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);
    const studentProfile = useAppStore(s => s.studentProfile);
    const walletBalanceValue = useAppStore(s => s.walletBalance);
    const isWalletLoading = useAppStore(s => s.isWalletLoading);
    const isProfileLoading = useAppStore(s => s.isProfileLoading);

    // Initial fetch is handled by UserLayout.
    // We only consume the data here.


    // Handle clicks outside the search dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isOutsideDesktop = desktopSearchRef.current && !desktopSearchRef.current.contains(target);
            const isOutsideMobile = mobileSearchRef.current && !mobileSearchRef.current.contains(target);

            if (isOutsideDesktop && isOutsideMobile) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- SEARCH API EFFECT WITH DEBOUNCE ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchText.trim().length > 0) {
                setIsSearching(true);
                try {
                    const response = await axios.get(`${baseURL}/api/products/search?keyword=${searchText}`);
                    const results = response.data?.products || [];
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
        }, 400); // 400ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchText, baseURL]);

    const handleChangeLanguage = (language: string) => {
        i18n.changeLanguage(language);
    }

    const handlePhoneChange = (value: string | undefined) => {
        const newValue = value || "";
        setPhone(newValue);
        if (newValue.length !== 11) {
            setErrorMessage("Phone number must be exactly 11 digits.");
            setIsButtonDisabled(true);
        } else {
            setErrorMessage(null);
            setIsButtonDisabled(false);
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
        setErrorMessage(null);
    };

    const handleVerify = () => {
        if (otp.join("").length !== 4) {
            setErrorMessage("Please enter a valid 4-digit OTP");
        } else {
            setErrorMessage(null);
            setStep(3);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // --- UPDATED: Modern Search Handler ---
    const handleSearch = () => {
        if (searchText.trim()) {
            const query = searchText.trim();
            setShowSuggestions(false);
            setSearchText('');
            navigate(`/dashboard?q=${encodeURIComponent(query)}`);
        } else {
            toast.warning("Please enter text to search", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                theme: "light",
            });
        }
    };

    const getProductTitle = (product: any) => {
        if (i18n.language === 'bn' && product.product_title_bangla) {
            return product.product_title_bangla;
        }
        return product.product_title_english || product.name || 'Unknown Product';
    };

    // --- UPDATED: Select Suggestion Handler ---
    const handleSelectSuggestion = () => {
        setShowSuggestions(false);
        setSearchText('');
    };

    const handlePhoneLogin = () => {
        setLoginMethod('phone');
        setIsLoginOptionsModalOpen(false);
        openLoginModal();
    };

    const handleEmailLogin = () => {
        setLoginMethod('email');
        setIsLoginOptionsModalOpen(false);
        openLoginModal();
    };
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Optional: Add the click-outside useEffect here if you want it to close when clicking away

    // --- avatar URL logic (using global store profile) ---
    const cacheBreaker = Date.now();
    const serverImageUrl = studentProfile?.image
        ? (studentProfile.image.startsWith('http') ? studentProfile.image : `${baseURL}/uploads/student/image/${studentProfile.image}?t=${cacheBreaker}`)
        : null;
    const avatarUrl = serverImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile?.name || 'Student')}&background=FF8A00&color=fff&bold=true`;

    return (
        <div className="w-full bg-white shadow-md border-b border-gray-200 z-40 sticky top-0">

            {/* =========================================
    1. DESKTOP HEADER (Large Screens)
   ========================================= */}
            <header className="hidden lg:flex items-center justify-between px-6 py-4 w-full max-w-[1350px] mx-auto h-24 gap-5">
                {/* --- LEFT: USER & WALLET --- */}
                <div className="flex items-center gap-4 shrink-0">

                    {/* --- USER PROFILE DROPDOWN (NEW) --- */}
                    <Link to="/dashboard" className="flex items-center gap-2 bg-primary-default text-white px-5 py-3 rounded-xl text-sm font-black hover:bg-green-600 shadow-md shadow-primary-default/25 transition-all active:scale-95">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>{t('header.dashboard') || "Dashboard"}</span>
                    </Link>

                    {/* --- WALLET WITH DROPDOWN MENU --- */}
                    <div className="relative group z-40">
                        {/* Wallet Button trigger */}
                        <div className="flex items-center gap-2.5 bg-white border border-slate-100 px-3 py-2 rounded-2xl shadow-sm hover:shadow-md hover:border-green-100 transition-all cursor-pointer">
                            <div className={`flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-300 ${isWalletLoading ? "bg-slate-100 animate-pulse" : "bg-green-50 text-[#5ca367] group-hover:bg-[#5ca367] group-hover:text-white"}`}>
                                {!isWalletLoading && <Wallet className="h-4.5 w-4.5" />}
                            </div>
                            <div className="flex flex-col pr-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase leading-none tracking-tight">My Balance</span>
                                <div className="mt-1.5 h-3.5 flex items-center">
                                    {isWalletLoading ? (
                                        <div className="h-4 w-16 bg-slate-100 animate-pulse rounded-md" />
                                    ) : (
                                        <span className="text-[15px] font-black text-slate-900 tracking-tight leading-none">৳{walletBalanceValue}</span>
                                    )}
                                </div>
                            </div>
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
                        </div>

                        {/* Dropdown Options */}
                        <div className="absolute top-full left-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all translate-y-2 group-hover:translate-y-0 overflow-hidden">
                            <div className="p-2 flex flex-col gap-1">
                                <Link to="/dashboard/wallet/add" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-[13px] font-bold text-slate-700 hover:text-green-600 transition-colors">
                                    <PlusCircle className="h-4 w-4 text-green-500" />
                                    Add Money
                                </Link>
                                <Link to="/dashboard/wallet/send" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-[13px] font-bold text-slate-700 hover:text-blue-600 transition-colors">
                                    <Send className="h-4 w-4 text-blue-500" />
                                    Send Money
                                </Link>
                                <Link to="/dashboard/wallet/withdraw" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-[13px] font-bold text-slate-700 hover:text-orange-600 transition-colors">
                                    <Landmark className="h-4 w-4 text-orange-500" />
                                    Withdraw Money
                                </Link>
                                <Link to="/dashboard/wallet/purchase" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-[13px] font-bold text-slate-700 hover:text-purple-600 transition-colors">
                                    <Download className="h-4 w-4 text-purple-500" />
                                    Purchase History
                                </Link>
                                <Link to="/dashboard/wallet/all" className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-[13px] font-bold text-slate-700 hover:text-purple-600 transition-colors">
                                    <Download className="h-4 w-4 text-purple-500" />
                                    All Transaction
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CENTER: SEARCH --- */}
                <div className="flex-1 relative mx-4" ref={desktopSearchRef}>
                    <div className="relative w-full group">
                        <input
                            type="text"
                            placeholder={t('header.search') || "Search for amazing products..."}
                            className="w-full pl-5 pr-28 py-3 bg-gray-50 border-2 border-transparent hover:border-gray-200 rounded-2xl focus:outline-none focus:bg-white focus:border-primary-default focus:ring-4 focus:ring-primary-default/10 text-base font-medium transition-all shadow-inner"
                            value={searchText}
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => searchText.trim() && setShowSuggestions(true)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                        />

                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            {isSearching && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}

                            <ImageSearchButton />

                            <div className="h-6 w-[2px] bg-gray-200"></div>

                            <button
                                onClick={handleSearch}
                                className="p-1.5 bg-primary-default/10 rounded-lg hover:bg-primary-default hover:text-white text-primary-default transition-colors"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Desktop Suggestions */}
                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] z-50 overflow-hidden max-h-[400px] overflow-y-auto">
                            {isSearching ? (
                                <div className="p-4 text-center text-gray-500 text-sm">Searching database...</div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map(p => {
                                    const productTitle = getProductTitle(p);
                                    return (
                                        <Link key={p.id} to={`/dashboard?q=${encodeURIComponent(productTitle)}`} className="flex items-center p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 gap-3 transition-colors" onClick={handleSelectSuggestion}>
                                            <img src={p.product_image ? `${baseURL}/uploads/ecommarce/product_image/${p.product_image}` : '/placeholder-image.jpg'} className="w-11 h-11 rounded-lg object-cover border border-gray-100 shadow-sm" alt={productTitle} onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/50'} />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800 text-[15px] line-clamp-1">{productTitle}</span>
                                                {p.offer_price && <span className="text-[13px] font-black text-primary-default">৳{p.offer_price}</span>}
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm italic">No products found matching your search.</div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- RIGHT SIDE: NOTIFICATION, LANG & DASHBOARD --- */}
                <div className="flex items-center gap-5 shrink-0">

                    {/* Notification Bell */}
                    <NotificationBell token={getAuthToken()} />

                    {/* Modern Language Toggle */}
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 px-2 py-1.5 shadow-sm">
                        <button
                            onClick={() => handleChangeLanguage('en')}
                            className={`px-2 text-sm font-bold transition-all ${i18n.language === 'en' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            EN
                        </button>
                        <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                        <button
                            onClick={() => handleChangeLanguage('bn')}
                            className={`px-2 text-sm font-bold transition-all ${i18n.language === 'bn' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            BN
                        </button>
                    </div>
                    {/* 1st: Profile Avatar */}
                    <div className="relative shrink-0">

                        {/* --- USER PROFILE DROPDOWN (NEW) --- */}
                        <div className="relative inline-block z-50" ref={profileDropdownRef}>
                            {/* Trigger Button */}
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="group flex items-center gap-3 pl-4 pr-3 py-2 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
                            >
                                {/* 1st: Profile Avatar */}
                                <div className="relative shrink-0">
                                    <div className="h-10 w-10 rounded-xl border border-slate-200 shadow-sm group-hover:rotate-3 group-hover:scale-110 transition-all duration-300 overflow-hidden bg-slate-100">
                                        <img
                                            src={avatarUrl}
                                            alt={studentProfile?.name || 'Profile'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile?.name || 'S')}&background=FF8A00&color=fff&bold=true`;
                                            }}
                                        />
                                    </div>

                                    {/* Online Badge */}
                                    <div className="absolute -bottom-1 -right-1 flex items-center justify-center h-5 w-5 bg-emerald-500 rounded-lg border-2 border-white shadow-lg shadow-emerald-200">
                                        <GraduationCap size={12} className="text-white" />
                                    </div>
                                </div>

                                {/* 2nd: Text Info (Name & Tier) */}
                                <div className="flex flex-col items-start justify-center text-left hidden md:flex">
                                    {isProfileLoading && !studentProfile ? (
                                        <div className="h-4 w-20 bg-slate-200 animate-pulse rounded-md" />
                                    ) : (
                                        <span className="text-[14px] font-semibold text-slate-900 tracking-tight leading-none group-hover:text-emerald-600 transition-colors">
                                            {studentProfile?.name || "Student"}
                                        </span>
                                    )}

                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
                                            Golden Tier
                                        </span>
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    </div>
                                </div>

                                {/* Dropdown Indicator Arrow */}
                                <ChevronDown className={`w-4 h-4 text-slate-400 ml-1 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute left-0 mt-3 w-48 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left z-[999]">
                                    <div className="p-1.5">
                                        <Link
                                            to="/dashboard/order"
                                            onClick={() => setIsProfileOpen(false)}
                                            className="group flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                                        >
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-slate-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-emerald-100 transition-all duration-200">
                                                <Package className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                                            </div>
                                            <span>Order History</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                sessionStorage.removeItem("student_session");
                                                navigate("/login");
                                                window.location.reload();
                                            }}
                                            className="group flex items-center gap-3 w-full px-2.5 py-2.5 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-50 transition-all duration-200"
                                        >
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-red-100 transition-all duration-200">
                                                <X className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                                            </div>
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                    {/* Dashboard Button */}

                </div>
            </header>

            {/* =========================================
                2. MOBILE HEADER (Small Screens)
               ========================================= */}
            <div className="lg:hidden flex flex-col w-full bg-white z-50" ref={mobileSearchRef}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-700">
                        <Menu className="h-7 w-7" />
                    </button>

                    <div className="flex items-center gap-2">
                        {/* Language Toggle */}
                        <div className="flex bg-gray-100 p-0.5 rounded-lg text-[10px] font-black border border-gray-200 mr-1">
                            <button onClick={() => handleChangeLanguage('en')} className={`px-2.5 py-1 rounded-md ${i18n.language === 'en' ? 'bg-white shadow-sm text-primary-default' : 'text-gray-400'}`}>EN</button>
                            <button onClick={() => handleChangeLanguage('bn')} className={`px-2.5 py-1 rounded-md ${i18n.language === 'bn' ? 'bg-white shadow-sm text-primary-default' : 'text-gray-400'}`}>BN</button>
                        </div>

                        {/* Mobile Profile Image - Reactive like ProfileSidebar */}
                        <Link to="/dashboard/profile/settings" className="flex items-center p-0.5 bg-slate-50 rounded-full border border-gray-100">
                            <img
                                src={avatarUrl}
                                alt="Profile"
                                className="h-8 w-8 rounded-full object-cover border border-white shadow-sm bg-slate-200"
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile?.name || 'S')}&background=FF8A00&color=fff&bold=true`;
                                }}
                            />
                        </Link>

                        {/* MOBILE WALLET MENU (Click to open dropdown) */}
                        <div className="relative">
                            <button
                                onClick={() => setIsMobileWalletOpen(!isMobileWalletOpen)}
                                className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1.5 rounded-xl shadow-sm active:scale-95 transition-all"
                            >
                                <div className={`flex items-center justify-center h-7 w-7 rounded-lg transition-all duration-300 ${isWalletLoading ? "bg-slate-100 animate-pulse" : "bg-green-50 text-[#5ca367]"}`}>
                                    {!isWalletLoading && <Wallet className="h-3.5 w-3.5" />}
                                </div>
                                <div className="flex flex-col items-start pr-0.5">
                                    <span className="text-[8px] font-black text-slate-400 uppercase leading-none tracking-tight">Balance</span>
                                    <div className="mt-1 h-2.5 flex items-center">
                                        {isWalletLoading ? (
                                            <div className="h-2.5 w-10 bg-slate-100 animate-pulse rounded-sm" />
                                        ) : (
                                            <span className="text-[11px] font-black text-slate-900 tracking-tight leading-none">৳{walletBalanceValue}</span>
                                        )}
                                    </div>
                                </div>
                                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isMobileWalletOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Mobile Wallet Dropdown */}
                            {isMobileWalletOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsMobileWalletOpen(false)}></div>
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-2 flex flex-col gap-1">
                                            <Link to="/dashboard/wallet/add" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:text-green-600 transition-colors">
                                                <PlusCircle className="h-4 w-4 text-green-500" />
                                                Add Money
                                            </Link>
                                            <Link to="/dashboard//wallet/send" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors">
                                                <Send className="h-4 w-4 text-blue-500" />
                                                Send Money
                                            </Link>
                                            <Link to="/wallet/receive" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:text-purple-600 transition-colors">
                                                <Download className="h-4 w-4 text-purple-500" />
                                                Receive Money
                                            </Link>
                                            <Link to="/dashboard//wallet/withdraw" onClick={() => setIsMobileWalletOpen(false)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-600 transition-colors">
                                                <Landmark className="h-4 w-4 text-orange-500" />
                                                Withdraw Money
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>

                <div className="px-4 py-3 bg-white relative border-b border-gray-50">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder={t('header.search')}
                            className="w-full pl-5 pr-12 py-3 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-medium shadow-inner focus:outline-none focus:bg-white focus:border-primary-default transition-all"
                            value={searchText}
                            onChange={(e) => { setSearchText(e.target.value); setShowSuggestions(true); }}
                            onFocus={() => searchText.trim() && setShowSuggestions(true)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isSearching && <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />}
                            <ImageSearchButton />
                        </div>
                    </div>

                    {/* Mobile Suggestions Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden max-h-[300px] overflow-y-auto">
                            {isSearching ? (
                                <div className="p-4 text-center text-gray-500 text-sm">Searching...</div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map(p => {
                                    const productTitle = getProductTitle(p);
                                    return (
                                        <Link key={p.id} to={`/dashboard?q=${encodeURIComponent(productTitle)}`} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 gap-3 transition-colors" onClick={handleSelectSuggestion}>
                                            <img src={p.product_image ? `${baseURL}/uploads/ecommarce/product_image/${p.product_image}` : '/placeholder-image.jpg'} className="w-10 h-10 rounded object-cover border border-gray-100" alt={productTitle} onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/40'} />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800 text-sm line-clamp-1">{productTitle}</span>
                                                {p.offer_price && <span className="text-xs font-bold text-primary-default">৳{p.offer_price}</span>}
                                            </div>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">No products found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Transition.Root show={isLoginModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[60]" initialFocus={cancelButtonRef} onClose={closeLoginModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-6">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all text-center text-gray-900">
                                    <button onClick={closeLoginModal} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400"><X className="h-6 w-6" /></button>
                                    <h3 className="text-2xl font-black mb-8">{step === 1 ? t('header.enterPhoneNumber') : t('header.enterOTP')}</h3>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <LoginOptionsModal
                isOpen={isLoginOptionsModalOpen}
                onClose={() => setIsLoginOptionsModalOpen(false)}
                onPhoneLogin={handlePhoneLogin}
                onEmailLogin={handleEmailLogin}
            />
        </div>
    );
};

export default Header;