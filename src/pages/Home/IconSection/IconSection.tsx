import { Facebook, Send, Video, MessageCircle, DollarSign } from 'lucide-react';

export default function IconSection() {
    return (
        <div className="flex flex-wrap justify-center gap-6 p-2 md:gap-10">
            {/* Facebook Button */}
            <div className="flex flex-col items-center w-20 sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-[#E7F3FF] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-90 cursor-pointer">
                        <Facebook className="w-5 h-5 text-white" />
                    </div>
                </div>
                <span className="mt-1 text-xs text-center">গ্রুপে যুক্ত হোন</span>
            </div>

            {/* Telegram Button */}
            <div className="flex flex-col items-center w-20 sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-[#E5F7FF] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#0088cc] flex items-center justify-center hover:opacity-90 cursor-pointer">
                        <Send className="w-5 h-5 text-white" />
                    </div>
                </div>
                <span className="mt-1 text-xs text-center">গ্রুপে যুক্ত হোন</span>
            </div>

            {/* Video Button */}
            <div className="flex flex-col items-center w-20 sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-[#FFEDED] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#FF4B4B] flex items-center justify-center hover:opacity-90 cursor-pointer">
                        <Video className="w-5 h-5 text-white" />
                    </div>
                </div>
                <span className="mt-1 text-xs text-center">ভিডিও দেখুন</span>
            </div>

            {/* Chat Button */}
            <div className="flex flex-col items-center w-20 sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-[#FFF5E5] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#FF9500] flex items-center justify-center hover:opacity-90 cursor-pointer">
                        <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                </div>
                <span className="mt-1 text-xs text-center">প্রশ্ন এবং উত্তর</span>
            </div>

            {/* Payment Button */}
            <div className="flex flex-col items-center w-20 sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-[#FFF8E5] flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#FFB800] flex items-center justify-center hover:opacity-90 cursor-pointer">
                        <DollarSign className="w-5 h-5 text-white" />
                    </div>
                </div>
                <span className="mt-1 text-xs text-center">ইনকাম করুন</span>
            </div>
        </div>
    );
}
