'use client'

import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { CameraIcon, UserIcon, Search, Menu, X, Bell } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { useTranslation } from 'react-i18next';
import useModalStore from '@/store/modalStore';

interface CourseHeaderProps {
    onMenuClick?: () => void;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ onMenuClick }) => {
    const { isLoginModalOpen, openLoginModal, closeLoginModal } = useModalStore();
    const [searchText, setSearchText] = useState('');
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [value, setValue] = useState<string | undefined>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const cancelButtonRef = useRef(null);

    const { t, i18n } = useTranslation('global');

    const handleChangeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const handlePhoneChange = (val: string | undefined) => { setPhone(val || ""); setErrorMessage(null); };
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newOtp = [...otp]; newOtp[index] = e.target.value; setOtp(newOtp);
    };
    const handleVerify = () => { if (otp.join("").length === 4) setStep(3); else setErrorMessage("Invalid OTP"); };
    // 1. Logic for handling image uploads
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // You can add your logic here (e.g., URL.createObjectURL(file) for preview)
            console.log("Selected file:", file.name);
        }
    };

    // 2. Logic for handling search button click
    const handleSearch = () => {
        if (searchText.trim()) {
            console.log("Searching for:", searchText);
            // Add your navigation or API call logic here
        }
    };
    return (
        // The container now uses w-full to ensure it fills the horizontal space completely
        <div className="w-full bg-white shadow-md border-b border-gray-200 z-40 sticky top-0">

            {/* =========================================
                1. DESKTOP MENU BAR (Single Row)
               ========================================= */}
            <header className="hidden lg:flex items-center justify-between px-8 py-4 w-full max-w-5xl mx-auto h-20 gap-8">

                {/* Search Bar Container - Fills available space */}
                <div className="flex-1 max-w-4xl relative">
                    <div className="relative w-full group">
                        <input
                            type="text"
                            // FIXED: Added proper syntax for the translation function
                            placeholder={t('Search Courses') || "Search courses..."}
                            className="w-full pl-6 pr-28 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-600 focus:ring-4 focus:ring-green-50/50 text-lg transition-all"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-3 pr-2">
                            {/* Camera Icon Trigger */}
                            <label className="cursor-pointer">
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                <CameraIcon className="h-6 w-6 text-gray-400 hover:text-green-600 transition-colors" />
                            </label>

                            <div className="h-6 w-[1.5px] bg-gray-300"></div>

                            {/* Search Icon Trigger */}
                            <button type="button" onClick={handleSearch}>
                                <Search className="h-6 w-6 text-gray-500 cursor-pointer hover:text-green-600 transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-6 shrink-0">
                    {/* Language Switcher Pill */}
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                        <button
                            onClick={() => handleChangeLanguage('en')}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${i18n.language === 'en' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => handleChangeLanguage('bn')}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${i18n.language === 'bn' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            BN
                        </button>
                    </div>

                    {/* Dashboard Button (Logo Removed) */}
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl text-lg font-black hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-95"
                    >
                        <UserIcon className="h-5 w-5" />
                        <span>Dashboard</span>
                    </Link>
                </div>
            </header>

            {/* =========================================
                2. MOBILE MENU BAR (Two Rows)
               ========================================= */}
            <div className="lg:hidden flex flex-col w-full bg-white">
                {/* Top Row: Menu Trigger and User Profile */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 w-full">
                    <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-xl text-gray-700">
                        <Menu className="h-8 w-8" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-100 p-1 rounded-lg text-[11px] font-black border border-gray-200">
                            <button onClick={() => handleChangeLanguage('en')} className={`px-3 py-1 rounded-md ${i18n.language === 'en' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}`}>EN</button>
                            <button onClick={() => handleChangeLanguage('bn')} className={`px-3 py-1 rounded-md ${i18n.language === 'bn' ? 'bg-white shadow-sm text-green-600' : 'text-gray-400'}`}>BN</button>
                        </div>
                        {/* Link directly to Dashboard */}
                        <Link to="/admin" className="bg-green-50 p-2.5 rounded-full text-green-600 border border-green-100 active:scale-90 transition-transform">
                            <UserIcon className="h-7 w-7" />
                        </Link>
                    </div>
                </div>

                {/* Bottom Row: Search Bar (Stretches to Full Width) */}
                <div className="px-5 py-4 bg-white w-full">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full pl-5 pr-12 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-base font-medium shadow-inner focus:outline-none focus:bg-white focus:border-green-600 transition-all"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <CameraIcon className="h-6 w-6 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================
                3. AUTH/LOGIN MODAL (Headless UI)
               ========================================= */}
            <Transition.Root show={isLoginModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[60]" initialFocus={cancelButtonRef} onClose={closeLoginModal}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-6 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl transition-all">
                                    <button onClick={closeLoginModal} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400">
                                        <X className="h-6 w-6" />
                                    </button>

                                    <h3 className="text-2xl font-black text-gray-900 mb-8">
                                        {step === 1 ? "Dashboard Access" : "Verification"}
                                    </h3>

                                    <div className="mt-4">
                                        {step === 1 ? (
                                            <>
                                                <PhoneInput
                                                    defaultCountry="BD"
                                                    value={value}
                                                    onChange={handlePhoneChange}
                                                    className="border-2 border-gray-100 p-4 rounded-2xl w-full mb-6 focus-within:border-green-600 transition-all bg-gray-50"
                                                />
                                                <button onClick={() => setStep(2)} className="w-full bg-green-600 text-white py-4 rounded-2xl text-lg font-black shadow-xl hover:bg-green-700 transition-all active:scale-95">
                                                    Continue
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex gap-4 justify-center mb-8">
                                                    {otp.map((v, i) => (
                                                        <input
                                                            key={i}
                                                            value={v}
                                                            onChange={(e) => handleOtpChange(e, i)}
                                                            className="border-2 border-gray-100 w-14 h-16 text-center rounded-2xl focus:border-green-600 outline-none text-2xl font-black bg-gray-50"
                                                            maxLength={1}
                                                        />
                                                    ))}
                                                </div>
                                                <button onClick={handleVerify} className="w-full bg-green-600 text-white py-4 rounded-2xl text-lg font-black shadow-xl hover:bg-green-700">
                                                    Verify Details
                                                </button>
                                            </>
                                        )}
                                        {errorMessage && <p className="text-red-500 text-sm mt-4 font-bold">{errorMessage}</p>}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default CourseHeader;