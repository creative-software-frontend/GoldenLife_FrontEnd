import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RotateCcw, HelpCircle, ArrowRight, MessageSquare, PhoneCall, Sparkles } from 'lucide-react';
import { useFAQs } from '@/hooks/useFAQs';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';

const categoryList = [
    { id: '', label: 'All Topics' },
    { id: '1', label: 'Earnings' },
    { id: '2', label: 'Investments' },
    { id: '3', label: 'Withdrawal' },
    { id: '4', label: 'Add Money' },
];

export default function FAQPage() {
    const location = useLocation();
    const isVendor = location.pathname.includes('/vendor/');
    const basePath = isVendor ? '/vendor/dashboard/help' : '/dashboard/help';

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

    const handleRefresh = async () => {
        await refetch();
        toast.success('FAQs updated successfully');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.3em]">
                        <Sparkles size={14} />
                        Support Center
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                        How can we <span className="text-blue-600 underline decoration-blue-100 underline-offset-8">help you</span>?
                    </h1>
                    <p className="text-slate-400 text-lg font-medium max-w-xl">
                        Search our knowledge base or browse categories below to find quick answers.
                    </p>
                </div>
                <button 
                    onClick={handleRefresh}
                    disabled={isFetching}
                    className={cn(
                        "flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all font-black text-slate-600 text-[11px] uppercase tracking-widest active:scale-95",
                        isFetching && "opacity-50"
                    )}
                >
                    <RotateCcw size={16} className={cn(isFetching && "animate-spin")} />
                    Update Database
                </button>
            </div>

            {/* --- Search & Filter Bar --- */}
            <div className="space-y-8">
                <div className="relative group max-w-4xl mx-auto">
                    <div className="absolute inset-0 bg-blue-500/5 blur-[40px] rounded-[40px] -z-10 group-hover:bg-blue-500/10 transition-colors" />
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder="Type keywords (e.g. withdrawal, security, profile)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-20 pl-20 pr-8 bg-white border-2 border-transparent focus:border-blue-100 rounded-[32px] outline-none shadow-2xl shadow-slate-200/60 transition-all text-xl font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {categoryList.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategoryId(cat.id)}
                            className={cn(
                                "px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                                categoryId === cat.id
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-100 scale-105"
                                    : "bg-white text-slate-500 border border-slate-100 hover:border-blue-200 hover:text-blue-600 shadow-sm"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- FAQ Accordion Content --- */}
            <div className="bg-white rounded-[48px] border border-slate-100/50 shadow-2xl shadow-slate-200/40 overflow-hidden min-h-[500px]">
                {isLoading ? (
                    <div className="p-12 space-y-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-20 bg-slate-50 rounded-[32px] animate-pulse" />
                        ))}
                    </div>
                ) : faqs && faqs.length > 0 ? (
                    <div className="p-6 md:p-12">
                        <Accordion type="single" collapsible className="space-y-6">
                            {faqs.map((faq) => (
                                <AccordionItem 
                                    key={faq.id} 
                                    value={`item-${faq.id}`}
                                    className="bg-slate-50/30 border border-slate-100/50 rounded-[40px] px-8 md:px-10 overflow-hidden transition-all hover:bg-white hover:border-blue-100 data-[state=open]:bg-white data-[state=open]:border-blue-200 data-[state=open]:shadow-2xl data-[state=open]:shadow-blue-500/5"
                                >
                                    <AccordionTrigger className="hover:no-underline py-8 text-left font-black text-slate-800 text-lg md:text-xl group">
                                        <div className="flex justify-between items-center w-full pr-6">
                                            <span className="leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{faq.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-500 pb-10 prose prose-slate max-w-none text-base md:text-lg leading-relaxed font-medium">
                                        <div 
                                            className="px-2"
                                            dangerouslySetInnerHTML={{ __html: faq.answer }} 
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 text-slate-400">
                        <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-8">
                            <HelpCircle size={48} className="text-slate-200" strokeWidth={1.5} />
                        </div>
                        <p className="text-xl font-black uppercase tracking-[0.2em] text-slate-300">No matching search</p>
                        <p className="text-sm font-bold mt-2 uppercase text-slate-400 opacity-60">Try different keywords or filters</p>
                    </div>
                )}
            </div>

            {/* --- CTA Section --- */}
            <div className="bg-slate-900 rounded-[48px] p-10 md:p-16 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-800/50 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="text-center lg:text-left space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">Can't find what you're <br /><span className="text-blue-400">looking for?</span></h2>
                        <p className="text-slate-400 font-medium max-w-md text-base md:text-lg">
                            Our personal support agents are available 24/7 to help you with any issues.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
                        <Link 
                            to={`${basePath}/ticket`}
                            className="bg-white text-slate-900 w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-2xl shadow-black/40 flex items-center justify-center gap-2 group/btn active:scale-95"
                        >
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            Open Ticket
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                            to={`${basePath}/hotline`}
                            className="bg-slate-800/80 border border-slate-700 text-white w-full sm:w-auto px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <PhoneCall className="w-4 h-4 text-blue-400" />
                            Live Hotline
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
