import React, { useState } from 'react';
import { Lock, X, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppStore } from '@/store/useAppStore';

interface ConfirmTransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
    amount: number;
    receiver_type: string;
    affiliate_id: string;
    type: string;
    chargePercentage?: number;
    currentBalance: number;
}

export default function ConfirmTransferModal({
    isOpen,
    onClose,
    onSuccess,
    onError,
    amount,
    receiver_type,
    affiliate_id,
    type,
    chargePercentage = 0,
    currentBalance
}: ConfirmTransferModalProps) {
    const { sendFunds } = useAppStore();
    const [pinCode, setPinCode] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    if (!isOpen) return null;

    const chargeAmount = (Number(amount) || 0) * (Number(chargePercentage || 0) / 100);
    const totalDeduction = (Number(amount) || 0) + chargeAmount;

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();

        if (pinCode.length !== 4) {
            toast.error("Please enter a valid 4-digit PIN");
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. We only use the JSON payload now (Standard for Laravel APIs)
            const formData = new FormData();
            formData.append('type', type || 'send');
            formData.append('amount', String(amount));
            formData.append('receiver_type', receiver_type);
            formData.append('affiliate_id', affiliate_id);
            formData.append('pin_code', pinCode);
            // Inform backend of the charge to be deducted from the sender's wallet
            formData.append('charge', String(chargeAmount.toFixed(2))); 

            console.log("Submitting Transfer (FormData):", Object.fromEntries(formData.entries()));
            const result = await sendFunds(formData);
            console.log("Full API Response:", result);

            // Prioritize message content over success flag (because backend is inconsistent)
            const message = result?.message || "";

            if (message.toLowerCase().includes("successfully") ||
                message.toLowerCase().includes("sent") ||
                result?.success === true) {

                toast.success(message || "Money sent successfully.");

                onSuccess?.(message || "Money sent successfully.");
                setPinCode('');
                onClose();
            } else {
                toast.error(message || "Transfer failed.");
                onError?.(message || "Transfer failed.");
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Transfer failed. Please try again.";
            toast.error(msg);
            onError?.(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setPinCode('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-in fade-in">
            <div className="bg-background rounded-[32px] p-8 w-full max-w-sm shadow-2xl border border-border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary" />

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                        <Lock className="text-secondary w-5 h-5" /> Verify Transfer
                    </h3>
                    <button onClick={handleClose} className="text-muted-foreground hover:bg-muted p-1.5 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="bg-muted/50 rounded-2xl p-5 mb-6 border border-border/50">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
                        Sending to <ArrowRight size={10} strokeWidth={4} /> <span className="text-secondary">{receiver_type}</span>
                    </p>
                    <p className="text-md font-black text-foreground break-all mb-4 text-center">{affiliate_id}</p>
                    
                    <div className="space-y-2.5 border-t border-border/50 pt-3">
                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                            <span>Current Balance:</span>
                            <span>৳{(Number(currentBalance) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-muted-foreground border-t border-border/10 pt-2">
                            <span>Amount to Send:</span>
                            <span>৳{(Number(amount) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-secondary">
                            <span>Fee ({chargePercentage}%):</span>
                            <span>+ ৳{(Number(chargeAmount) || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-border/50">
                            <span className="text-sm font-black text-foreground">Total:</span>
                            <span className="text-xl font-black text-foreground">৳{totalDeduction.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-1.5 text-[10px] font-bold text-muted-foreground border-t border-dashed border-border/30 mt-1">
                            <span>Remaining Balance:</span>
                            <span>৳{Math.max(0, (Number(currentBalance) || 0) - (totalDeduction || 0)).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleTransfer} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-2 block text-center">
                            Enter Your 4-Digit Security PIN
                        </label>
                        <input
                            type="password"
                            inputMode="numeric"
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                            maxLength={4}
                            placeholder="••••"
                            autoFocus
                            className="w-full px-4 py-4 bg-muted border-2 border-transparent focus:border-secondary focus:bg-background rounded-2xl outline-none text-center text-3xl tracking-[0.5em] font-black text-foreground transition-all"
                            required
                        />

                        <div className="flex justify-center items-center gap-2 mt-3 text-[10px] font-black uppercase tracking-tighter">
                            {pinCode.length === 4 ? (
                                <span className="text-emerald-500 flex items-center gap-1">
                                    <ShieldCheck size={12} /> PIN Complete
                                </span>
                            ) : (
                                <span className="text-muted-foreground">{pinCode.length} / 4 Digits</span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || pinCode.length !== 4}
                        className="w-full flex justify-center items-center gap-2 py-4 bg-secondary text-white rounded-2xl font-black shadow-lg shadow-secondary/20 hover:opacity-95 transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                <ShieldCheck size={20} /> Authorize Payment
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}