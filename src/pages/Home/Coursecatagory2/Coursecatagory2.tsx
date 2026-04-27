import React from 'react';
import { Backpack, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Category {
    id: number;
    category_name: string;
    category_slug: string;
    category_discription: string;
    category_image: string;
    category_icon: string | null;
    status: string;
}

const Coursecatagory2 = () => {
    const { t } = useTranslation("global");

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    const { data: categories = [], isLoading } = useQuery<Category[]>({
        queryKey: ['coursesCategoryIndex'],
        queryFn: async () => {
            const response = await axios.get(`${baseURL}/api/courses/category/index`);
            return response.data.data;
        }
    });

    // Fallback colors since API doesn't provide them
    const colors = [
        { color: 'bg-rose-50', iconBg: 'bg-rose-500' },
        { color: 'bg-amber-50', iconBg: 'bg-amber-500' },
        { color: 'bg-emerald-50', iconBg: 'bg-emerald-500' },
        { color: 'bg-orange-50', iconBg: 'bg-orange-500' },
        { color: 'bg-indigo-50', iconBg: 'bg-indigo-500' },
        { color: 'bg-sky-50', iconBg: 'bg-sky-500' },
    ];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1, // Staggers the entry of each card
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 },
        },
    };

    return (
        <section className="w-full py-6 px-4 overflow-hidden">
            {isLoading ? (
                <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-24 sm:h-32 bg-slate-100 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <motion.div 
                    className="max-w-5xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                        {categories.map((category, index) => {
                            const style = colors[index % colors.length];
                            return (
                                <motion.div
                                    key={category.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -4 }} // Reduced lift for smaller cards
                                    className="h-full"
                                >
                                    <Link
                                        to={`/courses/category/${category.id}`}
                                        className="group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border border-gray-100 bg-white shadow-sm h-full overflow-hidden transition-shadow hover:shadow-md"
                                    >
                                        {/* Background Highlight on Hover */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${style.color}`} />

                                        {/* Icon Container with Framer Motion Animation */}
                                        <motion.div 
                                            className={`p-2.5 sm:p-3 rounded-xl ${style.iconBg} text-white shadow-md z-10`}
                                            whileHover={{ rotate: 5, scale: 1.05 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <Backpack className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </motion.div>

                                        {/* Shrunk Font Size */}
                                        <h3 className="mt-3 text-center font-bold text-gray-800 text-[10px] sm:text-xs leading-tight group-hover:text-emerald-600 transition-colors z-10 px-1">
                                            {category.category_name}
                                        </h3>

                                        {/* Arrow Button with Motion */}
                                        <motion.div 
                                            className="mt-3 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-50 text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-all z-10"
                                            whileHover={{ x: 2 }}
                                        >
                                            <ArrowRight className="w-3 h-3" />
                                        </motion.div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </section>
    );
};

export default Coursecatagory2;