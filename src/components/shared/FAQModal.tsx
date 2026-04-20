import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, RotateCcw, Search, Plus, X } from 'lucide-react';
import useModalStore from '@/store/modalStore';
import { useFAQs } from '@/hooks/useFAQs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { toast } from 'react-toastify';

const categoryList = [
    { id: '', label: 'All' },
    { id: '1', label: 'Income' },
    { id: '2', label: 'Invest' },
    { id: '3', label: 'Withdraw' },
    { id: '4', label: 'Add Money' },
];

const FAQModal = () => {
    const { isFAQModalOpen, setIsFAQModalOpen, setIsTicketModalOpen, setIsHotlineModalOpen } = useModalStore();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: faqs, isLoading, refetch, isFetching } = useFAQs(debouncedSearch, categoryId);

    if (!isFAQModalOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsFAQModalOpen(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-xl bg-[#f8f9fa] rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                <HelpCircle size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">সাধারণ জিজ্ঞাসা (FAQ)</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={async () => {
                                    await refetch();
                                    toast.success('FAQs updated successfully');
                                }}
                                className={cn("p-2 rounded-full hover:bg-gray-100 text-green-600 transition-all", isFetching && "animate-spin")}
                            >
                                <RotateCcw size={20} />
                            </button>
                            <button 
                                onClick={() => setIsFAQModalOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="প্রশ্ন খুঁজুন..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-white border border-transparent focus:border-green-500 rounded-2xl outline-none shadow-sm transition-all"
                            />
                        </div>

                        {/* Category Chips */}
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {categoryList.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategoryId(cat.id)}
                                    className={cn(
                                        "px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border",
                                        categoryId === cat.id
                                            ? "bg-green-50 border-green-500 text-green-600 shadow-sm"
                                            : "bg-white border-transparent text-gray-500 hover:bg-gray-50"
                                    )}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* FAQ List */}
                        <div className="space-y-3">
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" />
                                ))
                            ) : faqs?.length ? (
                                <Accordion type="single" collapsible className="space-y-3">
                                    {faqs.map((faq) => (
                                        <AccordionItem 
                                            key={faq.id} 
                                            value={`item-${faq.id}`}
                                            className="bg-white border-none rounded-2xl px-4 overflow-hidden shadow-sm"
                                        >
                                            <AccordionTrigger className="hover:no-underline py-4 text-left font-bold text-gray-700">
                                                <div className="flex justify-between items-center w-full pr-4">
                                                    <span>{faq.question}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-gray-500 pb-4 prose prose-sm max-w-none">
                                                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            ) : (
                                <div className="text-center py-10 text-gray-400 italic">
                                    No questions found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-white border-t border-gray-100 flex items-center justify-between">
                        <span className="text-gray-500 font-medium">আরও সাহায্য দরকার?</span>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => {
                                    setIsFAQModalOpen(false);
                                    setIsTicketModalOpen(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 leading-none shadow-lg shadow-blue-600/10"
                            >
                                Support Ticket
                            </button>
                            <button 
                                onClick={() => {
                                    setIsFAQModalOpen(false);
                                    setIsHotlineModalOpen(true);
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-600/20 transition-all active:scale-95 leading-none"
                            >
                                Support
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FAQModal;
