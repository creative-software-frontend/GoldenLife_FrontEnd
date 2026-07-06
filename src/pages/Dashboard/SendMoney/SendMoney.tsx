'use client';

import { useState, FormEvent, useEffect } from 'react';
import { ChevronLeft, Phone, History, Clock, ArrowRight, UserPlus, Search, Info } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function SendMoney() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
    const navigate = useNavigate();
    const { transactions, isWalletLoading, fetchHistory, sendMoneyCharge } = useAppStore();

    useEffect(() => {
        fetchHistory(true);
    }, [fetchHistory]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Clean phone number (keep only digits)
        const cleanPhone = phoneNumber.replace(/\D/g, '');
        if (!cleanPhone || cleanPhone.length < 10) {
            return;
        }
        // Navigate to the next page with the phone number as a query parameter
        navigate(`/payamount?phone=${cleanPhone}`);
    };

    const transfers = transactions.filter(t => t.type === 'transfer' || t.type === 'send');

    return (
        <div className="w-full max-w-2xl mx-auto bg-slate-50 min-h-screen pb-20">
            {/* --- PREMIUM HEADER --- */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Send Money</h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                {/* TAB SWITCHER */}
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('send')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                            activeTab === 'send' ? "bg-white text-secondary shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <UserPlus className="w-4 h-4" /> Send Money
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300",
                            activeTab === 'history' ? "bg-white text-secondary shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <History className="w-4 h-4" /> History
                    </button>
                </div>
            </div>

            <div className="p-6">
                {activeTab === 'send' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-10 mb-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-[1.2rem] bg-secondary/10 flex items-center justify-center text-secondary">
                                    <Phone className="w-7 h-7" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 leading-tight">Receiver Details</h2>
                                    <p className="text-sm font-medium text-slate-500">Enter receiver's mobile number</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors">
                                        <Search className="w-6 h-6" />
                                    </div>
                                    <Input
                                        type="tel"
                                        placeholder="01XXXXXXXXX"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                        className="h-16 pl-16 pr-6 w-full text-xl font-bold bg-slate-50 border-2 border-slate-100 rounded-2xl focus-visible:ring-0 focus-visible:border-secondary transition-all placeholder:text-slate-300"
                                        required
                                        maxLength={11}
                                    />
                                </div>

                                {/* Charge Info */}
                                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                    <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <p className="text-xs font-bold text-amber-700 leading-relaxed">
                                        A charge of <span className="text-secondary">{parseFloat(sendMoneyCharge || '10').toFixed(0)}%</span> will be deducted from your sending amount. Please ensure you have sufficient balance.
                                    </p>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={phoneNumber.length < 10}
                                    className="w-full h-16 rounded-2xl bg-secondary hover:bg-secondary/90 text-white text-lg font-black tracking-widest shadow-lg shadow-secondary/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                                >
                                    PROCEED TO AMOUNT <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </form>
                        </div>

                        {/* Recent Contacts Placeholder */}
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Quick Suggestions</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                                    <div className="h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                                        <UserPlus className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">Recent</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* --- HISTORY TAB --- */
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between px-8 py-6 bg-slate-50/50 border-b border-slate-100 shrink-0">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                                    Transfer History
                                    {!isWalletLoading && (
                                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px]">
                                            {transfers.length} Records Found
                                        </span>
                                    )}
                                </h3>
                            </div>

                            {/* Column Headers */}
                            <div className="hidden md:grid md:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-3 px-8 py-4 border-b border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50/30 sticky top-0 z-10">
                                <div>Details</div>
                                <div className="text-center">Receiver</div>
                                <div className="text-center">Charge</div>
                                <div className="text-right">Timestamp</div>
                            </div>

                            <div className="flex-1 overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                {isWalletLoading ? (
                                    <div className="p-6 space-y-4">
                                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
                                    </div>
                                ) : transfers.length === 0 ? (
                                    <div className="text-center py-24">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
                                            <History className="w-10 h-10 text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No transfers found</p>
                                    </div>
                                ) : (
                                    <div className="p-4 md:p-6 space-y-3">
                                        {transfers.map((item) => {
                                            const chargeVal = parseFloat(item.charge || '0');
                                            return (
                                                <div
                                                    key={item.id}
                                                    className="group grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1.2fr] items-center gap-x-3 gap-y-4 px-6 py-4 border border-slate-100 rounded-2xl bg-white hover:border-secondary/30 hover:bg-slate-50/30 transition-all duration-200 shadow-sm"
                                                >
                                                    {/* 1. Details */}
                                                    <div className="order-1 flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                                                            <ArrowRight className="w-5 h-5 rotate-[-45deg]" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-base font-bold text-slate-900 leading-none tracking-tight">৳{parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                            <p className="text-[10px] font-black text-slate-400 mt-1.5 uppercase tracking-widest truncate">
                                                                {item.invoice_number || `TRF-${item.id}`}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* 2. Receiver */}
                                                    <div className="order-3 md:order-2 flex flex-col items-start md:items-center">
                                                        <span className="text-[10px] font-black text-slate-600 uppercase px-2 py-1 bg-slate-100 rounded-md w-fit tracking-wider">
                                                            {item.number || 'N/A'}
                                                        </span>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1">Receiver</p>
                                                    </div>

                                                    {/* 3. Charge */}
                                                    <div className="order-4 md:order-3 flex items-center justify-start md:justify-center">
                                                        {chargeVal > 0 ? (
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-xs font-bold text-rose-500">-৳{chargeVal.toFixed(2)}</span>
                                                                <span className="text-[8px] font-black uppercase text-rose-300 tracking-tighter">Charge</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-300">—</span>
                                                        )}
                                                    </div>

                                                    {/* 4. Timestamp */}
                                                    <div className="order-2 md:order-4 flex flex-col items-end">
                                                        <p className="text-xs font-bold text-slate-700">
                                                            {new Date(item.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
