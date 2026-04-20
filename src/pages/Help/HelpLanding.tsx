import React from 'react';
import { 
    Headphones, 
    Phone, 
    HelpCircle, 
    Ticket as TicketIcon 
} from 'lucide-react';
import useModalStore from '@/store/modalStore';
import { useTranslation } from 'react-i18next';

const HelpLanding: React.FC = () => {
    const { t } = useTranslation("global");
    
    // Global Modal Store Handlers
    const { 
        setIsAIChatOpen, 
        setIsHotlineModalOpen, 
        setIsFAQModalOpen, 
        setIsTicketModalOpen 
    } = useModalStore();

    const supportItems = [
        {
            title: "Support AI",
            icon: Headphones,
            onClick: () => setIsAIChatOpen(true),
            color: "text-slate-800",
            bgColor: "bg-white"
        },
        {
            title: "Hotline",
            icon: Phone,
            onClick: () => setIsHotlineModalOpen(true),
            color: "text-slate-800",
            bgColor: "bg-white"
        },
        {
            title: "FAQ",
            icon: HelpCircle,
            onClick: () => setIsFAQModalOpen(true),
            color: "text-slate-800",
            bgColor: "bg-[#F3F4F6]" // Slightly grayer for visual variety
        },
        {
            title: "Ticket",
            icon: TicketIcon,
            onClick: () => setIsTicketModalOpen(true),
            color: "text-slate-800",
            bgColor: "bg-white"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportItems.map((item) => (
                    <button
                        key={item.title}
                        onClick={item.onClick}
                        className={`
                            ${item.bgColor} 
                            border border-gray-200 
                            rounded-xl p-6 md:p-8 
                            flex items-center justify-center gap-4 
                            shadow-sm hover:shadow-md 
                            transition-all duration-300 
                            active:scale-95
                        `}
                    >
                        <item.icon className={`h-6 w-6 md:h-8 md:w-8 ${item.color}`} />
                        <span className="text-xl md:text-2xl font-bold text-gray-800">
                            {item.title}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HelpLanding;
