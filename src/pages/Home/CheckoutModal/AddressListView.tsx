import React from 'react';
import { ArrowLeft, X, Plus, Check, Loader2 } from 'lucide-react';
import { Address } from './CheckoutModal';

interface Props {
    addresses?: Address[];
    selectedId?: number | string;
    onBack: () => void;
    onClose: () => void;
    onSelect: (addr: Address) => void;
    onAddNew: () => void;
    loading?: boolean;
}

const AddressListView = ({ 
    addresses = [], 
    selectedId, 
    onBack, 
    onClose, 
    onSelect, 
    onAddNew,
    loading = false 
}: Props) => (
    // 'w-full' and 'overflow-hidden' ensure it never exceeds the parent modal
    <div className="flex flex-col h-full w-full bg-white font-sans overflow-hidden">
        
        {/* --- Header (Fixed) --- */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 border-b border-gray-100 bg-white shrink-0 z-10 w-full">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button onClick={onBack} className="p-1.5 sm:p-2 -ml-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 shrink-0">
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <h2 className="text-sm sm:text-base md:text-lg font-black text-gray-800 uppercase tracking-tight truncate">
                    Select Address
                </h2>
            </div>
            <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
        </div>

        {/* --- Scrollable Content --- */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4 md:space-y-5 bg-gray-50/50 min-h-0 w-full
            [&::-webkit-scrollbar]:w-1.5 
            [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-gray-300 
            [&::-webkit-scrollbar-thumb]:rounded-full 
            hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
        >
            <button 
                onClick={onAddNew} 
                className="w-full py-3.5 sm:py-4 border-2 border-dashed border-[#5C9C72] bg-[#F0FDF4] text-[#5C9C72] rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#DCFCE7] transition-all shrink-0"
            >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add New Address
            </button>

            <div className="space-y-3 sm:space-y-4 pb-2 w-full">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="w-8 h-8 text-[#5C9C72] animate-spin" />
                    </div>
                ) : (!addresses || addresses.length === 0) ? (
                    <div className="text-center py-10 md:py-12 bg-white rounded-2xl border-2 border-gray-100 border-dashed mx-auto">
                        <p className="text-gray-400 font-bold text-xs sm:text-sm uppercase tracking-wider">No addresses found</p>
                    </div>
                ) : (
                    addresses.map((addr, index) => {
                        const isDefault = Number(addr.is_default) === 1 || String(addr.is_default).toLowerCase() === 'true';
                        const isSelected = selectedId != null && addr.id != null && String(selectedId) === String(addr.id);

                        return (
                            <div 
                                key={addr.id || `fallback-${index}`} 
                                onClick={() => onSelect(addr)} 
                                className={`relative p-3 sm:p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all text-left group w-full ${
                                    isSelected 
                                    ? "border-[#5C9C72] bg-white shadow-md ring-1 ring-[#5C9C72]" 
                                    : "border-gray-100 bg-white hover:border-gray-200"
                                }`}
                            >
                                {/* items-start is better than items-center here in case the text wraps on small screens */}
                                <div className="flex justify-between items-start sm:items-center mb-1.5 sm:mb-2 gap-2 w-full">
                                    
                                    {/* Name & Badge Wrapper - min-w-0 prevents flex blowout, flex-wrap allows badge to drop down if needed */}
                                    <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0 pr-1">
                                        <h3 className="font-black text-gray-900 text-sm sm:text-base uppercase tracking-tight break-words line-clamp-2">
                                            {addr.name}
                                        </h3>
                                        {/* DEFAULT BADGE */}
                                        {isDefault && (
                                            <span className="bg-gray-100 text-gray-500 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded border border-gray-200 uppercase shrink-0 mt-0.5 sm:mt-0">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* CHECKMARK - shrink-0 ensures it never gets squished */}
                                    {isSelected && (
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#5C9C72] rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 sm:mt-0">
                                            <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </div>
                                    )}
                                </div>

                                <div className="text-xs sm:text-sm text-gray-500 space-y-0.5 sm:space-y-1 font-medium w-full pr-6 sm:pr-8">
                                    <p className="text-gray-700 font-bold break-all">{addr.phone}</p>
                                    <p className="leading-relaxed break-words">{addr.address}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    </div>
);

export default AddressListView;