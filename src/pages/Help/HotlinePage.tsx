import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Headphones, Asterisk, MessageSquare, Info } from 'lucide-react';

const supportItems = [
    {
        icon: Headphones,
        title: 'Customer Service',
        subtitle: '9 AM - 10 PM',
        number: '16500',
        bg: 'bg-[#eaf6f6]',
        iconBg: 'bg-[#d1ebeb]',
        iconColor: 'text-[#0e7676]',
        textColor: 'text-[#0e7676]'
    },
    {
        icon: Asterisk,
        title: 'Emergency Support',
        subtitle: '24 Hours Active',
        number: '01700-000000',
        bg: 'bg-[#fff1f1]',
        iconBg: 'bg-[#ffe1e1]',
        iconColor: 'text-[#d32f2f]',
        textColor: 'text-[#d32f2f]'
    },
    {
        icon: MessageSquare,
        title: 'WhatsApp Support',
        subtitle: '8 AM - 12 AM',
        number: '01800-000000',
        bg: 'bg-[#f0f9f0]',
        iconBg: 'bg-[#e0f2e0]',
        iconColor: 'text-[#2e7d32]',
        textColor: 'text-[#2e7d32]'
    }
];

const HotlinePage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100 p-8 flex flex-col items-center">
                {/* Header Icon */}
                <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-[#0e7676] flex items-center justify-center shadow-lg shadow-[#0e7676]/30">
                        <Phone className="text-white fill-white" size={32} />
                    </div>
                </div>

                {/* Title Section */}
                <h2 className="text-3xl font-bold text-[#1a2b3b] mb-2 text-center">Hotline Numbers</h2>
                <p className="text-gray-400 text-sm mb-10 text-center">Our support team is always there for you</p>

                {/* Support List */}
                <div className="w-full space-y-6">
                    {supportItems.map((item, index) => (
                        <motion.a
                            key={index}
                            href={`tel:${item.number}`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${item.bg} group flex items-center p-6 rounded-[24px] border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.98] outline-none`}
                        >
                            <div className={`${item.iconBg} ${item.iconColor} w-16 h-16 rounded-[20px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500`}>
                                <item.icon size={30} strokeWidth={2.5} />
                            </div>

                            <div className="ml-6 flex flex-col justify-center min-w-0">
                                <h3 className="font-extrabold text-[#1a2b3b] text-lg md:text-xl leading-none tracking-tight">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-[0.05em] mt-2 opacity-80">
                                    {item.subtitle}
                                </p>
                            </div>

                            <div className="flex-1 min-w-[20px]" />

                            <div className="flex items-center gap-4 shrink-0">
                                <span className={`text-xl md:text-3xl font-black ${item.textColor} tracking-tighter`}>
                                    {item.number}
                                </span>
                                <div className={`${item.iconBg} p-3 rounded-full hidden sm:flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                                    <Phone size={18} className={`${item.textColor} fill-current`} />
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Bottom Info Bar */}
                <div className="mt-10 w-full bg-[#eaf6f6] p-4 rounded-xl flex items-center justify-center gap-3">
                    <Info size={20} className="text-[#0e7676]" />
                    <span className="text-[#0e7676] text-sm md:text-base font-bold">Tap on number to call</span>
                </div>
            </div>
        </div>
    );
};

export default HotlinePage;
