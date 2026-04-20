'use client'

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChevronLeft, Loader2, Clock, Plus, Receipt, CreditCard } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

export default function WalletPurchase() {
    const [purchases, setPurchases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    const getAuthToken = () => {
        try {
            const session = sessionStorage.getItem("student_session");
            return session ? JSON.parse(session).token : null;
        } catch (error) {
            return null;
        }
    };

    const fetchPurchaseHistory = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = getAuthToken();
            if (!token) return;

            const { data } = await axios.get(`${baseURL}/api/student/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data?.status === "success" && data.transactions) {
                const filteredData = data.transactions.filter((t) => t.type === 'purchase');
                setPurchases(filteredData);
            }
        } catch (err) {
            console.error("Failed to fetch:", err);
        } finally {
            setIsLoading(false);
        }
    }, [baseURL]);

    useEffect(() => {
        fetchPurchaseHistory();
    }, [fetchPurchaseHistory]);

    const getStatusBadge = (status) => {
        const lowerStatus = status?.toLowerCase();
        let bgColor = "bg-rose-500";
        if (lowerStatus === 'pending') bgColor = "bg-orange-400";
        if (!status || lowerStatus === 'completed' || lowerStatus === 'success') bgColor = "bg-emerald-500";

        return (
            <span className={`px-3 md:px-6 py-1 md:py-1.5 text-[9px] md:text-[11px] font-black text-white ${bgColor} rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap`}>
                {status || 'Success'}
            </span>
        );
    };

    return (
        <div className="w-full max-w-5xl mx-auto bg-slate-50/30 min-h-screen pb-10 font-sans">
            {/* Header Navigation */}
            <div className="flex items-center gap-3 md:gap-4 p-4 md:p-6 bg-white border-b sticky top-0 z-20">
                <button onClick={() => navigate(-1)} className="text-blue-500 hover:bg-blue-50 p-1 md:p-2 rounded-full transition-all">
                    <ChevronLeft size={24} className="md:w-7 md:h-7" />
                </button>
                <h1 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">Wallet Store</h1>
            </div>

            {/* 1. Top-up Section */}
            <div className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <CreditCard className="text-blue-500" size={16} />
                    <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">Add Credits</h2>
                </div>
                {/* Responsive Grid: 2 columns on mobile, 4 on desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {[100, 200, 500, 1000].map((amount) => (
                        <Card key={amount} className="relative overflow-hidden cursor-pointer group border-none shadow-md active:scale-95 transition-all">
                            <div className="absolute inset-0 bg-blue-600 opacity-90 group-hover:bg-blue-700 transition-colors" />
                            <div className="relative p-4 md:p-6 flex flex-col items-center text-center gap-2 md:gap-3">
                                <div className="p-2 md:p-3 bg-white/10 rounded-xl md:rounded-2xl backdrop-blur-sm">
                                    <Plus className="text-white" size={16} md:size={20} />
                                </div>
                                <div>
                                    <p className="text-[8px] md:text-[10px] font-bold text-blue-100 uppercase tracking-widest">Amount</p>
                                    <p className="text-lg md:text-2xl font-black text-white">৳{amount}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* 2. Transaction History Section */}
            <div className="px-4 md:px-6 mt-2">
                <div className="bg-white rounded-[24px] md:rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">

                    {/* Header with Record Count */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 md:px-8 py-6 md:py-8">
                        <h2 className="text-base md:text-xl font-black text-slate-700 uppercase tracking-tight">History</h2>
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-wider w-fit">
                            {purchases.length} Records Found
                        </span>
                    </div>

                    {/* Column Labels - Hidden on small mobile, visible from 'sm' up */}
                    <div className="hidden sm:grid grid-cols-4 px-10 py-4 border-y border-slate-50 text-[10px] md:text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">
                        <div>Details</div>
                        <div className="text-center">Method</div>
                        <div className="text-center">Status</div>
                        <div className="text-right">Timestamp</div>
                    </div>

                    <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                        {isLoading ? (
                            <div className="py-16 flex flex-col items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading...</p>
                            </div>
                        ) : purchases.length === 0 ? (
                            <div className="py-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                No purchase history found
                            </div>
                        ) : (
                            purchases.map((tx, idx) => (
                                <div key={tx.id || idx} className="grid grid-cols-2 sm:grid-cols-4 items-center px-4 md:px-6 py-4 md:py-6 border border-slate-50 rounded-[20px] md:rounded-[30px] bg-white hover:shadow-md transition-all group">

                                    {/* Col 1: Details */}
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center shrink-0 bg-slate-50 text-slate-400">
                                            <Receipt size={18} className="md:w-5 md:h-5" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-base md:text-xl font-black text-slate-800 tracking-tighter truncate">
                                                ৳{Number(tx.amount || 0).toFixed(2)}
                                            </p>
                                            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase truncate">
                                                {tx.Transaction_ID || `TRX-${tx.id}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Col 2: Method - Hidden on mobile, shown on SM+ */}
                                    <div className="hidden sm:flex flex-col items-center gap-1">
                                        <span className="bg-slate-100 text-slate-600 px-2 md:px-3 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                            {tx.payment_method || 'Wallet'}
                                        </span>
                                        <p className="text-[10px] md:text-[11px] font-bold text-slate-400">{tx.number || 'N/A'}</p>
                                    </div>

                                    {/* Col 3: Status */}
                                    <div className="flex justify-end sm:justify-center">
                                        {getStatusBadge(tx.status)}
                                    </div>

                                    {/* Col 4: Timestamp - Spans full width on mobile or hides */}
                                    <div className="col-span-2 sm:col-span-1 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50 text-right">
                                        <p className="text-xs md:text-[15px] font-black text-slate-700">
                                            {tx.created_at ? new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                        </p>
                                        <div className="flex items-center justify-end gap-1 text-slate-400">
                                            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                            <span className="text-[9px] md:text-[11px] font-bold italic">
                                                {tx.created_at ? new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}