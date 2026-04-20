import React, { useState } from 'react';
import { KeyRound, X, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppStore } from '@/store/useAppStore';

interface SetPinModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export default function SetPinModal({ isOpen, onClose, onSuccess, onError }: SetPinModalProps) {
    const { setPin } = useAppStore();
    const [newPin, setNewPin] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleSetPin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await setPin(newPin);

            if (result.success) {
                toast.success(result.message);
                onSuccess(result.message);
                setNewPin('');
                onClose();
            } else {
                toast.error(result.message);
                onError(result.message);
                setNewPin('');
                onClose();
            }
        } catch (error) {
            const msg = "Error setting PIN.";
            toast.error(msg);
            onError(msg);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/10 backdrop-blur-md animate-in fade-in duration-300">
            {/* Modal Container */}
            <div className="relative bg-background rounded-[28px] p-8 w-full max-w-sm shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-border/50 transform transition-all">
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-5 right-5 text-muted-foreground hover:bg-muted hover:text-foreground p-2 rounded-full transition-colors"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                {/* Header */}
                <div className="flex flex-col items-center text-center mb-8 mt-2">
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 border border-secondary/20 shadow-inner">
                        <KeyRound className="text-secondary w-8 h-8" strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">
                        Set 4-Digit PIN
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground mt-2 px-4">
                        Create a secure <span className="font-bold text-rose-500">exactly 4-digit</span> PIN.<br />
                        Cannot be more or less than 4 digits.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSetPin} className="space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <input 
                                type="password" 
                                value={newPin} 
                                onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                                maxLength={4} 
                                placeholder="••••" 
                                className="w-full px-4 py-4 bg-muted/50 border-2 border-transparent focus:bg-background focus:border-secondary focus:ring-4 focus:ring-secondary/10 rounded-2xl outline-none text-center text-3xl tracking-[0.75em] font-black text-foreground transition-all placeholder:text-muted-foreground/30 placeholder:tracking-normal placeholder:font-medium placeholder:text-lg" 
                                required 
                            />
                        </div>

                        {/* Live length indicator */}
                        <div className="flex justify-center items-center gap-2 text-[11px] font-bold text-muted-foreground">
                            <span>{newPin.length} / 4 digits</span>
                            {newPin.length > 0 && newPin.length !== 4 && (
                                <span className="text-amber-500">• Must be exactly 4</span>
                            )}
                            {newPin.length === 4 && (
                                <span className="text-emerald-500">✓ Perfect</span>
                            )}
                        </div>

                        <div className="flex justify-center items-center gap-1.5 pt-1">
                            <ShieldCheck size={14} className="text-secondary" />
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">End-to-end encrypted</span>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || newPin.length !== 4} 
                        className="w-full group relative flex justify-center items-center gap-2 py-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl font-black text-base tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-secondary/25 hover:shadow-secondary/40 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" />
                                Saving...
                            </>
                        ) : (
                            <>Save 4-Digit PIN</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}