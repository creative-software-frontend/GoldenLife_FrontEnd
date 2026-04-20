import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
    ArrowLeft, Wallet, Landmark, Smartphone, Minus,
    UploadCloud, CheckCircle2, AlertCircle, Loader2, KeyRound, ShieldCheck, Building2, User, Clock, ArrowUpRight, X, HelpCircle
} from 'lucide-react';
import { cn } from "@/lib/utils";
import SetPinModal from '@/pages/Wallet/SetPinModal/SetPinModal';
import ConfirmWithdrawModal from '@/pages/Wallet/ConfirmWithdrawModal/ConfirmWithdrawModal';
import { useAppStore } from '@/store/useAppStore';
import type { Transaction } from '@/store/slices/walletSlice';



// Add your dynamic merchant number here
const MERCHANT_NUMBER = "01677468675";

const GATEWAY_CONFIGS: Record<string, any> = {
    bkash: {
        name: 'bKash',
        bg: 'bg-[#e2136e]', // Official bKash Pink
        text: 'text-[#e2136e]',
        steps: [
            { id: 1, text: 'Dial USSD Code', highlight: '*247#' },
            { id: 2, text: 'Select Option', highlight: '3 for Payment' },
            { id: 3, text: 'Enter Merchant No', highlight: MERCHANT_NUMBER },
            { id: 4, text: 'Enter Amount', highlight: 'Invoice Amount' },
            { id: 5, text: 'Enter Reference', highlight: 'Your Invoice No' },
            { id: 6, text: 'Enter Counter No', highlight: '1' },
            { id: 7, text: 'Confirm with PIN', highlight: 'Your bKash PIN' },
        ]
    },
    nagad: {
        name: 'Nagad',
        bg: 'bg-[#ed1c24]', // Official Nagad Red/Orange
        text: 'text-[#ed1c24]',
        steps: [
            { id: 1, text: 'Dial USSD Code', highlight: '*167#' },
            { id: 2, text: 'Select Option', highlight: '4 for Payment' },
            { id: 3, text: 'Enter Merchant No', highlight: MERCHANT_NUMBER },
            { id: 4, text: 'Enter Amount', highlight: 'Invoice Amount' },
            { id: 5, text: 'Enter Counter No', highlight: '1' },
            { id: 6, text: 'Enter Reference', highlight: 'Your Invoice No' },
            { id: 7, text: 'Confirm with PIN', highlight: 'Your Nagad PIN' },
        ]
    },
    rocket: {
        name: 'Rocket',
        bg: 'bg-[#8c1515]',
        text: 'text-[#8c1515]',
        steps: [
            { id: 1, text: 'Dial USSD Code', highlight: '*322#' },
            { id: 2, text: 'Select Option', highlight: '1 for Payment' },
            { id: 3, text: 'Enter Merchant No', highlight: MERCHANT_NUMBER },
            { id: 4, text: 'Enter Amount', highlight: 'Invoice Amount' },
            { id: 5, text: 'Enter Reference', highlight: 'Your Invoice No' },
            { id: 6, text: 'Enter Counter No', highlight: '1' },
            { id: 7, text: 'Confirm with PIN', highlight: 'Your Rocket PIN' },
        ]
    },
    bank: {
        name: 'Bank Transfer',
        bg: 'bg-blue-600',
        text: 'text-blue-600'
    }
};

const BANK_DETAILS = {
    bankName: "City Bank Limited",
    accountNumber: "123456789012",
    accountName: "Golden Life"
};

export default function VendorWithdraw() {
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    // --- Store Integration ---
    const {
        walletBalance: currentBalanceStr,
        transactions: storeTransactions,
        fetchNavbarData,
        fetchHistory,
        fetchCharges,
        withdrawCharge,
        isWalletLoading: isLoadingStore
    } = useAppStore();

    const currentBalance = Number(currentBalanceStr || 0);

    // --- Tab & History States ---
    const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>('withdraw');
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // --- Modal States ---
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);

    // --- Form State ---
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [guideTab, setGuideTab] = useState<'bkash' | 'nagad'>('bkash');

    // Gateway-Specific States
    const [mfsNumber, setMfsNumber] = useState('');
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        branchName: '',
        accountName: '',
        accountNumber: ''
    });

    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const presetAmounts: number[] = [500, 1000, 2000, 5000];

    const getAuthToken = (): string | null => {
        const session = sessionStorage.getItem("vendor_session");
        return session ? JSON.parse(session).token : null;
    };

    useEffect(() => {
        fetchNavbarData(true);
        fetchCharges();
    }, [baseURL]);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory(true);
        }
    }, [activeTab]);

    // Update local transactions when store changes
    useEffect(() => {
        setTransactions(storeTransactions.filter((t: any) => t.type === 'withdraw'));
    }, [storeTransactions]);

    // --- Helpers ---
    const getGatewayConfig = (method: string) => {
        switch (method?.toLowerCase()) {
            case 'nagad': return { name: 'Nagad', bg: 'bg-[#ed1c24]', text: 'text-[#ed1c24]', border: 'border-[#ed1c24]/20' };
            case 'bkash': return { name: 'bKash', bg: 'bg-[#e2136e]', text: 'text-[#e2136e]', border: 'border-[#e2136e]/20' };
            case 'rocket': return { name: 'Rocket', bg: 'bg-[#8c1515]', text: 'text-[#8c1515]', border: 'border-[#8c1515]/20' };
            case 'bank': return { name: 'Bank', bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-200' };
            default: return { name: method, bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-200' };
        }
    };

    // --- Validation & Open Modal ---
    const handleOpenConfirmation = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // 1. Amount Validation
        if (!amount || Number(amount) <= 0) {
            const msg = "Please enter a valid amount.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }
        const chargePercent = parseFloat(String(withdrawCharge).replace(/[^0-9.-]/g, '')) || 0;
        const chargeAmount = Number(amount) * (chargePercent / 100);
        const totalDeduction = Number(amount) + chargeAmount;

        if (totalDeduction > currentBalance) {
            const msg = `Insufficient funds! (Total including ${chargePercent}% fee: ৳${totalDeduction.toFixed(2)})`;
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        // 2. Gateway Specific Validation
        if (['bkash', 'nagad', 'rocket'].includes(paymentMethod)) {
            const isRocket = paymentMethod === 'rocket';
            const mfsRegex = isRocket ? /^01\d{9,10}$/ : /^01\d{9}$/;

            if (!mfsRegex.test(mfsNumber)) {
                const msg = `Please enter a valid ${isRocket ? '11 or 12' : '11'}-digit ${paymentMethod.toUpperCase()} number.`;
                setErrorMessage(msg);
                toast.error(msg);
                return;
            }
        } else if (paymentMethod === 'bank') {
            if (!bankDetails.bankName || !bankDetails.branchName || !bankDetails.accountName || !bankDetails.accountNumber) {
                const msg = "Please fill in all required bank details.";
                setErrorMessage(msg);
                toast.error(msg);
                return;
            }
        }

        setIsConfirmModalOpen(true);
    };

    const handleWithdrawSuccess = async (msg: string) => {
        setSuccessMessage(msg);
        toast.success(msg);
        setAmount('');
        setMfsNumber('');

        fetchNavbarData(true);
        fetchHistory(true);
    };

    const getFinalAccountDetails = () => {
        if (paymentMethod === 'bank') {
            return `${bankDetails.accountNumber} (${bankDetails.bankName} - ${bankDetails.branchName})`;
        }
        return mfsNumber;
    };

    // Instruction Modal Data
    const instructionConfig = GATEWAY_CONFIGS[paymentMethod] || GATEWAY_CONFIGS.bkash;
    const ussdSteps = instructionConfig.steps || [];

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* --- Modals --- */}
            <SetPinModal
                isOpen={isPinModalOpen}
                onClose={() => setIsPinModalOpen(false)}
                onSuccess={(msg) => {
                    setSuccessMessage(msg);
                    toast.success(msg);
                }}
                onError={(msg) => {
                    setErrorMessage(msg);
                    toast.error(msg);
                }}
            />

            <ConfirmWithdrawModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onSuccess={handleWithdrawSuccess}
                onError={(msg) => {
                    setErrorMessage(msg);
                    toast.error(msg);
                }}
                amount={amount}
                accountNumber={getFinalAccountDetails()}
                paymentMethod={paymentMethod}
                chargePercentage={parseFloat(String(withdrawCharge).replace(/[^0-9.-]/g, '')) || 0}
                currentBalance={currentBalance}
            />
            {/* --- Instruction Modal --- */}
            {showGuideModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative animate-in zoom-in-95 duration-300">

                        {/* TOP DRAG HANDLE */}
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />

                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setShowGuideModal(false)}
                            className="absolute top-6 right-6 z-20 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all active:scale-95"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* HEADER */}
                            <div className="px-8 pt-4 pb-6">
                                <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight">
                                    How to Pay
                                </h3>
                                <p className="text-sm text-slate-500 mt-1 font-medium">
                                    Follow these simple steps
                                </p>
                            </div>

                            {/* TAB SWITCHER */}
                            <div className="px-8 mb-6">
                                <div className="flex p-1 bg-slate-100/80 rounded-2xl relative">
                                    <button
                                        onClick={() => setGuideTab('bkash')}
                                        className={cn(
                                            "relative z-10 flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300",
                                            guideTab === 'bkash' ? "text-[#e2136e]" : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        {guideTab === 'bkash' && (
                                            <div className="absolute inset-0 bg-white rounded-xl shadow-sm animate-in fade-in zoom-in-95 duration-200" />
                                        )}
                                        <span className="relative z-20">bKash</span>
                                    </button>

                                    <button
                                        onClick={() => setGuideTab('nagad')}
                                        className={cn(
                                            "relative z-10 flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300",
                                            guideTab === 'nagad' ? "text-[#ed1c24]" : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        {guideTab === 'nagad' && (
                                            <div className="absolute inset-0 bg-white rounded-xl shadow-sm animate-in fade-in zoom-in-95 duration-200" />
                                        )}
                                        <span className="relative z-20">Nagad</span>
                                    </button>
                                </div>
                            </div>

                            {/* SCROLLABLE IMAGE CONTENT */}
                            <div className="flex-1 overflow-y-auto px-8 pb-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                <div className="relative">
                                    {guideTab === 'bkash' ? (
                                        <div key="bkash-img" className="animate-in slide-in-from-right-4 fade-in duration-500">
                                            <div className="rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
                                                <img
                                                    src="/image/payment/bikash_pay.png"
                                                    alt="bKash Guide"
                                                    className="w-full h-auto"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div key="nagad-img" className="animate-in slide-in-from-right-4 fade-in duration-500">
                                            <div className="rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
                                                <img
                                                    src="/image/payment/nogod_pay.png"
                                                    alt="Nagad Guide"
                                                    className="w-full h-auto"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* SECURITY BADGE */}
                                <div className="mt-8 py-4 px-6 bg-green-50/50 rounded-2xl flex items-center gap-3">
                                    <div className="bg-green-500 p-1.5 rounded-full">
                                        <ShieldCheck className="w-4 h-4 text-white" />
                                    </div>
                                    <p className="text-[11px] text-green-700 font-bold leading-tight">
                                        Secure End-to-End Payment Connection
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ACTION FOOTER */}
                        <div className="p-6 bg-white border-t border-slate-50 shrink-0">
                            <button
                                onClick={() => setShowGuideModal(false)}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
                            >
                                Got it, Thanks!
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* --- Page Header --- */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl bg-background border border-border shadow-sm hover:bg-muted text-muted-foreground transition-all">
                        <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-foreground tracking-tight">Withdraw Funds</h1>
                        <p className="text-xs font-medium text-muted-foreground mt-0.5">Wallet to Mobile / Bank</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsPinModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-xl text-xs font-bold transition-all"
                >
                    <KeyRound size={16} /> Set PIN
                </button>
            </div>

            {/* --- Tabs --- */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 shadow-inner">
                <button
                    onClick={() => setActiveTab('withdraw')}
                    className={cn(
                        "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200",
                        activeTab === 'withdraw' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    Withdraw
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={cn(
                        "flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-200",
                        activeTab === 'history' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    History
                </button>
            </div>

            {/* --- Main Content Area --- */}
            <div className="bg-background rounded-[32px] border border-border/50 shadow-xl overflow-hidden transition-all min-h-[400px]">

                {/* Balance Header (Shared across both tabs) */}
                <div className="bg-slate-50 p-6 md:p-10 border-b border-border/50">
                    <div className="flex items-center gap-5">
                        <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20">
                            <Wallet className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
                            {isLoadingStore && currentBalanceStr === "0.00" ? (
                                <div className="h-9 w-32 bg-slate-200 animate-pulse rounded-lg"></div>
                            ) : (
                                <p className="text-3xl md:text-4xl font-bold text-slate-900">৳ {currentBalance.toFixed(2)}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Withdraw Tab Content --- */}
                {activeTab === 'withdraw' && (


                    <form onSubmit={handleOpenConfirmation} className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        {successMessage && <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200 font-bold text-sm"><CheckCircle2 className="w-5 h-5" />{successMessage}</div>}
                        {errorMessage && <div className="flex items-center gap-3 p-4 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 font-bold text-sm"><AlertCircle className="w-5 h-5" />{errorMessage}</div>}

                        {/* Amount Input */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700">Withdraw Amount</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-400">৳</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        // Allow empty string (for clearing) or numbers 0 and above
                                        if (val === "" || Number(val) >= 0) {
                                            setAmount(val);
                                        }
                                    }}
                                    placeholder="0.00"
                                    min="0" /* Prevents browser step arrows from going below 0 */
                                    className="w-full pl-14 pr-6 py-6 text-5xl font-bold bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white outline-none focus:border-secondary transition-all"
                                    required
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {presetAmounts.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setAmount(preset.toString())}
                                        className={cn(
                                            "px-5 py-2 rounded-xl font-bold text-xs transition-all border",
                                            Number(amount) === preset
                                                ? 'bg-secondary text-white border-secondary'
                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        )}
                                    >
                                        ৳{preset}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Gateway Selection */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700">Select Gateway</label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (paymentMethod === 'nagad') {
                                            setGuideTab('nagad');
                                        } else {
                                            setGuideTab('bkash');
                                        }
                                        setShowGuideModal(true);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                                >
                                    <HelpCircle className="w-4 h-4" />
                                    How to Pay?
                                </button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {['bkash', 'nagad', 'rocket', 'bank'].map((method) => {
                                    const config = getGatewayConfig(method);
                                    const isComingSoon = method === 'rocket' || method === 'bank'; // Added Coming Soon Condition

                                    return (
                                        <label
                                            key={method}
                                            className={cn(
                                                "relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                                                isComingSoon
                                                    ? "border-slate-100 bg-slate-50 cursor-not-allowed opacity-60"
                                                    : paymentMethod === method
                                                        ? `border-secondary bg-secondary/5 cursor-pointer`
                                                        : "border-slate-100 bg-white hover:border-slate-200 cursor-pointer"
                                            )}
                                        >
                                            {/* Coming Soon Badge */}
                                            {isComingSoon && (
                                                <span className="absolute top-2 right-2 bg-slate-200 text-slate-600 text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                                                    Soon
                                                </span>
                                            )}

                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method}
                                                className="hidden"
                                                disabled={isComingSoon} // Disable selection for upcoming gateways
                                                onChange={(e) => {
                                                    if (!isComingSoon) {
                                                        setPaymentMethod(e.target.value);
                                                        setErrorMessage('');
                                                        setMfsNumber('');
                                                    }
                                                }}
                                                checked={paymentMethod === method}
                                            />
                                            {method === 'bank'
                                                ? <Landmark className={cn("w-6 h-6", isComingSoon ? "text-slate-400" : config.text)} />
                                                : <Smartphone className={cn("w-6 h-6", isComingSoon ? "text-slate-400" : config.text)} />
                                            }
                                            <span className={cn("text-xs font-bold uppercase", isComingSoon ? "text-slate-400" : config.text)}>
                                                {method}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Dynamic Gateway Fields */}
                        <div className="space-y-3 p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                            {['bkash', 'nagad', 'rocket'].includes(paymentMethod) ? (
                                <>
                                    <label className="text-sm font-bold text-slate-700 uppercase">{paymentMethod} Account Number</label>
                                    <div className="relative">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Smartphone size={20} /></span>
                                        <input
                                            type="tel"
                                            maxLength={paymentMethod === 'rocket' ? 12 : 11}
                                            value={mfsNumber}
                                            onChange={(e) => setMfsNumber(e.target.value.replace(/\D/g, ''))}
                                            placeholder="e.g. 017XXXXXXXX"
                                            className="w-full pl-14 pr-6 py-4 text-base font-semibold bg-white border border-slate-200 rounded-xl focus:bg-white focus:border-secondary outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <p className="text-[11px] font-medium text-slate-500">
                                        {paymentMethod === 'rocket' ? "Must be a valid 11 or 12-digit mobile number." : "Must be a valid 11-digit mobile number."}
                                    </p>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-slate-700 uppercase">Bank Account Details</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500">Bank Name</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Building2 size={16} /></span>
                                                <input type="text" value={bankDetails.bankName} onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })} placeholder="e.g. City Bank" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500">Branch Name</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Landmark size={16} /></span>
                                                <input type="text" value={bankDetails.branchName} onChange={(e) => setBankDetails({ ...bankDetails, branchName: e.target.value })} placeholder="e.g. Gulshan Branch" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500">Account Name</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><User size={16} /></span>
                                                <input type="text" value={bankDetails.accountName} onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })} placeholder="e.g. John Doe" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-500">Account Number</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><ShieldCheck size={16} /></span>
                                                <input type="text" value={bankDetails.accountNumber} onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })} placeholder="e.g. 112233445566" className="w-full pl-10 pr-4 py-3 text-sm font-semibold bg-white border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all" required />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>


                        <button type="submit" disabled={!amount} className="w-full py-5 bg-secondary hover:bg-secondary/90 text-white rounded-2xl font-bold text-xl shadow-lg shadow-secondary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                            Submit Withdrawal Request
                        </button>
                    </form>
                )}

                {/* --- History Tab Content --- */}
                {activeTab === 'history' && (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300 w-full">
                        {isLoadingHistory ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                <p className="text-sm font-medium">Loading history...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 m-4 md:m-6 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <Clock className="w-12 h-12 mb-4 text-slate-300" />
                                <p className="text-sm font-medium">No transactions found.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-[24px] md:rounded-3xl border border-slate-100 overflow-hidden shadow-sm">

                                {/* Header Section */}
                                <div className="flex flex-row items-center justify-between md:justify-start gap-4 px-5 py-5 md:px-8 md:py-6 border-b border-slate-100">
                                    <h2 className="text-sm font-black text-slate-600 tracking-wider uppercase">Withdrawal History</h2>
                                    <span className="px-3 py-1 bg-[#eef7f2] text-[#6cb28d] text-[10px] font-bold rounded-full tracking-wider uppercase shrink-0">
                                        {transactions.length} Records
                                    </span>
                                </div>

                                {/* Table Column Headers - Hidden on Mobile */}
                                <div className="hidden md:grid grid-cols-4 gap-4 px-8 py-4 border-b border-slate-100 bg-white text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                                    <div>Details</div>
                                    <div className="text-center">Method</div>
                                    <div className="text-center">Status</div>
                                    <div className="text-right">Timestamp</div>
                                </div>

                                {/* Transactions List */}
                                <div className="p-4 md:p-6 space-y-3 md:space-y-4 bg-[#f8fafc]">
                                    {transactions.map((trx, idx) => (
                                        <div key={trx.id || idx} className="grid grid-cols-2 md:grid-cols-4 items-center gap-y-4 gap-x-2 md:gap-4 p-4 border border-slate-100 rounded-[20px] bg-white shadow-sm hover:shadow-md transition-shadow">

                                            {/* 1. Details Column (Top Left on Mobile) */}
                                            <div className="order-1 flex items-center gap-3 md:gap-4">
                                                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-[14px] md:rounded-2xl bg-[#fff4eb] flex items-center justify-center text-[#f48120]">
                                                    <Minus className="w-4 h-4 md:w-5 md:h-5 stroke-[3]" />
                                                </div>
                                                <div>
                                                    <p className="text-base md:text-lg font-black text-[#0f172a] leading-none mb-1 md:mb-1.5">
                                                        ৳{Number(trx.amount).toFixed(2)}
                                                    </p>
                                                    <p className="text-[10px] md:text-[11px] font-medium text-slate-400 uppercase line-clamp-1">
                                                        ID: {trx.invoice_number || `WTD${idx.toString().padStart(3, '0')}`}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* 3. Status Column (Moved to Top Right on Mobile via order-2) */}
                                            <div className="order-2 md:order-3 flex items-center justify-end md:justify-center">
                                                <span className={cn(
                                                    "px-3 py-1 md:px-4 md:py-1.5 text-[10px] font-bold text-white rounded-full uppercase tracking-wider",
                                                    trx.status === 'completed' || trx.status === 'success' ? "bg-[#10b981]" :
                                                        trx.status === 'pending' ? "bg-[#f48120]" : "bg-[#ef4444]"
                                                )}>
                                                    {trx.status}
                                                </span>
                                            </div>

                                            {/* 2. Method Column (Moved to Bottom Left on Mobile via order-3) */}
                                            <div className="order-3 md:order-2 flex flex-col items-start md:items-center justify-center">
                                                <span className="px-2.5 py-1 bg-[#f1f5f9] text-[#334155] text-[10px] font-bold rounded-md uppercase mb-1 md:mb-1.5">
                                                    {trx.payment_method}
                                                </span>
                                                <span className="text-[11px] md:text-[12px] font-medium text-[#64748b] truncate max-w-full">
                                                    {trx.number || 'N/A'}
                                                </span>
                                            </div>

                                            {/* 4. Timestamp Column (Bottom Right on Mobile) */}
                                            <div className="order-4 flex flex-col items-end text-right">
                                                <p className="text-[13px] md:text-sm font-bold text-[#0f172a] mb-1 md:mb-1.5">
                                                    {new Date(trx.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                                </p>
                                                <div className="flex items-center gap-1 md:gap-1.5 text-[11px] md:text-[12px] font-medium text-slate-400">
                                                    <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                    {new Date(trx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>

                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}