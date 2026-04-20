import { ChevronRight, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Courses() {
    const [t] = useTranslation('global');

    // Colors used for strong image overlays and accents
    const courses = [
        { id: 1, name: t("webDev"), icon: "/image/courses/c2.jpg", color: "bg-orange-400" },
        { id: 2, name: t("dataSci"), icon: "/image/courses/c3.png", color: "bg-blue-400" },
        { id: 3, name: t("digitalMkt"), icon: "/image/courses/c4.jpg", color: "bg-teal-400" },
        { id: 4, name: t("graphicDes"), icon: "/image/courses/graphic.png", color: "bg-purple-400" },
        { id: 5, name: t("cyberSec"), icon: "/image/courses/cyber.jpg", color: "bg-red-400" },
        { id: 6, name: t("projMgmt"), icon: "/image/courses/cloud.jpg", color: "bg-green-400" },
        { id: 7, name: t("uiUx"), icon: "/image/courses/content.jpg", color: "bg-yellow-400" },
        { id: 8, name: t("ai"), icon: "/image/courses/ai.jpg", color: "bg-indigo-400" },
        { id: 9, name: t("cloudComp"), icon: "/image/courses/c3.png", color: "bg-pink-400" },
        { id: 10, name: t("photo"), icon: "/image/courses/photo.jpg", color: "bg-cyan-400" },
    ];

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

    return (
        <motion.div 
            className="py-10 w-full container mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
        >
            
            {/* Header Section */}
            <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
            >
                <div className="flex flex-col gap-1">
                    {/* Increased size and applied the secondary color */}
                    <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight">
                        {t('header.title') || "Courses"}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">
                        Find the perfect professional program for your career
                    </p>
                </div>
                
                <Link
                    to="/dashboard/all-courses"
                    className="group flex items-center gap-2 text-sm font-bold text-secondary bg-secondary/10 hover:bg-secondary/20 px-5 py-2.5 rounded-full transition-all duration-300"
                >
                    {t('header.allCourses') || "All Courses"}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </motion.div>

            {/* Courses / Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {courses.slice(0, 10).map((course) => (
                    <motion.div key={course.id} variants={itemVariants} className="h-full">
                        <Link
                            to={`/dashboard/category/${course.id}`}
                            className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                        >
                            {/* Top Image Section - ADDED [transform:translateZ(0)] here to fix the corner bleeding glitch */}
                            <div className="h-40 w-full relative overflow-hidden bg-slate-100 rounded-t-2xl [transform:translateZ(0)]">
                                {/* The Image */}
                                <img
                                    src={course.icon}
                                    alt={course.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-0"
                                    onError={(e) => { e.target.src = "/image/logo/logo.jpg" }}
                                />
                                
                                {/* Bold Color Overlay */}
                                <div className={`absolute inset-0 ${course.color} mix-blend-multiply opacity-50 group-hover:opacity-20 transition-opacity duration-500 z-10`}></div>

                                {/* Hover Badge */}
                                <div className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm p-1.5 rounded-full opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
                                    <ArrowUpRight className="w-4 h-4 text-slate-800" />
                                </div>
                            </div>

                            {/* Bottom Text Section */}
                            <div className="relative p-5 flex flex-col items-center justify-center flex-grow text-center">
                                {/* Soft background tint */}
                                <div className={`absolute inset-0 ${course.color} opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-300 pointer-events-none`}></div>
                                
                                {/* Solid color accent line */}
                                <div className={`absolute top-0 left-0 w-full h-1 ${course.color} opacity-80`}></div>

                                <h3 className="text-base font-bold text-slate-800 group-hover:text-primary-default transition-colors line-clamp-2 relative z-10">
                                    {course.name}
                                </h3>
                                <p className="text-[11px] font-bold text-slate-400 mt-1.5 tracking-wider uppercase relative z-10">
                                    Explore Category
                                </p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// SKELETON COMPONENT (Exported so you can use it in your loading states)
// ----------------------------------------------------------------------

export function CoursesSkeleton() {
    // Array of 10 items to match the `.slice(0, 10)` in your actual component
    const skeletonItems = Array.from({ length: 10 });

    return (
        <div className="py-10 w-full container mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 animate-pulse">
                <div className="flex flex-col gap-2 w-full">
                    {/* Title Placeholder */}
                    <div className="h-9 md:h-10 w-48 bg-slate-200 rounded-md"></div>
                    {/* Subtitle Placeholder */}
                    <div className="h-4 w-64 md:w-80 bg-slate-200 rounded-md mt-1"></div>
                </div>
                
                {/* Button Placeholder */}
                <div className="h-10 w-32 bg-slate-200 rounded-full shrink-0"></div>
            </div>

            {/* Courses / Categories Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {skeletonItems.map((_, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm animate-pulse"
                    >
                        {/* Top Image Section Placeholder */}
                        <div className="h-40 w-full bg-slate-200 rounded-t-2xl"></div>

                        {/* Bottom Text Section Placeholder */}
                        <div className="relative p-5 flex flex-col items-center justify-center flex-grow text-center">
                            {/* Solid color accent line placeholder */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100"></div>

                            {/* Title Placeholder */}
                            <div className="h-4 w-3/4 bg-slate-200 rounded mb-2.5 mt-1"></div>
                            
                            {/* Subtitle (Explore Category) Placeholder */}
                            <div className="h-2.5 w-1/2 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}