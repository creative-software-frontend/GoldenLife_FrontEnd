'use client';

import { useState } from 'react';
import { ChevronLeft, User2, ShieldCheck, Lock, ArrowRight, Loader2, Info } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';

export default function SendMoneyConfirm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { sendFunds, sendMoneyCharge, walletBalance } = useAppStore();

    const amount = searchParams.get('amount') || '0';
    const phone = searchParams.get('phone') || '';
    const receiverName = "User"; // Should be dynamic in real app

    const [pinCode, setPinCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const percent = parseFloat(sendMoneyCharge || '10');
    const totalDeduction = parseFloat(amount);
    const chargeAmount = totalDeduction * (percent / 100);
    const receiverGets = totalDeduction - chargeAmount;

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pinCode.length !== 4) {
            toast.error("Please enter a valid 4-digit PIN");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('receiver_number', phone);
            formData.append('amount', amount);
            formData.append('pin_code', pinCode);

            const result = await sendFunds(formData);

            if (result.success) {
                toast.success(result.message || "Money sent successfully!");
                navigate('/dashboard/wallet/send'); // Or a success page
            } else {
                toast.error(result.message || "Transaction failed");
            }
        } catch (error) {
            toast.error("An error occurred during transaction");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">Confirm Transfer</h1>
                    <div className="w-10" />
                </div>
            </div>

            <div className="p-6">
                {/* Transaction Summary Card */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-8">
                    <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex flex-col items-center text-center">
                        <div className="h-20 w-20 rounded-[2rem] bg-secondary/10 flex items-center justify-center text-secondary mb-4 shadow-inner">
                            <User2 className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{receiverName}</h2>
                        <p className="text-sm font-bold text-slate-500 mt-1">{phone}</p>

                        <div className="mt-8 flex flex-col items-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Amount to Send</p>
                            <p className="text-5xl font-black text-secondary tracking-tighter">৳{parseFloat(amount).toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="p-8 space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                            <span>Amount Sent (To Deduct)</span>
                            <span className="text-slate-900">৳{totalDeduction.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-amber-600">
                            <span>Transfer Charge ({percent}%)</span>
                            <span>- ৳{chargeAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                            <span className="text-xs font-black uppercase text-slate-900 tracking-widest">Receiver Will Get</span>
                            <span className="text-2xl font-black text-emerald-600">৳{receiverGets.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                            <span>Balance after transfer</span>
                            <span>৳{(parseFloat(walletBalance) - totalDeduction).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* PIN Verification Form */}
                <form onSubmit={handleConfirm} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                            <Lock className="w-5 h-5" />
                        </div>
                        <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Security Verification</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">
                                Enter 4-Digit PIN
                            </label>
                            <input
                                type="password"
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                                maxLength={4}
                                placeholder="••••"
                                className="w-full h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-4xl font-black tracking-[0.5em] focus:border-secondary transition-all outline-none"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                            <p className="text-[11px] font-bold text-blue-700 leading-relaxed">
                                Your transaction is protected by end-to-end encryption. Never share your PIN with anyone.
                            </p>
                        </div>
                    </div>
                </form>
            </div>

            {/* Bottom Sticky Action */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 z-40">
                <div className="max-w-2xl mx-auto">
                    <Button
                        onClick={handleConfirm}
                        disabled={isSubmitting || pinCode.length !== 4}
                        className="w-full h-16 rounded-2xl bg-secondary hover:bg-secondary/90 text-white text-lg font-black tracking-widest shadow-xl shadow-secondary/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>PROCESSING...</span>
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="w-6 h-6" />
                                <span>CONFIRM & SEND NOW</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
