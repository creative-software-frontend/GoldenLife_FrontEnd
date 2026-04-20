'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, ChevronDown, RotateCcw, AlertTriangle } from "lucide-react";
import { useFAQs } from "@/hooks/useFAQs";

const FAQLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200/50 rounded-2xl border border-gray-100" />
        ))}
    </div>
);

const DynamicProductFAQ: React.FC = () => {
    const [openIds, setOpenIds] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [language, setLanguage] = useState<"BN" | "EN">("EN");

    // Debounce search to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const { data: faqs, isLoading, isError, refetch, isFetching } = useFAQs(debouncedSearch);

    const toggleAccordion = (id: number) => {
        setOpenIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <section className="py-16 bg-[#FEFCE8] min-h-screen font-sans">
            <div className="container mx-auto px-4 ">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {language === "EN" ? "Frequently Asked" : "সচরাচর জিজ্ঞাসিত"} <span className="text-orange-500">{language === "EN" ? "Questions" : "প্রশ্ন"}</span>
                    </h2>
                    <p className="text-gray-500 text-sm font-medium">
                        {language === "EN" ? "Everything you need to know to start your business" : "ব্যাবসা শুরু করার জন্য প্রয়োজনীয় সব তথ্য"}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
                    
                    {/* LANGUAGE TOGGLE (Same as design) */}
                    <div className="flex bg-orange-50 p-1.5 rounded-full border border-orange-200">
                        <button
                            type="button"
                            onClick={() => setLanguage("BN")}
                            className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                                language === "BN"
                                    ? "bg-[#f97316] text-white shadow-md transform scale-105"
                                    : "text-orange-600 hover:bg-orange-100"
                            }`}
                        >
                            BN
                        </button>
                        <button
                            type="button"
                            onClick={() => setLanguage("EN")}
                            className={`px-6 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                                language === "EN"
                                    ? "bg-[#f97316] text-white shadow-md transform scale-105"
                                    : "text-orange-600 hover:bg-orange-100"
                            }`}
                        >
                            EN
                        </button>
                    </div>

                    {/* SEARCH BAR (Same as design) */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500" />
                            <input
                                type="text"
                                placeholder={language === "EN" ? "Search help topics..." : "প্রশ্ন খুঁজুন..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
                            />
                            {isFetching && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => refetch()}
                            className="p-3 bg-white border border-gray-200 rounded-full hover:bg-orange-50 transition-colors text-orange-500 shadow-sm"
                            title="Reload FAQ"
                        >
                            <RotateCcw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* LIST AREA */}
                <div className="space-y-10">
                    {isLoading ? (
                        <FAQLoadingSkeleton />
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-red-100 text-center">
                            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Failed to load FAQs</h3>
                            <p className="text-gray-500 mb-6 max-w-sm">There was an issue connecting to the support server. Please try again.</p>
                            <button 
                                onClick={() => refetch()}
                                className="px-8 py-3 bg-orange-500 text-white rounded-full font-bold shadow-lg hover:bg-orange-600 transition-all active:scale-95"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : !faqs || faqs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <p className="text-gray-400 font-medium">No results found for "{debouncedSearch}"</p>
                            <button onClick={() => setSearchQuery("")} className="text-orange-500 font-bold mt-2 hover:underline">Clear Search</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {faqs.map((item) => {
                                const isOpen = openIds.includes(item.id);
                                return (
                                    <div key={item.id} className={`border transition-all duration-300 rounded-2xl bg-white overflow-hidden h-fit ${isOpen ? "border-orange-300 shadow-md ring-1 ring-orange-100" : "border-gray-200 shadow-sm hover:border-orange-200"}`}>
                                        <button onClick={() => toggleAccordion(item.id)} className="w-full flex items-center justify-between p-5 text-left bg-white">
                                            <span className={`text-[15px] font-bold pr-4 ${isOpen ? "text-[#ea580c]" : "text-slate-700"}`}>{item.question}</span>
                                            <div className={`p-1 rounded-full transition-colors ${isOpen ? "bg-orange-50" : "bg-transparent"}`}>
                                                {isOpen ? <ChevronDown className="w-5 h-5 text-orange-500" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}>
                                                    <div className="px-5 pb-6 pt-0 text-sm text-gray-600 border-t border-orange-50 bg-orange-50/10">
                                                        <div 
                                                            className="pt-4 space-y-2 faq-content leading-relaxed"
                                                            dangerouslySetInnerHTML={{ __html: item.answer }}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                
            </div>
        </section>
    );
};

export default DynamicProductFAQ;

// Add some basic styling for the HTML content 
const style = document.createElement('style');
style.innerHTML = `
  .faq-content p { margin-bottom: 0.5rem; }
  .faq-content ul { list-style-type: disc; padding-left: 1.5rem; }
  .faq-content ol { list-style-type: decimal; padding-left: 1.5rem; }
  .faq-content a { color: #f97316; font-weight: 600; text-decoration: underline; }
`;
document.head.appendChild(style);
