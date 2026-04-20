import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Headphones, Asterisk, MessageSquare, Info, X } from 'lucide-react';
import useModalStore from '@/store/modalStore';

const HotlineModal = () => {
    const { isHotlineModalOpen, setIsHotlineModalOpen } = useModalStore();

    if (!isHotlineModalOpen) return null;

    const supportItems = [
        {
            icon: Headphones,
            title: 'গ্রাহক সেবা',
            subtitle: 'সকাল ৯টা - রাত ১০টা',
            number: '16500',
            bg: 'bg-[#eaf6f6]',
            iconBg: 'bg-[#d1ebeb]',
            iconColor: 'text-[#0e7676]',
            textColor: 'text-[#0e7676]'
        },
        {
            icon: Asterisk,
            title: 'জরুরি সাপোর্ট',
            subtitle: '২৪ ঘণ্টা সক্রিয়',
            number: '01700-000000',
            bg: 'bg-[#fff1f1]',
            iconBg: 'bg-[#ffe1e1]',
            iconColor: 'text-[#d32f2f]',
            textColor: 'text-[#d32f2f]'
        },
        {
            icon: MessageSquare,
            title: 'WhatsApp সাপোর্ট',
            subtitle: 'সকাল ৮টা - রাত ১২টা',
            number: '01800-000000',
            bg: 'bg-[#f0f9f0]',
            iconBg: 'bg-[#e0f2e0]',
            iconColor: 'text-[#2e7d32]',
            textColor: 'text-[#2e7d32]'
        }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsHotlineModalOpen(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
                >
                    {/* Top Handle Decor */}
                    <div className="flex justify-center pt-4">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={() => setIsHotlineModalOpen(false)}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8 pt-6 flex flex-col items-center">
                        {/* Header Icon */}
                        <div className="relative mb-6">
                            <div className="w-20 h-20 rounded-full bg-[#0e7676] flex items-center justify-center shadow-lg shadow-[#0e7676]/30">
                                <Phone className="text-white fill-white" size={32} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-4 border-white" />
                        </div>

                        {/* Title Section */}
                        <h2 className="text-2xl font-bold text-[#1a2b3b] mb-1">হটলাইন নম্বর</h2>
                        <p className="text-gray-400 text-sm mb-8">আমাদের সাপোর্ট টিম সর্বদা আপনার পাশে</p>

                        {/* Support List */}
                        <div className="w-full space-y-4">
                            {supportItems.map((item, index) => (
                                <motion.a
                                    key={index}
                                    href={`tel:${item.number}`}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`${item.bg} group flex items-center p-4 rounded-[24px] border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] outline-none`}
                                >
                                    {/* Modern Squircle Icon Box */}
                                    <div className={`${item.iconBg} ${item.iconColor} w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500`}>
                                        <item.icon size={26} strokeWidth={2.5} />
                                    </div>

                                    {/* Text Content - Left Aligned */}
                                    <div className="ml-5 flex flex-col justify-center min-w-0">
                                        <h3 className="font-extrabold text-[#1a2b3b] text-[15px] md:text-base leading-none tracking-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-400 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.05em] mt-1.5 opacity-80">
                                            {item.subtitle}
                                        </p>
                                    </div>

                                    {/* Flexible Spacer to create clear gap */}
                                    <div className="flex-1 min-w-[20px]" />

                                    {/* Number & Phone Icon - Right Aligned */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className={`text-[15px] md:text-[19px] font-black ${item.textColor} tracking-tighter`}>
                                            {item.number}
                                        </span>
                                        <div className={`${item.iconBg} p-2 rounded-full hidden sm:flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                                            <Phone size={14} className={`${item.textColor} fill-current`} />
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>

                        {/* Bottom Info Bar */}
                        <div className="mt-8 w-full bg-[#eaf6f6] p-3 rounded-xl flex items-center justify-center gap-2">
                            <Info size={16} className="text-[#0e7676]" />
                            <span className="text-[#0e7676] text-xs font-bold">কল করতে নম্বরে ট্যাপ করুন</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default HotlineModal;
