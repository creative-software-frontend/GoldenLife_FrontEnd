"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

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
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 60, damping: 15 }
    }
};

export default function Categories() {
    const { t, i18n } = useTranslation('global');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsedSession = JSON.parse(session);
            if (new Date().getTime() > parsedSession.expiry) {
                sessionStorage.removeItem("student_session");
                return null;
            }
            return parsedSession.token;
        } catch (e) { return null; }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';
                const token = getAuthToken();
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                };

                const response = await axios.get(`${baseURL}/api/getProductCategory`, config);
                let rawData = [];

                if (response.data?.data?.categories && Array.isArray(response.data.data.categories)) {
                    rawData = response.data.data.categories;
                }

                const mappedCategories = rawData.map((item: any) => ({
                    id: item.id,
                    name_en: item.category_name || "Category",
                    name_bn: item.category_name_bangla || item.category_name || "Category",
                    icon: `${baseURL}/uploads/ecommarce/category_image/${item.category_image}`,
                    slug: item.category_slug
                }));

                setCategories(mappedCategories.slice(0, 10));
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="w-full py-10 px-4">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div className="space-y-2">
                            <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
                            <div className="h-4 w-32 bg-gray-50 rounded-lg animate-pulse" />
                        </div>
                        <div className="h-10 w-28 bg-gray-100 rounded-full animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-6">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center space-y-3">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full animate-pulse" />
                                <div className="h-3 w-14 bg-gray-50 rounded-full animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="w-full py-10 px-4 bg-white">
            <div className="container mx-auto">

                {/* Modern Minimal Header */}
                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
                >
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight">
                            {t("header.categories", "Categories")}
                        </h2>
                        <p className="text-sm text-slate-500 font-medium">
                            Find the perfect professional program for your career
                        </p>
                    </div>

                    <Link
                        to="allcategories"
                        className="group flex items-center gap-2 text-sm font-bold text-secondary bg-secondary/10 hover:bg-secondary/20 px-5 py-2.5 rounded-full transition-all duration-300"
                    >
                        {t("header.allCategories", "All Courses")}
                        <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>

                {/* Categories Modern Circle Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-x-4 gap-y-8">
                    {categories.map((category) => {
                        const displayName = i18n.language === 'bn' ? category.name_bn : category.name_en;

                        return (
                            <Link
                                key={category.id}
                                to={`/dashboard/category/${category.id}`}
                                className="group relative flex flex-col items-center text-center outline-none"
                            >
                                {/* --- Tooltip Addition --- */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
                                    <div className="bg-slate-800 text-white text-[10px] md:text-xs py-1 px-3 rounded shadow-lg whitespace-nowrap">
                                        {displayName}
                                        {/* Tooltip Arrow */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                                    </div>
                                </div>
                                {/* ------------------------ */}

                                {/* Circle Container */}
                                <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3">
                                    <div className="absolute inset-0 bg-gray-50 rounded-full group-hover:bg-[#5ca367]/10 transition-colors duration-500 scale-100 group-hover:scale-110" />

                                    <div className="relative z-10 w-full h-full rounded-full border border-gray-100 bg-white p-3 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_10px_25px_-5px_rgba(92,163,103,0.3)] group-hover:-translate-y-1">
                                        <img
                                            src={category.icon}
                                            alt={displayName}
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/1170/1170628.png";
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Label */}
                                <span className="text-gray-600 font-bold text-[11px] md:text-xs uppercase tracking-tight group-hover:text-[#5ca367] transition-colors duration-300 line-clamp-1 px-1">
                                    {displayName}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}