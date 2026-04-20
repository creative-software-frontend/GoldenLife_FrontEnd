import React, { useState } from 'react';
import { X, Loader2, ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppStore } from '@/store/useAppStore';

interface ConfirmWithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void; 
    onError: (message: string) => void;   
    amount: string;
    accountNumber: string;
    paymentMethod: string;
    chargePercentage?: number;
    currentBalance: number;
}

export default function ConfirmWithdrawModal({ 
    isOpen, onClose, onSuccess, onError, amount, accountNumber, paymentMethod, chargePercentage = 0, currentBalance
}: ConfirmWithdrawModalProps) {
    const { withdrawFunds } = useAppStore();
    
    const [pinCode, setPinCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const numAmount = parseFloat(amount) || 0;
    const chargeAmount = numAmount * (Number(chargePercentage || 0) / 100);
    const totalDeduction = numAmount + chargeAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pinCode.length !== 4) return;   // ← Strictly 4 digits only

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('type', 'withdraw');
            formData.append('amount', amount);
            formData.append('number', accountNumber);
            formData.append('payment_method', paymentMethod);
            
            // Sending as both to fix "Invalid password" issues
            formData.append('password', pinCode); 
            formData.append('pin_code', pinCode); 
            

            const result = await withdrawFunds(formData);

            if (result.success) {
                toast.success(result.message);
                onSuccess(result.message);
                handleClose(); 
            } else {
                toast.error(result.message);
                onError(result.message);
                setIsSubmitting(false);
            }
        } catch (error) {
            const errorMsg = "Error processing withdrawal.";
            toast.error(errorMsg);
            onError(errorMsg);
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setPinCode('');
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/10 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative bg-background rounded-[24px] p-6 w-full max-w-sm shadow-2xl border border-border/50 transform transition-all">
                
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2 text-foreground">
                        <Lock size={20} className="text-secondary" strokeWidth={2.5} />
                        <h3 className="text-lg font-black tracking-tight">Verify Withdrawal</h3>
                    </div>
                    <button onClick={handleClose} disabled={isSubmitting} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition-colors">
                        <X size={18} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Summary Card */}
                <div className="bg-muted/40 rounded-xl p-4 mb-6 border border-border/50">
                    <div className="flex flex-col items-center mb-4">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 flex items-center justify-center gap-1.5">
                            Withdrawing to <ArrowRight size={10} strokeWidth={3} /> <span className="text-secondary">{paymentMethod.toUpperCase()}</span>
                        </p>
                        
                        {/* Gateway Logo */}
                        <div className="mb-2">
                            {['bkash', 'bikash'].includes(paymentMethod.toLowerCase()) && (
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-border/50">
                                    <img src="/image/payment/bikash.png" alt="bKash" className="h-8 w-auto object-contain" />
                                </div>
                            )}
                            {['nagad', 'nogod'].includes(paymentMethod.toLowerCase()) && (
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-border/50">
                                    <img src="/image/payment/nogod.png" alt="Nagad" className="h-8 w-auto object-contain" />
                                </div>
                            )}
                            {paymentMethod.toLowerCase() === 'rocket' && (
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-border/50">
                                    <img src="/image/payment/rocket.jpg" alt="Rocket" className="h-8 w-auto object-contain" />
                                </div>
                            )}
                        </div>
                        
                        <p className="text-xl font-black text-foreground tracking-tight">{accountNumber}</p>
                    </div>
                    
                    <div className="space-y-2.5 border-t border-border/50 pt-4">
                        <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                            <span>Current Balance:</span>
                            <span className="text-foreground">৳{(Number(currentBalance) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold text-muted-foreground border-t border-border/10 pt-2.5">
                            <span>Requested:</span>
                            <span className="text-foreground">৳{(Number(numAmount) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-bold text-amber-600">
                            <span>Fee ({chargePercentage}%):</span>
                            <span>+ ৳{(Number(chargeAmount) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-border/50 items-baseline">
                            <span className="text-[11px] font-black uppercase text-foreground tracking-wider">Total to Deduct:</span>
                            <span className="text-2xl font-black text-emerald-600">৳{totalDeduction.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 text-[10px] font-bold text-muted-foreground border-t border-dashed border-border/30 mt-1">
                            <span>Remaining Balance:</span>
                            <span>৳{Math.max(0, (Number(currentBalance) || 0) - (totalDeduction || 0)).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                            Enter Your 4-Digit PIN
                        </label>
                        <input 
                            type="password" 
                            value={pinCode} 
                            onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))} 
                            maxLength={4} 
                            placeholder="••••" 
                            autoFocus
                            className="w-full mt-1 px-4 py-3 bg-muted border-2 border-border rounded-xl focus:border-secondary outline-none text-center text-2xl tracking-[0.5em] font-black text-foreground transition-all" 
                            required 
                        />

                        {/* Live length indicator */}
                        <div className="flex justify-center items-center gap-2 mt-2 text-[11px] font-bold text-muted-foreground">
                            <span>{pinCode.length} / 4 digits</span>
                            {pinCode.length > 0 && pinCode.length !== 4 && (
                                <span className="text-amber-500">• Must be exactly 4</span>
                            )}
                            {pinCode.length === 4 && (
                                <span className="text-emerald-500">✓ Perfect</span>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || pinCode.length !== 4} 
                        className="w-full flex justify-center items-center gap-2 py-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl font-black tracking-wide shadow-lg shadow-secondary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            <>
                                <ShieldCheck size={18} strokeWidth={2.5}/> Confirm & Withdraw
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}