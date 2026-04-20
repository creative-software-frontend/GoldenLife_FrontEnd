'use client'

import React from "react"
import { Clock, Send, Bell } from "lucide-react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

const CommingSoon: React.FC = () => {
    const { t } = useTranslation("global")

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    }

    return (
        <section className="w-full min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-5xl w-full mx-auto"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Main Content Card */}
                <div className="relative overflow-hidden bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 md:p-16 text-center">

                    {/* Background Decorative Gradient Blob */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60" />

                    {/* Icon Header */}
                    <motion.div variants={itemVariants} className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-200 blur-xl opacity-50 rounded-full" />
                            <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 p-5 rounded-3xl shadow-lg">
                                <Clock className="w-12 h-12 text-white animate-pulse" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Text Section */}
                    <motion.div variants={itemVariants} className="space-y-4 relative z-10">
                        <h1 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter">
                            {t("comming.title1") || "Something Big is Coming"}
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
                            {t("comming.title2") || "We're working hard to bring you the best experience. Stay tuned for our launch!"}
                        </p>
                    </motion.div>

                    {/* Date/Status Badge */}
                    <motion.div variants={itemVariants} className="mt-8 flex justify-center">
                        <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-full">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                            <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">
                                {t("comming.title3")} <span className="text-emerald-600 font-black">Launching Soon 2026</span>
                            </span>
                        </div>
                    </motion.div>

                    {/* Email Form */}
                    <motion.div variants={itemVariants} className="mt-12 relative z-10">
                        <form className="max-w-md mx-auto">
                            <div className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-gray-50 rounded-3xl border border-gray-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                                <input
                                    type="email"
                                    required
                                    placeholder={t("comming.title5") || "Enter your email..."}
                                    className="w-full bg-transparent px-4 py-3 text-gray-800 outline-none placeholder:text-gray-400 font-medium"
                                />
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-200 active:scale-95"
                                >
                                    <Bell className="w-4 h-4" />
                                    {t("comming.title6") || "Notify Me"}
                                </button>
                            </div>
                        </form>
                        <p className="mt-6 text-sm text-gray-400 font-medium">
                            {t("comming.title7") || "We promise not to spam your inbox."}
                        </p>
                    </motion.div>

                    {/* Social Links / Bottom Gradient Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 via-yellow-600 to-green-600" />
                </div>
            </motion.div>
        </section>
    )
}

export default CommingSoon