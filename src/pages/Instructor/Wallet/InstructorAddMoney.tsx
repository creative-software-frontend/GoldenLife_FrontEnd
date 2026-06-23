import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Wallet, Smartphone, ShieldCheck,
    Loader2, AlertCircle, History, Plus, Clock, Building2,
    HelpCircle, X, CheckCircle2, Image as ImageIcon
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useInstructorWallet } from '@/hooks/useInstructorWallet';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL } from '@/store/utils';

export default function InstructorAddMoney() {
    const navigate = useNavigate();
    const { t } = useTranslation('global');
    const { balance, transactions, addMoney, isAddingMoney, isBalanceLoading } = useInstructorWallet();

    const [activeTab, setActiveTab] = useState<'add' | 'history'>('add');
    const [amount, setAmount] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('bkash');
    const [accountNumber, setAccountNumber] = useState<string>('');
    const [trxId, setTrxId] = useState<string>('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [senderBankName, setSenderBankName] = useState<string>('');
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [guideTab, setGuideTab] = useState<'bkash' | 'nagad'>('bkash');

    const [banks, setBanks] = useState<any[]>([]);
    const [selectedBank, setSelectedBank] = useState<string>('');

    React.useEffect(() => {
        const fetchBanks = async () => {
            try {
                const { data } = await axios.get(`${baseURL}/api/banks`);
                if (data?.status === 'success') {
                    setBanks(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch banks", err);
            }
        };
        fetchBanks();
    }, []);

    const addTransactions = transactions.filter((t: any) => t.type === 'add');
    const presetAmounts = [500, 1000, 2000, 5000];

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();

        if (paymentMethod === 'bank') {
            if (!selectedBank) {
                alert("Please select a bank to send money to.");
                return;
            }
            if (!senderBankName) {
                alert("Please select your bank name.");
                return;
            }
            if (!accountNumber.trim()) {
                alert("Please enter your sender account number.");
                return;
            }
        }

        const formData = new FormData();
        formData.append('type', 'add');
        formData.append('amount', amount);
        formData.append('number', accountNumber);
        formData.append('Transaction_ID', trxId.toUpperCase());
        formData.append('payment_method', paymentMethod);
        if (paymentMethod === 'bank') {
            formData.append('sender_bank_name', senderBankName);
        }
        formData.append('role', '4'); // Instructor role

        if (attachment) {
            formData.append('attachment', attachment);
        }

        try {
            await addMoney(formData);
            setAmount('');
            setAccountNumber('');
            setTrxId('');
            setSenderBankName('');
            setAttachment(null);
        } catch (err) {
            // Error handled by mutation
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm text-slate-500">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Wallet Portal</h1>
                    <p className="text-slate-500">Securely top up your instructor account balance</p>
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
                        {tab === 'add' ? "Add Money" : "History"}
                    </button>
                ))}
            </div>

            {activeTab === 'add' ? (
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 p-8 border-b border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-white">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Balance</p>
                                    {isBalanceLoading ? (
                                        <div className="h-8 w-32 bg-slate-200 animate-pulse rounded-lg mt-1"></div>
                                    ) : (
                                        <p className="text-2xl font-bold text-slate-900">৳ {balance}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleAddFunds} className="p-8 space-y-8">
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700">Enter Amount</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">৳</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-12 pr-6 py-5 text-4xl font-bold bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-secondary outline-none transition-all"
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
                                                "px-4 py-2 rounded-xl border text-sm font-bold transition-all",
                                                Number(amount) === p ? "bg-secondary text-white border-secondary" : "bg-white text-slate-600 hover:border-slate-300"
                                            )}
                                        >
                                            + ৳{p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-700">Select Gateway</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowGuideModal(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        <HelpCircle className="w-4 h-4" />
                                        How to Pay?
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {[
                                        { id: 'bkash', label: 'bKash', color: 'text-[#e2136e]', icon: Smartphone },
                                        { id: 'nagad', label: 'Nagad', color: 'text-[#ed1c24]', icon: Smartphone },
                                        { id: 'bank', label: 'Bank', color: 'text-blue-600', icon: Building2 }
                                    ].map((method) => {
                                        const Icon = method.icon;
                                        return (
                                            <label
                                                key={method.id}
                                                className={cn(
                                                    "relative flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-2xl border-2 cursor-pointer transition-all uppercase text-[12px] font-black bg-white",
                                                    paymentMethod === method.id ? "border-green-600 bg-green-50/30" : "border-slate-100 hover:border-slate-200 shadow-sm"
                                                )}
                                            >
                                                <input
                                                    type="radio"
                                                    className="hidden"
                                                    onChange={() => setPaymentMethod(method.id)}
                                                    checked={paymentMethod === method.id}
                                                />
                                                <Icon className={cn("w-6 h-6 mb-1", method.color)} />
                                                {method.label}
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {paymentMethod === 'bank' && banks.length > 0 && (
                                    <div className="md:col-span-2 bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Receiver bank </label>
                                        <select
                                            className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:border-blue-500 outline-none transition-all font-bold text-slate-700 mb-4"
                                            value={selectedBank}
                                            onChange={(e) => setSelectedBank(e.target.value)}
                                        >
                                            <option value="">-- Choose a Bank --</option>
                                            {banks.map(b => (
                                                <option key={b.id} value={b.id}>{b.name}</option>
                                            ))}
                                        </select>

                                        {selectedBank && (
                                            <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-blue-100 text-sm">
                                                {banks.filter(b => String(b.id) === String(selectedBank)).map(b => (
                                                    <React.Fragment key={b.id}>
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold text-slate-400">Account Name</p>
                                                            <p className="font-bold text-slate-700">{b.account_name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold text-slate-400">Account No</p>
                                                            <p className="font-bold text-slate-700">{b.account_no}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold text-slate-400">Routing Number</p>
                                                            <p className="font-bold text-slate-700">{b.routing_number}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] uppercase font-bold text-slate-400">Branch</p>
                                                            <p className="font-bold text-slate-700">{b.address}</p>
                                                        </div>
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {paymentMethod === 'bank' && (
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Bank Sender Name (Your Bank)</label>
                                        <select
                                            value={senderBankName}
                                            onChange={(e) => setSenderBankName(e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all text-slate-700 font-medium"
                                        >
                                            <option value="">-- Select Your Bank --</option>
                                            {[
                                                "AB Bank PLC", "Agrani Bank PLC", "Bangladesh Krishi Bank", "Bank Asia PLC", "BRAC Bank PLC",
                                                "City Bank PLC", "Dhaka Bank PLC", "Dutch Bangla Bank PLC", "Eastern Bank PLC", "Global Islami Bank PLC",
                                                "HSBC", "ICB Islamic Bank", "IFIC Bank PLC", "Islami Bank Bangladesh PLC", "Jamuna Bank PLC",
                                                "Janata Bank PLC", "Meghna Bank PLC", "Mercantile Bank PLC", "Midland Bank PLC", "Modhumoti Bank PLC",
                                                "Mutual Trust Bank PLC", "National Bank PLC", "NCC Bank PLC", "NRB Bank PLC", "One Bank PLC",
                                                "Padma Bank PLC", "Premier Bank PLC", "Prime Bank PLC", "Pubali Bank PLC", "Rajshahi Krishi Unnayan Bank",
                                                "Rupali Bank PLC", "SBAC Bank PLC", "Shahjalal Islami Bank PLC", "Social Islami Bank PLC", "Sonali Bank PLC",
                                                "South Bangla Agriculture Bank PLC", "Southeast Bank PLC", "Standard Chartered Bank", "State Bank of India",
                                                "Trust Bank PLC", "Union Bank PLC", "United Commercial Bank PLC", "Uttara Bank PLC", "Others (International / Local)"
                                            ].map(bank => (
                                                <option key={bank} value={bank}>{bank}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">
                                        {paymentMethod === 'bank' ? t('reference_account', 'Sender Bank Account No') : 'Sender Number'}
                                    </label>
                                    <input
                                        type="tel"
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(paymentMethod === 'bank' ? e.target.value : e.target.value.replace(/\D/g, ''))}
                                        placeholder={paymentMethod === 'bank' ? t('account_no', "Your Account No") : "01XXXXXXXXX"}
                                        maxLength={paymentMethod === 'bank' ? 50 : 11}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Transaction ID</label>
                                    <input
                                        type="text"
                                        value={trxId}
                                        onChange={(e) => setTrxId(e.target.value)}
                                        placeholder="TRX-XXXXXX"
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-secondary outline-none uppercase transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-700">Attachment (Optional Proof Image)</label>
                                <div
                                    className={cn(
                                        "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl transition-all cursor-pointer group",
                                        attachment ? "border-secondary bg-secondary/5" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                                    )}
                                    onClick={() => document.getElementById('instructor-wallet-add-attachment')?.click()}
                                >
                                    {attachment ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <ImageIcon className="w-8 h-8 text-secondary" />
                                            <p className="text-sm font-bold text-slate-700">{attachment.name}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <Plus className="w-8 h-8 text-slate-400" />
                                            <p className="text-sm font-bold text-slate-500">Click to upload proof image</p>
                                        </div>
                                    )}
                                    <input
                                        id="instructor-wallet-add-attachment"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isAddingMoney}
                                className="w-full py-5 bg-secondary text-white rounded-2xl font-bold text-xl shadow-lg transition-all hover:brightness-110 disabled:opacity-60"
                            >
                                {isAddingMoney ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Submit Top Up Request"}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px] w-full overflow-hidden">
                    <div className="px-12 py-6 bg-slate-50/50 border-b border-slate-100">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Transaction History</h3>
                    </div>
                    <div className="p-8 space-y-4">
                        {addTransactions.length === 0 ? (
                            <div className="text-center py-20 text-slate-400">No add money records found.</div>
                        ) : (
                            addTransactions.map((item: any) => (
                                <div key={item.id} className="p-4 sm:p-6 border border-slate-100 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                                            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-lg sm:text-xl font-black text-slate-900 truncate">৳{item.amount}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">{item.payment_method} • {item.number}</p>
                                                {item.charge && parseFloat(item.charge) > 0 && (
                                                    <span className="text-[8px] sm:text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-md uppercase">
                                                        Charge: ৳{item.charge}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between items-center sm:items-end border-t sm:border-0 pt-3 sm:pt-0">
                                        <span className={cn(
                                            "px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest",
                                            item.status === 'approved' ? "bg-green-500 text-white" : "bg-orange-400 text-white"
                                        )}>
                                            {item.status}
                                        </span>
                                        <p className="text-[10px] sm:text-xs font-medium text-slate-400 mt-2 sm:mt-2">{new Date(item.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Guide Modal (Simplified) */}
            {showGuideModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 relative">
                        <button onClick={() => setShowGuideModal(false)} className="absolute top-6 right-6 p-2 text-slate-400"><X /></button>
                        <h3 className="text-2xl font-black mb-6">How to Pay</h3>
                        <div className="flex gap-2 mb-6">
                            <button onClick={() => setGuideTab('bkash')} className={cn("flex-1 py-2 rounded-xl font-bold", guideTab === 'bkash' ? "bg-[#e2136e] text-white" : "bg-slate-100")}>bKash</button>
                            <button onClick={() => setGuideTab('nagad')} className={cn("flex-1 py-2 rounded-xl font-bold", guideTab === 'nagad' ? "bg-[#ed1c24] text-white" : "bg-slate-100")}>Nagad</button>
                        </div>
                        <img src={guideTab === 'bkash' ? "/image/payment/bikash_pay.png" : "/image/payment/nogod_pay.png"} className="w-full rounded-2xl border" alt="Guide" />
                        <button onClick={() => setShowGuideModal(false)} className="w-full mt-6 py-4 bg-slate-900 text-white font-bold rounded-2xl">Got it!</button>
                    </div>
                </div>
            )}
        </div>
    );
}
