'use client';

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
// IMPORT MUST MATCH THE EXPORT NAME FROM STEP 1
import { productFaqData } from "@/data/ProductFAQ"; 

const ProductFAQ: React.FC = () => {
  const [openIds, setOpenIds] = useState<number[]>([]);
  const [language, setLanguage] = useState<"BN" | "EN">("EN");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAccordion = (id: number) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 1. SAFETY CHECK: Ensure data exists before accessing it
  const currentData = productFaqData?.[language] || [];

  // 2. FILTER LOGIC
  const filteredCategories = currentData.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

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
          
          {/* LANGUAGE TOGGLE */}
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

          {/* SEARCH BAR */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-orange-500" />
            <input
              type="text"
              placeholder={language === "EN" ? "Search help topics..." : "প্রশ্ন খুঁজুন..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
            />
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-10">
          {filteredCategories.map((cat, index) => (
            <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-5 pl-1">
                <div className="w-1.5 h-6 bg-[#f97316] rounded-full" />
                <h3 className="text-xl font-bold text-slate-800">{cat.category}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {cat.items.map((item) => {
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
                              <ul className="list-disc list-inside pt-4 space-y-2 ml-1">
                                {item.answer.map((line, i) => (
                                  <li key={i} className="pl-1 marker:text-orange-400">{line}</li>
                                ))}
                              </ul>
                              {item.note && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-900 text-xs font-semibold flex gap-2">
                                  <span>💡</span><span className="pt-0.5">{item.note}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default ProductFAQ;