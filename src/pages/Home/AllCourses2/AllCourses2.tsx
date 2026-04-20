"use client";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ArrowUpRight } from "lucide-react";

export default function AllCourses2() {
    const { t } = useTranslation("global");

    // Colors matching the solid accent lines from the design
    const courses = [
        { id: 1, name: t("webDev") || "Web Development", icon: "/image/courses/c2.jpg", color: "bg-[#f59e0b]" }, // Orange
        { id: 2, name: t("dataSci") || "Data Science", icon: "/image/courses/c3.png", color: "bg-[#60a5fa]" }, // Blue
        { id: 3, name: t("digitalMkt") || "Digital Marketing", icon: "/image/courses/c4.jpg", color: "bg-[#34d399]" }, // Mint Green
        { id: 4, name: t("graphicDes") || "Graphic Design", icon: "/image/courses/ai.jpg", color: "bg-[#a78bfa]" }, // Purple
        { id: 5, name: t("cyberSec") || "Cybersecurity", icon: "/image/courses/c2.jpg", color: "bg-[#f43f5e]" }, // Red/Rose
        { id: 6, name: t("projMgmt") || "Project Management", icon: "/image/courses/cloud.jpg", color: "bg-[#34d399]" }, // Green
        { id: 7, name: t("uiUx") || "UI/UX Design", icon: "/image/courses/content.jpg", color: "bg-[#fef08a]" }, // Yellow
        { id: 8, name: t("ai") || "Artificial Intelligence", icon: "/image/courses/ai.jpg", color: "bg-[#818cf8]" }, // Indigo
        { id: 9, name: t("cloudComp") || "Cloud Computing", icon: "/image/courses/c3.png", color: "bg-[#f472b6]" }, // Pink
        { id: 10, name: t("photo") || "Photography", icon: "/image/courses/photo.jpg", color: "bg-[#2dd4bf]" }, // Teal
    ];

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
            transition: { type: "spring", stiffness: 100, damping: 12 }
        }
    };

    return (
        <section className="w-full py-4 md:py-1 px-4 bg-[#f8fcfb]">
            <div className="mx-0 md:mx-4 lg:mx-8">
                <motion.div
                    className="container mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                >
                    {/* Header Section from Design */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
                    >
                        <div className="flex flex-col gap-1">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight">
                                {t("header.title") || "Courses"}
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">
                                Find the perfect professional program for your career
                            </p>
                        </div>

                        <Link
                            to="/courses"
                            className="group flex items-center gap-1.5 text-sm font-bold text-secondary bg-secondary/10 hover:bg-secondary/20 px-5 py-2.5 rounded-full transition-all duration-300"
                        >
                            {t("header.allCourses") || "All Courses"}
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {courses.map((course) => (
                            <motion.div key={course.id} variants={itemVariants} className="h-full">
                                <Link
                                   to={`/dashboard/category/${course.id}`}
                                    className="group isolate flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5"
                                >
                                    {/* Top Image Section - [transform:translateZ(0)] prevents border radius glitch on hover */}
                                    <div className="h-44 w-full relative overflow-hidden bg-slate-50 rounded-t-3xl [transform:translateZ(0)]">
                                        <img
                                            src={course.icon}
                                            alt={course.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0"
                                            onError={(e) => { e.currentTarget.src = "/image/logo/logo.jpg"; }}
                                        />
                                        
                                        {/* Corner Hover Arrow */}
                                        <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
                                            <ArrowUpRight className="w-4 h-4 text-slate-700" />
                                        </div>
                                    </div>

                                    {/* Solid Color Accent Line */}
                                    <div className={`w-full h-1.5 ${course.color}`}></div>

                                    {/* Bottom Text Section */}
                                    <div className="relative p-5 flex flex-col items-center justify-center flex-grow text-center rounded-b-3xl bg-white">
                                        {/* Subtle background tint on hover */}
                                        <div className={`absolute inset-0 ${course.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none rounded-b-3xl`}></div>
                                        
                                        <h3 className="text-[15px] font-bold text-slate-800 transition-colors line-clamp-2 relative z-10">
                                            {course.name}
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1.5 tracking-wider uppercase relative z-10">
                                            Explore Category
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ----------------------------------------------------------------------
// SKELETON COMPONENT (Exported so you can use it in your loading states)
// ----------------------------------------------------------------------

export function AllCoursesSkeleton() {
    // Array of 10 items to match your 10 categories
    const skeletonItems = Array.from({ length: 10 });

    return (
        <section className="w-full py-12 px-4 bg-[#f8fcfb]">
            <div className="mx-0 md:mx-4 lg:mx-8">
                <div className="container mx-auto">
                    
                    {/* Header Skeleton */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 animate-pulse">
                        <div className="flex flex-col gap-2 w-full">
                            {/* Title Placeholder */}
                            <div className="h-9 md:h-10 w-48 bg-slate-200 rounded-md"></div>
                            {/* Subtitle Placeholder */}
                            <div className="h-4 w-64 md:w-80 bg-slate-200 rounded-md mt-1"></div>
                        </div>

                        {/* Button Placeholder */}
                        <div className="h-10 w-32 bg-slate-200 rounded-full shrink-0"></div>
                    </div>

                    {/* Courses Grid Skeleton */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {skeletonItems.map((_, index) => (
                            <div 
                                key={index} 
                                className="flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] animate-pulse"
                            >
                                {/* Top Image Section */}
                                <div className="h-44 w-full bg-slate-200 rounded-t-3xl"></div>

                                {/* Solid Color Accent Line Placeholder */}
                                <div className="w-full h-1.5 bg-slate-100"></div>

                                {/* Bottom Text Section */}
                                <div className="p-5 flex flex-col items-center justify-center flex-grow bg-white">
                                    {/* Title Placeholder */}
                                    <div className="h-4 w-3/4 bg-slate-200 rounded mb-3"></div>
                                    {/* Subtitle (Explore Category) Placeholder */}
                                    <div className="h-2.5 w-1/2 bg-slate-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}