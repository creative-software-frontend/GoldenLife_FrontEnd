'use client';

import React, { useState } from 'react';
import { X, Home, Briefcase, Heart, Plus } from 'lucide-react';

interface AddAddressFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const AddAddressFormModal: React.FC<AddAddressFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [labelType, setLabelType] = useState('Home');
    const [isDefault, setIsDefault] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80] p-4 font-sans">
             <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 duration-300">
                
                {/* Header */}
                <div className="flex justify-between items-center p-5">
                    <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-800" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
                    
                    {/* Name & Address Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-900">Name</label>
                            <input type="text" placeholder="Name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-900">Address</label>
                            <input type="text" placeholder="Address" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                    </div>

                    {/* District & Phone Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-900">District</label>
                            <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white transition-colors">
                                <option>Select a district</option>
                                <option>Dhaka</option>
                                <option>Chittagong</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-900">Phone</label>
                            <input type="tel" placeholder="Phone" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                        </div>
                    </div>

                    {/* Delivery Notes */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-900">Delivery Notes</label>
                        <textarea 
                            rows={3} 
                            placeholder="Add any specific delivery instructions" 
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 resize-none transition-colors"
                        />
                    </div>

                    {/* Add a label */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900">Add a label</label>
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { name: 'Home', icon: Home },
                                { name: 'Work', icon: Briefcase },
                                { name: 'Partner', icon: Heart },
                                { name: 'Other', icon: Plus },
                            ].map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => setLabelType(item.name)}
                                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-lg border transition-all
                                    ${labelType === item.name 
                                        ? "bg-orange-500 text-white border-orange-500 shadow-md" 
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Save as default switch */}
                    <div className="flex items-center gap-3 pt-2">
                        <button 
                            onClick={() => setIsDefault(!isDefault)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${isDefault ? 'bg-orange-500' : 'bg-gray-200'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isDefault ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                        <span className="text-sm font-bold text-gray-900">Save as default address</span>
                    </div>

                </div>

                {/* Footer Button */}
                <div className="p-6 pt-0">
                    <button onClick={() => { onSubmit({}); onClose(); }} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-lg shadow-lg transition-colors">
                        Save Address
                    </button>
                </div>

             </div>
        </div>
    );
};

export default AddAddressFormModal;