import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft, Wallet, Smartphone, ShieldCheck,
    Loader2, AlertCircle, History, Plus, Clock, Building2,
    HelpCircle, X, CheckCircle2, Image as ImageIcon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'react-toastify';
import { useAppStore } from '@/store/useAppStore';
import { baseURL, getAuthToken } from '@/store/utils';

export default function WalletAdd() {
    const navigate = useNavigate();
    // Updated translation hook based on your request
    const { t } = useTranslation('global');

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    // --- State Management ---
    const [activeTab, setActiveTab] = useState<'add' | 'history'>('add');
    const [amount, setAmount] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('bkash');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [trxId, setTrxId] = useState<string>('');
    const [attachment, setAttachment] = useState<File | null>(null);


    // Status States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showGuideModal, setShowGuideModal] = useState(false); // Modal state
    const [guideTab, setGuideTab] = useState<'bkash' | 'nagad'>('bkash');

    const presetAmounts = [500, 1000, 2000, 5000];
    const paymentMethods = [
        { id: 'bkash', label: 'bKash', icon: <Smartphone className="w-6 h-6 mb-1" />, active: true },
        { id: 'nagad', label: 'Nagad', icon: <Smartphone className="w-6 h-6 mb-1" />, active: true },
        { id: 'rocket', label: 'Rocket', icon: <Smartphone className="w-6 h-6 mb-1" />, active: false },
        { id: 'bank', label: 'Bank', icon: <Building2 className="w-6 h-6 mb-1" />, active: false }
    ];

    // --- Helpers ---
    const walletBalance = useAppStore(s => s.walletBalance);
    const isWalletLoading = useAppStore(s => s.isWalletLoading);
    const fetchWallet = useAppStore(s => s.fetchWallet);
    const transactions = useAppStore(s => s.transactions);
    const fetchHistory = useAppStore(s => s.fetchHistory);

    useEffect(() => {
        fetchWallet(); // Ensure this is called on mount!
    }, []);

    // Fetch history when switching to history tab
    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab]);

    // --- Form State ---




    // --- Dynamic Input Validation ---
    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        val = val.replace(/(?!^\+)[^\d]/g, '');

        let maxLength = 11;
        if (val.startsWith('+')) {
            maxLength = 15;
        } else if (val.startsWith('880')) {
            maxLength = 13;
        }

        if (val.length > maxLength) {
            val = val.slice(0, maxLength);
        }

        setAccountNumber(val);
        if (error) setError(null);
    };

    // --- Form Submission Validation ---
    const validateForm = (): boolean => {
        setError(null);
        const numAmount = Number(amount);

        if (isNaN(numAmount) || numAmount <= 0) {
            setError(t('error_invalid_amount', "Please enter a valid amount."));
            return false;
        }

        if (paymentMethod !== 'bank') {
            const mobileRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
            if (!mobileRegex.test(accountNumber)) {
                setError(t('error_invalid_number', "Invalid sender number. Use format: 01XXXXXXXXX"));
                return false;
            }
        }

        if (trxId.trim().length < 6) {
            setError(t('error_invalid_trx', "Transaction ID seems too short (minimum 6 characters)."));
            return false;
        }

        return true;
    };

    // --- Submission Logic ---
    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return; // Use the validation function

        setIsSubmitting(true);
        setError(null);

        try {
            const token = getAuthToken();
            const formData = new FormData();

            // Append all fields
            formData.append('type', 'add');
            formData.append('amount', amount);
            formData.append('number', accountNumber);
            formData.append('Transaction_ID', trxId.toUpperCase());
            formData.append('payment_method', paymentMethod);

            if (attachment) {
                formData.append('attachment', attachment);
            }

            const { data } = await axios.post(`${baseURL}/api/transactions`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // 🚨 REMOVED 'Content-Type': 'application/json' so the browser can set multipart/form-data properly for the file upload.
                }
            });

            if (data?.status === 'success' || data?.status === "true" || data?.success === true) {
                const msg = data.message || t('success_request_submitted', "Request submitted successfully!");
                setSuccess(msg);
                toast.success(msg);

                // Clear Form
                setAmount('');
                setAccountNumber('');
                setTrxId('');
                setAttachment(null);

                // 4. Update the Zustand Store (Silent fetch for balance so the UI doesn't flash)
                await fetchWallet(true); // This updates the balance everywhere

                // If on history tab, refresh history too
                if (activeTab === 'history') {
                    await fetchHistory();
                }




            } else {
                const msg = data?.message || "Failed to submit request.";
                setError(msg);
                toast.error(msg);
            }
        } catch (err: any) {
            console.error("Top-up Error:", err);
            setError(err.response?.data?.message || t('error_server', "Internal server error."));
        } finally {
            setIsSubmitting(false);
        }
    };
    // --- Modal Configuration Helpers ---
    const getGatewayConfig = () => {
        switch (paymentMethod) {
            case 'nagad':
                return {
                    name: 'Nagad',
                    bg: 'bg-[#f7931e]',
                    text: 'text-[#f7931e]',
                    border: 'border-[#f7931e]/20',
                    ussd: '*167#'
                };
            case 'bkash':
                return {
                    name: 'bKash',
                    bg: 'bg-[#e2136e]',
                    text: 'text-[#e2136e]',
                    border: 'border-[#e2136e]/20',
                    ussd: '*247#'
                };
            case 'bank':
                return {
                    name: 'Bank',
                    bg: 'bg-blue-600',
                    text: 'text-blue-600',
                    border: 'border-blue-200',
                    ussd: ''
                };
            default:
                return { name: paymentMethod, bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-200', ussd: '' };
        }
    };

    const gatewayConfig = getGatewayConfig();

    const ussdSteps = [
        { id: 1, text: t('instruction_step_1', 'Dial USSD to start'), highlight: gatewayConfig.ussd },
        { id: 2, text: t('instruction_step_2', 'Press to select Payment'), highlight: '4 (Payment)' }, // Adjusted generally for bKash/Nagad
        { id: 3, text: t('instruction_step_3', 'Enter Merchant No'), highlight: '01XXXXXXXXX' },
        { id: 4, text: t('instruction_step_4', 'Enter Amount'), highlight: 'XXXX' },
        { id: 5, text: t('instruction_step_5', 'Enter Reference'), highlight: '1' },
        { id: 6, text: t('instruction_step_6', 'Enter Counter Number'), highlight: '1' },
        { id: 7, text: t('instruction_step_7', 'Enter PIN to confirm'), highlight: 'Your PIN' },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm text-slate-500">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{t('wallet_portal', 'Wallet Portal')}</h1>
                    <p className="text-slate-500">{t('wallet_subtitle', 'Securely top up your account balance')}</p>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1.5 bg-slate-100 rounded-3xl mb-8 border border-slate-200">
                {(['add', 'history'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all",
                            activeTab === tab ? "bg-white shadow-md text-slate-900" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {tab === 'add' ? <Plus className="w-4 h-4" /> : <History className="w-4 h-4" />}
                        {tab === 'add' ? t('tab_add_money', 'Add Money') : t('tab_history', 'History')}
                    </button>
                ))}
            </div>

            {activeTab === 'add' ? (
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 p-8 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Icon Container */}
                                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-white">
                                    <Wallet className="w-6 h-6" />
                                </div>

                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                        {t('current_balance', 'Balance')}
                                    </p>

                                    {/* Integrated Loading Logic */}
                                    {isWalletLoading ? (
                                        <div className="h-8 w-32 bg-slate-200 animate-pulse rounded-lg mt-1"></div>
                                    ) : (
                                        <p className="text-2xl font-bold text-slate-900">
                                            ৳ {walletBalance}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleAddFunds} className="p-8 space-y-8">
                            {success && <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200 font-bold text-sm"><CheckCircle2 className="w-5 h-5" />{success}</div>}
                            {/* Amount Section */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700">Enter Amount</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">৳</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={amount}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // Prevents entering negative numbers or starting with multiple zeros
                                            if (Number(val) < 0) return;
                                            setAmount(val);
                                        }}
                                        placeholder="0.00"
                                        className="w-full pl-12 pr-6 py-5 text-4xl font-bold bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-secondary outline-none transition-all"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {presetAmounts.map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setAmount(p.toString())}
                                            className={cn(
                                                "px-4 py-2 rounded-xl border text-sm font-bold transition-all",
                                                Number(amount) === p
                                                    ? "bg-secondary text-white border-secondary"
                                                    : "bg-white text-slate-600 hover:border-slate-300"
                                            )}
                                        >
                                            + ৳{p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Gateway Selection & Guide Button */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-700">{t('select_gateway', 'Select Gateway')}</label>

                                    {/* HOW TO PAY BUTTON */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Smart feature: auto-select the tab based on the chosen gateway
                                            if (paymentMethod === 'nagad') {
                                                setGuideTab('nagad');
                                            } else {
                                                setGuideTab('bkash'); // Defaults to bKash for anything else
                                            }
                                            setShowGuideModal(true);
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        <HelpCircle className="w-4 h-4" />
                                        {t('how_to_pay', 'How to Pay?')}
                                    </button>
                                </div>

                                {/* UPDATED GATEWAY BUTTONS */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {paymentMethods.map((method) => {
                                        // Set specific brand colors for the icons and text
                                        let brandColorClass = "text-slate-400";
                                        if (method.id === 'bkash') brandColorClass = "text-[#e2136e]"; // bKash Pink
                                        if (method.id === 'nagad') brandColorClass = "text-[#ed1c24]"; // Nagad Red
                                        if (method.id === 'rocket') brandColorClass = "text-[#8c3494]"; // Rocket Purple
                                        if (method.id === 'bank') brandColorClass = "text-blue-600"; // Bank Blue

                                        return (
                                            <label
                                                key={method.id}
                                                className={cn(
                                                    "relative flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-2xl border-2 transition-all uppercase text-[12px] font-black overflow-hidden bg-white",
                                                    !method.active
                                                        ? "opacity-50 cursor-not-allowed border-slate-100 text-slate-300"
                                                        : cn("cursor-pointer", brandColorClass),
                                                    paymentMethod === method.id && method.active
                                                        ? "border-green-600 bg-green-50/30" // Green active border from your screenshot
                                                        : "border-slate-100 hover:border-slate-200 shadow-sm"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    disabled={!method.active}
                                                    onChange={() => setPaymentMethod(method.id)}
                                                    checked={paymentMethod === method.id}
                                                />
                                                <div className="mb-1 transform scale-110">
                                                    {method.icon}
                                                </div>
                                                {method.label}

                                                {!method.active && (
                                                    <span className="absolute top-2 right-2 bg-slate-100 text-slate-400 px-2 py-0.5 rounded-md text-[10px] tracking-normal normal-case font-bold">Soon</span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Input Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">
                                        {paymentMethod === 'bank' ? t('reference_account', 'Reference/Account') : t('sender_number', 'Sender Number')}
                                    </label>
                                    <input
                                        type="text"
                                        value={accountNumber}
                                        onChange={paymentMethod === 'bank' ? (e) => setAccountNumber(e.target.value) : handlePhoneInput}
                                        placeholder={paymentMethod === 'bank' ? t('account_no', "Account No") : "01XXXXXXXXX"}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">{t('transaction_id', 'Transaction ID')}</label>
                                    <input
                                        type="text"
                                        value={trxId}
                                        onChange={(e) => setTrxId(e.target.value)}
                                        placeholder="TRX-XXXXXX"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary outline-none uppercase transition-all"
                                    />
                                </div>
                            </div>

                            {/* Attachment Section */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700">Attachment (Optional Proof Image)</label>
                                <div
                                    className={cn(
                                        "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl transition-all cursor-pointer group",
                                        attachment ? "border-secondary bg-secondary/5" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                                    )}
                                    onClick={() => document.getElementById('wallet-add-attachment')?.click()}
                                >
                                    {attachment ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                                                <ImageIcon className="w-8 h-8" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-700">{attachment.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Click to change file</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-slate-200 rounded-2xl text-slate-400 group-hover:bg-slate-300 group-hover:text-slate-500 transition-colors">
                                                <Plus className="w-8 h-8" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-500">Click to upload proof image</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">JPG, PNG, PDF up to 5MB</p>
                                        </div>
                                    )}
                                    <input
                                        id="wallet-add-attachment"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setAttachment(file);
                                        }}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            {/* Feedback & Submit */}
                            <div className="space-y-5 pt-5">
                                {/* ─── Messages ──────────────────────────────────────────────── */}
                                {error && (
                                    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-semibold text-red-700 shadow-sm">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}



                                {/* ─── Submit Button ─────────────────────────────────────────── */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
      flex w-full items-center justify-center gap-3 
      rounded-2xl bg-secondary px-6 py-5 
      text-xl font-bold text-white 
      shadow-lg transition-all
      hover:brightness-110 hover:shadow-xl
      focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:ring-offset-2
      disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100 disabled:hover:shadow-lg
    `}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        t('btn_submit_request', 'Submit Top Up Request')
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                /* History Tab */
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px] w-full overflow-hidden">
                    <div className="flex items-center justify-between px-12 py-6 bg-slate-50/50 border-b border-slate-100">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                            {t('transaction_history', 'Transaction History')}
                            {!isWalletLoading && (
                                <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px]">
                                    {transactions.filter(t => t.type === 'add').length} {t('records_found', 'Records Found')}
                                </span>
                            )}
                        </h3>
                    </div>

                    <div className="hidden md:grid grid-cols-4 gap-4 px-12 py-4 border-b border-slate-100 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <div>{t('table_col_details', 'Details')}</div>
                        <div className="text-center">{t('table_col_method', 'Method')}</div>
                        <div className="text-center">{t('table_col_status', 'Status')}</div>
                        <div className="text-right">{t('table_col_time', 'Timestamp')}</div>
                    </div>

                    {isWalletLoading ? (
                        <div className="p-4 md:p-8 space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="group p-5 md:px-10 md:py-6 border border-slate-100 rounded-[2rem] grid grid-cols-1 md:grid-cols-4 items-center gap-4 bg-white shadow-sm">
                                    <div className="flex items-center gap-5">
                                        <Skeleton className="h-14 w-14 rounded-2xl shrink-0" />
                                        <div className="flex flex-col gap-2">
                                            <Skeleton className="h-6 w-24" />
                                            <Skeleton className="h-3 w-32" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:items-center gap-2">
                                        <Skeleton className="h-5 w-16 rounded-lg" />
                                        <Skeleton className="h-3 w-28" />
                                    </div>
                                    <div className="flex md:justify-center">
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : transactions.filter(t => t.type === 'add').length === 0 ? (
                        <div className="text-center py-32">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <History className="w-12 h-12 text-slate-200" />
                            </div>
                            <p className="text-slate-400 font-bold uppercase text-sm">{t('no_records_found', 'No transaction records found')}</p>
                        </div>
                    ) : (
                        <div className="p-4 md:p-8 space-y-3">
                            {transactions.filter(t => t.type === 'add').map((item) => (
                                <div
                                    key={item.id}
                                    className="group p-5 md:px-10 md:py-6 border border-slate-100 rounded-[2rem] grid grid-cols-1 md:grid-cols-4 items-center gap-4 hover:border-secondary/30 hover:bg-slate-50/30 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors",
                                            item.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                        )}>
                                            <Plus className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900 leading-none">৳{item.amount}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter">ID: {item.Transaction_ID || 'PENDING'}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:items-center">
                                        <span className="text-[10px] font-black text-slate-700 uppercase px-3 py-1 bg-slate-100 rounded-lg w-fit">
                                            {item.payment_method}
                                        </span>
                                        <p className="text-[11px] font-medium text-slate-500 mt-1">{item.number}</p>
                                    </div>

                                    <div className="flex md:justify-center">
                                        <span className={cn(
                                            "px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm transition-all",
                                            item.status === 'approved' ? "bg-green-500 text-white" : "bg-orange-400 text-white"
                                        )}>
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <p className="text-sm font-bold text-slate-800">
                                            {new Date(item.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- INSTRUCTION MODAL --- */}
            {showGuideModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative animate-in zoom-in-95 duration-300">

                        {/* TOP DRAG HANDLE (Visual Only for Modern Look) */}
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
                                    {t('how_to_pay_title', 'How to Pay')}
                                </h3>
                                <p className="text-sm text-slate-500 mt-1 font-medium">
                                    {t('select_method_guide', 'Follow these simple steps')}
                                </p>
                            </div>

                            {/* MODERN TAB SWITCHER */}
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

                            {/* SCROLLABLE IMAGE CONTENT WITH ANIMATION */}
                            <div className="flex-1 overflow-y-auto px-8 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                                        {t('secure_payment_note', 'Secure End-to-End Payment Connection')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ACTION FOOTER */}
                        <div className="p-6 bg-white border-t border-slate-50">
                            <button
                                onClick={() => setShowGuideModal(false)}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
                            >
                                {t('btn_close', 'Got it, Thanks!')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}