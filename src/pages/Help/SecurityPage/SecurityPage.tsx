import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Shield, Key, EyeOff, Lock, AlertTriangle } from 'lucide-react';

export default function SecurityPage() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 90 } }
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto px-4 py-8 text-gray-800"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-2">
                <Shield className="h-8 w-8 text-secondary" />
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Security & Data Protection</h1>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 my-8">
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="p-6 border border-gray-100 rounded-2xl shadow-sm bg-white flex gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl h-fit"><Lock size={22} /></div>
                    <div>
                        <h3 className="font-bold text-lg mb-1 text-gray-900">End-to-End Encryption</h3>
                        <p className="text-sm text-gray-600">Active network payloads remain fully wrapped under advanced AES-256 standards.</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="p-6 border border-gray-100 rounded-2xl shadow-sm bg-white flex gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl h-fit"><EyeOff size={22} /></div>
                    <div>
                        <h3 className="font-bold text-lg mb-1 text-gray-900">Anti-Fraud Screening</h3>
                        <p className="text-sm text-gray-600">Automated scripts instantly detect and block concurrent multi-device usage.</p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}