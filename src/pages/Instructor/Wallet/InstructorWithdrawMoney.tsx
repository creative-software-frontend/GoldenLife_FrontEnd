import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Wallet, Landmark, Smartphone, Minus,
    CheckCircle2, AlertCircle, Loader2, Clock, X, HelpCircle, KeyRound
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'react-toastify';
import SetPinModal from '@/pages/Wallet/SetPinModal/SetPinModal';
import ConfirmWithdrawModal from '@/pages/Wallet/ConfirmWithdrawModal/ConfirmWithdrawModal';
import { useInstructorWallet } from '@/hooks/useInstructorWallet';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';

export default function InstructorWithdrawMoney() {
    const navigate = useNavigate();
    const { balance, transactions, withdrawMoney, isWithdrawingMoney, isBalanceLoading, refetchBalance, refetchTransactions } = useInstructorWallet();
    const { withdrawCharge, fetchCharges } = useAppStore();

    useEffect(() => {
        fetchCharges();
    }, []);

    const [activeTab, setActiveTab] = useState<'withdraw' | 'history'>('withdraw');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bkash');
    const [mfsNumber, setMfsNumber] = useState('');
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [guideTab, setGuideTab] = useState<'bkash' | 'nagad'>('bkash');
    
    const [isPinModalOpen, setIsPinModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const withdrawTransactions = transactions.filter((t: any) => t.type === 'withdraw');
    const presetAmounts = [500, 1000, 2000, 5000];

    const handleOpenConfirmation = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!amount || Number(amount) <= 0) {
            const msg = "Please enter a valid amount.";
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        const chargePercent = parseFloat(String(withdrawCharge).replace(/[^0-9.-]/g, '')) || 0;
        const chargeAmount = Number(amount) * (chargePercent / 100);
        const totalDeduction = Number(amount) + chargeAmount;

        if (totalDeduction > Number(balance)) {
            const msg = `Insufficient funds! (Total including ${chargePercent}% fee: ৳${totalDeduction.toFixed(2)})`;
            setErrorMessage(msg);
            toast.error(msg);
            return;
        }

        if (['bkash', 'nagad', 'rocket'].includes(paymentMethod)) {
            const mfsRegex = paymentMethod === 'rocket' ? /^01\d{9,10}$/ : /^01\d{9}$/;
            if (!mfsRegex.test(mfsNumber)) {
                const msg = `Please enter a valid ${paymentMethod === 'rocket' ? '11 or 12' : '11'}-digit ${paymentMethod.toUpperCase()} number.`;
                setErrorMessage(msg);
                toast.error(msg);
                return;
            }
        }

        setIsConfirmModalOpen(true);
    };

    const handleWithdrawSuccess = (msg: string) => {
        setSuccessMessage(msg);
        toast.success(msg);
        setAmount('');
        setMfsNumber('');
        refetchBalance();
        refetchTransactions();
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4">
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
                accountNumber={mfsNumber}
                paymentMethod={paymentMethod}
                chargePercentage={parseFloat(String(withdrawCharge).replace(/[^0-9.-]/g, '')) || 0}
                currentBalance={Number(balance)}
                onSubmitOverride={async (pinCode) => {
                    try {
                        const payload = {
                            amount,
                            number: mfsNumber,
                            payment_method: paymentMethod,
                            password: pinCode,
                            pin_code: pinCode
                        };
                        const res = await withdrawMoney(payload);
                        // If we are here, mutation succeeded according to useInstructorWallet
                        return { success: true, message: res?.message || "Withdrawal successful!" };
                    } catch (err: any) {
                        return { success: false, message: err.response?.data?.message || err.message || "Withdrawal failed." };
                    }
                }}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm text-slate-500">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Withdraw Funds</h1>
                        <p className="text-slate-500">Transfer your earnings to mobile wallet or bank</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsPinModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-200 rounded-xl text-xs font-bold transition-all"
                >
                    <KeyRound size={16} /> Set PIN
                </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1.5 bg-slate-100 rounded-3xl mb-8 border border-slate-200">
                {(['withdraw', 'history'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all",
                            activeTab === tab ? "bg-white shadow-md text-slate-900" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {tab === 'withdraw' ? <Minus className="w-4 h-4" /> : <History className="w-4 h-4" />}
                        {tab === 'withdraw' ? "Withdraw" : "History"}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                {/* Balance Section */}
                <div className="bg-slate-50 p-8 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                            <Wallet className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Available Balance</p>
                            {isBalanceLoading ? (
                                <div className="h-8 w-32 bg-slate-200 animate-pulse rounded-lg mt-1"></div>
                            ) : (
                                <p className="text-3xl font-bold text-slate-900">৳ {balance}</p>
                            )}
                        </div>
                    </div>
                </div>

                {activeTab === 'withdraw' ? (
                    <form onSubmit={handleOpenConfirmation} className="p-8 space-y-8">
                        {successMessage && <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-200 font-bold text-sm"><CheckCircle2 className="w-5 h-5" />{successMessage}</div>}
                        {errorMessage && <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-200 font-bold text-sm"><AlertCircle className="w-5 h-5" />{errorMessage}</div>}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-700">Withdraw Amount</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-400">৳</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-14 pr-6 py-6 text-5xl font-bold bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white outline-none focus:border-secondary transition-all"
                                    required
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {presetAmounts.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setAmount(p.toString())}
                                        className={cn(
                                            "px-5 py-2 rounded-xl font-bold text-xs transition-all border",
                                            Number(amount) === p ? 'bg-secondary text-white border-secondary' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        )}
                                    >
                                        ৳{p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-700">Select Gateway</label>
                                <button type="button" onClick={() => setShowGuideModal(true)} className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                                    <HelpCircle className="w-3.5 h-3.5" /> How to withdraw?
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { id: 'bkash', label: 'bKash', color: 'text-[#e2136e]' },
                                    { id: 'nagad', label: 'Nagad', color: 'text-[#ed1c24]' }
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        className={cn(
                                            "relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all uppercase text-[10px] font-black",
                                            paymentMethod === method.id ? "border-secondary bg-secondary/5" : "border-slate-100 bg-white hover:border-slate-200"
                                        )}
                                    >
                                        <input type="radio" className="hidden" onChange={() => setPaymentMethod(method.id)} checked={paymentMethod === method.id} />
                                        <Smartphone className={cn("w-6 h-6", method.color)} />
                                        {method.label}
                                    </label>
                                ))}
                                {['rocket', 'bank'].map(method => (
                                    <div key={method} className="relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 opacity-60 cursor-not-allowed">
                                        <span className="absolute top-2 right-2 bg-slate-200 text-slate-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Soon</span>
                                        {method === 'bank' ? <Landmark className="w-6 h-6 text-slate-400" /> : <Smartphone className="w-6 h-6 text-slate-400" />}
                                        <span className="text-[10px] font-black text-slate-400 uppercase">{method}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">{paymentMethod} Account Number</label>
                            <input
                                type="tel"
                                value={mfsNumber}
                                onChange={(e) => setMfsNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="01XXXXXXXXX"
                                maxLength={11}
                                className="w-full px-6 py-4 text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-secondary outline-none transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isWithdrawingMoney || !amount}
                            className="w-full py-5 bg-secondary text-white rounded-2xl font-bold text-xl shadow-lg transition-all hover:brightness-110 disabled:opacity-60"
                        >
                            {isWithdrawingMoney ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Submit Withdrawal Request"}
                        </button>
                    </form>
                ) : (
                    <div className="p-8 space-y-4">
                        {withdrawTransactions.length === 0 ? (
                            <div className="text-center py-20 text-slate-400">No withdrawal records found.</div>
                        ) : (
                            withdrawTransactions.map((trx: any) => (
                                <div key={trx.id} className="p-6 border border-slate-100 rounded-3xl flex items-center justify-between hover:border-secondary/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                            <Minus className="w-6 h-6 stroke-[3]" />
                                        </div>
                                        <div>
                                            <p className="text-xl font-black text-slate-900">৳{trx.amount}</p>
                                            <p className="text-xs font-bold text-slate-400 uppercase">{trx.payment_method} • {trx.number}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm",
                                            trx.status === 'approved' || trx.status === 'success' ? "bg-emerald-500" : trx.status === 'pending' ? "bg-orange-400" : "bg-red-500"
                                        )}>
                                            {trx.status}
                                        </span>
                                        <p className="text-xs font-medium text-slate-400 mt-2">{new Date(trx.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Instruction Modal */}
            {showGuideModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 relative">
                        <button onClick={() => setShowGuideModal(false)} className="absolute top-6 right-6 p-2 text-slate-400"><X /></button>
                        <h3 className="text-2xl font-black mb-6">Withdrawal Guide</h3>
                        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                            <p>1. Ensure you have enough balance in your wallet.</p>
                            <p>2. Select your preferred mobile banking gateway (bKash/Nagad).</p>
                            <p>3. Enter the correct personal account number.</p>
                            <p>4. Withdrawal requests take 24-48 hours to process.</p>
                        </div>
                        <button onClick={() => setShowGuideModal(false)} className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl">Got it!</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function History(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M12 7v5l4 2" />
        </svg>
    )
}
