import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CreditCard, Wallet, HelpCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function PaymentsPage() {
    // Explicitly typed to avoid type inference issues
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 15, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', damping: 15 }
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
                <CreditCard className="h-8 w-8 text-secondary" />
                <h1 className="text-3xl font-black tracking-tight text-gray-900">Billing & Payments</h1>
            </motion.div>
            <motion.p variants={itemVariants} className="text-sm text-gray-500 mb-6">
                Manage purchase protocols, platform wallets, and standard transaction security thresholds.
            </motion.p>

            {/* Warning Notice Box */}
            <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.01 }}
                className="bg-amber-50/60 border border-amber-200/70 p-4 mb-8 rounded-2xl flex items-start gap-3"
            >
                <HelpCircle className="text-amber-600 mt-0.5 flex-shrink-0" size={18} />
                <p className="text-sm text-amber-900 font-medium">
                    Tracking a specific transaction or deposit settlement issue? Jump straight to your{' '}
                    <Link to="/dashboard/order" className="underline font-bold text-amber-700 hover:text-amber-600 inline-flex items-center gap-0.5">
                        Order History <ArrowUpRight size={14} />
                    </Link>{' '}
                    or draft a manual support ticket.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                    { icon: <CreditCard />, title: "Payment Gateways", text: "Supports global credit cards, debit channels, and certified digital checkout processing apps." },
                    { icon: <Wallet />, title: "Student Wallets", text: "Direct point-of-sale buying power, seamless course checkouts, and clean balance processing." },
                    { icon: <ShieldCheck />, title: "Secure Rails", text: "Fully equipped with specialized anti-fraud screening loops and instant dynamic transaction verification tokens." }
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        className="p-5 border border-gray-100 rounded-2xl shadow-sm bg-white"
                    >
                        <div className="text-secondary bg-secondary/10 w-fit p-2.5 rounded-xl mb-3">
                            {card.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-1 text-gray-900">{card.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed">{card.text}</p>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-6">
                <motion.section variants={itemVariants} className="border-b border-gray-100 pb-6">
                    <h2 className="text-lg font-bold mb-2 text-gray-900">1. Supported Payment Methods</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        All checkouts on the platform process through encrypted endpoints using SSL/TLS infrastructure layers. Funds are securely handled through accredited financial gateways, or standard internal wallet units, completely removing vulnerability exposures.
                    </p>
                </motion.section>

                <motion.section variants={itemVariants} className="border-b border-gray-100 pb-6">
                    <h2 className="text-lg font-bold mb-2 text-gray-900">2. Refund & Cancellation Terms</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Digital course purchases typically qualify for our 14-day standard return grace timeline, provided less than 20% of premium video models or content indices have been stream-loaded. Node adjustments, vendor cashouts, and standard withdrawals undergo auditing flags to ensure systemic validation safety.
                    </p>
                </motion.section>

                <motion.section variants={itemVariants} className="pb-6">
                    <h2 className="text-lg font-bold mb-2 text-gray-900">3. Wallet Transactions & Credits</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Credits added directly into your unified student wallet cannot be distributed or traded externally. Approved balance payout transfers are securely batched out to authorized bank targets inside a standard window of 3 to 5 banking days.
                    </p>
                </motion.section>
            </div>
        </motion.div>
    );
}