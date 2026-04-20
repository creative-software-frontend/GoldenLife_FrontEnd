import React from 'react';
import { Backpack, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Coursecatagory2 = () => {
    const { t } = useTranslation("global");

    const grades = [
        { id: 1, label: t("course.HSC242526") || "HSC 24, 25, 26", color: 'bg-rose-50', iconBg: 'bg-rose-500', path: '/courses/hsc' },
        { id: 2, label: t("course.১০ম শ্রেণি") || "10th Grade", color: 'bg-amber-50', iconBg: 'bg-amber-500', path: '/courses/ssc' },
        { id: 3, label: t("course.৯ম শ্রেণি") || "9th Grade", color: 'bg-emerald-50', iconBg: 'bg-emerald-500', path: '/courses/ssc' },
        { id: 4, label: t("course.৮ম শ্রেণি") || "8th Grade", color: 'bg-orange-50', iconBg: 'bg-orange-500', path: '/courses/ssc' },
        { id: 5, label: t("course.৭ম শ্রেণি") || "7th Grade", color: 'bg-indigo-50', iconBg: 'bg-indigo-500', path: '/courses/ssc' },
        { id: 6, label: t("course.৬ষ্ঠ শ্রেণি") || "6th Grade", color: 'bg-sky-50', iconBg: 'bg-sky-500', path: '/courses/ssc' },
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
            <motion.div 
                className="max-w-5xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
                    {grades.map((grade) => (
                        <motion.div
                            key={grade.id}
                            variants={itemVariants}
                            whileHover={{ y: -4 }} // Reduced lift for smaller cards
                            className="h-full"
                        >
                            <Link
                                to={grade.path}
                                className="group relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border border-gray-100 bg-white shadow-sm h-full overflow-hidden transition-shadow hover:shadow-md"
                            >
                                {/* Background Highlight on Hover */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${grade.color}`} />

                                {/* Icon Container with Framer Motion Animation */}
                                <motion.div 
                                    className={`p-2.5 sm:p-3 rounded-xl ${grade.iconBg} text-white shadow-md z-10`}
                                    whileHover={{ rotate: 5, scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <Backpack className="w-4 h-4 sm:w-5 sm:h-5" />
                                </motion.div>

                                {/* Shrunk Font Size */}
                                <h3 className="mt-3 text-center font-bold text-gray-800 text-[10px] sm:text-xs leading-tight group-hover:text-emerald-600 transition-colors z-10 px-1">
                                    {grade.label}
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
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Coursecatagory2;