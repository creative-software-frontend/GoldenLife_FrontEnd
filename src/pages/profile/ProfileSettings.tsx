import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { Share2, X, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileSidebar from '../../layout/ProfileSidebar/ProfileSidebar'; // Make sure this path matches where your file is!

export default function ProfileSettings() {
    const [referralLink, setReferralLink] = useState<string>('');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    useEffect(() => {
        const fetchReferralLink = async () => {
            const session = sessionStorage.getItem("student_session");
            if (!session) return;
            try {
                const token = JSON.parse(session).token;
                const response = await axios.get(`${baseURL}/api/student/referral-link`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data?.success) {
                    setReferralLink(response.data.data.referral_link);
                }
            } catch (error) {
                console.error('Failed to fetch referral link', error);
            }
        };
        fetchReferralLink();
    }, [baseURL]);

    const handleCopy = () => {
        if (!referralLink) {
            toast.error("Referral link not available");
            return;
        }
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success("Referral link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-6 lg:px-8 relative">
            {/* Max-width container to keep things centered and neat */}
            <div className="max-w-6xl mx-auto">

                {/* Header (Optional, but looks great for context) */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Account Settings
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Manage your profile, documents, and security preferences.
                        </p>
                    </div>

                    {/* Share Referral Link Trigger - with requested margins */}
                    <div
                        onClick={() => setIsShareModalOpen(true)}
                        className="flex flex-col items-center cursor-pointer group my-6 sm:my-0"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-sky-200 group-hover:bg-sky-600 transition-all duration-300"
                        >
                            <Share2 size={28} />
                        </motion.div>
                        <span className="text-[11px] font-bold text-slate-600 mt-3 group-hover:text-sky-600 transition-colors uppercase tracking-wider">
                            Share Referral Link
                        </span>
                    </div>
                </div>

                {/* Main Layout Grid */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                    {/* Left Side: Your beautiful custom Sidebar */}
                    <div className="w-full lg:w-auto">
                        <ProfileSidebar />
                    </div>

                    {/* Right Side: The Content Area */}
                    <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 lg:p-8 min-h-[500px]">
                        {/* <Outlet /> is where React Router injects the components for 
                            /basic-info, /personal-info, /security, etc., based on the URL!
                        */}
                        <Outlet />
                    </div>

                </div>
            </div>

            {/* Share Modal Overlay */}
            <AnimatePresence>
                {isShareModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setIsShareModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative Background Element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16 blur-2xl" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">Share Referral</h3>
                                    <button
                                        onClick={() => setIsShareModalOpen(false)}
                                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                                    Copy your unique referral link below and share it with your friends to earn rewards.
                                </p>

                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                            <Share2 size={18} />
                                        </div>
                                        <input
                                            readOnly
                                            type="text"
                                            value={referralLink || "Fetching link..."}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all cursor-default"
                                        />
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleCopy}
                                        className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm transition-all shadow-xl ${copied
                                                ? 'bg-emerald-500 text-white shadow-emerald-200'
                                                : 'bg-slate-900 text-white shadow-slate-200 hover:bg-slate-800'
                                            }`}
                                    >
                                        {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                                        {copied ? 'Link Copied!' : 'Copy Referral Link'}
                                    </motion.button>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                        Secure sharing activated
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}