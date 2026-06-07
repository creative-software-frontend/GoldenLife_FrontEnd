import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Cookie, ShieldAlert, Settings, Eye } from 'lucide-react';

export default function CookiesPage() {
    // Animation variants for cascading entry
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto px-4 py-8 text-gray-800"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-2">
                <Cookie className="h-8 w-8 text-secondary" />
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Cookie Policy</h1>
            </motion.div>
            <motion.p variants={itemVariants} className="text-sm text-gray-500 mb-8">
                Last updated: June 2026
            </motion.p>

            <div className="space-y-8">
                <motion.section variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary/10 rounded-xl text-secondary mt-1">
                            <Eye size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2 text-gray-900">1. What Are Cookies?</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Cookies are tiny text files saved onto your device when you browse our platform. They function as a helpful memory bank, letting us recognize your active device and recall personal layout preferences for an uninterrupted, optimized learning process.
                            </p>
                        </div>
                    </div>
                </motion.section>

                <motion.section variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary/10 rounded-xl text-secondary mt-1">
                            <Settings size={20} />
                        </div>
                        <div className="w-full">
                            <h2 className="text-xl font-bold mb-2 text-gray-900">2. How We Use Cookies</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                We manage cookies to accurately persist session configurations, protect user state settings, track dynamic course execution points, and gather anonymous usage metrics.
                            </p>

                            <div className="grid sm:grid-cols-3 gap-4 mt-2">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="font-bold text-gray-900 block mb-1">Essential</span>
                                    <span className="text-xs text-gray-500">Powers identity logins, secure operations, and state-saving modules.</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="font-bold text-gray-900 block mb-1">Performance</span>
                                    <span className="text-xs text-gray-500">Aggregates layout analytics to debug bottlenecks and upgrade page speed.</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className="font-bold text-gray-900 block mb-1">Functionality</span>
                                    <span className="text-xs text-gray-500">Locks in your native language, dark/light modes, and media playback settings.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                <motion.section variants={itemVariants} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-secondary/10 rounded-xl text-secondary mt-1">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2 text-gray-900">3. Managing Your Preferences</h2>
                            <p className="text-gray-600 leading-relaxed">
                                You can configure, block, or completely clear out cookies through your web browser's preference settings at any time. Be aware that switching off essential tracking tags might instantly restrict availability to interactive parts of your dashboard profile layout.
                            </p>
                        </div>
                    </div>
                </motion.section>
            </div>
        </motion.div>
    );
}