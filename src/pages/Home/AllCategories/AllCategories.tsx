"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAppStore } from "@/store/useAppStore";

interface Category {
    id: number;
    name_en: string;
    name_bn: string;
    icon: string;
    slug: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

export default function Categories() {
    const { t, i18n } = useTranslation('global');

    const [hoveredId, setHoveredId] = useState<number | null>(null); // Track which card is hovered
    const { categories, fetchCategories, isCategoryLoading: loading } = useAppStore();

    // 2. Simply trigger the fetch on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    if (loading) {
        return (
            <section className="w-full py-10 px-4">
                <div className="container mx-auto max-w-[1440px]">
                    <div className="h-10 w-48 bg-gray-100 rounded-lg mb-8 animate-pulse" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="w-full py-10 px-4 bg-white">
            <div className="mx-4 md:mx-12">

                <div className="container mx-auto max-w-[1440px]">

                    {/* --- HEADER --- */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight">
                            {t("header.categories", "Categories")}
                        </h2>
                        <div className="h-1 w-12 bg-emerald-500 rounded-full mt-2" />
                    </motion.div>

                    {/* --- CATEGORY GRID --- */}
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4 sm:gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {categories.map((category) => {
                            const displayName = i18n.language === 'bn' ? category.name_bn : category.name_en;

                            return (
                                <motion.div
                                    key={category.id}
                                    variants={itemVariants}
                                    className="relative" // Relative for tooltip positioning
                                    onMouseEnter={() => setHoveredId(category.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {/* Tooltip Implementation */}
                                    <AnimatePresence>
                                        {hoveredId === category.id && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, x: "-50%" }}
                                                animate={{ opacity: 1, y: 0, x: "-50%" }}
                                                exit={{ opacity: 0, y: 5, x: "-50%" }}
                                                className="absolute -top-10 left-1/2 z-50 pointer-events-none"
                                            >
                                                <div className="bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                                                    {displayName}
                                                    {/* Tooltip Pointer */}
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Link
                                        to={`/dashboard/category/${category.id}`}
                                        className="group flex flex-col items-center justify-center p-5 bg-white rounded-[20px] border border-slate-100 shadow-sm 
                                    hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.1)] hover:border-emerald-500/30
                                    transition-all duration-500 transform hover:-translate-y-1.5 h-full"
                                    >
                                        <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-slate-50 rounded-full group-hover:bg-emerald-50 group-hover:scale-110 transition-all duration-500" />

                                            <img
                                                src={category.icon}
                                                alt={displayName}
                                                className="relative z-10 w-10 h-10 object-contain transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/1170/1170628.png";
                                                }}
                                            />
                                        </div>

                                        <span className="text-slate-700 font-bold text-center text-[11px] sm:text-[13px] uppercase tracking-wide group-hover:text-emerald-600 transition-colors duration-300 leading-tight line-clamp-2 px-1">
                                            {displayName}
                                        </span>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}