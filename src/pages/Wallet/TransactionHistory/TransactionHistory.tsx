import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Receipt, Wallet, ArrowUpRight, ArrowDownLeft, Hash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Transaction {
    id: number;
    type: string;
    amount: string;
    payment_method: string;
    number: string;
    Transaction_ID: string | null;
    invoice_number?: string | null;
    status: string;
    created_at: string;
}

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    const getAuthToken = () => {
        try {
            const session = sessionStorage.getItem("student_session");
            return session ? JSON.parse(session).token : null;
        } catch (error) {
            console.error("Session parse error:", error);
            return null;
        }
    };

    const fetchHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const token = getAuthToken();
            if (!token) throw new Error("No auth token found");

            const { data } = await axios.get(`${baseURL}/api/student/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data?.status === "success") {
                setTransactions(data.transactions || []);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const getStatusBadge = (status: string) => {
        if (!status) return <span className="px-2.5 py-1 text-[10px] md:text-xs font-bold text-emerald-700 bg-emerald-100/80 rounded-full border border-emerald-200/50 uppercase tracking-wider">Success</span>;
        const normalized = status.toLowerCase();
        if (normalized === 'completed' || normalized === 'success') {
            return <span className="px-2.5 py-1 text-[10px] md:text-xs font-bold text-emerald-700 bg-emerald-100/80 rounded-full border border-emerald-200/50 uppercase tracking-wider">Success</span>;
        }
        if (normalized === 'pending') {
            return <span className="px-2.5 py-1 text-[10px] md:text-xs font-bold text-amber-700 bg-amber-100/80 rounded-full border border-amber-200/50 uppercase tracking-wider">Pending</span>;
        }
        return <span className="px-2.5 py-1 text-[10px] md:text-xs font-bold text-rose-700 bg-rose-100/80 rounded-full border border-rose-200/50 uppercase tracking-wider">{status}</span>;
    };

    const formatMethod = (method: string) => {
        if (!method) return 'N/A';
        const lower = method.toLowerCase();
        if (lower === 'add') return 'ADD MONEY';
        if (lower === 'send') return 'SEND MONEY';
        return method.toUpperCase();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return { date: 'N/A', time: '' };
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="animate-in fade-in duration-500 w-full max-w-5xl mx-auto px-4 py-8 md:py-12 md:px-8">

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                        Transaction History
                    </h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Keep track of your wallet activities</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-indigo-50/80 border border-indigo-100 px-4 py-2.5 rounded-2xl w-fit">
                    <Wallet className="w-4 h-4 text-indigo-500" />
                    <span className="text-indigo-700 text-sm font-bold tracking-wide">
                        {transactions.length} Records
                    </span>
                </div>
            </div>

            <div className="w-full">
                <div className="space-y-4">
                    {isLoadingHistory ? (
                        <div className="grid grid-cols-1 gap-3 md:gap-4 mt-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm bg-white gap-4">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <Skeleton className="w-12 h-12 rounded-2xl" />
                                        <div className="flex flex-col gap-2 w-full max-w-[200px]">
                                            <Skeleton className="h-5 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-4 w-2/3" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto mt-2 md:mt-0">
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="py-24 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <Receipt className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-1">No transactions yet</h3>
                            <p className="text-slate-500 text-sm max-w-[250px] mx-auto">Your transaction history will be displayed here once you make a move.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 md:gap-4">
                            {transactions.map((tx, idx) => {
                                const isPositive = tx.type === 'add';
                                const isPurchase = tx.type === 'purchase';
                                const { date, time } = formatDate(tx.created_at);

                                return (
                                    <div
                                        key={tx.id || idx}
                                        className="group relative bg-white flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300"
                                    >
                                        <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                                            {/* Icon */}
                                            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl shrink-0 transition-colors duration-300 ${isPositive
                                                ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                                                : isPurchase
                                                    ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                                                    : 'bg-rose-50 text-rose-600 group-hover:bg-rose-100'
                                                }`}>
                                                {isPositive ? <ArrowDownLeft size={24} strokeWidth={2.5} /> : <ArrowUpRight size={24} strokeWidth={2.5} />}
                                            </div>

                                            {/* Main Details */}
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[15px] font-bold text-slate-800">
                                                        {formatMethod(tx.type)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center flex-wrap gap-1.5 md:gap-2 text-xs font-medium text-slate-500">
                                                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 uppercase tracking-wider text-[10px]">
                                                        {tx.payment_method || 'Wallet'}
                                                    </span>
                                                    {tx.number && (
                                                        <>
                                                            <span className="text-slate-300 hidden md:inline">•</span>
                                                            <span className="tracking-wide break-all">{tx.number}</span>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1 mt-1.5 text-[11px] text-slate-400 font-medium">
                                                    <Hash className="w-3 h-3 shrink-0" />
                                                    <span className="truncate max-w-[150px] md:max-w-[250px]">
                                                        {tx.Transaction_ID || tx.invoice_number || 'No ID'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile Divider */}
                                        <div className="h-px w-full bg-slate-50 my-3 md:hidden"></div>

                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center w-full md:w-auto">
                                            {/* Amount & Status */}
                                            <div className="flex flex-col items-start md:items-end w-full md:w-auto">
                                                <div className="flex items-center justify-between md:justify-end w-full md:w-auto md:mb-1">
                                                    <p className={`text-lg md:text-xl font-black ${isPositive ? 'text-emerald-600' : 'text-slate-800'}`}>
                                                        {isPositive ? '+' : '-'}৳{Number(tx.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </p>
                                                    {/* Status Badge (shows inline on mobile right side) */}
                                                    <div className="md:hidden ml-4">
                                                        {getStatusBadge(tx.status)}
                                                    </div>
                                                </div>

                                                {/* Status Badge Desktop */}
                                                <div className="hidden md:block">
                                                    {getStatusBadge(tx.status)}
                                                </div>
                                            </div>

                                            {/* Timestamp */}
                                            <div className="flex flex-col items-start md:flex-row md:items-center gap-0.5 md:gap-2 text-xs mt-1 md:mt-2 text-slate-400 font-medium">
                                                <span>{date}</span>
                                                <span className="hidden md:inline text-slate-300">•</span>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 md:hidden" />
                                                    <span>{time}</span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}