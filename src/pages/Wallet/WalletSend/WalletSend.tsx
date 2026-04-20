import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Wallet, Send, User,
    CheckCircle2, AlertCircle, KeyRound, ArrowRight, Search, Loader2, Mail, Phone, Clock, Plus, Minus, History
} from 'lucide-react';

// Import our newly separated modals
import { useAppStore } from '@/store/useAppStore';
import { Transaction } from '@/store/slices/walletSlice';
import SetPinModal from '../SetPinModal/SetPinModal';
import ConfirmTransferModal from '../ConfirmTransferModal/ConfirmTransferModal';
import { toast } from 'react-toastify';

// --- Interface for the Verified User ---
interface VerifiedUserData {
    type: string;
    name: string;
    email: string;
    display_id: string;
    mobile: string;
    image: string;
}

export default function WalletSend() {
    const navigate = useNavigate();
    const {
        walletBalance: storeWalletBalance,
        transactions: storeTransactions,
        isWalletLoading: isLoadingBalance,
        fetchWallet,
        fetchHistory,
        searchReceiver,
        sendMoneyCharge,
        fetchCharges
    } = useAppStore();

    // --- Tabs State ---
    const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');

    // --- Transfer Form State ---
    const [amount, setAmount] = useState<string>('');
    const [affiliateId, setAffiliateId] = useState<string>('');
    const [receiverType, setReceiverType] = useState<string>('');

    // --- Verification State ---
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [verifiedUser, setVerifiedUser] = useState<VerifiedUserData | null>(null);
    const [verifyError, setVerifyError] = useState<string>('');
    const [imageFailed, setImageFailed] = useState<boolean>(false);

    // --- UI & Modals State ---
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [showSetPinModal, setShowSetPinModal] = useState<boolean>(false);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

    const storeSendMoneyCharge = useAppStore(s => s.sendMoneyCharge);
    
    const currentBalance = parseFloat(String(storeWalletBalance).replace(/[^0-9.-]/g, '')) || 0;
    const chargePercent = parseFloat(String(storeSendMoneyCharge).replace(/[^0-9.-]/g, '')) || 0;
    const presetAmounts: number[] = [100, 500, 1000, 2000];

    useEffect(() => {
        fetchWallet();
        fetchHistory();
        fetchCharges();
    }, [fetchWallet, fetchHistory, fetchCharges]);

    // --- 2. Verify User Using Store ---
    const handleVerifyUser = async () => {
        if (!affiliateId) {
            setVerifyError("Please enter an Affiliate ID first.");
            return;
        }

        setIsVerifying(true);
        setVerifyError('');
        setVerifiedUser(null);
        setReceiverType('');
        setImageFailed(false);

        try {
            const result = await searchReceiver(affiliateId);
            if (result.success && result.data) {
                const userData = result.data;

                // Improved detection: prioritize 'type', then 'role', default to 'student'
                // Also ensure we trim() to prevent hidden whitespace issues
                const foundType = (userData?.type || userData?.role || "student").toLowerCase().trim();

                setVerifiedUser({
                    type: foundType,
                    name: userData?.name || "Verified User",
                    email: userData?.email || "",
                    display_id: userData?.display_id || "",
                    mobile: userData?.mobile || "",
                    image: userData?.image || ""
                });
                console.log(foundType);


                // Set this as a backup
                setReceiverType(foundType);
            } else {
                setVerifyError(result.message || "User not found.");
            }
        } catch (error: any) {
            setVerifyError(error.message || "Unable to verify user.");
        } finally {
            setIsVerifying(false);
        }
    };

    useEffect(() => {
        setVerifiedUser(null);
        setVerifyError('');
        setReceiverType('');
        setImageFailed(false);
    }, [affiliateId]);

    // Derived Transactions
    const transactions = React.useMemo(() => {
        return storeTransactions.filter((t: Transaction) => t.type === 'send' || t.type === 'transfer_out');
    }, [storeTransactions]);

    const isLoadingHistory = isLoadingBalance; // Simplified loading tie-in

    // --- 3. Modal Handlers ---
    const handleSuccess = (message: string) => {
        setErrorMessage('');
        setSuccessMessage(message);
        toast.success(message);
    };

    const handleTransferSuccess = async (message: string) => {
        setErrorMessage('');
        setSuccessMessage(message);
        setAmount('');
        setAffiliateId('');
        setVerifiedUser(null);
    };

    const handleError = (message: string) => {
        setSuccessMessage('');
        setErrorMessage(message);
        toast.error(message);
    };

    const triggerPinConfirmation = (e: React.FormEvent) => {
        e.preventDefault();

        const chargeAmount = Number(amount) * (chargePercent / 100);
        const totalDeduction = Number(amount) + chargeAmount;

        if (totalDeduction > currentBalance) {
            const msg = `Insufficient funds! (Total including ${chargePercent}% fee: ৳${totalDeduction.toFixed(2)})`;
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        if (!verifiedUser) {
            const msg = "Please verify the receiver first.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        setShowConfirmModal(true);
    };

    // --- Helper Components ---
    const getStatusBadge = (status: string) => {
        const normalizedStatus = status?.toUpperCase() || 'COMPLETED';
        switch (normalizedStatus) {
            case 'PENDING':
                return <span className="bg-orange-400 text-white px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider">PENDING</span>;
            case 'COMPLETED':
            case 'APPROVED':
            case 'SUCCESS':
                return <span className="bg-emerald-500 text-white px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider">{normalizedStatus}</span>;
            case 'FAILED':
            case 'REJECTED':
                return <span className="bg-destructive text-white px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider">{normalizedStatus}</span>;
            default:
                return <span className="bg-slate-400 text-white px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider">{normalizedStatus}</span>;
        }
    };

    // Helper to format dates if api sends created_at instead of date/time
    const formatDate = (tx: Transaction) => {
        if (tx.date) return tx.date;
        if (tx.created_at) return new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return 'N/A';
    };

    const formatTime = (tx: Transaction) => {
        if (tx.time) return tx.time;
        if (tx.created_at) return new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return '';
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* --- Modals --- */}
            <SetPinModal
                isOpen={showSetPinModal}
                onClose={() => setShowSetPinModal(false)}
                onSuccess={handleSuccess}
                onError={handleError}
            />
            <ConfirmTransferModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onSuccess={handleTransferSuccess}
                onError={(msg) => toast.error(msg)}

                // Pass values directly to ensure no empty strings are sent
                amount={Number(amount)}

                // FIX: Pull type directly from verifiedUser first, fallback to receiverType
                receiver_type={verifiedUser?.type || receiverType}

                affiliate_id={affiliateId}
                type="send"
                chargePercentage={chargePercent}
                currentBalance={currentBalance}
            />

            {/* --- Main Page Header --- */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-background border border-border shadow-sm hover:bg-muted hover:border-border/80 text-muted-foreground hover:text-foreground transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight">Wallet</h1>
                        <p className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] md:tracking-[0.2em] mt-0.5 md:mt-1 flex items-center gap-1.5 md:gap-2">
                            Dashboard <ArrowRight className="w-3 h-3" strokeWidth={3} /> {activeTab === 'send' ? 'Send Money' : 'History'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowSetPinModal(true)}
                    className="flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                >
                    <KeyRound className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} /> Set PIN
                </button>
            </div>

            {/* --- Tabs --- */}
            <div className="flex p-1.5 bg-muted/50 rounded-[18px] w-fit mb-6 md:mb-8 border border-border/50">
                <button
                    onClick={() => setActiveTab('send')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'send' ? 'bg-background text-foreground shadow-sm shadow-black/5' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
                >
                    <Send className="w-4 h-4" strokeWidth={2.5} /> Send Money
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'history' ? 'bg-background text-foreground shadow-sm shadow-black/5' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
                >
                    <History className="w-4 h-4" strokeWidth={2.5} /> History
                </button>
            </div>

            {/* --- Main Content Card --- */}
            <div className="bg-background rounded-[24px] md:rounded-[32px] border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all">

                {activeTab === 'send' && (
                    <div className="animate-in fade-in duration-300">
                        {/* Modern Balance Header */}
                        <div className="bg-gradient-to-br from-secondary/10 to-background p-5 md:p-8 border-b border-border/50 flex items-center justify-between relative overflow-hidden">
                            <div className="relative z-10 flex items-center gap-4 md:gap-5">
                                <div className="flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-[16px] md:rounded-[20px] bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25">
                                    <Wallet className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="text-xs md:text-sm font-bold text-muted-foreground uppercase tracking-wider mb-0.5 md:mb-1">Available Balance</p>
                                    {isLoadingBalance ? (
                                        <div className="h-7 md:h-9 w-28 md:w-36 bg-foreground/10 animate-pulse rounded-md mt-1"></div>
                                    ) : (
                                        <p className="text-2xl md:text-3xl font-black text-foreground tracking-tight animate-in fade-in duration-300">
                                            ৳ {currentBalance.toFixed(2)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="absolute right-0 top-0 w-24 h-24 md:w-32 md:h-32 bg-secondary/10 rounded-full blur-2xl md:blur-3xl -mr-8 -mt-8 md:-mr-10 md:-mt-10"></div>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={triggerPinConfirmation} className="p-5 md:p-8 space-y-6 md:space-y-8">

                            {/* Status Messages */}
                            {successMessage && (
                                <div className="flex items-center gap-3 p-3 md:p-4 bg-secondary/10 text-secondary rounded-xl md:rounded-2xl border border-secondary/20 animate-in fade-in zoom-in-95">
                                    <CheckCircle2 className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                                    <p className="text-xs md:text-sm font-bold">{successMessage}</p>
                                </div>
                            )}
                            {errorMessage && (
                                <div className="flex items-center gap-3 p-3 md:p-4 bg-destructive/10 text-destructive rounded-xl md:rounded-2xl border border-destructive/20 animate-in fade-in zoom-in-95">
                                    <AlertCircle className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                                    <p className="text-xs md:text-sm font-bold">{errorMessage}</p>
                                </div>
                            )}

                            {/* Receiver Affiliate ID & Find Button */}
                            <div className="space-y-2 md:space-y-2.5">
                                <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest flex items-center justify-between">
                                    <span>Receiver Affiliate ID</span>
                                    {verifyError && <span className="text-destructive normal-case tracking-normal font-bold">{verifyError}</span>}
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <User className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                                        </span>
                                        <input
                                            type="text"
                                            value={affiliateId}
                                            onChange={(e) => setAffiliateId(e.target.value)}
                                            placeholder="e.g. 123456"
                                            className="w-full pl-11 pr-4 py-3 md:pl-14 md:pr-5 md:py-4 text-sm md:text-base font-bold text-foreground bg-muted/50 border-2 border-transparent rounded-xl md:rounded-2xl focus:bg-background focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all placeholder:text-muted-foreground/40"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleVerifyUser}
                                        disabled={!affiliateId || isVerifying}
                                        className="w-full sm:w-auto px-5 md:px-8 py-3 md:py-0 bg-foreground hover:bg-foreground/90 text-background rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isVerifying ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Search className="w-4 h-4 md:w-5 md:h-5" />}
                                        <span>Find User</span>
                                    </button>
                                </div>

                                {/* Verified User Details Card */}
                                {verifiedUser && (
                                    <div className="mt-4 p-4 md:p-5 bg-secondary/5 border-2 border-secondary/20 rounded-[20px] flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-5 animate-in fade-in zoom-in-95 relative overflow-hidden">

                                        {/* Absolute "Verified" Badge */}
                                        <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground text-[9px] md:text-[10px] font-black uppercase px-3 py-1.5 rounded-bl-xl flex items-center gap-1.5 shadow-sm">
                                            <CheckCircle2 size={12} strokeWidth={3} /> Verified
                                        </div>

                                        <div className="relative shrink-0 pt-2 sm:pt-0">
                                            {!imageFailed && verifiedUser.image ? (
                                                <img
                                                    src={verifiedUser.image}
                                                    alt={verifiedUser.name}
                                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-background shadow-md bg-muted"
                                                    onError={() => setImageFailed(true)}
                                                />
                                            ) : (
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-background shadow-md bg-secondary/10 flex items-center justify-center text-secondary font-black text-2xl md:text-3xl uppercase">
                                                    {verifiedUser.name ? verifiedUser.name.charAt(0) : <User size={24} />}
                                                </div>
                                            )}

                                            {/* Green Online Dot */}
                                            <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-emerald-500 border-[3px] border-background rounded-full shadow-sm"></div>
                                        </div>

                                        {/* User Details */}
                                        <div className="flex-1 text-center sm:text-left pt-1">
                                            <h4 className="text-lg md:text-xl font-black text-foreground leading-tight">{verifiedUser.name}</h4>
                                            <p className="text-[11px] md:text-xs font-bold text-secondary uppercase tracking-widest mt-1 mb-2.5">
                                                {verifiedUser.type} Profile
                                            </p>

                                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-xs md:text-sm font-medium text-muted-foreground">
                                                {verifiedUser.mobile && (
                                                    <span className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg border border-border shadow-sm">
                                                        <Phone size={14} className="text-secondary" /> {verifiedUser.mobile}
                                                    </span>
                                                )}
                                                {verifiedUser.email && (
                                                    <span className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-lg border border-border shadow-sm">
                                                        <Mail size={14} className="text-secondary" /> <span className="truncate max-w-[150px] md:max-w-[200px]">{verifiedUser.email}</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Amount Section */}
                            <div className="space-y-2 md:space-y-3 pt-2 md:pt-4">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] md:text-[11px] font-black text-muted-foreground uppercase tracking-widest">Transfer Amount</label>
                                    {Number(amount) > currentBalance && !isLoadingBalance && <span className="text-[10px] md:text-xs font-black text-destructive animate-pulse">Exceeds Balance</span>}
                                </div>
                                <div className="relative group">
                                    <span className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-2xl md:text-3xl font-black text-muted-foreground group-focus-within:text-foreground transition-colors">৳</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className={`w-full pl-11 pr-4 py-3.5 md:pl-14 md:pr-6 md:py-5 text-3xl md:text-4xl font-black bg-muted/50 border-2 rounded-[20px] md:rounded-3xl focus:bg-background transition-all outline-none placeholder:text-muted-foreground/30 ${Number(amount) > currentBalance && !isLoadingBalance ? 'border-destructive/50 focus:border-destructive focus:ring-4 focus:ring-destructive/10 text-destructive' : 'border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 text-foreground'}`}
                                        required
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2 md:gap-2.5 pt-2 md:pt-3">
                                    {presetAmounts.map((preset) => {
                                        const isSelected = Number(amount) === preset;
                                        return (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => setAmount(preset.toString())}
                                                disabled={isLoadingBalance || preset > currentBalance}
                                                className={`px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-[14px] font-bold text-xs md:text-sm transition-all border-2 
                                                    ${isSelected
                                                        ? 'bg-secondary text-secondary-foreground border-secondary shadow-md shadow-secondary/20'
                                                        : 'bg-background border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50'
                                                    } 
                                                    disabled:opacity-40 disabled:hover:bg-background disabled:hover:border-border disabled:cursor-not-allowed`}
                                            >
                                                ৳{preset}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Submit Button Container */}
                            <div className="pt-4 md:pt-6">
                                <button
                                    type="submit"
                                    disabled={!amount || Number(amount) <= 0 || !verifiedUser || isLoadingBalance || Number(amount) > currentBalance}
                                    className="w-full group flex items-center justify-center gap-2 md:gap-2.5 py-4 md:py-[18px] bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl md:rounded-2xl font-black text-base md:text-lg tracking-wide shadow-xl shadow-secondary/25 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                                >
                                    <Send className="w-5 h-5 md:w-[22px] md:h-[22px] group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                                    Proceed to Verify
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* --- History View --- */}
                {activeTab === 'history' && (
                    <div className="p-4 md:p-8 animate-in fade-in duration-300 w-full">
                        {/* Header Area */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-8">
                            <div className="flex items-center gap-3 md:gap-4">
                                <h2 className="text-sm md:text-base font-black text-slate-500 uppercase tracking-widest">Transaction History</h2>
                                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider shrink-0">
                                    {transactions.length} Records
                                </span>
                            </div>
                        </div>

                        {/* Transaction List */}
                        <div className="w-full">
                            {/* Desktop Headers */}
                            <div className="hidden md:grid grid-cols-4 gap-4 pb-4 border-b border-border/50 text-xs font-bold text-muted-foreground uppercase tracking-widest px-4">
                                <div>Details</div>
                                <div>Method</div>
                                <div>Status</div>
                                <div className="text-right">Timestamp</div>
                            </div>

                            {/* Rows */}
                            <div className="space-y-3 md:space-y-0 mt-4 md:mt-0">
                                {isLoadingHistory ? (
                                    <div className="py-10 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                                    </div>
                                ) : transactions.length === 0 ? (
                                    <div className="py-10 text-center text-muted-foreground font-medium bg-muted/10 rounded-2xl border border-dashed border-border/50 m-2 md:m-0">
                                        No transactions found.
                                    </div>
                                ) : (
                                    transactions.map((tx) => {
                                        const isPositive = tx.type === 'deposit' || tx.type === 'transfer_in' || tx.type === 'receive';

                                        return (
                                            <div key={tx.id} className="grid grid-cols-2 md:grid-cols-4 items-center gap-y-4 gap-x-2 md:gap-4 p-4 md:py-6 md:px-4 border border-border/50 md:border-0 md:border-b md:border-border/50 rounded-[20px] md:rounded-none bg-muted/20 md:bg-transparent hover:bg-muted/40 transition-colors">

                                                {/* 1. Details (Top Left Mobile) */}
                                                <div className="order-1 flex items-center gap-3 md:gap-4">
                                                    <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-[14px] md:rounded-xl border shrink-0 ${isPositive ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                                        {isPositive ? <Plus className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={3} /> : <Minus className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={3} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[15px] md:text-base font-bold text-foreground truncate">
                                                            {isPositive ? '+' : '-'} ৳{Number(tx.amount || 0).toFixed(2)}
                                                        </p>
                                                        <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase mt-0.5">
                                                            {(tx.type || 'transaction').replace('_', ' ')}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* 3. Status (Top Right Mobile via order-2) */}
                                                <div className="order-2 md:order-3 flex items-center justify-end md:justify-start w-full">
                                                    {getStatusBadge(tx.status || 'COMPLETED')}
                                                </div>

                                                {/* 2. Method (Bottom Left Mobile via order-3) */}
                                                <div className="order-3 md:order-2 flex flex-col items-start w-full">
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                                            {tx.payment_method || tx.method || 'Wallet'}
                                                        </span>
                                                        <span className="text-[10px] md:text-xs font-medium text-muted-foreground truncate max-w-full">
                                                            {tx.number || tx.account || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 4. Timestamp (Bottom Right Mobile via order-4) */}
                                                <div className="order-4 flex flex-col items-end text-right w-full">
                                                    <div className="flex items-center justify-end gap-1 md:gap-1.5 text-muted-foreground">
                                                        <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                        <span className="text-[11px] md:text-sm font-semibold">{formatDate(tx)}</span>
                                                    </div>
                                                    <div className="text-[10px] md:text-xs font-medium text-muted-foreground mt-0.5">
                                                        {formatTime(tx)}
                                                    </div>
                                                </div>

                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}