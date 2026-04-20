import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Search, Bell, MapPin, User, ChevronDown, ArrowLeft,
    Wallet, PlusCircle, Send, Landmark, Camera, ShoppingBag, History,
    Settings, LogOut
} from 'lucide-react';
import ImageUploadModal from '@/components/shared/ImageUploadModal';
import { useVendorProfile, getVendorDisplayName, getVendorAvatarUrl } from '@/hooks/useVendorProfile';
import VendorNotificationBell from '@/pages/Vendor/VendorHeader/NotificationBell';
import { useProfileCompletion } from '../../hooks/useProfileCompletion';
import { useVendorAuth } from '@/hooks/useVendorAuth';
import { useAppStore } from '@/store/useAppStore';
import { baseURL } from '@/store/utils';

// --- CUSTOM ICONS ---
const MenuFoldLeftIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
        <polyline points="9 7 4 12 9 17" />
    </svg>
);

const MenuFoldRightIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
        <polyline points="15 7 20 12 15 17" />
    </svg>
);

const Navbar: React.FC<{ toggleSidebar: () => void; isOpen: boolean }> = ({ toggleSidebar, isOpen }) => {
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { handleLogout } = useVendorAuth();

    const {
        walletBalance,
        notifications,
        unreadCount,
        vendorProfile: profile,
        fetchNavbarData,
        isNavbarLoading: isLoading
    } = useAppStore();

    const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const walletRefDesktop = useRef<HTMLDivElement>(null);
    const walletRefMobile = useRef<HTMLDivElement>(null);

    // Profile completion check
    const { percentage: profilePercentage, isComplete: isProfileComplete } = useProfileCompletion(profile?.vendor);

    // --- Helpers ---
    const getVendorToken = () => {
        const session = sessionStorage.getItem('vendor_session');
        return session ? JSON.parse(session).token : null;
    };

    const isProfileLoading = isLoading && !profile;

    // --- Fetch Navbar and Profile Data ---
    const { fetchProfile } = useAppStore();

    useEffect(() => {
        fetchNavbarData();
        fetchProfile(); // Ensure full profile data is available for accurate avatar display

        // Set up interval for auto-update every 10 seconds (less aggressive than 5s)
        const intervalId = setInterval(() => fetchNavbarData(true), 10000);

        return () => clearInterval(intervalId);
    }, [fetchNavbarData, fetchProfile]);

    // --- Close Menu on Click Outside ---
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                walletRefDesktop.current && !walletRefDesktop.current.contains(event.target as Node) &&
                walletRefMobile.current && !walletRefMobile.current.contains(event.target as Node)
            ) {
                setIsWalletMenuOpen(false);
            }
            if (
                profileRef.current && !profileRef.current.contains(event.target as Node)
            ) {
                setIsProfileMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- REUSABLE WALLET COMPONENT ---
    const renderWalletDropdown = (isMobile: boolean, ref: React.RefObject<HTMLDivElement>) => (
        <div className={`relative z-40 ${isMobile ? 'w-full' : ''}`} ref={ref}>

            {/* Wallet Button trigger */}
            <div
                onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
                className={`flex items-center justify-between bg-background border border-border shadow-sm hover:shadow-md hover:border-secondary/50 transition-all cursor-pointer select-none ${isMobile ? 'px-4 py-3 rounded-[16px] w-full' : 'px-4 py-2 rounded-2xl gap-3'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center rounded-xl transition-all duration-300 ${isLoading ? "bg-muted animate-pulse" : "bg-secondary/10 text-secondary"} h-10 w-10 ${isWalletMenuOpen ? 'bg-secondary text-secondary-foreground' : ''}`}>
                        {!isLoading && <Wallet className="h-5 w-5" strokeWidth={2.5} />}
                    </div>

                    <div className="flex flex-col pr-1 text-left">
                        <span className="font-black text-muted-foreground uppercase leading-none tracking-tight text-[11px]">My Balance</span>
                        <div className="mt-1 h-4 flex items-center">
                            {isLoading ? (
                                <div className={`bg-muted animate-pulse rounded-md ${isMobile ? 'h-3.5 w-16' : 'h-4 w-20'}`} />
                            ) : (
                                <span className="font-black text-foreground tracking-tight leading-none text-[16px]">৳{walletBalance}</span>
                            )}
                        </div>
                    </div>
                </div>
                <ChevronDown className={`text-muted-foreground transition-transform duration-300 ${isWalletMenuOpen ? 'rotate-180' : ''} ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </div>

            {/* Dropdown Options */}
            <div className={`absolute mt-2 bg-background rounded-2xl shadow-xl border border-border transition-all duration-200 overflow-hidden ${isWalletMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'} ${isMobile ? 'top-full left-0 w-full' : 'top-full right-0 w-60'}`}>
                <div className="p-2 flex flex-col gap-1">
                    <Link onClick={() => setIsWalletMenuOpen(false)} to="/vendor/dashboard/wallet/vendor_add" className={`flex items-center gap-3 px-3 hover:bg-muted rounded-xl font-bold text-foreground transition-colors py-2.5 ${isMobile ? 'text-sm' : 'text-[13px]'}`}>
                        <PlusCircle className="h-4 w-4 text-emerald-500" /> Add Money
                    </Link>

                    <Link onClick={() => setIsWalletMenuOpen(false)} to="/vendor/dashboard/wallet/vendor_withdraw" className={`flex items-center gap-3 px-3 hover:bg-muted rounded-xl font-bold text-foreground transition-colors py-2.5 ${isMobile ? 'text-sm' : 'text-[13px]'}`}>
                        <Landmark className="h-4 w-4 text-orange-500" /> Withdraw Money
                    </Link>

                    <Link onClick={() => setIsWalletMenuOpen(false)} to="/vendor/dashboard/wallet/vendor_all" className={`flex items-center gap-3 px-3 hover:bg-muted rounded-xl font-bold text-foreground transition-colors py-2.5 ${isMobile ? 'text-sm' : 'text-[13px]'}`}>
                        <History className="h-4 w-4 text-indigo-500" /> All Transactions
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <header className="w-full bg-background border-b border-border sticky top-0 z-30 transition-colors duration-300 flex flex-col relative">

            {/* --- TABLET/MOBILE SEARCH OVERLAY (Single Source of Truth) --- */}
            {isMobileSearchOpen && (
                <div className={`absolute top-0 left-0 right-0 h-16 sm:h-20 bg-background z-50 flex items-center px-4 ${isOpen ? 'xl:hidden' : 'lg:hidden'} animate-in fade-in slide-in-from-top-2 duration-200 border-b border-border shadow-sm`}>
                    <button
                        onClick={() => setIsMobileSearchOpen(false)}
                        className="p-2 mr-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors flex-shrink-0"
                        aria-label="Close search"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div className="flex-1 flex items-center bg-muted/50 border border-border rounded-xl px-4 py-2.5 focus-within:ring-1 focus-within:ring-secondary focus-within:border-secondary transition-all">
                        <Search size={20} className="text-muted-foreground flex-shrink-0" />
                        <input
                            type="text"
                            autoFocus
                            placeholder="Search orders, customers..."
                            className="bg-transparent border-none focus:ring-0 text-sm sm:text-base text-foreground ml-3 w-full placeholder:text-muted-foreground outline-none min-w-0"
                        />
                        <button
                            onClick={() => setIsImageSearchOpen(true)}
                            className="p-1.5 hover:bg-yellow-50 rounded-lg transition ml-2 flex-shrink-0"
                            title="Search by image"
                        >
                            <Camera size={20} className="text-gray-700 hover:text-yellow-600 transition" />
                        </button>
                    </div>
                </div>
            )}

            {/* === ROW 1: ALWAYS VISIBLE === */}
            <div className="flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20 w-full min-w-0">

                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleSidebar();
                        }}
                        aria-label="Toggle Sidebar"
                        className="relative z-40 p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all duration-300 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                    >
                        {isOpen ? <MenuFoldLeftIcon size={24} /> : <MenuFoldRightIcon size={24} />}
                    </button>

                    {/* DESKTOP WALLET */}
                    <div className="hidden md:block">
                        {renderWalletDropdown(false, walletRefDesktop)}
                    </div>

                    {/* DESKTOP SEARCH BOX */}
                    <div className={`ml-4 xl:ml-8 hidden ${isOpen ? 'xl:flex' : 'lg:flex'} flex-1 items-center bg-muted/50 border border-border rounded-xl px-3 lg:px-4 py-2 lg:py-2.5 w-full max-w-2xl min-w-[200px] focus-within:ring-1 focus-within:ring-secondary focus-within:border-secondary transition-all shadow-sm`}>
                        <Search size={20} className="text-muted-foreground flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search orders, customers..."
                            className="bg-transparent border-none focus:ring-0 text-sm lg:text-base text-foreground ml-2 lg:ml-3 w-full min-w-0 placeholder:text-muted-foreground outline-none text-ellipsis"
                        />
                        <button
                            onClick={() => setIsImageSearchOpen(true)}
                            className="p-1.5 hover:bg-yellow-50 rounded-lg transition ml-1 flex-shrink-0"
                            title="Search by image"
                        >
                            <Camera size={20} className="text-gray-700 hover:text-yellow-600 transition" />
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE ICONS */}
                <div className="flex items-center gap-2 sm:gap-4 xl:gap-6 ml-auto flex-shrink-0">

                    {/* Search Trigger for Mobile/Tablet */}
                    <button
                        onClick={() => setIsMobileSearchOpen(true)}
                        className={`${isOpen ? 'xl:hidden' : 'lg:hidden'} p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors flex-shrink-0`}
                    >
                        <Search size={20} className="sm:w-[22px] sm:h-[22px]" />
                    </button>

                    {/* Location Icon - Desktop Only */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                        <MapPin size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Dhaka</span>
                    </div>

                    {/* Notification Bell */}
                    <VendorNotificationBell
                        baseURL={baseURL}
                        token={getVendorToken()}
                    />

                    {/* User Profile with Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <div
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-border cursor-pointer group flex-shrink-0 hover:bg-muted/50 rounded-xl pr-3 py-2 transition-all"
                        >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                {isProfileLoading ? (
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-muted animate-pulse" />
                                ) : getVendorAvatarUrl(profile) ? (
                                    <img
                                        src={getVendorAvatarUrl(profile)}
                                        alt={getVendorDisplayName(profile)}
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-secondary/20"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            const parent = (e.target as HTMLImageElement).parentElement;
                                            if (parent && !parent.querySelector('.fallback-avatar')) {
                                                const fallback = document.createElement('div');
                                                fallback.className = 'fallback-avatar w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark rounded-full';
                                                fallback.innerHTML = `<span class="text-white font-bold text-xs sm:text-sm">${getVendorDisplayName(profile).charAt(0).toUpperCase()}</span>`;
                                                parent.appendChild(fallback);
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
                                        <span className="text-white font-bold text-xs sm:text-sm">
                                            {getVendorDisplayName(profile).charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Name - Desktop Only */}
                            <div className="text-right hidden sm:block max-w-[120px] xl:max-w-none">
                                <p className="text-sm xl:text-base font-bold text-foreground leading-none truncate">
                                    {getVendorDisplayName(profile)}
                                </p>
                                <p className="text-[11px] xl:text-xs text-secondary font-bold mt-1 uppercase tracking-wider">
                                    Available
                                </p>
                            </div>

                            <ChevronDown size={18} className="text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block flex-shrink-0" />
                        </div>

                        {/* Profile Dropdown Menu */}
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* Header */}
                                <div className="px-4 py-3 bg-muted/50 border-b border-border">
                                    <p className="text-sm font-bold text-foreground">{getVendorDisplayName(profile)}</p>
                                    <p className="text-xs text-muted-foreground truncate">Seller ID: {profile?.vendor?.seller_id || 'N/A'}</p>

                                    {/* Profile Completion Badge */}
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ease-out rounded-full ${isProfileComplete
                                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                                                    : 'bg-gradient-to-r from-amber-500 to-amber-600'
                                                    }`}
                                                style={{ width: `${profilePercentage}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-bold ${isProfileComplete ? 'text-emerald-600' : 'text-amber-600'
                                            }`}>
                                            {profilePercentage}%
                                        </span>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <Link
                                        to="/vendor/dashboard/profile"
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    >
                                        <User className="h-4 w-4 text-primary-light" />
                                        <span>My Profile</span>
                                    </Link>

                                    <button
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
                                        onClick={() => {
                                            setIsProfileMenuOpen(false);
                                            // Navigate to settings when available
                                        }}
                                    >
                                        <Settings className="h-4 w-4 text-primary-dark" />
                                        <span>Settings</span>
                                    </button>

                                    <div className="my-2 border-t border-border" />

                                    <button
                                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                                        onClick={() => {
                                            setIsProfileMenuOpen(false);
                                            handleLogout();
                                        }}
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* === ROW 2: MOBILE WALLET === */}
            <div className="md:hidden flex items-center px-4 pb-4 w-full">
                {renderWalletDropdown(true, walletRefMobile)}
            </div>

            {/* Image Upload Modal */}
            <ImageUploadModal
                isOpen={isImageSearchOpen}
                onClose={() => setIsImageSearchOpen(false)}
            />

        </header>
    );
};

export default Navbar;