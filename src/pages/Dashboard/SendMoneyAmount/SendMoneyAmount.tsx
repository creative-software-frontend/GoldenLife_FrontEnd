import { useState } from 'react';
import { ChevronLeft, ArrowRight, User2, Wallet, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { formatBDT } from '@/utils/currencyFormatter';
import { useAppStore } from '@/store/useAppStore';

const QUICK_AMOUNTS = [100, 200, 500, 1000];

export default function SendMoneyAmount() {
    const [amount, setAmount] = useState<number>(0);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { walletBalance, sendMoneyCharge } = useAppStore();

    const phone = searchParams.get('phone') || '';
    const receiverName = "User"; // In a real app, this would be fetched from the search receiver API

    // Defensive setter
    const safeSetAmount = (val: number) => setAmount(Math.max(0, val));

    const percent = parseFloat(sendMoneyCharge || '10');
    const chargeAmount = amount > 0 ? amount * (percent / 100) : 0;
    const totalDeduction = amount;
    const receiverGets = amount > 0 ? amount - chargeAmount : 0;
    const isInsufficient = totalDeduction > parseFloat(walletBalance);

    return (
        <div className="w-full max-w-2xl mx-auto bg-slate-50 min-h-screen pb-32">
            {/* --- PREMIUM HEADER --- */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Enter Amount</h1>
                    <div className="w-10" />
                </div>
            </div>

            <div className="p-6">
                {/* Receiver Info Card */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 mb-8 shadow-sm flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <User2 className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Receiver</p>
                        <p className="text-lg font-black text-slate-900 leading-tight">{receiverName}</p>
                        <p className="text-sm font-bold text-slate-500">{phone}</p>
                    </div>
                </div>

                {/* Amount Input Section */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 p-8 md:p-10 text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Set Amount to Send</p>
                    
                    <div className="relative inline-block mb-4">
                        <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-300">৳</span>
                        <input 
                            type="number"
                            value={amount || ''}
                            onChange={(e) => safeSetAmount(parseFloat(e.target.value) || 0)}
                            className="text-6xl font-black text-slate-900 bg-transparent border-none outline-none text-center w-full max-w-[250px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="px-4 py-2 bg-slate-100 rounded-full flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-500">Balance: ৳{walletBalance}</span>
                        </div>
                    </div>

                    {/* Quick Suggestions */}
                    <div className="grid grid-cols-4 gap-3 mb-10">
                        {QUICK_AMOUNTS.map((val) => (
                            <button
                                key={val}
                                onClick={() => safeSetAmount(val)}
                                className={cn(
                                    "py-3 rounded-xl border-2 font-black text-sm transition-all active:scale-95",
                                    amount === val 
                                        ? "bg-secondary border-secondary text-white shadow-lg shadow-secondary/25" 
                                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                                )}
                            >
                                {val}
                            </button>
                        ))}
                    </div>

                    {/* Charge Summary */}
                    <div className="border-t border-slate-100 pt-8 space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                            <span>Amount to Deduct</span>
                            <span className="text-slate-900">৳{totalDeduction.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-amber-500">
                            <span>Transfer Charge ({percent}%)</span>
                            <span>- ৳{chargeAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase text-slate-900 tracking-widest">Receiver Will Get</span>
                            <span className={cn(
                                "text-2xl font-black",
                                isInsufficient ? "text-rose-500" : "text-emerald-600"
                            )}>
                                ৳{receiverGets.toFixed(2)}
                            </span>
                        </div>

                        {isInsufficient && (
                            <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100 animate-in fade-in zoom-in-95 duration-300">
                                <Info className="w-4 h-4" />
                                <span>Insufficient balance for this transaction</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Sticky Action */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 z-40">
                <div className="max-w-2xl mx-auto">
                    <Button
                        disabled={amount <= 0 || isInsufficient}
                        onClick={() => navigate(`/sendmoneyconfirm?amount=${amount}&phone=${phone}`)}
                        className="w-full h-16 rounded-2xl bg-secondary hover:bg-secondary/90 text-white text-lg font-black tracking-widest shadow-xl shadow-secondary/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-between px-8"
                    >
                        <span>CONFIRM TRANSFER</span>
                        <ArrowRight className="w-6 h-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
