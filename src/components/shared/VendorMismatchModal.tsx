import { AlertCircle, Trash2, X, ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import useModalStore from "@/store/modalStore";

interface VendorMismatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const VendorMismatchModal = ({ isOpen, onClose, onConfirm }: VendorMismatchModalProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { t } = useTranslation('global');
    const { setCartOpen, setCheckoutModalOpen } = useModalStore();

    if (!isOpen) return null;

    const handleCheckout = () => {
        onClose();
        setCartOpen(false);
        setCheckoutModalOpen(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
                {/* Close Button Top Right */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-rose-500 rounded-full transition-colors z-10"
                >
                    <X size={18} />
                </button>

                <div className="p-8 pb-10 text-center space-y-6 mt-4">
                    <div className="mx-auto w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-2">
                        <AlertCircle className="w-10 h-10 text-rose-500" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Vendor Mismatch</h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed px-4">
                            Your cart already contains products from another vendor. You can only purchase items from a single vendor at a time.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-6">
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/20"
                        >
                            <ShoppingCart size={18} />
                            Proceed to Checkout
                        </button>
                        
                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">OR</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        <button
                            onClick={onConfirm}
                            className="w-full py-4 px-6 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            <Trash2 size={18} />
                            Clear Cart & Add This Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
