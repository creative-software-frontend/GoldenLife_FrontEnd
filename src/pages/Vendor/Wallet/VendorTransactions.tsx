import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ArrowLeft, History, Search,
    ArrowUpRight, ArrowDownLeft, Clock,
    RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
    id: number;
    type: string;
    amount: string;
    payment_method: string;
    number: string;
    Transaction_ID: string | null;
    status: string | null;
    created_at: string;
}

export default function VendorTransactions() {
    const navigate = useNavigate();
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getAuthToken = () => {
        const session = sessionStorage.getItem("vendor_session");
        return session ? JSON.parse(session).token : null;
    };

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            const { data } = await axios.get(`${baseURL}/api/vendor/transactions/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data?.status === "success" || data?.transactions) {
                setTransactions(Array.isArray(data.transactions) ? data.transactions : []);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load transaction history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm text-slate-500">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Transaction History</h1>
                        <p className="text-slate-500">View all your credits, debits, and pending requests.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchTransactions}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm"
                        title="Refresh"
                    >
                        <RefreshCw className={cn("w-5 h-5 text-slate-500", loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Filters */}

            {/* Content Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm min-h-[500px] w-full overflow-hidden">
                <div className="flex items-center justify-between px-12 py-6 bg-slate-50/50 border-b border-slate-100">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-3">
                        <History className="w-5 h-5" />
                        Transactions
                        {!loading && (
                            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-[10px]">
                                {transactions.length} Records Found
                            </span>
                        )}
                    </h3>
                </div>

                <div className="hidden md:grid grid-cols-4 gap-4 px-12 py-4 border-b border-slate-100 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <div>Details</div>
                    <div className="text-center">Method</div>
                    <div className="text-center">Status</div>
                    <div className="text-right">Timestamp</div>
                </div>

                {loading ? (
                    <div className="p-4 md:p-8 space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
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
                ) : transactions.length === 0 ? (
                    <div className="text-center py-40">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <History className="w-12 h-12 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-sm">{error || "No transaction records found"}</p>
                    </div>
                ) : (
                    <div className="p-4 md:p-8 space-y-3">
                        {transactions.map((tx) => {
                            const isAdd = tx.type === 'add' || tx.type === 'purchase' || tx.type === 'sale';
                            const statusLabel = tx.status || 'pending';
                            const lowerStatus = statusLabel.toLowerCase();

                            return (
                                <div
                                    key={tx.id}
                                    className="group p-5 md:px-10 md:py-6 border border-slate-100 rounded-[2rem] grid grid-cols-1 md:grid-cols-4 items-center gap-4 hover:border-secondary/30 hover:bg-slate-50/30 transition-all duration-300 shadow-sm md:shadow-none"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors",
                                            isAdd ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                        )}>
                                            {isAdd ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-slate-900 leading-none">৳{tx.amount}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-tighter shrink-0">{tx.type} • ID: {tx.Transaction_ID || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:items-center">
                                        <span className="text-[10px] font-black text-slate-700 uppercase px-3 py-1 bg-slate-100 rounded-lg w-fit">
                                            {tx.payment_method}
                                        </span>
                                        <p className="text-[11px] font-medium text-slate-500 mt-1">{tx.number || '---'}</p>
                                    </div>

                                    <div className="flex md:justify-center">
                                        <span className={cn(
                                            "px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm transition-all",
                                            (lowerStatus === 'success' || lowerStatus === 'approved')
                                                ? "bg-green-500 text-white"
                                                : (lowerStatus === 'pending' ? "bg-orange-400 text-white" : "bg-red-500 text-white")
                                        )}>
                                            {statusLabel}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <p className="text-sm font-bold text-slate-800">
                                            {new Date(tx.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

