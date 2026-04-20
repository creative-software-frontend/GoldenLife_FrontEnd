import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, MessageSquare, Zap } from 'lucide-react';
import useModalStore from '@/store/modalStore';

const AISupportPage: React.FC = () => {
    const { setIsAIChatOpen } = useModalStore();

    // Automatically open the AI Chatbot modal when landing on this page
    // to provide a seamless transition if it's integrated as a modal
    useEffect(() => {
        setIsAIChatOpen(true);
    }, [setIsAIChatOpen]);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100 p-12 flex flex-col items-center text-center">
                {/* AI Animation Icon */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative mb-8"
                >
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#67AC79] to-[#86efac] flex items-center justify-center shadow-2xl shadow-[#67AC79]/40">
                        <Bot className="text-white" size={48} />
                    </div>
                    <motion.div 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 text-yellow-400"
                    >
                        <Sparkles size={24} fill="currentColor" />
                    </motion.div>
                </motion.div>

                {/* Content */}
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">Meet Your AI Assistant</h2>
                <p className="text-gray-500 text-lg mb-10 max-w-lg">
                    Our AI is ready to help you with orders, account questions, and anything in between. Powered by Golden Life's knowledge base.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 text-left border border-gray-100">
                        <div className="p-2 rounded-lg bg-white shadow-sm text-[#67AC79]">
                            <Zap size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Instant Answers</h4>
                            <p className="text-xs text-gray-500 mt-1">Get immediate responses to common questions without waiting.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-gray-50 text-left border border-gray-100">
                        <div className="p-2 rounded-lg bg-white shadow-sm text-[#67AC79]">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">24/7 Availability</h4>
                            <p className="text-xs text-gray-500 mt-1">Available at any time, day or night, for your convenience.</p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button 
                    onClick={() => setIsAIChatOpen(true)}
                    className="px-10 py-4 bg-[#67AC79] text-white font-black rounded-full shadow-xl shadow-[#67AC79]/30 hover:bg-[#589668] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                    <MessageSquare size={20} />
                    START CHATTING NOW
                </button>
            </div>
        </div>
    );
};

export default AISupportPage;
